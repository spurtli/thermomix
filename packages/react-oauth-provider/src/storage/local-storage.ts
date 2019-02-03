import { Data, Storage } from "../types";

export function createStorage(): Storage {
  return new LocalStorage();
}

class LocalStorage implements Storage {
  private static KEY = "_auth_storage";

  delete(): Promise<void> {
    window.localStorage.removeItem(LocalStorage.KEY);
    return Promise.resolve();
  }

  load(): Promise<Data | null> {
    try {
      const json = window.localStorage.getItem(LocalStorage.KEY);
      if (!json) {
        return Promise.resolve(null);
      }
      return JSON.parse(json);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  save(data: Data): Promise<void> {
    try {
      const json = JSON.stringify(data);
      window.localStorage.setItem(LocalStorage.KEY, json);
      return Promise.resolve();
    } catch (err) {
      return Promise.reject(err);
    }
  }
}
