import type { NewUser, User } from "@/lib/shared/types/user";

export interface IUserRepository {
  create(user: NewUser): Promise<Omit<User, "password"> | User>;
  findByEmail(email: string): Promise<User | null>;
}
