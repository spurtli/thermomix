import "jest-fetch-mock";

import { client } from "../../test/fixtures/client";
import { token } from "../../test/fixtures/token";

import { Provider } from "../provider";
import { createStorage } from "../storage/memory-storage";
import { add, now } from "../date";

jest.useFakeTimers();

describe("Provider", () => {
  it("creates provider with config", async () => {
    const provider = new Provider({
      client,
      storage: await createStorage()
    });
    const obj = await provider.authObj();
    expect(obj.isAuthenticated).toBe(false);
  });

  it("returns auth object which is not authenticated", async () => {
    const provider = new Provider({
      client,
      storage: await createStorage({
        accessToken: "abc123",
        refreshToken: "abc123",
        expiresAt: now().toISOString()
      })
    });

    const obj = await provider.authObj();
    expect(obj.isAuthenticated).toBe(false);
  });

  it("returns auth object which is authenticated", async () => {
    const provider = new Provider({
      client,
      storage: await createStorage({
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
      storage: await createStorage({
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

  describe("Behaviour", () => {
    beforeEach(() => {
      global.fetch.resetMocks();
    });

    it("should refresh on start", async () => {
      const storage = await createStorage({
        accessToken: "abc123",
        refreshToken: "abc123",
        expiresAt: add(now(), 1).toISOString()
      });
      new Provider({
        client,
        storage
      });
      global.fetch.mockResponse(JSON.stringify(token));
      jest.runOnlyPendingTimers();
      expect(setInterval).toHaveBeenCalledTimes(1);
    });
  });

  describe("Network", () => {
    beforeEach(() => {
      global.fetch.resetMocks();
    });

    it("should refresh token", async () => {
      const storage = await createStorage({
        accessToken: "abc123",
        refreshToken: "abc123",
        expiresAt: add(now(), 1).toISOString()
      });
      const provider = new Provider({
        client,
        storage
      });

      global.fetch.mockResponse(
        JSON.stringify({
          access_token: "def456",
          refresh_token: "ghi789",
          expires_in: 7200
        })
      );

      await provider.refresh();

      const data = await storage.load();
      expect(data).not.toBeNull();
      expect(data!.accessToken).toBe("def456");
      expect(data!.refreshToken).toBe("ghi789");
    });

    it("should authorize", async () => {
      const storage = await createStorage();
      const provider = new Provider({
        client,
        storage
      });

      global.fetch.mockResponse(JSON.stringify(token));

      await provider.authorize("123");

      const data = await storage.load();
      expect(data).not.toBeNull();
      expect(data!.accessToken).toBe("abc123");
      expect(data!.refreshToken).toBe("def456");
    });
  });
});
