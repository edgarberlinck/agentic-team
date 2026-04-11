import { describe, expect, mock, test } from "bun:test";

class UserModuleMock {}

mock.module("./modules/user.module", () => ({
  UserModule: UserModuleMock,
}));

describe("PrismaDatabase", () => {
  test("should return the same singleton instance on every call", async () => {
    const { PrismaDatabase } = await import("./index");
    const first = PrismaDatabase.getDatabase();
    const second = PrismaDatabase.getDatabase();

    expect(first).toBe(second);
  });

  test("should initialize user module in constructor", async () => {
    const { PrismaDatabase } = await import("./index");
    const database = new PrismaDatabase();

    expect(database.user).toBeInstanceOf(UserModuleMock);
  });
});
