import { create } from "zustand";

interface MediaState {
  localStream: MediaStream | null;
  isPaused: boolean;
  isMuted: boolean;
  isStreaming: boolean;
  // Actions
  startStream: (config: {
    videoEnabled?: boolean;
  }) => Promise<MediaStream | null>;
  toggleVideo: () => void;
  toggleAudio: () => void;
  stopStream: () => void;
}

export const useMediaStream = create<MediaState>((set, get) => ({
  localStream: null,
  isPaused: true,
  isStreaming: false,

  isMuted: true,
  startStream: async ({ videoEnabled = true }) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720, facingMode: "user" },
        audio: true,
      });

      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = videoEnabled;
      }

      set({
        localStream: stream,
        isPaused: !videoEnabled,
        isMuted: false,
        isStreaming: true,
      });

      return stream;
    } catch (error) {
      console.error("Error accessing media devices:", error);
      return null;
    }
  },

  toggleVideo: () => {
    const { localStream } = get();
    if (!localStream) return get().startStream({ videoEnabled: true });
    if (get().isMuted && !get().isPaused) return get().stopStream();
    const track = localStream.getVideoTracks()[0];
    if (track) {
      track.enabled = !track.enabled;
      set({ isPaused: !track.enabled });
    }
  },

  toggleAudio: () => {
    const { localStream } = get();
    if (!localStream) return get().startStream({ videoEnabled: false });
    if (!get().isMuted && get().isPaused) return get().stopStream();
    const track = localStream.getAudioTracks()[0];
    if (track) {
      track.enabled = !track.enabled;
      set({ isMuted: !track.enabled });
    }
  },

  stopStream: () => {
    const { localStream } = get();
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
      set({ localStream: null, isPaused: true, isMuted: true });
    }
  },
}));
