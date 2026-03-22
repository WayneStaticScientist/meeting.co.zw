"use client";
import { useState } from "react";

export default function MeetingChatsLayout() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "Sarah Jenkins",
      text: "Hey everyone, glad we could sync today!",
      time: "10:02 AM",
    },
    {
      id: 2,
      sender: "Michael Chen",
      text: "Can someone share the figma link?",
      time: "10:05 AM",
    },
  ]);

  return (
    <div className="space-y-4">
      {messages.map((m: any) => (
        <div
          key={m.id}
          className={`flex flex-col ${m.sender === "You" ? "items-end" : "items-start"}`}
        >
          <span className="text-[10px] text-zinc-500 font-bold mb-1">
            {m.sender}
          </span>
          <div
            className={`px-3 py-2 rounded-xl text-xs max-w-[90%] ${m.sender === "You" ? "bg-emerald-600 text-white rounded-tr-none" : "bg-zinc-800 text-zinc-200 rounded-tl-none"}`}
          >
            {m.text}
          </div>
        </div>
      ))}
    </div>
  );
}
