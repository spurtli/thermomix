export enum Unit {
  Millisecond = 1,
  Milliseconds = 1,
  Second = 1000,
  Seconds = Unit.Second,
  Minute = 60000,
  Minutes = Unit.Minute,
  Hour = 3600000,
  Hours = Unit.Hour
}

export function add(date: Date, period: number, unit = Unit.Second) {
  return new Date(date.getTime() + period * unit);
}

export function isAfter(date: Date, after: Date): boolean {
  return date.getTime() > after.getTime();
}

export function now(): Date {
  return new Date();
}
