import { UserModule, type IUserModule } from "./modules/User.module";

export interface IPrismaDatabase {
  user: IUserModule;
}

export class PrismaDatabase implements IPrismaDatabase {
  user: IUserModule;

  constructor() {
    this.user = new UserModule();
  }
}
