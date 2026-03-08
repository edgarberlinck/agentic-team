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
}
