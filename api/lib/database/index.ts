import { UserModule, type IUserModule } from "./modules/user.module";

export interface IPrismaDatabase {
  user: IUserModule;
}

export class PrismaDatabase implements IPrismaDatabase {
  user: IUserModule;

  private static instance: IPrismaDatabase = new PrismaDatabase();

  static getDatabase(): IPrismaDatabase {
    return PrismaDatabase.instance;
  }

  constructor() {
    this.user = new UserModule();
  }
}
