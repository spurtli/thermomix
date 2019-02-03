import { createStorage as createLocalStorage } from "../storage/local-storage";
import { createStorage as createMemoryStorage } from "../storage/memory-storage";
import { now } from "../date";
import { Data } from "../types";

describe("Storage", () => {
  describe("LocalStorage", () => {
    const data: Data = {
      accessToken: "a",
      refreshToken: "r",
      expiresAt: now().toISOString()
    };

    it("should save and load item", async () => {
      const storage = await createLocalStorage();
      await storage.save(data);
      const item = await storage.load();
      expect(item).toBeInstanceOf(Object);
    });

    it("should delete item", async () => {
      const storage = await createLocalStorage();
      await storage.save(data);
      let item = await storage.load();
      expect(item).toBeInstanceOf(Object);
      await storage.delete();
      item = await storage.load();
      expect(item).toBeNull();
    });
  });

  describe("MemoryStorage", () => {
    const data: Data = {
      accessToken: "a",
      refreshToken: "r",
      expiresAt: now().toISOString()
    };

    it("should save and load item", async () => {
      const storage = await createMemoryStorage();
      await storage.save(data);
      const item = await storage.load();
      expect(item).toBeInstanceOf(Object);
    });

    it("should delete item", async () => {
      const storage = await createMemoryStorage();
      await storage.save(data);
      let item = await storage.load();
      expect(item).toBeInstanceOf(Object);
      await storage.delete();
      item = await storage.load();
      expect(item).toBeNull();
    });
  });
});
