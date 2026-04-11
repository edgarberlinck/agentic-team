import { prisma } from "@/lib/prisma";
import type { IUserRepository } from "@/lib/use-cases/ports/user-repository";
import type { NewUser, SafeUser, User } from "@/lib/shared/types/user";

export interface IUserModule extends IUserRepository {
  query: (query: Partial<SafeUser>) => Promise<SafeUser[]>;
}

export class UserModule implements IUserModule {
  async create(user: NewUser): Promise<SafeUser> {
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email: user.email }, { username: user.username }],
      },
    });

    if (existingUser) {
      throw new Error("User with this email or username already exists");
    }

    const password = await Bun.password.hash(user.password);
    const newUser = await prisma.user.create({
      data: {
        ...user,
        password,
      },
    });

    return {
      id: newUser.id,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      username: newUser.username,
      email: newUser.email,
    };
  }

  async query(query: Partial<SafeUser>): Promise<SafeUser[]> {
    const users = await prisma.user.findMany({ where: query });

    return users.map((user) => ({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      email: user.email,
    }));
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await prisma.user.findFirst({ where: { email } });

    if (!user) {
      return null;
    }

    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      email: user.email,
      password: user.password,
    };
  }
}
