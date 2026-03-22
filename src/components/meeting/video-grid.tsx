"use client";
import { useRTCHandler } from "@/hooks/use-rtc-handler";
import { useEffect, useRef } from "react";

export default function VideoGrid({ localStream, userId }: any) {
  const { remoteStreams } = useRTCHandler(localStream, userId);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    // This is the critical part!
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 h-full bg-zinc-950">
      {/* LOCAL VIDEO */}
      <div className="relative rounded-3xl overflow-hidden bg-zinc-900 border-2 border-emerald-500">
        <video
          ref={localVideoRef}
          autoPlay
          muted
          playsInline
          className="w-full h-full object-cover mirror"
        />
        <span className="absolute bottom-4 left-4 text-white bg-black/50 px-3 py-1 rounded-lg">
          You
        </span>
      </div>

      {/* REMOTE VIDEOS */}
      {Object.entries(remoteStreams).map(([peerId, stream]) => (
        <div
          key={peerId}
          className="relative rounded-3xl overflow-hidden bg-zinc-900"
        >
          <video
            autoPlay
            playsInline
            ref={(el) => {
              if (el) el.srcObject = stream;
            }}
            className="w-full h-full object-cover"
          />
          <span className="absolute bottom-4 left-4 text-white bg-black/50 px-3 py-1 rounded-lg">
            Participant
          </span>
        </div>
      ))}
    </div>
  );
}
