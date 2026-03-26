"use client";
import { useEffect, useState } from "react";

import React from "react";
import { useParams } from "next/navigation";
import VideoGrid from "@/components/meeting/video-grid";
import { useMeetingStore } from "@/stores/meeting-store";
import { useJoinMeetingHook } from "@/hooks/join-meeting-hook";
import BottomControls from "@/components/meeting/bottom-controls";
import { ZMeetLoader } from "@/components/loaders/meeting-loader";
import { ShieldCheck, LayoutGrid, Maximize2, X } from "lucide-react";
import MeetingWaitingRoom from "@/components/meeting/meeting-waiting-room";
import MeetingParticipants from "@/components/meeting/meeting-participants-layout";
import { LiveKitRoom } from "@livekit/components-react";
import ChatInput from "@/components/meeting/chat-input";
import MeetingChatsLayout from "@/components/meeting/meeting-chats-layout";

export default function MeetingRoom() {
  const params = useParams();

  const [activeSidebar, setActiveSidebar] = useState("none");
  const [date, setDate] = useState<Date | null>(null);
  const { token, setToken } = useJoinMeetingHook();
  const meetingStore = useMeetingStore();

  useEffect(() => {
    meetingStore.fetchMeeting(params.id as string);
    setDate(new Date());
  }, [params.id as string]);

  if (token == "") {
    return <ZMeetLoader />;
  }
  return (
    <React.Fragment>
      <LiveKitRoom
        video={true}
        audio={true}
        token={token}
        connect={true}
        serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
      >
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
                <VideoGrid />
              </div>

              <BottomControls
                setActiveSidebar={setActiveSidebar}
                activeSidebar={activeSidebar}
                setToken={setToken}
              />
            </div>

            {/* Sidebar Panel */}
            {activeSidebar !== "none" && (
              <div className="w-80 bg-zinc-900 border-l border-white/5 flex flex-col h-full pb-16 animate-in slide-in-from-right duration-300">
                <div className="p-4 flex items-center justify-between border-b border-white/5">
                  <h2 className="font-bold text-sm capitalize">
                    {activeSidebar}
                  </h2>
                  <button
                    onClick={() => setActiveSidebar("none")}
                    className="p-1.5 hover:bg-zinc-800 rounded-md text-zinc-500"
                  >
                    <X size={16} />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                  {activeSidebar === "chat" ? (
                    <>
                      <MeetingChatsLayout />
                    </>
                  ) : (
                    // <RtkChat meeting={meeting} />
                    <MeetingWaitingRoom />
                  )}
                </div>

                {activeSidebar === "chat" && <ChatInput />}
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
      </LiveKitRoom>
    </React.Fragment>
  );
}
