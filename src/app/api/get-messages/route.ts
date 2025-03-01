import { db } from "@/lib/db";
import { messages } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  try {
    const { chatId } = await req.json();
    const _messages = await db
      .select()
      .from(messages)
      .where(eq(messages.chatId, chatId));
    return NextResponse.json(_messages);
  } catch (error) {
    console.log("Error getting messages", error);
    return NextResponse.json(
      { error: "Error getting messages" },
      { status: 500 }
    );
  }
};
