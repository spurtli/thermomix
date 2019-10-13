import {LocalStorage} from "./local-storage";
import {MemoryStorage} from "./memory";
import {Storage} from "./types";

export enum StorageType {
  AUTO,
  MEMORY,
  LOCAL_STORAGE
}

export function create(type = StorageType.AUTO): Storage {
  if (type === StorageType.AUTO) {
    if (window && window.localStorage) {
      return new LocalStorage();
    } else {
      return new MemoryStorage();
    }
  }

  switch (type) {
    case StorageType.MEMORY:
      return new MemoryStorage();
    case StorageType.LOCAL_STORAGE:
      return new LocalStorage();
  }
}
