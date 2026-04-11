import { prisma } from "@/lib/prisma";
import type { IAgentRepository } from "@/lib/use-cases/ports/agent-repository";
import type { Agent, NewAgent } from "@/lib/shared/types/agent";

export class AgentModule implements IAgentRepository {
  async create(userId: string, agent: NewAgent): Promise<Agent> {
    const existingAgent = await prisma.agent.findFirst({
      where: { alias: agent.alias },
    });

    if (existingAgent) {
      throw new Error("Agent with this alias already exists");
    }

    const newAgent = await prisma.agent.create({
      data: {
        ...agent,
        users: {
          connect: { id: userId },
        },
      },
    });

    return {
      id: newAgent.id,
      alias: newAgent.alias,
      model: newAgent.model,
      initialPrompt: newAgent.initialPrompt,
    };
  }

  async findByUserId(userId: string): Promise<Agent[]> {
    const agents = await prisma.agent.findMany({
      where: {
        users: {
          some: {
            id: userId,
          },
        },
      },
    });

    return agents.map((agent) => ({
      id: agent.id,
      alias: agent.alias,
      model: agent.model,
      initialPrompt: agent.initialPrompt,
    }));
  }

  async findById(id: string): Promise<Agent | null> {
    const agent = await prisma.agent.findFirst({
      where: { id },
    });

    if (!agent) {
      return null;
    }

    return {
      id: agent.id,
      alias: agent.alias,
      model: agent.model,
      initialPrompt: agent.initialPrompt,
    };
  }
}
