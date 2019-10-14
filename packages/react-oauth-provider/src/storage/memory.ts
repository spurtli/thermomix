import {Storage, Record} from './types';

export class MemoryStorage implements Storage {
  private record: Record = null;

  load(): Record {
    return this.record;
  }

  reset() {
    this.record = null;
  }

  save(record: Record) {
    this.record = record;
  }
}
