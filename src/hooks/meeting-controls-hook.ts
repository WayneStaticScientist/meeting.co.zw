"use client";
import { useSocket } from "@/providers/socket-provider";
import { Chats, useMessages } from "@/stores/chats-store";
import { useMeetingStore } from "@/stores/meeting-store";
import { useSessionState } from "@/stores/session-store";
import { useWaitingListStore } from "@/stores/waiting-list-store";
import { useState } from "react";

export const MeetingControlsHook = () => {
  const session = useSessionState();
  const { addMessage } = useMessages();
  const { socket, isConnected } = useSocket();
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const meetingStore = useMeetingStore();
  const [chatInput, setChatInput] = useState("");
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isWhiteboardActive, setIsWhiteboardActive] = useState(false);
  const sendMessage = (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isConnected) return;
    const chat: Chats = {
      userId: session._id,
      message: chatInput,
      displayName: `${session.firstName} ${session.lastName}`,
    };
    socket.emit("on-event-message", {
      ...chat,
      meetingCode: meetingStore.meeting!.meetingCode,
    });
    addMessage(chat);
    setChatInput("");
  };
  return {
    micOn,
    sendMessage,
    setCamOn,
    setMicOn,
    chatInput,
    setChatInput,
    camOn,
    isScreenSharing,
    setIsScreenSharing,
    isWhiteboardActive,
    setIsWhiteboardActive,
  };
};
