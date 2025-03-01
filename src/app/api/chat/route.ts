import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { client } from "@/lib/openai";
import { NextResponse } from "next/server";
import { getContext } from "@/lib/context";
import { chats, messages as _messages } from "@/lib/db/schema";

export async function POST(req: Request) {
  try {
    const { messages, chatId } = await req.json();

    // Verify chat exists
    const [chat] = await db.select().from(chats).where(eq(chats.id, chatId));

    if (!chat) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 });
    }

    // Get last user message and context
    const lastMessage = messages[messages.length - 1];
    const context = await getContext(lastMessage.content, chat.fileKey);

    console.log("Context:", context);

    // System prompt with context integration
    const systemPrompt = {
      role: "system" as const,
      content: `You are a PDF analysis assistant. Follow these rules:
          1. Answer ONLY using the provided PDF context
          2. Be concise and professional
          3. If unsure, say "I couldn't find that in the document"
          4. Never invent information
          5. Format answers in Markdown

          PDF Context:
          ${context}`,
    };

    // Generate AI response
    const completion = await client.chat.completions.create({
      model: "gpt-4o",
      messages: [
        systemPrompt,
        { role: "user" as const, content: lastMessage.content },
      ],
      temperature: 0.2,
      max_tokens: 1500,
      top_p: 1,
    });

    const aiResponse =
      completion.choices[0].message.content || "Something went wrong";

    // Save user message
    await db.insert(_messages).values({
      chatId,
      content: lastMessage.content,
      role: "user",
    });

    // Save AI response
    await db.insert(_messages).values({
      chatId,
      content: aiResponse,
      role: "system",
    });

    return NextResponse.json(
      {
        message: aiResponse,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Chat error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
