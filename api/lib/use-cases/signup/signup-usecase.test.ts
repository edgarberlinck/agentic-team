import { describe, expect, test, mock, spyOn, beforeEach } from "bun:test";
import { PrismaDatabase } from "@/lib/database";
import { SignUp } from "./signup-usecase";
import { fromSignUpInputToUser } from "@/lib/converters/user.converter";

const validInput = {
  firstName: "John",
  lastName: "Doe",
  email: "john@example.com",
  password: "secret123",
};

const mockCreatedUser = {
  id: "mock-id",
  firstName: "John",
  lastName: "Doe",
  username: "john@example.com",
  email: "john@example.com",
};

const mockUserCreate = mock(async () => mockCreatedUser);

beforeEach(() => {
  spyOn(PrismaDatabase, "getDatabase").mockReturnValue({
    user: { create: mockUserCreate, findByEmail: mock(async () => null) },
  });
  mockUserCreate.mockClear();
});

describe("SignUp", () => {
  describe("validation", () => {
    test("should return error with all field errors when input is empty", async () => {
      const result = await SignUp({});
      expect(result).toMatchObject({
        success: false,
        error: {
          firstName: "First name is required",
          lastName: "Last name is required",
          email: "Email is required",
          password: "Password is required",
        },
      });
    });

    test("should return error when firstName is missing", async () => {
      const result = await SignUp({
        lastName: "Doe",
        email: "john@example.com",
        password: "secret123",
      });
      expect(result).toMatchObject({
        success: false,
        error: { firstName: "First name is required" },
      });
    });

    test("should not call user.create when validation fails", async () => {
      await SignUp({});
      expect(mockUserCreate).not.toHaveBeenCalled();
    });
  });

  describe("success", () => {
    test("should call user.create with the converted input", async () => {
      await SignUp(validInput);
      expect(mockUserCreate).toHaveBeenCalledTimes(1);
      expect(mockUserCreate).toHaveBeenCalledWith(
        fromSignUpInputToUser(validInput),
      );
    });

    test("should return success: true with the created user", async () => {
      const result = await SignUp(validInput);
      expect(result).toMatchObject({
        success: true,
        data: mockCreatedUser,
      });
    });

    test("should not include password in the returned data", async () => {
      const result = await SignUp(validInput);
      expect(result).not.toHaveProperty("data.password");
    });

    test("should remove password even if create returns it by mistake", async () => {
      mockUserCreate.mockResolvedValueOnce({
        ...mockCreatedUser,
        password: "hashed-password",
      } as any);

      const result = await SignUp(validInput);

      expect(result).toMatchObject({
        success: true,
        data: {
          id: "mock-id",
          username: "john@example.com",
          email: "john@example.com",
        },
      });
      expect(result).not.toHaveProperty("data.password");
    });
  });

  describe("database errors", () => {
    test("should return message when user.create throws", async () => {
      mockUserCreate.mockRejectedValueOnce(new Error("duplicate user"));

      const result = await SignUp(validInput);

      expect(result).toMatchObject({
        success: false,
        error: { message: "User with this mail already exists" },
      });
      expect(mockUserCreate).toHaveBeenCalledTimes(1);
      expect(mockUserCreate).toHaveBeenCalledWith(
        fromSignUpInputToUser(validInput),
      );
    });
  });
});
