import type { User } from "@/generated/prisma/browser";
import type { SignupInput } from "../validator/signup-input.validator";

export function fromSignUpInputToUser(from: SignupInput): Omit<User, "id"> {
  return {
    username: from.email,
    firstName: from.firstName,
    lastName: from.lastName,
    password: from.password,
    email: from.email,
  };
}
