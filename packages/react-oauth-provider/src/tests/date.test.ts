import { add, isAfter, now, Unit } from "../date";

describe("Date", () => {
  it("create current date", () => {
    const curr = now();
    const comp = new Date();
    expect(curr.toISOString()).toBe(comp.toISOString());
  });

  describe("manipulate", () => {
    it("should add 1 second to given date", () => {
      const date = new Date("2019-02-02T20:28:35+00:00");
      const next = add(date, 1);
      expect(next.getTime()).toBe(date.getTime() + 1000);
    });

    it("should add 1 minute to given date", () => {
      const date = new Date("2019-02-02T20:28:35+00:00");
      const next = add(date, 1, Unit.Minute);
      expect(next.getTime()).toBe(date.getTime() + 1000 * 60);
    });

    it("should add 1 hour to given date", () => {
      const date = new Date("2019-02-02T20:28:35+00:00");
      const next = add(date, 1, Unit.Hour);
      expect(next.getTime()).toBe(date.getTime() + 1000 * 60 * 60);
    });

    it("should remove 1 second from given date", () => {
      const date = new Date("2019-02-02T20:28:35+00:00");
      const next = add(date, -1);
      expect(next.getTime()).toBe(date.getTime() - 1000);
    });

    it("should change nothing if same date", () => {
      const date = new Date("2019-02-02T20:28:35+00:00");
      const next = add(date, 0);
      expect(next.getTime()).toBe(date.getTime());
    });
  });

  describe("compare", () => {
    it("should compare if date is after given date", () => {
      const date = new Date("2019-02-02T20:28:35+00:00");
      const after = new Date("2019-02-02T20:28:34+00:00");
      expect(isAfter(date, after)).toBe(true);
    });

    it("should compare if date is not after given date", () => {
      const date = new Date("2019-02-02T20:28:35+00:00");
      const after = new Date("2019-02-02T20:28:36+00:00");
      expect(isAfter(date, after)).toBe(false);
    });

    it("should compare if same date is not returning true for isAfter", () => {
      const date = new Date("2019-02-02T20:28:35+00:00");
      const after = new Date("2019-02-02T20:28:35+00:00");
      expect(isAfter(date, after)).toBe(false);
    });
  });
});
