"use client";

import { useSessionState } from "@/stores/session-store";
import {
  RoomAudioRenderer,
  TrackReference,
  TrackReferenceOrPlaceholder,
  useIsSpeaking,
  useTracks,
  VideoTrack,
} from "@livekit/components-react";
import { Track } from "livekit-client";
import React, { useMemo, useEffect, useState } from "react";

/**
 * Note: In your local environment, continue using:
 * import "@livekit/components-styles";
 * import { RoomAudioRenderer, useTracks, VideoTrack, useLocalParticipant } from "@livekit/components-react";
 * import { Track } from "livekit-client";
 */

// Placeholder for Track constants to prevent build errors in the preview environment
const TrackSource = {
  Camera: "camera",
  ScreenShare: "screen_share",
  Microphone: "microphone",
};

export default function VideoGrid() {
  const sessionId = useSessionState();
  // Mocking LiveKit hooks for the preview environment structure
  // In your real code, keep using useTracks() and useLocalParticipant()
  const tracks = useTracks([
    { source: Track.Source.Camera, withPlaceholder: true },
  ]);
  const screenTracks = useTracks([
    { source: Track.Source.ScreenShare, withPlaceholder: false },
  ]);

  // Adaptive Grid Logic: Calculate CSS classes based on participant count
  const hasScreenShare = screenTracks.length > 0;

  const gridLayoutClass = useMemo(() => {
    const count = tracks.length || 1; // Default to 1 for layout demo
    if (hasScreenShare) return "flex flex-col md:flex-row h-full w-full gap-2";
    if (count === 1)
      return "grid-cols-1 place-content-center max-w-4xl mx-auto h-full";
    if (count === 2)
      return "grid-cols-1 md:grid-cols-2 place-content-center gap-3 md:gap-4 h-full max-w-6xl mx-auto";
    if (count <= 4)
      return "grid-cols-2 place-content-center gap-3 md:gap-4 h-full";
    if (count <= 6)
      return "grid-cols-2 md:grid-cols-3 place-content-center gap-3 h-full";

    return "grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4";
  }, [tracks.length, hasScreenShare]);

  return (
    <div className="flex flex-col h-full w-full bg-[#1a1a1a] p-2 md:p-4 overflow-hidden ">
      {/* --- STAGE VIEW (Screen Share or Active Speaker) --- */}
      <RoomAudioRenderer />

      {hasScreenShare ? (
        <div className="flex flex-col md:flex-row gap-4 h-full w-full overflow-hidden">
          {/* Main Screen Share Area */}
          <div className="flex-3 relative bg-black rounded-xl overflow-hidden shadow-2xl border border-gray-800">
            <div className="w-full h-full flex items-center justify-center bg-gray-900 text-gray-500">
              {screenTracks.length > 0 && (
                <div className="flex-1 border-b border-gray-700">
                  {screenTracks.map((track: any) => (
                    <VideoTrack
                      key={track.publication!.trackSid}
                      trackRef={track}
                    />
                  ))}
                </div>
              )}
            </div>
            <div className="absolute top-4 left-4 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse shadow-lg">
              LIVE SCREEN SHARE
            </div>
          </div>

          {/* <div className="flex-1 flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto pb-2 md:pb-0">
            {tracks.map((track: any, idx) => (
              <ParticipantTile
                key={idx}
                track={track}
                identity={track.participant?.identity || `User ${idx}`}
                isSmall
              />
            ))}
          </div> */}
        </div>
      ) : (
        /* --- GALLERY VIEW (Balanced Grid) --- */
        <div className={`grid gap-3 md:gap-4 w-full h-full ${gridLayoutClass}`}>
          {/* Map through your actual cameraTracks here */}
          {/* <ParticipantTile identity="Local User" isLocal track={track} /> */}
          {tracks.length > 0 &&
            tracks
              .filter((e) => e.participant?.identity != sessionId._id)
              .map((track: TrackReferenceOrPlaceholder, idx) => (
                <ParticipantTile
                  key={idx}
                  track={track}
                  identity={track.participant?.name ?? ""}
                />
              ))}
          {tracks.length > 0 &&
            tracks
              .filter((e) => e.participant?.identity == sessionId._id)
              .map((track: TrackReferenceOrPlaceholder, idx) => (
                <ParticipantTile
                  key={idx}
                  track={track}
                  isLocal={true}
                  identity={track.participant?.name ?? ""}
                />
              ))}
        </div>
      )}
    </div>
  );
}

/**
 * Individual Participant Card Component
 */
function ParticipantTile({
  isSmall = false,
  track,
}: {
  track: TrackReferenceOrPlaceholder;
  identity: string;
  isSmall?: boolean;
  isLocal?: boolean;
}) {
  const isCameraEnabled = track.publication?.isEnabled;
  const isMuted = !track.participant?.isMicrophoneEnabled;
  const isSpeaking = useIsSpeaking(track.participant);
  const identity = track.participant?.name || "Unknown";
  const isLocal = track.participant?.isLocal;

  return (
    <div
      className={`relative group rounded-2xl overflow-hidden bg-[#222222] border-2 transition-all duration-300 flex items-center justify-center shadow-lg ${
        isSmall
          ? "min-w-40 md:min-w-full aspect-video"
          : "w-full aspect-video max-h-[45vh]"
      } ${
        isSpeaking
          ? "border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]"
          : "border-gray-800"
      }`}
    >
      {/* 🎥 Video or Initials */}
      {isCameraEnabled ? (
        <VideoTrack
          trackRef={track as TrackReference}
          className="object-cover w-full h-full"
        />
      ) : (
        <div className="w-full h-full bg-linear-to-br from-[#2a2a2a] to-[#1a1a1a] flex items-center justify-center">
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-blue-600 flex items-center justify-center text-xl md:text-2xl font-bold text-white shadow-2xl uppercase">
            {identity.charAt(0)}
          </div>
        </div>
      )}

      {/* 🏷️ Info Bar (Identity + Mute Status) */}
      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent pointer-events-none">
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
          <div className="bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 flex items-center gap-2">
            <span className="text-white text-xs md:text-sm font-medium truncate max-w-32">
              {identity}{" "}
              {isLocal && (
                <span className="text-blue-400 text-[10px] ml-1">(You)</span>
              )}
            </span>

            {/* Mute Indicator Icon */}
            {isMuted && (
              <span className="text-red-500 text-xs" title="Muted">
                🔇
              </span>
            )}
          </div>

          {/* 🔊 Speaking "Waves" (Only shows if they are talking) */}
          {isSpeaking && (
            <div className="flex gap-0.5 items-end h-3 mb-1 mr-1">
              <div
                className="w-0.5 bg-blue-400 animate-bounce h-1"
                style={{ animationDelay: "0.1s" }}
              ></div>
              <div
                className="w-0.5 bg-blue-400 animate-bounce h-3"
                style={{ animationDelay: "0.2s" }}
              ></div>
              <div
                className="w-0.5 bg-blue-400 animate-bounce h-2"
                style={{ animationDelay: "0.3s" }}
              ></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
// <div className="grid grid-cols-2 gap-4 p-4">
//     <RemoteAudioRenderer />
//     {screenTracks.length > 0 && (
//       <div className="flex-1 border-b border-gray-700">
//         {screenTracks.map((track: any) => (
//           <VideoTrack key={track.publication!.trackSid} trackRef={track} />
//         ))}
//       </div>
//     )}
//     {tracks.map((track: any) => (
//       <div
//         key={track.participant.identity}
//         className="relative rounded-lg overflow-hidden bg-gray-900 aspect-video"
//       >
//         <VideoTrack trackRef={track} />
//         <div className="absolute bottom-2 left-2 text-white bg-black/50 px-2 py-1 rounded">
//           {track.participant.identity}
//         </div>
//       </div>
//     ))}
//   </div>
