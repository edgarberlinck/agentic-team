import type { NewUser } from "@/lib/shared/types/user";
import type { SignupInput } from "../validator/signup-input.validator";

export function fromSignUpInputToUser(from: SignupInput): NewUser {
  return {
    username: from.email,
    firstName: from.firstName,
    lastName: from.lastName,
    password: from.password,
    email: from.email,
  };
}
