import EventEmitter from "events";
import qs from "qs";

import { add, diff, isBefore, now } from "./date";
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
  private client: Client;
  private interval: number;
  private readonly refreshInterval: number;
  private state = ProviderState.Idle;
  private readonly storage: Storage;

  constructor({
    client,
    storage,
    refreshInterval = DEFAULT_REFRESH_INTERVAL
  }: Config) {
    super();

    this.client = client;
    this.storage = storage;
    this.refreshInterval = refreshInterval;
    this.interval = window.setInterval(async () => {
      try {
        await this.refresh();
      } catch (err) {
        console.error(err);
      }
    }, refreshInterval);
  }

  public async authObj(): Promise<Auth> {
    const token = await this.storage.load();
    let isAuthenticated = false;
    if (
      token &&
      Provider.isValidToken(token) &&
      !Provider.isExpiredToken(token)
    ) {
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

    // skip if there is no token or invalid
    const token = await this.storage.load();
    if (!(token && Provider.isValidToken(token))) {
      this.state = ProviderState.Idle;
      return Promise.resolve();
    }

    // skip if lifetime is more than twice as the refreshInterval
    const expires = new Date(token.expiresAt);
    if (diff(expires, now()) > this.refreshInterval * 2) {
      this.state = ProviderState.Idle;
      return Promise.resolve();
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
      return Promise.reject("Cannot refresh token.");
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

  private static isExpiredToken(token: Data) {
    if (!Provider.isValidToken(token)) {
      throw new Error("Invalid token");
    }
    const expiresAt = new Date(token.expiresAt);
    return !isBefore(now(), expiresAt);
  }

  private static isValidToken(token: Data | null) {
    if (!token) {
      return false;
    }
    const { accessToken, refreshToken, expiresAt } = token;
    return accessToken && refreshToken && expiresAt;
  }
}
