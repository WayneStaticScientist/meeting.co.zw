"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { useChat } from "@livekit/components-react";
import { useSocket } from "@/providers/socket-provider";
import { useMeetingStore } from "@/stores/meeting-store";
import { useSessionState } from "@/stores/session-store";
import { Chats, useMessages } from "@/stores/chats-store";
import { Toaster } from "@/utils/toast-marker";

export default function chatInput() {
  const message = useMessages();
  const sessionStore = useSessionState();
  const { socket, isConnected } = useSocket();
  const [chatInput, setChatInput] = useState("");
  const meeting = useMeetingStore();
  const sendMessage = (msg: Chats) => {
    if (!isConnected) {
      return Toaster.error("Message sent failed please try again later");
    }
    socket.emit("on-event-message", {
      ...msg,
      meetingCode: meeting.meeting!.meetingCode,
    });
  };
  return (
    <div className="p-4 border-t border-white/5">
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const chat: Chats = {
            message: chatInput.trim(),
            displayName: `${sessionStore.firstName} ${sessionStore.lastName}`,
            userId: sessionStore._id,
          };
          await sendMessage(chat);
          message.addMessage(chat);
          setChatInput("");
        }}
        className="relative"
      >
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
