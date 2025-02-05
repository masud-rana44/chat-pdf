import { OpenAI } from "openai";

const token = process.env.GITHUB_TOKEN;
const endpoint = "https://models.inference.ai.azure.com";

const client = new OpenAI({
  baseURL: endpoint,
  apiKey: token,
});

export async function getEmbeddings(text: string) {
  try {
    const embeddings = await client.embeddings.create({
      model: "text-embedding-3-large",
      input: text.replace(/\n/g, ""),
      dimensions: 1536,
    });

    return embeddings.data[0].embedding as number[];
  } catch (error) {
    console.log("Error calling openai embeddings api", error);
    throw error;
  }
}
