import { createStorage } from "../storage/local-storage";
import { now } from "../date";
import { Data } from "../types";

describe("Storage", () => {
  describe("localStorage", () => {
    const data: Data = {
      accessToken: "a",
      refreshToken: "r",
      expiresAt: now().toISOString()
    };

    it("should save and load item", async () => {
      const storage = createStorage();
      await storage.save(data);
      const item = await storage.load();
      expect(item).toBeInstanceOf(Object);
    });

    it("should delete item", async () => {
      const storage = createStorage();
      await storage.save(data);
      let item = await storage.load();
      expect(item).toBeInstanceOf(Object);
      await storage.delete();
      item = await storage.load();
      expect(item).toBeNull();
    });
  });
});
