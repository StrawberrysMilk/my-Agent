import OpenAi from 'openai';
import {config} from "../config.js";

export const openai = new OpenAi({
    apiKey: config.OPENAI_API_KEY,
    baseURL: config.OPENAI_BASE_URL,
})

export const modelName = config.OPENAI_MODEL;