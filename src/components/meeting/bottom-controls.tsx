"use client";
import {
  CameraOff,
  MessageSquare,
  Mic,
  MicOff,
  Monitor,
  PenTool,
  Users,
  Video,
} from "lucide-react";
import { AlertDialog, Button } from "@heroui/react";
import { useWaitingListStore } from "@/stores/waiting-list-store";
import { MeetingControlsHook } from "@/hooks/meeting-controls-hook";
import ZLoader from "../displays/z-loader";
import { useSessionState } from "@/stores/session-store";
import { useMeetingStore } from "@/stores/meeting-store";
import { useMediaStream } from "@/hooks/use-media-stream";

export default function BottomControls({
  setActiveSidebar,
  activeSidebar,
}: {
  setActiveSidebar: (act: string) => void;
  activeSidebar: string;
}) {
  const media = useMediaStream();
  const session = useSessionState();
  const meeting = useMeetingStore();
  const waiters = useWaitingListStore();
  const meetingControls = MeetingControlsHook();
  return (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 z-50">
      <div className="bg-zinc-900/90 backdrop-blur-2xl border border-white/10 px-4 lg:flex-row! py-2.5 rounded-2xl flex-col gap-y-12  items-center gap-2 shadow-2xl">
        <div className="flex justify-between lg:justify-start">
          <button
            onClick={() => {
              if (!media.localStream) {
                media.startStream({ videoEnabled: false });
              } else {
                media.toggleAudio();
              }
            }}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${!media.isMuted ? "hover:bg-zinc-800 text-zinc-300" : "bg-red-500 text-white"}`}
          >
            {!media.isMuted ? <Mic size={20} /> : <MicOff size={20} />}
          </button>
          <button
            onClick={() => {
              if (!media.localStream) {
                media.startStream({ videoEnabled: true });
              } else {
                media.toggleVideo();
              }
            }}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${!media.isPaused ? "hover:bg-zinc-800 text-zinc-300" : "bg-red-500 text-white"}`}
          >
            {media.isPaused ? <Video size={20} /> : <CameraOff size={20} />}
          </button>
          <div className="w-px h-6 bg-white/10 mx-1" />
          <button
            onClick={() => {
              meetingControls.setIsScreenSharing(
                !meetingControls.isScreenSharing,
              );
              meetingControls.setIsWhiteboardActive(false);
            }}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${meetingControls.isScreenSharing ? "bg-emerald-500 text-white" : "hover:bg-zinc-800 text-zinc-300"}`}
          >
            <Monitor size={20} />
          </button>
          <button
            onClick={() => {
              meetingControls.setIsWhiteboardActive(
                !meetingControls.isWhiteboardActive,
              );
              meetingControls.setIsScreenSharing(false);
            }}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${meetingControls.isWhiteboardActive ? "bg-emerald-500 text-white" : "hover:bg-zinc-800 text-zinc-300"}`}
          >
            <PenTool size={20} />
          </button>
        </div>
        <div className="h-6 lg:h-0" />
        <div className="flex justify-between lg:justify-start">
          <div className="w-px h-6 bg-white/10 mx-1 hidden lg:visible" />

          <button
            onClick={() =>
              setActiveSidebar(
                activeSidebar === "participants" ? "none" : "participants",
              )
            }
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all relative ${activeSidebar === "participants" ? "bg-zinc-800 text-white" : "hover:bg-zinc-800 text-zinc-300"}`}
          >
            <Users size={20} />
            {waiters.waiters.length > 0 && (
              <div className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-zinc-900" />
            )}
          </button>
          <button
            onClick={() =>
              setActiveSidebar(activeSidebar === "chat" ? "none" : "chat")
            }
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${activeSidebar === "chat" ? "bg-zinc-800 text-white" : "hover:bg-zinc-800 text-zinc-300"}`}
          >
            <MessageSquare size={20} />
          </button>

          <AlertDialog>
            <Button variant="danger">
              {meeting.leaving ? <ZLoader /> : "Leave"}
            </Button>
            <AlertDialog.Backdrop>
              <AlertDialog.Container>
                <AlertDialog.Dialog className="sm:max-w-100">
                  <AlertDialog.CloseTrigger />
                  <AlertDialog.Header>
                    <AlertDialog.Icon status="danger" />
                    <AlertDialog.Heading color="red">
                      <span className="text-red-500"> Leave Meeting</span>
                    </AlertDialog.Heading>
                  </AlertDialog.Header>
                  <AlertDialog.Body>
                    <p>
                      Are you sure you want to leave the meeting?
                      {meeting.meeting?.host == session._id &&
                        "This will close the meeting for all participants"}
                    </p>
                  </AlertDialog.Body>
                  <AlertDialog.Footer>
                    <Button slot="close" variant="primary">
                      Cancel
                    </Button>
                    <Button
                      slot="close"
                      variant="danger"
                      onClick={() => {
                        meeting.leaveMeeting();
                      }}
                    >
                      Leave Meeting
                    </Button>
                  </AlertDialog.Footer>
                </AlertDialog.Dialog>
              </AlertDialog.Container>
            </AlertDialog.Backdrop>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
}
