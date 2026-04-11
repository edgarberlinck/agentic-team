import type { UseCaseOutput } from "../types";
import type { IAgentRepository } from "../ports/agent-repository";
import type { Agent } from "@/lib/shared/types/agent";

export function createListAgentsUseCase(agentRepository: IAgentRepository) {
  return async function ListAgents(
    userId: string,
  ): Promise<UseCaseOutput<Agent[], null>> {
    try {
      const agents = await agentRepository.findByUserId(userId);
      return { success: true, data: agents };
    } catch (error) {
      return {
        success: false,
        error: { message: "Failed to list agents" },
      };
    }
  };
}
