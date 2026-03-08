declare module "bun" {
  interface Env {
    PORT: string;
    DEV: string;
    SECRET_HASH: string;
    DB_USER: string;
    DB_PASSWORD: string;
    DB_HOST: string;
    DB_PORT: string;
    DB_URL: string;
  }
}
