import { create } from "zustand";

interface MeetingControlsState {
  // UI States
  micOn: boolean;
  camOn: boolean;
  chatInput: string;
  isScreenSharing: boolean;
  isWhiteboardActive: boolean;

  // Actions
  setMicOn: (val: boolean) => void;
  setCamOn: (val: boolean) => void;
  setChatInput: (val: string) => void;
  setIsScreenSharing: (val: boolean) => void;
  setIsWhiteboardActive: (val: boolean) => void;

  // Toggle Helpers
  toggleMic: () => void;
  toggleCam: () => void;
}

export const useMeetingControlsStore = create<MeetingControlsState>((set) => ({
  micOn: true,
  camOn: true,
  chatInput: "",
  isScreenSharing: false,
  isWhiteboardActive: false,

  setMicOn: (micOn) => set({ micOn }),
  setCamOn: (camOn) => set({ camOn }),
  setChatInput: (chatInput) => set({ chatInput }),
  setIsScreenSharing: (val) =>
    set({
      isScreenSharing: val,
      isWhiteboardActive: val ? false : undefined, // Turn off whiteboard if sharing screen
    }),
  setIsWhiteboardActive: (val) =>
    set({
      isWhiteboardActive: val,
      isScreenSharing: val ? false : undefined, // Turn off screen share if whiteboard active
    }),

  toggleMic: () => set((state) => ({ micOn: !state.micOn })),
  toggleCam: () => set((state) => ({ camOn: !state.camOn })),
}));
