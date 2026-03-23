"use client";
import React, { useEffect, useState } from "react";
import {
  LayoutGrid,
  X,
  ShieldCheck,
  PenTool,
  Send,
  Pencil,
  Eraser,
  Type,
  Maximize2,
} from "lucide-react";
import { toast } from "@heroui/react";
import { useParams } from "next/navigation";
import { useSocket } from "@/providers/socket-provider";
import { useMeetingStore } from "@/stores/meeting-store";
import { Chats, useMessages } from "@/stores/chats-store";
import { useJoinMeetingHook } from "@/hooks/join-meeting-hook";
import { ZMeetLoader } from "@/components/loaders/meeting-loader";
import BottomControls from "@/components/meeting/bottom-controls";
import { MeetingControlsHook } from "@/hooks/meeting-controls-hook";
import MeetingChatsLayout from "@/components/meeting/meeting-chats-layout";
import MeetingWaitingRoom from "@/components/meeting/meeting-waiting-room";
import MeetingParticipants from "@/components/meeting/meeting-participants-layout";
import { Participant } from "@/types/participant";

export default function MeetingRoom() {
  const params = useParams();
  const {} = useJoinMeetingHook();
  const { addMessage } = useMessages();
  const meetingStore = useMeetingStore();
  const { socket, isConnected } = useSocket();
  const meetingControls = MeetingControlsHook();
  const [date, setDate] = useState<Date | null>(null);
  const [activeSidebar, setActiveSidebar] = useState("none");

  useEffect(() => {
    meetingStore.fetchMeeting(params.id as string);
  }, [params.id as string]);
  useEffect(() => {
    if (isConnected) return;
    socket.on("new-chat-message", (data: Chats) => {
      toast.success(`new message from ${data.displayName}`);
      addMessage(data);
    });
    socket.on("close-meeting", (data: Participant[]) => {
      meetingStore.closeMeeting();
    });
    socket.on("updated-participants", (data: Participant[]) => {
      meetingStore.updateParticipants(data);
    });
    setDate(new Date());
  }, [params.id as string]);

  if (meetingStore.meeting == null) {
    return <ZMeetLoader />;
  }
  return (
    <div className="h-screen w-full bg-[#0a0a0a] text-zinc-100 flex flex-col overflow-hidden select-none">
      {/* Top Bar: Minimalist */}
      <div className="h-12 px-4 flex items-center justify-between bg-zinc-900/40 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded text-[10px] font-bold border border-emerald-500/20 flex items-center gap-1.5 uppercase tracking-wider">
            <ShieldCheck size={12} /> Encrypted
          </div>
          <h1 className="text-xs font-medium text-zinc-400">
            {process.env.NEXT_PUBLIC_APP_NAME} •{" "}
            {date &&
              `${date
                .getHours()
                .toString()
                .padStart(
                  2,
                  "0",
                )}:${date.getMinutes().toString().padStart(2, "0")} ${date.getMonth() + 1}/${date.getFullYear()}`}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-1.5 hover:bg-zinc-800 rounded text-zinc-400">
            <LayoutGrid size={16} />
          </button>
          <button className="p-1.5 hover:bg-zinc-800 rounded text-zinc-400">
            <Maximize2 size={16} />
          </button>
        </div>
      </div>

      <div className="flex-1 flex min-h-0 relative">
        {/* Main Stage: Flex Grow */}
        <div className="flex-1 flex flex-col relative min-w-0 bg-black">
          {/* Viewport: Non-scrollable wrapper */}
          <div className="flex-1 p-4 flex gap-4 min-h-0 overflow-hidden">
            {/* Primary Content (Screen Share or Whiteboard) */}
            {(meetingControls.isScreenSharing ||
              meetingControls.isWhiteboardActive) && (
              <div className="flex-3 bg-zinc-900 rounded-xl overflow-hidden relative border border-white/5 shadow-2xl">
                {meetingControls.isWhiteboardActive ? (
                  <div className="w-full h-full bg-slate-800 flex flex-col items-center justify-center relative">
                    <PenTool size={48} className="text-emerald-500/20 mb-4" />
                    <p className="text-slate-400 font-medium">
                      Shared Whiteboard
                    </p>
                    <div className="absolute top-4 left-4 flex flex-col gap-2 p-1.5 bg-black/40 backdrop-blur-md rounded-lg border border-white/10">
                      <button className="p-2 bg-emerald-500 rounded-md">
                        <Pencil size={16} />
                      </button>
                      <button className="p-2 hover:bg-white/10 rounded-md">
                        <Eraser size={16} />
                      </button>
                      <button className="p-2 hover:bg-white/10 rounded-md">
                        <Type size={16} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-full bg-zinc-950 flex items-center justify-center">
                    <img
                      src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200"
                      className="w-full h-full object-contain"
                      alt="Screen"
                    />
                    <div className="absolute top-4 left-4 bg-emerald-600 px-3 py-1 rounded text-xs font-bold shadow-lg">
                      You are sharing
                    </div>
                  </div>
                )}
              </div>
            )}
            {/* Participants Grid */}
            <MeetingParticipants
              isScreenSharing={meetingControls.isScreenSharing}
              isWhiteboardActive={meetingControls.isWhiteboardActive}
              camOn={meetingControls.camOn}
            />
          </div>

          <BottomControls
            setActiveSidebar={setActiveSidebar}
            activeSidebar={activeSidebar}
          />
        </div>

        {/* Sidebar Panel */}
        {activeSidebar !== "none" && (
          <div className="w-80 bg-zinc-900 border-l border-white/5 flex flex-col h-full animate-in slide-in-from-right duration-300">
            <div className="p-4 flex items-center justify-between border-b border-white/5">
              <h2 className="font-bold text-sm capitalize">{activeSidebar}</h2>
              <button
                onClick={() => setActiveSidebar("none")}
                className="p-1.5 hover:bg-zinc-800 rounded-md text-zinc-500"
              >
                <X size={16} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
              {activeSidebar === "chat" ? (
                <MeetingChatsLayout />
              ) : (
                <MeetingWaitingRoom />
              )}
            </div>

            {activeSidebar === "chat" && (
              <div className="p-4 border-t border-white/5">
                <form
                  onSubmit={meetingControls.sendMessage}
                  className="relative"
                >
                  <input
                    type="text"
                    value={meetingControls.chatInput}
                    onChange={(e) =>
                      meetingControls.setChatInput(e.target.value)
                    }
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
            )}
          </div>
        )}
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #333; border-radius: 10px; }
        @keyframes bounce {
          0%, 100% { transform: scaleY(1); }
          50% { transform: scaleY(0.4); }
        }
      `,
        }}
      />
    </div>
  );
}
