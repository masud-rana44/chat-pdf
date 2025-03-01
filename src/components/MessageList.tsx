import { cn } from "@/lib/utils";
import { Message } from "ai/react";
import { Loader2 } from "lucide-react";
import React from "react";

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
    <div>
      {messages.map((message: Message) => {
        return (
          <div key={message.id} className={cn("flex", {})}>
            <div
              className={cn(
                "rounded-lg px-3 text-sm py-1 shadow-md ring-1 ring-gray-900/10"
              )}
            >
              <p>{message.content}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default MessageList;
