"use client";

import { useMeetingStore } from "@/stores/meeting-store";
import { useSessionState } from "@/stores/session-store";
import {
  useTracks,
  VideoTrack,
  TrackReference,
  RoomAudioRenderer,
  TrackReferenceOrPlaceholder,
} from "@livekit/components-react";
import { m } from "framer-motion";
import { Track } from "livekit-client";
import {
  Camera,
  CameraOff,
  Maximize,
  Mic,
  MicOff,
  Minimize,
  MoreVertical,
} from "lucide-react";
import { useMemo, useEffect, useState, useRef } from "react";
import ZLoader from "../displays/z-loader";

export default function VideoGrid() {
  const sessionId = useSessionState();
  const meeting = useMeetingStore();

  const tracks = useTracks([
    { source: Track.Source.Camera, withPlaceholder: true },
  ]);
  const screenTracks = useTracks([
    { source: Track.Source.ScreenShare, withPlaceholder: false },
  ]);
  let activeTacks = tracks;
  if (meeting?.meeting?.focuseNode && meeting?.meeting?.focuseNode.length > 0) {
    activeTacks = tracks.filter(
      (t) => t.participant?.identity == meeting.meeting!.focuseNode,
    );
  }
  // Adaptive Grid Logic: Calculate CSS classes based on participant count
  const hasScreenShare = screenTracks.length > 0;
  const gridLayoutClass = useMemo(() => {
    const count = activeTacks.length || 1; // Default to 1 for layout demo
    if (hasScreenShare) return "flex flex-col md:flex-row h-full w-full gap-2 ";
    if (count === 1)
      return "grid-cols-1 place-content-center max-w-4xl mx-auto h-full";
    if (count === 2)
      return "grid-cols-1 md:grid-cols-2 place-content-center gap-3 md:gap-4 h-full max-w-6xl mx-auto";
    if (count <= 4)
      return "grid-cols-2  place-content-center gap-3 md:gap-4 h-full";
    if (count <= 6)
      return "grid-cols-2 md:grid-cols-3 place-content-center gap-3 h-full";

    return "grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4";
  }, [activeTacks.length, hasScreenShare]);

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

          <div className="flex-1 flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto pb-2 md:pb-0">
            {activeTacks.map((track: any, idx) => (
              <ParticipantTile key={idx} track={track} isSmall />
            ))}
          </div>
        </div>
      ) : (
        /* --- GALLERY VIEW (Balanced Grid) --- */
        <div className={`grid gap-3 md:gap-4 w-full h-full ${gridLayoutClass}`}>
          {/* Map through your actual cameraTracks here */}
          {/* <ParticipantTile identity="Local User" isLocal track={track} /> */}
          {activeTacks.length > 0 &&
            activeTacks
              .filter(
                (e) => e.participant?.identity != sessionId._id && meeting,
              )
              .map((track: TrackReferenceOrPlaceholder, idx) => (
                <ParticipantTile
                  key={idx}
                  track={track}
                  numberOfTracks={activeTacks.length}
                />
              ))}
          {activeTacks.length > 0 &&
            activeTacks
              .filter((e) => e.participant?.identity == sessionId._id)
              .map((track: TrackReferenceOrPlaceholder, idx) => (
                <ParticipantTile
                  key={idx}
                  track={track}
                  numberOfTracks={activeTacks.length}
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

export function ParticipantTile({
  isSmall = false,
  track,
  numberOfTracks = 1,
  onToggleMic,
  onToggleCam,
}: {
  track: any;
  isSmall?: boolean;
  numberOfTracks?: number;
  onToggleMic?: () => void;
  onToggleCam?: () => void;
}) {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const meeting = useMeetingStore();
  const session = useSessionState();
  // Extract states from track references
  const isCameraEnabled = track.publication?.isEnabled;
  const isMuted = !track.participant?.isMicrophoneEnabled;
  const isSpeaking = track.participant?.isSpeaking; // Assuming state from hook
  const identity = track.participant?.name || "Unknown";
  const isLocal = track.participant?.isLocal;

  // Handle clicking outside to close menu
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Dynamic height based on grid size
  let miniHeight = "min-h-64";
  if (numberOfTracks === 2) miniHeight = "min-h-48";
  else if (numberOfTracks >= 5 && numberOfTracks <= 6) miniHeight = "min-h-32";
  else if (numberOfTracks >= 7 && numberOfTracks <= 8) miniHeight = "min-h-24";
  else if (numberOfTracks >= 9) miniHeight = "min-h-16";

  return (
    <div
      className={`relative  ${miniHeight} group rounded-2xl overflow-hidden bg-[#1a1a1a] border-2 transition-all duration-300 flex items-center justify-center shadow-lg ${
        isSmall ? "min-w-40 md:min-w-full" : "w-full "
      } ${
        isSpeaking
          ? "border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]"
          : "border-gray-800 hover:border-gray-600"
      }`}
    >
      {/* 🎥 Video or Initials */}
      {isCameraEnabled ? (
        <div className="w-full h-full bg-black">
          <VideoTrack
            trackRef={track as TrackReference}
            className="object-cover w-full h-full"
          />
        </div>
      ) : (
        <div className="w-full h-full bg-linear-to-br from-[#2a2a2a] to-[#121212] flex items-center justify-center">
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-blue-600 flex items-center justify-center text-xl md:text-2xl font-bold text-white shadow-2xl uppercase">
            {identity.charAt(0)}
          </div>
        </div>
      )}

      {/* 🏷️ Info Bar (Identity + Mute Status) */}
      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent pointer-events-none">
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-auto">
          <div className="bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 flex items-center gap-2">
            <span className="text-white text-xs md:text-sm font-medium truncate max-w-30">
              {identity}
              {isLocal && (
                <span className="text-blue-400 text-[10px] ml-1">(You)</span>
              )}
            </span>
            {isMuted && <MicOff size={14} className="text-red-500" />}
          </div>

          {/* 🔊 Speaking "Waves" */}
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

      {/* ⚙️ Context Menu Trigger (Only visible on hover or if menu open) */}
      {meeting.meeting?.host == session._id && (
        <div className="absolute top-3 right-3  transition-opacity duration-200">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="p-2 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-sm border border-white/10 transition-colors"
          >
            <MoreVertical size={18} />
          </button>
        </div>
      )}
      {/* 🚀 Dropdown Menu */}
      {showMenu && (
        <div
          ref={menuRef}
          className="fixed top-12 right-3 w-48 bg-[#1e1e1e] border border-white/10 rounded-xl shadow-2xl py-1.5 z-50 animate-in fade-in zoom-in duration-150"
        >
          <span className="block px-4 py-2 text-xs text-gray-400 uppercase tracking-wide">
            {identity}
          </span>
          <button
            onClick={() => {
              meeting.updateFocusNode(
                meeting.meeting?.focuseNode &&
                  meeting.meeting.focuseNode.length > 0
                  ? null
                  : track.participant?.identity,
              );
              setShowMenu(false);
            }}
            className="w-full px-4 py-2 text-left text-sm text-white hover:bg-blue-600 flex items-center gap-3 transition-colors"
          >
            {meeting.updatingFocus ? (
              <ZLoader />
            ) : (
              <>
                {meeting.meeting?.focuseNode &&
                meeting.meeting.focuseNode.length > 0 ? (
                  <>
                    <Minimize size={16} />
                    Exit Focus
                  </>
                ) : (
                  <>
                    <Maximize size={16} />
                    Focus Camera
                  </>
                )}
              </>
            )}
          </button>

          <>
            <div className="h-px bg-white/10 my-1" />
            <button
              onClick={() => {
                meeting.sendMeetingCommand(
                  isCameraEnabled ? "uncamera" : "camera",
                  track.participant?.identity,
                );
                setShowMenu(false);
              }}
              className="w-full px-4 py-2 text-left text-sm text-white hover:bg-white/5 flex items-center gap-3 transition-colors"
            >
              {!isCameraEnabled ? (
                <CameraOff size={16} className="text-red-400" />
              ) : (
                <Camera size={16} className="text-green-400" />
              )}
              {isCameraEnabled ? "Stop Video" : "Start Video"}
            </button>
            <button
              onClick={() => {
                meeting.sendMeetingCommand(
                  isMuted ? "unmute" : "mute",
                  track.participant?.identity,
                );
                setShowMenu(false);
              }}
              className="w-full px-4 py-2 text-left text-sm text-white hover:bg-white/5 flex items-center gap-3 transition-colors"
            >
              {!isMuted ? (
                <Mic size={16} className="text-green-400" />
              ) : (
                <MicOff size={16} className="text-red-400" />
              )}
              {isMuted ? "Unmute Mic" : "Mute Mic"}
            </button>
          </>
        </div>
      )}
    </div>
  );
}
