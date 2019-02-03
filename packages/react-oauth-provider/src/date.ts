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

export function diff(date1: Date, date2: Date, unit = Unit.Millisecond) {
  return (date1.getTime() - date2.getTime()) / unit;
}

export function isAfter(date: Date, after: Date): boolean {
  return date.getTime() > after.getTime();
}

export function isBefore(date: Date, before: Date): boolean {
  return date.getTime() < before.getTime();
}

export function now(): Date {
  return new Date();
}
