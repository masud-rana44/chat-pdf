import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";
import { MessageCircle, PlusCircle } from "lucide-react";
import { DrizzleChat } from "@/lib/db/schema";
import { cn } from "@/lib/utils";

interface ChatSidebarProps {
  chats: DrizzleChat[];
  chatId: number;
}

function ChatSidebar({ chats, chatId }: ChatSidebarProps) {
  return (
    <div className="flex flex-col w-full h-screen overflow-y-scroll p-4 text-gray-300 bg-gray-900">
      <Link href="/chat">
        <Button className="w-full border-dashed border-white border">
          <PlusCircle className="size-4 mr-2" />
          New Chat
        </Button>
      </Link>

      <div className="flex-1 pb-20 flex-col gap-2 mt-4">
        {chats.map((chat) => (
          <Link key={chat.id} href={`/chat/${chat.id}`}>
            <div
              className={cn("rounded-lg p-3 text-sky-300 flex items-center", {
                "bg-blue-600 text-white": chat.id === chatId,
                "hover:text-white": chat.id !== chatId,
              })}
            >
              <MessageCircle className="mr-2" />
              <p className="w-full overflow-hidden text-sm truncate whitespace-nowrap text-ellipsis">
                {chat.pdfName}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default ChatSidebar;
