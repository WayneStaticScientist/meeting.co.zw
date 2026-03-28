"use client";
import { useEffect, useRef } from "react";
import { Toaster } from "@/utils/toast-marker";
import { useSocket } from "@/providers/socket-provider";
import { Chats, useMessages } from "@/stores/chats-store";
import { useSessionState } from "@/stores/session-store";

export default function MeetingChatsLayout() {
  const { socket, isConnected } = useSocket();
  const session = useSessionState();
  const chatMessages = useMessages();
  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [chatMessages]);

  return (
    <div className="space-y-4" ref={scrollRef}>
      {chatMessages.messages.map((msg, id) => (
        <div
          key={id}
          className={`flex flex-col ${msg.userId === session._id ? "items-end" : "items-start"}`}
        >
          <span className="text-[10px] text-zinc-500 font-bold mb-1">
            {msg.displayName}
          </span>
          <div
            className={`px-3 py-2 rounded-xl text-xs max-w-[90%] ${msg.userId === session._id ? "bg-emerald-600 text-white rounded-tr-none" : "bg-zinc-800 text-zinc-200 rounded-tl-none"}`}
          >
            {msg.message}
          </div>
        </div>
      ))}
    </div>
  );
}
