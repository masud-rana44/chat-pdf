import ChatComponent from "@/components/ChatComponent";
import ChatSidebar from "@/components/ChatSidebar";
import PDFViewer from "@/components/PDFViewer";
import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import React from "react";

type ChatIdPageProps = {
  params: {
    chatId: string;
  };
};

export default async function ChatIdPage({ params }: ChatIdPageProps) {
  const { userId } = await auth();
  const { chatId } = params;

  if (!userId) {
    return redirect("/");
  }

  const _chats = await db.select().from(chats).where(eq(chats.userId, userId));

  const currentChat = _chats.find((chat) => chat.id === parseInt(chatId));

  return (
    <div className="flex min-h-screen overflow-y-scroll">
      <div className="flex w-full max-h-screen overflow-scroll">
        {/* Chat Sidebar */}
        <div className="flex-[1] max-w-xs">
          <ChatSidebar chats={_chats} chatId={parseInt(chatId)} />
        </div>

        {/* PDF Viewer */}
        <div className="min-h-screen p-4 overflow-y-scroll flex-[5]">
          <PDFViewer pdfUrl={currentChat?.pdfUrl} />
        </div>

        {/* Chat Component */}
        <div className="flex-[3] border-l-4 boarder-l-slate-200">
          <ChatComponent />
        </div>
      </div>
    </div>
  );
}
