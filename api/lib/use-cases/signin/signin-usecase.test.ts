import { beforeEach, describe, expect, mock, test } from "bun:test";
import { createSignInUseCase } from "./signin-usecase";

const validInput = {
  email: "john@example.com",
  password: "secret123",
};

const mockStoredUser = {
  id: "mock-id",
  firstName: "John",
  lastName: "Doe",
  username: "john@example.com",
  email: "john@example.com",
  password: "hashed-password",
};

const mockFindByEmail = mock(async () => mockStoredUser);
const mockCreate = mock(async () => ({
  id: "unused",
  firstName: "Unused",
  lastName: "Unused",
  username: "unused@example.com",
  email: "unused@example.com",
}));
const mockVerify = mock(async () => true);

const SignIn = createSignInUseCase({
  userRepository: {
    create: mockCreate,
    findByEmail: mockFindByEmail,
  },
  passwordVerifier: {
    verify: mockVerify,
  },
});

beforeEach(() => {
  mockFindByEmail.mockClear();
  mockCreate.mockClear();
  mockVerify.mockClear();
  mockVerify.mockResolvedValue(true);
});

describe("SignIn", () => {
  describe("validation", () => {
    test("should return validation errors when input is empty", async () => {
      const result = await SignIn({});

      expect(result).toMatchObject({
        success: false,
        error: {
          email: "Email is required",
          password: "Password is required",
        },
      });
      expect(mockFindByEmail).not.toHaveBeenCalled();
    });
  });

  describe("success", () => {
    test("should call findByEmail with the input email", async () => {
      await SignIn(validInput);

      expect(mockFindByEmail).toHaveBeenCalledTimes(1);
      expect(mockFindByEmail).toHaveBeenCalledWith("john@example.com");
    });

    test("should return success with user without password", async () => {
      const result = await SignIn(validInput);

      expect(result).toMatchObject({
        success: true,
        data: {
          id: "mock-id",
          firstName: "John",
          lastName: "Doe",
          username: "john@example.com",
          email: "john@example.com",
        },
      });
      expect(result).not.toHaveProperty("data.password");
    });
  });

  describe("credentials", () => {
    test("should return invalid credentials when user does not exist", async () => {
      mockFindByEmail.mockResolvedValueOnce(null as any);

      const result = await SignIn(validInput);

      expect(result).toMatchObject({
        success: false,
        error: { message: "Invalid email or password" },
      });
    });

    test("should return invalid credentials when password is wrong", async () => {
      mockVerify.mockResolvedValueOnce(false);

      const result = await SignIn(validInput);

      expect(result).toMatchObject({
        success: false,
        error: { message: "Invalid email or password" },
      });
    });
  });

  describe("database errors", () => {
    test("should return generic message when findByEmail throws", async () => {
      mockFindByEmail.mockRejectedValueOnce(new Error("db failure"));

      const result = await SignIn(validInput);

      expect(result).toMatchObject({
        success: false,
        error: { message: "Unable to sign in" },
      });
    });
  });
});
