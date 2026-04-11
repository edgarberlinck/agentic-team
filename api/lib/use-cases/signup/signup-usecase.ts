import {
  validateSignupInput,
  type SignupInput,
} from "@/lib/validator/signup-input.validator";
import type { UseCaseOutput } from "../types";
import { fromSignUpInputToUser } from "@/lib/converters/user.converter";
import type { IUserRepository } from "../ports/user-repository";
import type { SafeUser, User } from "@/lib/shared/types/user";

export function createSignUpUseCase(userRepository: IUserRepository) {
  return async function SignUp(
    form: unknown,
  ): Promise<UseCaseOutput<SafeUser, SignupInput>> {
    const validator = validateSignupInput(form);

    if ("error" in validator) {
      return { success: false, error: validator.error };
    }

    try {
      const user = await userRepository.create(
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
  };
}
