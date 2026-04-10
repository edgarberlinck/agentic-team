import type { ValidatorResult } from "../shared/types/validator";

export type SignupInput = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

export function validateSignupInput(
  data: unknown,
): ValidatorResult<SignupInput> {
  let result: ValidatorResult<SignupInput> | null = null;

  if (!hasProp(data, "firstName")) {
    result = { error: { firstName: "First name is required" } };
  }

  if (!hasProp(data, "lastName")) {
    result = { error: { ...result?.error, lastName: "Last name is required" } };
  }

  if (!hasProp(data, "email")) {
    result = { error: { ...result?.error, email: "Email is required" } };
  }

  if (!hasProp(data, "password")) {
    result = { error: { ...result?.error, password: "Password is required" } };
  }

  if (!result) {
    result = { success: true, data: data as SignupInput };
  }

  return result;
}

function hasProp(data: any, prop: string): boolean {
  return Object.keys(data).some((key) => key === prop);
}
