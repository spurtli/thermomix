export type Data = {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
};

export interface Storage {
  delete(): Promise<void>;
  save(data: Data): Promise<void>;
  load(): Promise<Data | null>;
}
