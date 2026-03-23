"use client";
import { Chats, useMessages } from "@/stores/chats-store";
import { useSessionState } from "@/stores/session-store";

export default function MeetingChatsLayout() {
  const messagaesStore = useMessages();
  const session = useSessionState();
  return (
    <div className="space-y-4">
      {messagaesStore.messages.map((m: Chats, id) => (
        <div
          key={id}
          className={`flex flex-col ${m.userId === session._id ? "items-end" : "items-start"}`}
        >
          <span className="text-[10px] text-zinc-500 font-bold mb-1">
            {m.displayName}
          </span>
          <div
            className={`px-3 py-2 rounded-xl text-xs max-w-[90%] ${m.userId === session._id ? "bg-emerald-600 text-white rounded-tr-none" : "bg-zinc-800 text-zinc-200 rounded-tl-none"}`}
          >
            {m.message}
          </div>
        </div>
      ))}
    </div>
  );
}
