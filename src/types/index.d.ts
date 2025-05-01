export interface IEnv {
    PORT: number;
    PREFIX: string;
    VERSION: string;
    MONGO_PORT: number;
    MONGO_USERNAME: string;
    MONGO_PASSWORD: string;
    MONGO_NAME: string;
    ACCESS_TOKEN_SECRET: string;
    ACCESS_TOKEN_EXPIRE: string;
    REFRESH_TOKEN_SECRET: string;
    REFRESH_TOKEN_EXPIRE: string;
    NODE_ENV: "development" | "production"
}

declare global {
    namespace NodeJS {
        interface ProcessEnv extends IEnv { }
    }
}
