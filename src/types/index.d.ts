export interface IEnv {
  PORT: number;
  PREFIX: string;
  VERSION: string;
  MONGO_PORT: number;
  DB_USERNAME: string;
  DB_PASSWORD: string;
  DB_NAME: string;
  DB_HOST: string;
  ACCESS_TOKEN_SECRET: string;
  ACCESS_TOKEN_EXPIRE: string;
  REFRESH_TOKEN_SECRET: string;
  REFRESH_TOKEN_EXPIRE: string;
  NODE_ENV: 'development' | 'production';
  ARGON_SECRET: string;
  OPEN_ROUTER_API_KEY: string;
}

declare global {
  namespace NodeJS {
    interface ProcessEnv extends IEnv {}
  }
}
