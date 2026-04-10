import {
  validateSigninInput,
  type SigninInput,
} from "@/lib/validator/signin-input.validator";
import type { UseCaseOutput } from "../types";
import { PrismaDatabase } from "@/lib/database";
import { type User } from "@/lib/database/modules/user.module";

export async function SignIn(
  form: unknown,
): Promise<UseCaseOutput<Omit<User, "password">, SigninInput>> {
  const validator = validateSigninInput(form);

  if ("error" in validator) {
    return { success: false, error: validator.error };
  }

  try {
    const user = await PrismaDatabase.getDatabase().user.findByEmail(
      validator.data.email,
    );

    if (!user) {
      return {
        success: false,
        error: { message: "Invalid email or password" },
      };
    }

    const isValidPassword = await Bun.password.verify(
      validator.data.password,
      user.password,
    );

    if (!isValidPassword) {
      return {
        success: false,
        error: { message: "Invalid email or password" },
      };
    }

    const { password: _password, ...safeUser } = user as User;

    return { success: true, data: safeUser };
  } catch (error) {
    return {
      success: false,
      error: { message: "Unable to sign in" },
    };
  }
}
