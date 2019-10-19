import {default as moment} from 'moment';
import {Storage, Record} from './types';

interface SerializedToken {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
}

export class LocalStorage implements Storage {
  private static DEFAULT_KEY = 'spurtli-auth';

  private readonly keyName: string;

  private serialize(record: Record) {
    return JSON.stringify({
      accessToken: record.accessToken,
      refreshToken: record.refreshToken,
      expiresAt: record.expiresAt.toISOString()
    });
  }

  private deserialize(serializedRecord: string): Record {
    try {
      const rawRecord: SerializedToken = JSON.parse(serializedRecord);
      return {
        accessToken: rawRecord.accessToken,
        refreshToken: rawRecord.refreshToken,
        expiresAt: moment(rawRecord.expiresAt)
      };
    } catch (err) {
      console.error(err);
      return {
        accessToken: '',
        refreshToken: '',
        expiresAt: moment(0)
      };
    }
  }

  constructor(keyName = LocalStorage.DEFAULT_KEY) {
    if (!window || !window.localStorage) {
      throw new Error('window.localStorage is not available.');
    }
    this.keyName = keyName;
  }

  load(): Record {
    const data = window.localStorage.getItem(this.keyName);
    if (!data) {
      return {
        accessToken: '',
        refreshToken: '',
        expiresAt: moment(0)
      };
    }

    return this.deserialize(data);
  }

  reset() {
    window.localStorage.removeItem(this.keyName);
  }

  save(record: Record) {
    if (!record) {
      console.warn('Cannot save empty record');
    }

    window.localStorage.setItem(this.keyName, this.serialize(record));
  }
}
