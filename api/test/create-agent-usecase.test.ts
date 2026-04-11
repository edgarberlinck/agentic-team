import { describe, expect, it, mock } from "bun:test";
import { createCreateAgentUseCase } from "@/lib/use-cases/agent/create-agent-usecase";
import type { IAgentRepository } from "@/lib/use-cases/ports/agent-repository";

describe("CreateAgentUseCase", () => {
  it("should create an agent successfully", async () => {
    const mockRepository: IAgentRepository = {
      create: mock(async (userId: string, agent: any) => ({
        id: "agent-123",
        alias: agent.alias,
        model: agent.model,
        initialPrompt: agent.initialPrompt,
      })),
      findByUserId: mock(async () => []),
      findById: mock(async () => null),
    };

    const CreateAgent = createCreateAgentUseCase(mockRepository);

    const result = await CreateAgent("user-123", {
      alias: "my-agent",
      model: "gpt-4",
      initialPrompt: "You are helpful",
    });

    expect(result.success).toBe(true);
    if (result.success) {
      const agent = result.data;
      expect(agent.id).toBe("agent-123");
      expect(agent.alias).toBe("my-agent");
      expect(agent.model).toBe("gpt-4");
    }
  });

  it("should return validation error when alias is missing", async () => {
    const mockRepository: IAgentRepository = {
      create: mock(async () => ({}) as any),
      findByUserId: mock(async () => []),
      findById: mock(async () => null),
    };

    const CreateAgent = createCreateAgentUseCase(mockRepository);

    const result = await CreateAgent("user-123", {
      model: "gpt-4",
      initialPrompt: "You are helpful",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.alias).toBeDefined();
    }
  });

  it("should return error when repository throws", async () => {
    const mockRepository: IAgentRepository = {
      create: mock(async () => {
        throw new Error("Database error");
      }),
      findByUserId: mock(async () => []),
      findById: mock(async () => null),
    };

    const CreateAgent = createCreateAgentUseCase(mockRepository);

    const result = await CreateAgent("user-123", {
      alias: "my-agent",
      model: "gpt-4",
      initialPrompt: "You are helpful",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.message).toBe("Failed to create agent");
    }
  });
});
