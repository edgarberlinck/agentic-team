import { describe, expect, it, beforeEach, mock } from "bun:test";
import { AgentModule } from "@/lib/database/modules/agent.module";
import type { IAgentRepository } from "@/lib/use-cases/ports/agent-repository";

// Mock Prisma
const mockPrisma = {
  agent: {
    findFirst: mock((query: any) => Promise.resolve(null)),
    create: mock((data: any) =>
      Promise.resolve({
        id: "agent-123",
        alias: data.data.alias,
        model: data.data.model,
        initialPrompt: data.data.initialPrompt,
      }),
    ),
    findMany: mock((query: any) =>
      Promise.resolve([
        {
          id: "agent-123",
          alias: "assistant",
          model: "gpt-4",
          initialPrompt: "You are helpful",
        },
      ]),
    ),
  },
};

// Mock the prisma import
beforeEach(() => {
  mock.module("@/lib/prisma", () => ({
    prisma: mockPrisma,
  }));
});

describe("AgentModule", () => {
  it("should create a new agent", async () => {
    const module = new AgentModule();

    const result = await module.create("user-123", {
      alias: "assistant",
      model: "gpt-4",
      initialPrompt: "You are helpful",
    });

    expect(result.id).toBeDefined();
    expect(result.alias).toBe("assistant");
    expect(result.model).toBe("gpt-4");
    expect(result.initialPrompt).toBe("You are helpful");
  });

  it("should throw error when alias already exists", async () => {
    const existingAgent = {
      id: "agent-456",
      alias: "assistant",
      model: "gpt-3.5",
      initialPrompt: "Old prompt",
    };

    const mockPrismaWithExisting = {
      agent: {
        findFirst: mock((query: any) => Promise.resolve(existingAgent)),
        create: mock(),
        findMany: mock(),
      },
    };

    mock.module("@/lib/prisma", () => ({
      prisma: mockPrismaWithExisting,
    }));

    const module = new AgentModule();

    let error: Error | null = null;
    try {
      await module.create("user-123", {
        alias: "assistant",
        model: "gpt-4",
        initialPrompt: "You are helpful",
      });
    } catch (e) {
      error = e as Error;
    }

    expect(error?.message).toContain("Agent with this alias already exists");
  });

  it("should find agents by userId", async () => {
    const module = new AgentModule();

    const result = await module.findByUserId("user-123");

    expect(Array.isArray(result)).toBe(true);
    if (result.length > 0) {
      expect(result[0]?.id).toBeDefined();
      expect(result[0]?.alias).toBeDefined();
    }
  });

  it("should find agent by id", async () => {
    const mockPrismaWithFindById = {
      agent: {
        findFirst: mock((query: any) =>
          Promise.resolve({
            id: "agent-123",
            alias: "assistant",
            model: "gpt-4",
            initialPrompt: "You are helpful",
          }),
        ),
      },
    };

    mock.module("@/lib/prisma", () => ({
      prisma: mockPrismaWithFindById,
    }));

    const module = new AgentModule();

    const result = await module.findById("agent-123");

    expect(result).not.toBeNull();
    if (result) {
      expect(result.id).toBe("agent-123");
      expect(result.alias).toBe("assistant");
    }
  });

  it("should return null when agent not found", async () => {
    const mockPrismaWithNull = {
      agent: {
        findFirst: mock(() => Promise.resolve(null)),
      },
    };

    mock.module("@/lib/prisma", () => ({
      prisma: mockPrismaWithNull,
    }));

    const module = new AgentModule();

    const result = await module.findById("non-existent");

    expect(result).toBeNull();
  });
});
