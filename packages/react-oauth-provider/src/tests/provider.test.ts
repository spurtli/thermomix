import "jest-fetch-mock";

import { client } from "../../test/fixtures/client";

import { Provider } from "../provider";
import { createStorage } from "../storage/memory-storage";
import { add, now } from "../date";

describe("Provider", () => {
  it("creates provider with config", async () => {
    const provider = new Provider({
      client,
      storage: createStorage()
    });
    const obj = await provider.authObj();
    expect(obj.isAuthenticated).toBe(false);
  });

  it("should return an auth object which is not authenticated", async () => {
    const provider = new Provider({
      client,
      storage: createStorage({
        accessToken: "abc123",
        refreshToken: "abc123",
        expiresAt: now().toISOString()
      })
    });

    const obj = await provider.authObj();
    expect(obj.isAuthenticated).toBe(false);
  });

  it("should return an auth object which is authenticated", async () => {
    const provider = new Provider({
      client,
      storage: createStorage({
        accessToken: "abc123",
        refreshToken: "abc123",
        expiresAt: add(now(), 1).toISOString()
      })
    });

    const obj = await provider.authObj();
    expect(obj.isAuthenticated).toBe(true);
  });

  it("should signOut", async () => {
    const provider = new Provider({
      client,
      storage: createStorage({
        accessToken: "abc123",
        refreshToken: "abc123",
        expiresAt: add(now(), 1).toISOString()
      })
    });

    const obj1 = await provider.authObj();
    expect(obj1.isAuthenticated).toBe(true);

    await provider.signOut();

    const obj2 = await provider.authObj();
    expect(obj2.isAuthenticated).toBe(false);
  });

  describe("Network", () => {
    it("should refresh token", async () => {
      const storage = createStorage({
        accessToken: "abc123",
        refreshToken: "abc123",
        expiresAt: add(now(), 1).toISOString()
      });
      const provider = new Provider({
        client,
        storage
      });

      global.fetch.mockResponseOnce(
        JSON.stringify({
          access_token: "def456",
          refresh_token: "ghi789",
          expires_in: 7200
        })
      );

      await provider.refresh();

      const data = await storage.load();
      expect(data).not.toBeNull();
      // @ts-ignore
      expect(data.accessToken).toBe("def456");
      // @ts-ignore
      expect(data.refreshToken).toBe("ghi789");
    });

    it("should authorize", async () => {
      const storage = createStorage();
      const provider = new Provider({
        client,
        storage
      });

      global.fetch.mockResponseOnce(
        JSON.stringify({
          access_token: "abc123",
          refresh_token: "abc123",
          expires_in: 7200
        })
      );

      await provider.authorize("123");

      const data = await storage.load();
      expect(data).not.toBeNull();
      // @ts-ignore
      expect(data.accessToken).toBe("abc123");
      // @ts-ignore
      expect(data.refreshToken).toBe("abc123");
    });
  });
});
