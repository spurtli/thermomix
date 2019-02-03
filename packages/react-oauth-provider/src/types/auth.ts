import { Provider } from "../provider";

export interface Auth {
  isAuthenticated: boolean;
  provider: Provider;
}
