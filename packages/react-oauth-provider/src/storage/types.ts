import {default as moment} from 'moment';

export interface Record {
  accessToken: string;
  refreshToken: string;
  expiresAt: moment.Moment;
}

export interface Storage {
  load(): Record;
  save(record: Record): void;
  reset(): void;
}
