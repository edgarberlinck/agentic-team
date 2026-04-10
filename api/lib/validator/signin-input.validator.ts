import type { ValidatorResult } from "../shared/types/validator";

export type SigninInput = {
  email: string;
  password: string;
};

export function validateSigninInput(
  data: unknown,
): ValidatorResult<SigninInput> {
  let result: ValidatorResult<SigninInput> | null = null;

  if (!hasProp(data, "email")) {
    result = { error: { email: "Email is required" } };
  }

  if (!hasProp(data, "password")) {
    result = { error: { ...result?.error, password: "Password is required" } };
  }

  if (!result) {
    result = { success: true, data: data as SigninInput };
  }

  return result;
}

function hasProp(data: any, prop: string): boolean {
  return Object.keys(data).some((key) => key === prop);
}
