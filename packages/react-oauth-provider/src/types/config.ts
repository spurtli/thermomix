import { Client } from "./client";
import { Storage } from "./storage";

export interface Config {
  client: Client;

  refreshInterval?: number;
  storage: Storage;
}
