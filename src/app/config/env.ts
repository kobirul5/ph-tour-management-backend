import dotenv from 'dotenv';

dotenv.config()

interface EnvConfig {
    PORT: string;
    DB_URL: string;
    NODE_ENV: string;
    JWT_SECRET?: string;
    JWT_EXPIRATION?: string;
    BCRYPT_SALT_ROUNDS?: string;
    SUPER_ADMIN_EMAIL: string;
    SUPER_ADMIN_PASSWORD: string;
}

const loadEnvVariables = (): EnvConfig => {
    const requiredEnvVariables: string[] = ["PORT", "DB_URL", "NODE_ENV", "BCRYPT_SALT_ROUNDS", "JWT_EXPIRATION", "JWT_SECRET", "SUPER_ADMIN_EMAIL", "SUPER_ADMIN_PASSWORD"];

    requiredEnvVariables.forEach(key => {
        if (!process.env[key]) {
            throw new Error(`Missing require environment variable ${key}`)
        }
    })


    return {
        PORT: process.env.PORT as string,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        DB_URL: process.env.DB_URL!,
        NODE_ENV: process.env.NODE_ENV as string,
        JWT_SECRET: process.env.JWT_SECRET as string,
        JWT_EXPIRATION: process.env.JWT_EXPIRATION as string,
        BCRYPT_SALT_ROUNDS: process.env.BCRYPT_SALT_ROUNDS as string,
        SUPER_ADMIN_EMAIL:process.env.SUPER_ADMIN_EMAIL as string,
        SUPER_ADMIN_PASSWORD: process.env.SUPER_ADMIN_PASSWORD as string

    }
}

export const envVars: EnvConfig = loadEnvVariables()