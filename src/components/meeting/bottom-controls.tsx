"use client";
import {
  CameraOff,
  MessageSquare,
  Mic,
  MicOff,
  Monitor,
  Share,
  Users,
  Video,
} from "lucide-react";
import ZLoader from "../displays/z-loader";
import { Toaster } from "@/utils/toast-marker";
import { useSessionState } from "@/stores/session-store";
import { useMeetingStore } from "@/stores/meeting-store";
import ToolTipIconButton from "../actions/tooltip-icon-button";
import { useWaitingListStore } from "@/stores/waiting-list-store";
import { AlertDialog, Button, Dropdown, Label } from "@heroui/react";
import { useMeetingControlsStore } from "@/stores/use-meeting-control";
import { useLocalParticipant, useRoomContext } from "@livekit/components-react";

export default function BottomControls({
  setActiveSidebar,
  activeSidebar,
  setToken,
}: {
  setToken: (token: string) => void;
  setActiveSidebar: (act: string) => void;
  activeSidebar: string;
}) {
  const {
    localParticipant,
    isMicrophoneEnabled,
    isCameraEnabled,
    isScreenShareEnabled,
  } = useLocalParticipant();
  const room = useRoomContext();
  const session = useSessionState();
  const meeting = useMeetingStore();
  const waiters = useWaitingListStore();
  const meetingControls = useMeetingControlsStore();
  // 1. Toggle Audio
  const toggleMicrophone = async () => {
    await localParticipant.setMicrophoneEnabled(!isMicrophoneEnabled);
  };

  // 2. Toggle Video
  const toggleCamera = async () => {
    await localParticipant.setCameraEnabled(!isCameraEnabled);
  };

  // 3. Toggle Screen Share
  const toggleScreen = async () => {
    try {
      // Note: Browsers will show a popup to pick a window
      await localParticipant.setScreenShareEnabled(!isScreenShareEnabled);
    } catch (e) {
      console.error("Screen share cancelled or failed", e);
    }
  };
  function shareLink(): void {
    const inviteUrl = `${window.location.origin}/meeting/${meeting.meeting?.meetingCode}`;
    navigator.clipboard.writeText(inviteUrl);
    Toaster.success("Link copied to clipboard");
  }

  function shareCode(): void {
    navigator.clipboard.writeText(`${meeting.meeting?.meetingCode}`);
    Toaster.success("Invation code copied to clipboard");
  }

  return (
    <div
      className={`fixed lg:absolute bottom-8 left-1/2 -translate-x-1/2 flex   justify-center items-center gap-3 z-50 ${
        activeSidebar !== "none" ? "hidden lg:flex" : ""
      }`}
    >
      <div className="bg-zinc-900/90 lg:flex-row! flex gap-3 backdrop-blur-2xl border border-white/10 px-4 py-2.5 rounded-2xl flex-col gap-y-4 items-center shadow-2xl">
        <div className="flex justify-between gap-4 lg:justify-start">
          <ToolTipIconButton
            currentState={!isMicrophoneEnabled}
            trueState={<MicOff size={20} />}
            falseState={<Mic size={20} />}
            tooltip={!isMicrophoneEnabled ? "Unmute" : "Mute"}
            onPress={toggleMicrophone}
          />
          <ToolTipIconButton
            currentState={!isCameraEnabled}
            trueState={<CameraOff size={20} />}
            falseState={<Video size={20} />}
            tooltip={!isCameraEnabled ? "Show Camera" : "Hide Camera"}
            onPress={toggleCamera}
          />
          <ToolTipIconButton
            currentState={isScreenShareEnabled}
            trueState={<Monitor size={20} />}
            falseState={<Monitor size={20} />}
            tooltip={
              meetingControls.isScreenSharing
                ? "Hide Screen Share"
                : "Show Screen Sharing"
            }
            onPress={toggleScreen}
          />
          <Dropdown>
            <ToolTipIconButton
              currentState={meetingControls.isWhiteboardActive}
              noState={<Share size={20} />}
              tooltip={"Share Link"}
              onPress={async () => {}}
            />
            <Dropdown.Popover
              placement="top"
              className={"bg-black text-white!"}
            >
              <Dropdown.Menu
                onAction={(key) => console.log(`Selected: ${key}`)}
              >
                <Dropdown.Item
                  id="link"
                  textValue="Meet Link"
                  onClick={() => shareLink()}
                >
                  <Label>Meeting Link</Label>
                </Dropdown.Item>
                <Dropdown.Item
                  id="code"
                  textValue="Meeting Code"
                  onClick={() => shareCode()}
                >
                  <Label>Meeting Code</Label>
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown.Popover>
          </Dropdown>
        </div>
        <div className="flex justify-between gap-4 lg:justify-start">
          <ToolTipIconButton
            noState={
              <>
                <Users size={20} />
                {waiters.waiters.length > 0 && (
                  <div className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-zinc-900" />
                )}
              </>
            }
            tooltip={"Participants"}
            onPress={async () => {
              setActiveSidebar(
                activeSidebar === "participants" ? "none" : "participants",
              );
            }}
          />
          <ToolTipIconButton
            noState={<MessageSquare size={20} />}
            tooltip={"Open Chats"}
            onPress={async () => {
              setActiveSidebar(activeSidebar === "chat" ? "none" : "chat");
            }}
          />
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
                      onClick={async () => {
                        if (await meeting.leaveMeeting()) {
                          room.disconnect();
                          setToken("");
                        }
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
