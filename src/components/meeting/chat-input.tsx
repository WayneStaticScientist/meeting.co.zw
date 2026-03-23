"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { useSocket } from "@/providers/socket-provider";
import { Chats, useMessages } from "@/stores/chats-store";
import { useMeetingStore } from "@/stores/meeting-store";
import { useSessionState } from "@/stores/session-store";

export default function chatInput() {
  const session = useSessionState();
  const meetingStore = useMeetingStore();
  const { addMessage } = useMessages();
  const { socket, isConnected } = useSocket();
  const [chatInput, setChatInput] = useState("");
  const sendMessage = (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isConnected) return;
    const chat: Chats = {
      userId: session._id,
      message: chatInput,
      displayName: `${session.firstName} ${session.lastName}`,
    };
    socket.emit("on-event-message", {
      ...chat,
      meetingCode: meetingStore.meeting!.meetingCode,
    });
    addMessage(chat);
    setChatInput("");
  };
  return (
    <div className="p-4 border-t border-white/5">
      <form onSubmit={sendMessage} className="relative">
        <input
          type="text"
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          placeholder="Message..."
          className="w-full bg-zinc-800 border-none rounded-xl py-2.5 pl-4 pr-10 text-xs text-white focus:ring-1 focus:ring-emerald-500 outline-none"
        />
        <button
          type="submit"
          className="absolute right-2 top-1.5 p-1.5 text-emerald-500 hover:text-emerald-400"
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}
