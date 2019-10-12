type URL = string;
type Scope = string;

export interface Provider {
  scopes?: Scope[];
  authorizationUrl?: URL;
  tokenUrl?: URL;
  revokeUrl?: URL;
  clientId?: string;
}
