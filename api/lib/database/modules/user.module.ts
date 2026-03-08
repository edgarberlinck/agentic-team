import { prisma } from "@/lib/prisma";

export interface IUserModule {
  create: (user: Omit<User, "id">) => Promise<Omit<User, "password">>;
}

export type User = {
  id: string;
  username: string;
  email: string;
  password: string;
};

export class UserModule implements IUserModule {
  async create(user: Omit<User, "id">): Promise<Omit<User, "password">> {
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: user.email },
          { username: user.username }
        ]
      }
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
      username: newUser.username,
      email: newUser.email,
    };
  }

  async query(
    query: Partial<Omit<User, "password">>,
  ): Promise<Omit<User, "password">[]> {
    const users = await prisma.user.findMany({ where: query });

    return users.map((user) => ({
      id: user.id,
      username: user.username,
      email: user.email,
    }));
  }
}
