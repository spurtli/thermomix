import EventEmitter from "events";
import moment from "moment";
import qs from "qs";

import { Record, Storage } from "./storage";
import { OAuthProvider } from "./";

export enum AuthEvent {
  Authenticated = "authenticated",
  Unauthenticated = "unauthenticated"
}

export class Service {
  private readonly eventEmitter = new EventEmitter();
  private readonly _primaryAuthorizationProvider: OAuthProvider;
  private readonly authorizationProvider: Map<string, OAuthProvider>;
  private readonly storage: Storage;
  private readonly _currentAuthorizationProvider: OAuthProvider;

  constructor(
    primaryAuthorizationProvider: OAuthProvider,
    authorizationProvider: Map<string, OAuthProvider>,
    storage: Storage
  ) {
    this._primaryAuthorizationProvider = primaryAuthorizationProvider;
    this.authorizationProvider = authorizationProvider;
    this.storage = storage;
    this._currentAuthorizationProvider = this.authorizationProvider
      .values()
      .next().value;
  }

  public get currentAuthorizationProvider() {
    return this._currentAuthorizationProvider;
  }

  public get primaryAuthorizationProvider() {
    return this._primaryAuthorizationProvider;
  }

  public addListener(event: AuthEvent, cb: (...args: []) => void) {
    this.eventEmitter.addListener(event, cb);
  }

  public removeListener(event: AuthEvent, cb: (...args: []) => void) {
    this.eventEmitter.removeListener(event, cb);
  }

  public hasValidToken() {
    const record = this.storage.load();
    return record && moment().isBefore(record.expiresAt);
  }

  public hasToken() {
    const token = this.storage.load();
    if (!token) {
      return false;
    }
    const { accessToken, refreshToken, expiresAt } = token;
    return !!(accessToken && refreshToken && expiresAt);
  }

  public getToken() {
    return this.storage.load();
  }

  public async exchangeCodeForToken(authorizationCode: { code: string }) {
    const response = await fetch(this.primaryAuthorizationProvider.tokenUrl, {
      body: JSON.stringify({
        client_id: this.primaryAuthorizationProvider.clientId,
        grant_type: "assertion",
        provider: "strava",
        assertion: authorizationCode.code
      }),
      headers: {
        "content-type": "application/json"
      },
      method: "POST"
    });

    if (!response.ok) {
      return Promise.reject(
        `Cannot exchange code for token: ${authorizationCode}`
      );
    }

    const token = await this.mapResponseToRecord(response);

    this.storage.save(token);
    this.eventEmitter.emit(AuthEvent.Authenticated);

    return token;
  }

  public async refreshToken() {
    if (!this.hasToken()) {
      return Promise.reject("Cannot find token to refresh.");
    }

    const { accessToken, refreshToken } = this.storage.load();
    const response = await fetch(this._primaryAuthorizationProvider.tokenUrl, {
      body: qs.stringify({
        grant_type: "refresh_token",
        refresh_token: refreshToken,
        client_id: this._primaryAuthorizationProvider.clientId
      }),
      headers: {
        authorization: `Bearer ${accessToken}`,
        "content-type": "application/x-www-form-urlencoded"
      },
      method: "POST"
    });

    if (!response.ok) {
      return Promise.reject(`Cannot refresh token: ${response.status}`);
    }

    const token = await this.mapResponseToRecord(response);

    this.storage.save(token);
    this.eventEmitter.emit(AuthEvent.Authenticated);

    return token;
  }

  public async revokeToken() {
    // try to revoke token on primary authorization service
    if (this.hasValidToken()) {
      const { accessToken } = this.getToken();
      const response = await fetch(
        this._primaryAuthorizationProvider.revokeUrl,
        {
          body: qs.stringify({
            token: accessToken,
            token_type_hint: "access_token"
          }),
          headers: {
            authorization: `Bearer ${accessToken}`,
            "content-type": "application/x-www-form-urlencoded"
          },
          method: "POST"
        }
      );

      if (!response.ok) {
        console.warn(`Cannot revoke token: ${accessToken}`);
      }
    }

    this.storage.reset();
    this.eventEmitter.emit(AuthEvent.Unauthenticated);
  }

  private async mapResponseToRecord(response: any): Promise<Record> {
    const raw = await response.json();
    return {
      accessToken: raw.access_token,
      refreshToken: raw.refresh_token,
      expiresAt: moment().add(raw.expires_in, "seconds")
    };
  }
}
