import { Data, Storage } from "../types";

export async function createStorage(
  init: Data | false = false
): Promise<Storage> {
  const storage = new MemoryStorage();
  if (init) {
    await storage.save(init);
  }
  return storage;
}

class MemoryStorage implements Storage {
  private static KEY = "_auth_storage";
  private storage = new Map();

  delete(): Promise<void> {
    this.storage.delete(MemoryStorage.KEY);
    return Promise.resolve();
  }

  load(): Promise<Data | null> {
    try {
      const json = this.storage.get(MemoryStorage.KEY);
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
      this.storage.set(MemoryStorage.KEY, json);
      return Promise.resolve();
    } catch (err) {
      return Promise.reject(err);
    }
  }
}
