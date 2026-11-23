import {config as loadEnv} from "dotenv";
import {resolve} from 'node:path'

loadEnv({
    path: resolve(process.cwd(), '../../.env')
})

function requireEnv(name: string): string {
    const value = process.env[name];

    if(!value) {
        throw new Error(`缺少环境变量: ${name}`)
    }

    return value
}

export const config = {
    OPENAI_API_KEY: requireEnv("OPENAI_API_KEY"),
    OPENAI_BASE_URL: requireEnv("OPENAI_BASE_URL"),
    OPENAI_MODEL: requireEnv("OPENAI_MODEL"),
}