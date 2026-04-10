import { describe, expect, test } from "bun:test";
import { fromSignUpInputToUser } from "./user.converter";

const baseInput = {
  firstName: "John",
  lastName: "Doe",
  email: "john@example.com",
  password: "secret123",
};

describe("fromSignUpInputToUser", () => {
  test("should map firstName correctly", () => {
    const result = fromSignUpInputToUser(baseInput);
    expect(result.firstName).toBe(baseInput.firstName);
  });

  test("should map lastName correctly", () => {
    const result = fromSignUpInputToUser(baseInput);
    expect(result.lastName).toBe(baseInput.lastName);
  });

  test("should map email correctly", () => {
    const result = fromSignUpInputToUser(baseInput);
    expect(result.email).toBe(baseInput.email);
  });

  test("should map password correctly", () => {
    const result = fromSignUpInputToUser(baseInput);
    expect(result.password).toBe(baseInput.password);
  });

  test("should set username from email", () => {
    const result = fromSignUpInputToUser(baseInput);
    expect(result.username).toBe(baseInput.email);
  });

  test("should not include id field", () => {
    const result = fromSignUpInputToUser(baseInput);
    expect(result).not.toHaveProperty("id");
  });

  test("should return all required fields", () => {
    const result = fromSignUpInputToUser(baseInput);
    expect(Object.keys(result)).toEqual(
      expect.arrayContaining(["firstName", "lastName", "email", "password", "username"]),
    );
  });

  test("username should always match email regardless of other fields", () => {
    const input = { ...baseInput, email: "other@domain.com" };
    const result = fromSignUpInputToUser(input);
    expect(result.username).toBe("other@domain.com");
    expect(result.email).toBe("other@domain.com");
  });
});
