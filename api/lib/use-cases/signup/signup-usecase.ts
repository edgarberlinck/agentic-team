import {
  validateSignupInput,
  type SignupInput,
} from "@/lib/validator/signup-input.validator";
import type { UseCaseOutput } from "../types";
import { PrismaDatabase } from "@/lib/database";
import { type User } from "@/lib/database/modules/user.module";
import { fromSignUpInputToUser } from "@/lib/converters/user.converter";

export async function SignUp(
  form: unknown,
): Promise<UseCaseOutput<Omit<User, "password">, SignupInput>> {
  const validator = validateSignupInput(form);

  if ("error" in validator) {
    return { success: false, error: validator.error };
  }

  try {
    const user = await PrismaDatabase.getDatabase().user.create(
      fromSignUpInputToUser(validator.data),
    );

    const { password: _password, ...safeUser } = user as User;

    return { success: true, data: safeUser };
  } catch (error) {
    return {
      success: false,
      error: { message: "User with this mail already exists" },
    };
  }
}
