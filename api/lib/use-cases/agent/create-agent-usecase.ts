import {
  validateCreateAgentInput,
  type CreateAgentInput,
} from "@/lib/validator/create-agent-input.validator";
import type { UseCaseOutput } from "../types";
import type { IAgentRepository } from "../ports/agent-repository";
import type { Agent } from "@/lib/shared/types/agent";

export function createCreateAgentUseCase(agentRepository: IAgentRepository) {
  return async function CreateAgent(
    userId: string,
    form: unknown,
  ): Promise<UseCaseOutput<Agent, CreateAgentInput>> {
    const validator = validateCreateAgentInput(form);

    if ("error" in validator) {
      return { success: false, error: validator.error };
    }

    try {
      const agent = await agentRepository.create(userId, validator.data);
      return { success: true, data: agent };
    } catch (error) {
      return {
        success: false,
        error: { message: "Failed to create agent" },
      };
    }
  };
}
