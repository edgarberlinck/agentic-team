import { UserModule, type IUserModule } from "./modules/user.module";
import { AgentModule } from "./modules/agent.module";
import type { IAgentRepository } from "@/lib/use-cases/ports/agent-repository";

export interface IPrismaDatabase {
  user: IUserModule;
  agent: IAgentRepository;
}

export class PrismaDatabase implements IPrismaDatabase {
  user: IUserModule;
  agent: IAgentRepository;

  private static instance: IPrismaDatabase = new PrismaDatabase();

  static getDatabase(): IPrismaDatabase {
    return PrismaDatabase.instance;
  }

  constructor() {
    this.user = new UserModule();
    this.agent = new AgentModule();
  }
}
