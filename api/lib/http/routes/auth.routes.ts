import type { BunRequest } from "bun";
import { Route, Server } from "../decorators";

type SignUpUseCase = (
  form: unknown,
) => Promise<
  | { success: true; data: { id: string } }
  | { success: false; error: Record<string, string> }
>;

type SignInUseCase = (
  form: unknown,
) => Promise<
  | { success: true; data: { id: string } }
  | { success: false; error: Record<string, string> }
>;

type AuthRouteDeps = {
  SignUp: SignUpUseCase;
  SignIn: SignInUseCase;
};

export function createAuthRoutes(deps: AuthRouteDeps) {
  @Server({ path: "/api" })
  class AuthRoutes {
    @Route({ method: "POST", path: "signup", public: true })
    static async signup(req: BunRequest) {
      const body = await req.json();
      const result = await deps.SignUp(body);

      if (!result.success) {
        return Response.json({ error: result.error }, { status: 500 });
      }

      return new Response(null, { status: 201 });
    }

    @Route({ method: "POST", path: "auth", public: true })
    static async signin(req: BunRequest) {
      const body = await req.json();
      const result = await deps.SignIn(body);

      if (!result.success) {
        return Response.json({ error: result.error }, { status: 500 });
      }

      const cookies = req.cookies;
      cookies.set("user_id", result.data.id, {
        maxAge: 60 * 60 * 24 * 7,
        httpOnly: true,
        secure: true,
        path: "/",
      });

      return Response.json({ message: "Logged in" }, { status: 200 });
    }

    @Route({ method: "DELETE", path: "auth", public: true })
    static signout(req: BunRequest) {
      const cookies = req.cookies;
      cookies.delete("user_id", {
        path: "/",
      });
      return Response.json({ message: "Logged out" }, { status: 200 });
    }
  }

  return AuthRoutes;
}
