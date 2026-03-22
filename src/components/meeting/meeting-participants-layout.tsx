"use client";
import { useMediaStream } from "@/hooks/use-media-stream";
import { useMeetingStore } from "@/stores/meeting-store";
import { useSessionState } from "@/stores/session-store";
import VideoGrid from "./video-grid";
import { useEffect } from "react";
import { Toaster } from "@/utils/toast-marker";

export default function MeetingParticipants({
  isScreenSharing,
  isWhiteboardActive,
  camOn,
}: {
  isScreenSharing: boolean;
  isWhiteboardActive: boolean;
  camOn: boolean;
}) {
  const sessionStore = useSessionState();

  const { localStream, startStream, toggleVideo, toggleAudio } =
    useMediaStream();

  const { meeting } = useMeetingStore();
  const getGridClass = () => {
    const count = meeting!.participants?.length ?? 0;
    if (isScreenSharing || isWhiteboardActive)
      return "grid-cols-1 md:grid-cols-4 lg:grid-cols-6"; // Sidebar style grid
    if (count === 1) return "grid-cols-1";
    if (count <= 2) return "grid-cols-1 md:grid-cols-2";
    if (count <= 4) return "grid-cols-2";
    if (count <= 6) return "grid-cols-2 md:grid-cols-3";
    return "grid-cols-2 md:grid-cols-3 lg:grid-cols-4";
  };
  useEffect(() => {
    if (meeting === null || sessionStore._id === null) return;
    if (meeting?.host == sessionStore._id) {
      const handleStreamInit = async () => {
        // Check if user is host OR if camOn is explicitly true
        if (meeting.host === sessionStore._id || camOn) {
          try {
            await startStream();
            Toaster.success("Camera initialized");
          } catch (err) {
            Toaster.error("Could not start camera");
          }
        }
      };

      handleStreamInit();
    }
  }, [meeting, sessionStore._id, camOn]);
  if (!meeting) {
    return <></>;
  }
  return (
    <div
      className={`flex-1 min-h-0 grid ${getGridClass()} gap-3 transition-all duration-500 ease-in-out h-full`}
    >
      <VideoGrid
        localStream={localStream}
        userId={sessionStore._id}
        isScreenSharing={isScreenSharing}
        isWhiteboardActive={isWhiteboardActive}
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
