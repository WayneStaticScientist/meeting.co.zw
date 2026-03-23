"use client";
import { useEffect, useMemo, useRef } from "react";
import { useRTCHandler } from "@/hooks/use-rtc-handler";

export default function VideoGrid({ localStream, userId }: any) {
  // Use the mock for the preview environment, but you should use your real hook locally.
  const { remoteStreams } = useRTCHandler(userId);
  const localVideoRef = useRef<HTMLVideoElement>(null);

  const remoteParticipants = Object.entries(remoteStreams);
  const totalCount = (localStream ? 1 : 0) + remoteParticipants.length;

  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  // Fail-safe: Click to play all videos if browser blocks autoplay
  const handleGridClick = () => {
    const videos = document.querySelectorAll("video");
    videos.forEach((v) => v.play().catch(() => {}));
  };

  /**
   * DYNAMIC GRID LOGIC
   * Ensures high height and proper alignment based on participant count.
   */
  const gridLayoutClass = useMemo(() => {
    if (totalCount === 0) {
      return "flex";
    }
    if (totalCount === 1) {
      return "w-full h-full";
    }
    if (totalCount === 1) {
      return "grid grid-cols-2";
    }
    if (totalCount === 2) {
      return "grid grid-cols-1 md:grid-cols-2 gap-4 h-full w-full";
    }
    if (totalCount <= 4) {
      return "grid grid-cols-2 gap-4 h-full w-full";
    }
    return "grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 h-full w-full";
  }, [totalCount]);

  return (
    <div
      onClick={handleGridClick}
      className="w-full h-full  p-2 md:p-6 overflow-hidden cursor-pointer flex flex-col items-center justify-center"
    >
      <div className={gridLayoutClass}>
        {/* LOCAL VIDEO */}
        {localStream && (
          <VideoContainer label="You" isLocal>
            <video
              ref={localVideoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover scale-x-[-1]"
            />
          </VideoContainer>
        )}
        {/* REMOTE VIDEOS */}
        {remoteParticipants.map(([peerId, stream]) => (
          <VideoContainer key={peerId} label="Participant">
            <RemoteVideoPlayer stream={stream as MediaStream} />
          </VideoContainer>
        ))}
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #09090b;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #27272a;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}

/**
 * Individual Video Tile Wrapper
 * Handles the consistent aspect ratio and label styling.
 */
function VideoContainer({ children, label, isLocal }: any) {
  return (
    <div className="relative w-full h-full min-h-55 md:min-h-0 rounded-3xl overflow-hidden bg-zinc-900 border border-zinc-800/60 shadow-2xl flex items-center justify-center group transition-all duration-300">
      {children}

      {/* Participant Label */}
      <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-black/60 backdrop-blur-xl px-4 py-2 rounded-2xl border border-white/10 z-10 pointer-events-none shadow-lg">
        <div
          className={`w-2.5 h-2.5 rounded-full ${isLocal ? "bg-emerald-500 animate-pulse" : "bg-blue-500"}`}
        />
        <span className="text-[13px] font-bold text-white tracking-tight uppercase">
          {label}
        </span>
      </div>
    </div>
  );
}

/**
 * Individual Remote Player Component
 * Encapsulates the specific browser autoplay logic.
 */
function RemoteVideoPlayer({ stream }: { stream: MediaStream }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !stream) return;

    if (video.srcObject !== stream) {
      video.srcObject = stream;
    }

    const handlePlay = async () => {
      try {
        await video.play();
      } catch (err) {
        console.warn("Autoplay block detected.", err);
      }
    };

    video.onloadedmetadata = handlePlay;
  }, [stream]);

  return (
    <video
      ref={videoRef}
      autoPlay
      playsInline
      muted // Required for reliable browser playback
      className="w-full h-full object-cover bg-zinc-900"
    />
  );
}
// export default function VideoGrid({ localStream, userId }: any) {
//   const { remoteStreams } = useRTCHandler(localStream, userId);
//   const localVideoRef = useRef<HTMLVideoElement>(null);

//   useEffect(() => {
//     // This is the critical part!
//     if (localVideoRef.current && localStream) {
//       localVideoRef.current.srcObject = localStream;
//     }
//   }, [localStream]);
//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 h-full bg-zinc-950">
//       {/* LOCAL VIDEO */}
//       <div className="relative rounded-3xl overflow-hidden bg-zinc-900 border-2 border-emerald-500">
//         <video
//           ref={localVideoRef}
//           autoPlay
//           muted
//           playsInline
//           className="w-full h-full object-cover mirror"
//         />
//         <span className="absolute bottom-4 left-4 text-white bg-black/50 px-3 py-1 rounded-lg">
//           You
//         </span>
//       </div>

//       {/* REMOTE VIDEOS */}
//       {Object.entries(remoteStreams).map(([peerId, stream]) => (
//         <div
//           key={peerId}
//           className="relative rounded-3xl overflow-hidden bg-zinc-900"
//         >
//           <RemoteVideoPlayer stream={stream} />
//           <span className="absolute bottom-4 left-4 text-white bg-black/50 px-3 py-1 rounded-lg">
//             Participant
//           </span>
//         </div>
//       ))}
//     </div>
//   );
// }
// function RemoteVideoPlayer({ stream }: { stream: MediaStream }) {
//   const videoRef = useRef<HTMLVideoElement>(null);

//   useEffect(() => {
//     const video = videoRef.current;
//     if (!video || !stream) return;

//     // Only update if the stream actually changed to prevent the "AbortError"
//     if (video.srcObject !== stream) {
//       video.srcObject = stream;
//     }

//     const handlePlay = async () => {
//       try {
//         await video.play();
//       } catch (err) {
//         console.warn("Autoplay block detected. User might need to click.", err);
//       }
//     };

//     video.onloadedmetadata = handlePlay;
//   }, [stream]);
//   const handleGridClick = () => {
//     const videos = document.querySelectorAll("video");
//     videos.forEach((v) => v.play().catch(() => {}));
//   };
//   return (
//     <div
//       onClick={handleGridClick}
//       className="grid w-screen h-screen grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4  bg-zinc-950 cursor-pointer"
//     >
//       <video
//         ref={videoRef}
//         autoPlay
//         playsInline
//         muted // CRITICAL: Browsers allow autoplay 99% of the time IF muted.
//         className="w-full h-full object-cover bg-zinc-900"
//       />
//     </div>
//   );
// }
