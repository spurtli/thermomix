import EventEmitter from "events";
import qs from "qs";

import { add, isAfter, now } from "./date";
import { Auth, Client, Config, Data, Storage } from "./types";

const DEFAULT_REFRESH_INTERVAL = 10 * 60 * 1000;

export enum ProviderState {
  Authorize,
  Idle,
  Refresh,
  SignOut
}

export enum ProviderEvent {
  Change = "change"
}

export class Provider extends EventEmitter {
  private refreshInterval: number;
  private client: Client;
  private storage: Storage;
  private state = ProviderState.Idle;

  constructor({
    client,
    storage,
    refreshInterval = DEFAULT_REFRESH_INTERVAL
  }: Config) {
    super();

    this.client = client;

    this.storage = storage;
    this.refreshInterval = refreshInterval;
  }

  public async authObj(): Promise<Auth> {
    const token = await this.storage.load();
    let isAuthenticated = false;
    if (token && Provider.isValidToken(token)) {
      isAuthenticated = true;
    }
    return { isAuthenticated, provider: this };
  }

  public async authorize(code: String): Promise<void> {
    this.state = ProviderState.Authorize;

    const req = new Request(this.client.authorizeURL, {
      body: JSON.stringify({ code }),
      headers: {
        "content-type": "application/json"
      },
      method: "POST"
    });
    const res = await fetch(req);
    if (!res.ok) {
      this.state = ProviderState.Idle;
      throw new Error(
        "Authorization failed. Please check your authorization code."
      );
    }

    const { access_token, refresh_token, expires_in } = await res.json();
    const expiresAt = add(now(), expires_in);
    await this.storage.save({
      accessToken: access_token,
      refreshToken: refresh_token,
      expiresAt: expiresAt.toISOString()
    });

    this.emit(ProviderEvent.Change);
    this.state = ProviderState.Idle;
  }

  public async refresh(): Promise<void> {
    if (this.state === ProviderState.SignOut) {
      return Promise.reject("Cannot refresh when signOut is in progress");
    }
    this.state = ProviderState.Refresh;

    const token = await this.storage.load();
    if (!(token && Provider.isValidToken(token))) {
      this.state = ProviderState.Idle;
      throw new Error("Token is missing or invalid. Check storage entries.");
    }

    const { accessToken, refreshToken } = token;
    const req = new Request(this.client.refreshURL, {
      body: qs.stringify({
        grant_type: "refresh_token",
        refresh_token: refreshToken,
        client_id: this.client.id
      }),
      headers: {
        authorization: `Bearer ${accessToken}`,
        "content-type": "application/x-www-form-urlencoded"
      },
      method: "POST"
    });
    const res = await fetch(req);
    if (!res.ok) {
      this.state = ProviderState.Idle;
      throw new Error("Cannot refresh token.");
    }
    const { access_token, refresh_token, expires_in } = await res.json();
    const expiresAt = add(now(), expires_in);
    await this.storage.save({
      accessToken: access_token,
      refreshToken: refresh_token,
      expiresAt: expiresAt.toISOString()
    });

    this.state = ProviderState.Idle;
  }

  public async signOut(): Promise<void> {
    this.state = ProviderState.SignOut;
    // TODO revoke
    await this.storage.delete();

    this.emit(ProviderEvent.Change);
    this.state = ProviderState.Idle;
  }

  private static isValidToken(token: Data) {
    if (!token) {
      return false;
    }
    const { accessToken, refreshToken, expiresAt } = token;
    if (!(accessToken && refreshToken && expiresAt)) {
      return false;
    }
    const expiresAtDate = new Date(expiresAt);
    return isAfter(expiresAtDate, now());
  }
}
