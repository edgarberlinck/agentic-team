import type { BunRequest } from "bun";
import "./config";
import { PrismaDatabase } from "./lib/database";
import { buildBunRoutes } from "./lib/http/decorators";
import { createAuthRoutes } from "./lib/http/routes/auth.routes";
import { createAgentRoutes } from "./lib/http/routes/agent.routes";
import { createSignUpUseCase } from "./lib/use-cases/signup/signup-usecase";
import { createSignInUseCase } from "./lib/use-cases/signin/signin-usecase";
import { createCreateAgentUseCase } from "./lib/use-cases/agent/create-agent-usecase";
import { createListAgentsUseCase } from "./lib/use-cases/agent/list-agents-usecase";

const database = PrismaDatabase.getDatabase();
const userRepository = database.user;
const agentRepository = database.agent;

const SignUp = createSignUpUseCase(userRepository);
const SignIn = createSignInUseCase({
  userRepository,
  passwordVerifier: {
    verify: async (plain: string, hash: string) =>
      Bun.password.verify(plain, hash),
  },
});
const CreateAgent = createCreateAgentUseCase(agentRepository);
const ListAgents = createListAgentsUseCase(agentRepository);

const AuthRoutes = createAuthRoutes({ SignUp, SignIn });
const AgentRoutes = createAgentRoutes({ ListAgents, CreateAgent });

const routes = buildBunRoutes([AuthRoutes, AgentRoutes]);

const server = Bun.serve({
  development: Bun.env.DEV === "true",
  port: Bun.env.PORT, // Zero uses a random port
  //hostname: "mydomain.com", // defaults to 0.0.0.0
  routes,

  fetch(req) {
    return new Response("Not found", { status: 404 });
  },

  error(error: Bun.ErrorLike) {
    return new Response(`<pre>${error.message}\n${error.stack}</pre>`, {
      headers: {
        "Content-Type": "text/html",
      },
    });
  },
});

console.log(`Server running at ${server.url}`);
if (Bun.env.DEV === "true") {
  console.log("Development mode on");
}
