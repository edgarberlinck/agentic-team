import type { BunRequest } from "bun";
import "./config";

const server = Bun.serve({
  development: Bun.env.DEV === "true",
  port: Bun.env.PORT, // Zero uses a random port
  //hostname: "mydomain.com", // defaults to 0.0.0.0
  routes: {
    "/api/public/auth": {
      POST: (req: BunRequest) => {
        const cookies = req.cookies;
        // Read: https://bun.com/docs/runtime/hashing
        cookies.set("user_id", "1234", {
          maxAge: 60 * 60 * 24 * 7,
          httpOnly: true,
          secure: true,
          path: "/",
        });

        return Response.json({ message: "Logged in" }, { status: 200 });
      },
      DELETE: (req: BunRequest) => {
        const cookies = req.cookies;
        cookies.delete("user_id", {
          path: "/",
        });
        return Response.json({ message: "Logged out" }, { status: 200 });
      },
    },
    "/api/v1/status": new Response("ok"),

    // Sample dynamic route
    "/api/v1/user/:id": (req: BunRequest) => {
      return new Response(`Hello user ${req.params.id}`);
    },

    // Sample Per-Http method handler
    "/api/v1/agents": {
      GET: () => Response.json([{ id: 1, name: "mock agent" }]),
      POST: async (req: BunRequest) => {
        const body = await req.json();
        return Response.json(body);
      },
    },
  },

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
