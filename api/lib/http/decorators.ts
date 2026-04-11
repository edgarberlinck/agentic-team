import type { BunRequest } from "bun";

type HttpMethod =
  | "GET"
  | "POST"
  | "PUT"
  | "PATCH"
  | "DELETE"
  | "OPTIONS"
  | "HEAD";

type RouteHandler = (
  req: BunRequest,
  server: Bun.Server<unknown>,
) => Response | Promise<Response>;

export type RouteOptions = {
  method: HttpMethod;
  path: string;
  public: boolean;
};

export type ServerOptions = {
  path: string;
};

type RouteMeta = {
  method: HttpMethod;
  path: string;
  public: boolean;
  handlerName: string;
};

const SERVER_OPTIONS: unique symbol = Symbol("server-options");
const ROUTE_OPTIONS: unique symbol = Symbol("route-options");

type ControllerWithMeta = Function & {
  [SERVER_OPTIONS]?: ServerOptions;
  [ROUTE_OPTIONS]?: RouteMeta[];
};

type BunRoutes = Record<string, Partial<Record<HttpMethod, RouteHandler>>>;

function normalizePath(path: string): string {
  return path.trim().replace(/^\/+|\/+$/g, "");
}

function joinPath(...parts: string[]): string {
  const normalized = parts
    .map(normalizePath)
    .filter((part) => part.length > 0)
    .join("/");

  return `/${normalized}`;
}

export function Server(options: ServerOptions): ClassDecorator {
  return function registerServer(target) {
    const controller = target as unknown as ControllerWithMeta;
    Object.defineProperty(controller, SERVER_OPTIONS, {
      value: options,
      writable: false,
      enumerable: false,
      configurable: false,
    });
  };
}

export function Route(options: RouteOptions): MethodDecorator {
  return function registerRoute(target, propertyKey) {
    const controller = target as unknown as ControllerWithMeta;
    const existingRoutes = controller[ROUTE_OPTIONS] ?? [];

    const route: RouteMeta = {
      method: options.method,
      path: options.path,
      public: options.public,
      handlerName: String(propertyKey),
    };

    Object.defineProperty(controller, ROUTE_OPTIONS, {
      value: [...existingRoutes, route],
      writable: true,
      enumerable: false,
      configurable: true,
    });
  };
}

export function buildBunRoutes(controllers: Function[]): BunRoutes {
  const routes: BunRoutes = {};

  for (const rawController of controllers) {
    const controller = rawController as ControllerWithMeta;
    const serverOptions = controller[SERVER_OPTIONS];
    const routeOptions = controller[ROUTE_OPTIONS] ?? [];

    if (!serverOptions) {
      continue;
    }

    for (const route of routeOptions) {
      const visibilityPrefix = route.public ? "public" : "v1";
      const fullPath = joinPath(
        serverOptions.path,
        visibilityPrefix,
        route.path,
      );

      if (!routes[fullPath]) {
        routes[fullPath] = {};
      }

      const routeEntry = routes[fullPath];
      const handler = (controller as unknown as Record<string, unknown>)[
        route.handlerName
      ] as RouteHandler;

      if (typeof handler !== "function") {
        throw new Error(
          `Route handler \"${route.handlerName}\" is not a function on controller.`,
        );
      }

      routeEntry[route.method] = handler.bind(controller);
    }
  }

  return routes;
}
