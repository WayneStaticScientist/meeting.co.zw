"use client";
import { useEffect } from "react";
import VideoGrid from "./video-grid";
import { Toaster } from "@/utils/toast-marker";
import { useSocket } from "@/providers/socket-provider";
import { useMeetingStore } from "@/stores/meeting-store";
import { useSessionState } from "@/stores/session-store";
import { useMediaStream } from "@/stores/media-stream-store";

export default function MeetingParticipants({
  camOn,
}: {
  isScreenSharing: boolean;
  isWhiteboardActive: boolean;
  camOn: boolean;
}) {
  const sessionStore = useSessionState();
  const { socket, isConnected } = useSocket();
  const { startStream } = useMediaStream();

  const { meeting } = useMeetingStore();

  useEffect(() => {
    if (meeting === null || sessionStore._id === null) return;
    if (meeting?.host == sessionStore._id) {
      const handleStreamInit = async () => {
        // Check if user is host OR if camOn is explicitly true
        if (meeting.host === sessionStore._id || camOn) {
          try {
            await startStream({ videoEnabled: true });
            socket.emit("admin-start-streaming", {
              meetingCode: meeting.meetingCode,
              userId: sessionStore._id,
            });
          } catch (err) {
            Toaster.error("Could not start camera");
          }
        }
      };

      handleStreamInit();
    }
  }, [meeting, sessionStore._id, camOn, isConnected]);
  if (!meeting) {
    return <></>;
  }
  return (
    <div
      className={`flex-1 min-h-0 grid gap-3 transition-all duration-500 ease-in-out h-full`}
    >
      <VideoGrid
      // localStream={localStream}
      // userId={sessionStore._id}
      // isScreenSharing={isScreenSharing}
      // isWhiteboardActive={isWhiteboardActive}
      />
      {/* {meeting?.participants?.map((p, id) => (
        <div
          key={id}
          className={`relative rounded-xl overflow-hidden bg-zinc-900 border ${p.isSpeaking ? "border-emerald-500 ring-2 ring-emerald-500/20" : "border-white/5"} transition-all`}
        >
          {p.userId == sessionStore._id && !camOn ? (
            <div className="w-full h-full flex items-center justify-center bg-zinc-800">
              <div className="w-16 h-16 rounded-full bg-zinc-700 flex items-center justify-center text-2xl font-bold">
                A
              </div>
            </div>
          ) : (
            <img className="w-full h-full object-cover" alt={p.displayName} />
          )}
          <div className="absolute bottom-2 left-2 flex items-center gap-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded-md text-[11px] font-medium border border-white/5">
            {p.isMuted && <MicOff size={12} className="text-red-500" />}
            <span>{p.displayName}</span>
          </div>
          {p.isSpeaking && (
            <div className="absolute top-2 right-2">
              <div className="flex gap-0.5 items-end h-3">
                <div
                  className="w-0.5 bg-emerald-400 animate-[bounce_0.6s_infinite]"
                  style={{ height: "60%" }}
                ></div>
                <div
                  className="w-0.5 bg-emerald-400 animate-[bounce_0.8s_infinite]"
                  style={{ height: "100%" }}
                ></div>
                <div
                  className="w-0.5 bg-emerald-400 animate-[bounce_0.5s_infinite]"
                  style={{ height: "40%" }}
                ></div>
              </div>
            </div>
          )}
        </div>
      )) ?? <></>} */}
    </div>
  );
}
