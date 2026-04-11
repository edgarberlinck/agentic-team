import {
  validateSigninInput,
  type SigninInput,
} from "@/lib/validator/signin-input.validator";
import type { UseCaseOutput } from "../types";
import type { IUserRepository } from "../ports/user-repository";
import type { IPasswordVerifier } from "../ports/password-verifier";
import type { SafeUser, User } from "@/lib/shared/types/user";

type SignInDeps = {
  userRepository: IUserRepository;
  passwordVerifier: IPasswordVerifier;
};

export function createSignInUseCase(deps: SignInDeps) {
  return async function SignIn(
    form: unknown,
  ): Promise<UseCaseOutput<SafeUser, SigninInput>> {
    const validator = validateSigninInput(form);

    if ("error" in validator) {
      return { success: false, error: validator.error };
    }

    try {
      const user = await deps.userRepository.findByEmail(validator.data.email);

      if (!user) {
        return {
          success: false,
          error: { message: "Invalid email or password" },
        };
      }

      const isValidPassword = await deps.passwordVerifier.verify(
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
  };
}
