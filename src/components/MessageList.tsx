import { cn } from "@/lib/utils";
import { Message } from "ai/react";
import { Loader2 } from "lucide-react";
import React from "react";
import Markdown from "react-markdown";

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
}

function MessageList({ messages, isLoading }: MessageListProps) {
  if (isLoading) {
    return (
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <Loader2 className="size-6 animate-spin" />
      </div>
    );
  }

  if (!messages) return null;

  return (
    <div className="flex flex-col gap-2 px-4">
      {messages.map((message: Message) => {
        return (
          <div
            key={message.id}
            className={cn("flex", {
              "justify-end pl-10": message.role === "user",
              "justify-start pl-10": message.role === "assistant",
            })}
          >
            <div
              className={cn(
                "rounded-lg px-3 text-sm py-1 shadow-md ring-1 ring-gray-900/10",
                { "bg-blue-600 text-white": message.role === "user" }
              )}
            >
              <Markdown>{message.content}</Markdown>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default MessageList;
