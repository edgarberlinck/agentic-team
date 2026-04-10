import { describe, expect, test } from "bun:test";
import { validateSignupInput } from "./signup-input.validator";

describe("SignupInput Validator", () => {
  test("should validate a valid payload", () => {
    const input = {
      firstName: "Foo",
      lastName: "Bar",
      email: "foo",
      password: "bar",
    };
    const validator = validateSignupInput(input);

    expect(validator).toMatchObject({
      success: true,
      data: input,
    });
  });

  test("should return an error if first name is missing", () => {
    const input = {};
    const validator = validateSignupInput(input);
    expect(validator).toMatchObject({
      error: {
        firstName: "First name is required",
        lastName: "Last name is required",
        email: "Email is required",
        password: "Password is required",
      },
    });
  });

  test("should return an error if only firstName is provided", () => {
    const validator = validateSignupInput({ firstName: "Foo" });
    expect(validator).toMatchObject({
      error: {
        lastName: "Last name is required",
        email: "Email is required",
        password: "Password is required",
      },
    });
    expect(validator).not.toHaveProperty("error.firstName");
  });

  test("should return an error if only lastName is missing", () => {
    const validator = validateSignupInput({
      firstName: "Foo",
      email: "foo@bar.com",
      password: "secret",
    });
    expect(validator).toMatchObject({
      error: {
        lastName: "Last name is required",
      },
    });
  });

  test("should return an error if only email is missing", () => {
    const validator = validateSignupInput({
      firstName: "Foo",
      lastName: "Bar",
      password: "secret",
    });
    expect(validator).toMatchObject({
      error: {
        email: "Email is required",
      },
    });
  });

  test("should return an error if only password is missing", () => {
    const validator = validateSignupInput({
      firstName: "Foo",
      lastName: "Bar",
      email: "foo@bar.com",
    });
    expect(validator).toMatchObject({
      error: {
        password: "Password is required",
      },
    });
  });

  test("should not have success key when validation fails", () => {
    const validator = validateSignupInput({});
    expect(validator).not.toHaveProperty("success");
  });

  test("should not have error key when validation succeeds", () => {
    const validator = validateSignupInput({
      firstName: "Foo",
      lastName: "Bar",
      email: "foo@bar.com",
      password: "secret",
    });
    expect(validator).not.toHaveProperty("error");
  });

  test("should return data matching the input on success", () => {
    const input = {
      firstName: "Alice",
      lastName: "Smith",
      email: "alice@example.com",
      password: "p@ssw0rd",
    };
    const validator = validateSignupInput(input);
    expect(validator).toHaveProperty("data");
    if ("data" in validator) {
      expect(validator.data).toEqual(input);
    }
  });

  test("should return an error if input is null-like empty object", () => {
    const validator = validateSignupInput({});
    expect(validator).toHaveProperty("error");
  });
});
