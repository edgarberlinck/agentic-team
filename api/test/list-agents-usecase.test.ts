import { describe, expect, it, mock } from "bun:test";
import { createListAgentsUseCase } from "@/lib/use-cases/agent/list-agents-usecase";
import type { IAgentRepository } from "@/lib/use-cases/ports/agent-repository";

describe("ListAgentsUseCase", () => {
  it("should list agents for a user", async () => {
    const mockAgents = [
      {
        id: "agent-1",
        alias: "assistant",
        model: "gpt-4",
        initialPrompt: "You are helpful",
      },
      {
        id: "agent-2",
        alias: "coder",
        model: "gpt-4",
        initialPrompt: "You are a coding expert",
      },
    ];

    const mockRepository: IAgentRepository = {
      create: mock(async () => ({}) as any),
      findByUserId: mock(async () => mockAgents),
      findById: mock(async () => null),
    };

    const ListAgents = createListAgentsUseCase(mockRepository);

    const result = await ListAgents("user-123");

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toHaveLength(2);
      expect(result.data[0].alias).toBe("assistant");
      expect(result.data[1].alias).toBe("coder");
    }
  });

  it("should return empty list when user has no agents", async () => {
    const mockRepository: IAgentRepository = {
      create: mock(async () => ({}) as any),
      findByUserId: mock(async () => []),
      findById: mock(async () => null),
    };

    const ListAgents = createListAgentsUseCase(mockRepository);

    const result = await ListAgents("user-123");

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toHaveLength(0);
    }
  });

  it("should return error when repository throws", async () => {
    const mockRepository: IAgentRepository = {
      create: mock(async () => ({}) as any),
      findByUserId: mock(async () => {
        throw new Error("Database error");
      }),
      findById: mock(async () => null),
    };

    const ListAgents = createListAgentsUseCase(mockRepository);

    const result = await ListAgents("user-123");

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.message).toBe("Failed to list agents");
    }
  });
});
