import type { BunRequest } from "bun";
import { Route, Server } from "../decorators";

type ListAgentsUseCase = (userId: string) => Promise<
  | {
      success: true;
      data: Array<{
        id: string;
        alias: string;
        model: string;
        initialPrompt: string;
      }>;
    }
  | { success: false; error: Record<string, string> }
>;

type CreateAgentUseCase = (
  userId: string,
  form: unknown,
) => Promise<
  | {
      success: true;
      data: {
        id: string;
        alias: string;
        model: string;
        initialPrompt: string;
      };
    }
  | { success: false; error: Record<string, string> }
>;

type AgentRouteDeps = {
  ListAgents: ListAgentsUseCase;
  CreateAgent: CreateAgentUseCase;
};

export function createAgentRoutes(deps: AgentRouteDeps) {
  @Server({ path: "/api" })
  class AgentRoutes {
    @Route({ method: "GET", path: "status", public: false })
    static status() {
      return new Response("ok");
    }

    @Route({ method: "GET", path: "user/:id", public: false })
    static user(req: BunRequest) {
      return new Response(`Hello user ${req.params.id}`);
    }

    @Route({ method: "GET", path: "agents", public: false })
    static async listAgents(req: BunRequest) {
      const userId = req.cookies.get("user_id");

      if (!userId) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
      }

      const result = await deps.ListAgents(userId);

      if (!result.success) {
        return Response.json({ error: result.error }, { status: 500 });
      }

      return Response.json(result.data, { status: 200 });
    }

    @Route({ method: "POST", path: "agents", public: false })
    static async createAgent(req: BunRequest) {
      const userId = req.cookies.get("user_id");

      if (!userId) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
      }

      const body = await req.json();
      const result = await deps.CreateAgent(userId, body);

      if (!result.success) {
        return Response.json({ error: result.error }, { status: 500 });
      }

      return Response.json(result.data, { status: 201 });
    }
  }

  return AgentRoutes;
}
