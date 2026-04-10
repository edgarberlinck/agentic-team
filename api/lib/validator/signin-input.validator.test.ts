import { describe, expect, test } from "bun:test";
import { validateSigninInput } from "./signin-input.validator";

describe("SigninInput Validator", () => {
  test("should validate a valid payload", () => {
    const input = {
      email: "john@example.com",
      password: "secret123",
    };

    const validator = validateSigninInput(input);

    expect(validator).toMatchObject({
      success: true,
      data: input,
    });
  });

  test("should return an error if email and password are missing", () => {
    const validator = validateSigninInput({});

    expect(validator).toMatchObject({
      error: {
        email: "Email is required",
        password: "Password is required",
      },
    });
  });

  test("should return an error if password is missing", () => {
    const validator = validateSigninInput({ email: "john@example.com" });

    expect(validator).toMatchObject({
      error: {
        password: "Password is required",
      },
    });
  });

  test("should return an error if email is missing", () => {
    const validator = validateSigninInput({ password: "secret123" });

    expect(validator).toMatchObject({
      error: {
        email: "Email is required",
      },
    });
  });
});
