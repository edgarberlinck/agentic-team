export type User = {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
};

export type NewUser = Omit<User, "id">;
export type SafeUser = Omit<User, "password">;
