import { describe, expect, test, mock, beforeEach } from "bun:test";
import { UserModule } from "@/lib/database/modules/user.module";

const mockCreate = mock(async ({ data }) => ({
  id: "mock-id-123",
  username: data.username,
  email: data.email,
  password: data.password,
}));

const mockFindFirst = mock();
const mockFindMany = mock();

mock.module("@/lib/prisma", () => ({
  prisma: {
    user: {
      create: mockCreate,
      findFirst: mockFindFirst,
      findUnique: mock(),
      findMany: mockFindMany,
      update: mock(),
      delete: mock(),
    },
  },
}));

describe("User Module", () => {
  beforeEach(() => {
    mockCreate.mockClear();
    mockFindFirst.mockClear();
    mockFindMany.mockClear();
  });

  describe("create", () => {
    test("should create a user successfully", async () => {
      mockFindFirst.mockResolvedValue(null);

      const userModule = new UserModule();
      const newUser = await userModule.create({
        username: "testuser",
        email: "test@example.com",
        password: "password123",
      });

      expect(newUser).toHaveProperty("id");
      expect(newUser).toHaveProperty("username", "testuser");
      expect(newUser).toHaveProperty("email", "test@example.com");
      expect(newUser).not.toHaveProperty("password");
      expect(mockFindFirst).toHaveBeenCalledTimes(1);
      expect(mockCreate).toHaveBeenCalledTimes(1);
    });

    test("should throw error if email already exists", async () => {
      mockFindFirst.mockResolvedValue({
        id: "existing-id",
        username: "otheruser",
        email: "test@example.com",
        password: "hashedpassword",
      });

      const userModule = new UserModule();
      
      expect(async () => {
        await userModule.create({
          username: "newuser",
          email: "test@example.com",
          password: "password123",
        });
      }).toThrow("User with this email or username already exists");

      expect(mockFindFirst).toHaveBeenCalledTimes(1);
      expect(mockCreate).not.toHaveBeenCalled();
    });

    test("should throw error if username already exists", async () => {
      mockFindFirst.mockResolvedValue({
        id: "existing-id",
        username: "testuser",
        email: "other@example.com",
        password: "hashedpassword",
      });

      const userModule = new UserModule();
      
      expect(async () => {
        await userModule.create({
          username: "testuser",
          email: "new@example.com",
          password: "password123",
        });
      }).toThrow("User with this email or username already exists");

      expect(mockFindFirst).toHaveBeenCalledTimes(1);
      expect(mockCreate).not.toHaveBeenCalled();
    });

    test("should hash password before storing", async () => {
      mockFindFirst.mockResolvedValue(null);

      const userModule = new UserModule();
      await userModule.create({
        username: "testuser",
        email: "test@example.com",
        password: "password123",
      });

      const createCall = mockCreate.mock.calls[0][0];
      expect(createCall.data.password).not.toBe("password123");
      expect(createCall.data.password).toMatch(/^\$argon2/);
    });
  });

  describe("query", () => {
    test("should return all users when no filter is provided", async () => {
      mockFindMany.mockResolvedValue([
        {
          id: "id-1",
          username: "user1",
          email: "user1@example.com",
          password: "hashedpassword1",
        },
        {
          id: "id-2",
          username: "user2",
          email: "user2@example.com",
          password: "hashedpassword2",
        },
      ]);

      const userModule = new UserModule();
      const users = await userModule.query({});

      expect(users).toHaveLength(2);
      expect(users[0]).not.toHaveProperty("password");
      expect(users[1]).not.toHaveProperty("password");
      expect(mockFindMany).toHaveBeenCalledWith({ where: {} });
    });

    test("should filter users by email", async () => {
      mockFindMany.mockResolvedValue([
        {
          id: "id-1",
          username: "user1",
          email: "test@example.com",
          password: "hashedpassword1",
        },
      ]);

      const userModule = new UserModule();
      const users = await userModule.query({ email: "test@example.com" });

      expect(users).toHaveLength(1);
      expect(users[0].email).toBe("test@example.com");
      expect(users[0]).not.toHaveProperty("password");
      expect(mockFindMany).toHaveBeenCalledWith({
        where: { email: "test@example.com" },
      });
    });

    test("should filter users by username", async () => {
      mockFindMany.mockResolvedValue([
        {
          id: "id-1",
          username: "testuser",
          email: "test@example.com",
          password: "hashedpassword1",
        },
      ]);

      const userModule = new UserModule();
      const users = await userModule.query({ username: "testuser" });

      expect(users).toHaveLength(1);
      expect(users[0].username).toBe("testuser");
      expect(users[0]).not.toHaveProperty("password");
      expect(mockFindMany).toHaveBeenCalledWith({
        where: { username: "testuser" },
      });
    });

    test("should filter users by id", async () => {
      mockFindMany.mockResolvedValue([
        {
          id: "specific-id",
          username: "user1",
          email: "user1@example.com",
          password: "hashedpassword1",
        },
      ]);

      const userModule = new UserModule();
      const users = await userModule.query({ id: "specific-id" });

      expect(users).toHaveLength(1);
      expect(users[0].id).toBe("specific-id");
      expect(users[0]).not.toHaveProperty("password");
    });

    test("should return empty array when no users match", async () => {
      mockFindMany.mockResolvedValue([]);

      const userModule = new UserModule();
      const users = await userModule.query({ email: "nonexistent@example.com" });

      expect(users).toHaveLength(0);
    });
  });
});
