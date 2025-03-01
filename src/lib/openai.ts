import OpenAI from "openai";

const token = process.env.GITHUB_TOKEN;
const endpoint = "https://models.inference.ai.azure.com";

export const client = new OpenAI({
  baseURL: endpoint,
  apiKey: token,
});
