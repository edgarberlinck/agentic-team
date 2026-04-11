import type { Agent, NewAgent } from "@/lib/shared/types/agent";

export interface IAgentRepository {
  create(userId: string, agent: NewAgent): Promise<Agent>;
  findByUserId(userId: string): Promise<Agent[]>;
  findById(id: string): Promise<Agent | null>;
}
