import moment from 'moment';
import {Storage, Record} from './types';

export class MemoryStorage implements Storage {
  private record: Record = {
    accessToken: '',
    refreshToken: '',
    expiresAt: moment(0)
  };

  load(): Record {
    return this.record;
  }

  reset() {
    this.record = {
      accessToken: '',
      refreshToken: '',
      expiresAt: moment(0)
    };
  }

  save(record: Record) {
    this.record = record;
  }
}
