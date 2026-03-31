"use client";
import api from "../../interceptior";
import { toast } from "@heroui/react";
import { UserRound } from "lucide-react";
import { Meeting } from "@/types/meeting";
import { useEffect, useState } from "react";
import { Toaster } from "@/utils/toast-marker";
import { Participant } from "@/types/participant";
import { useSocket } from "@/providers/socket-provider";
import { useMeetingStore } from "@/stores/meeting-store";
import { useSessionState } from "@/stores/session-store";
import { Chats, useMessages } from "@/stores/chats-store";
import { useWaitingListStore } from "@/stores/waiting-list-store";

export const useJoinMeetingHook = () => {
  const [token, setToken] = useState("");
  const chatMessages = useMessages();
  const { isConnected, socket } = useSocket();
  const session = useSessionState();
  const waiting = useWaitingListStore();
  const meetingStore = useMeetingStore();
  function canUserJoin(user: Participant) {
    if (waiting.pass(user.userId)) return;
    if (meetingStore.pass(user.userId)) return;
    waiting.addWaiter(user);
    toast(`${user.displayName} `, {
      actionProps: {
        children: <p className="text-sm  text-green-500">Admit to meeting?</p>,
        onPress: async () => {
          toast.clear();
          const response = await meetingStore.admitParticipant(user);
          if (response) {
            waiting.removeWaiter(response);
          }
        },
        variant: "tertiary",
      },
      description: `${user.displayName} wants to join your meeting`,
      indicator: <UserRound className="bg-green-400" />,
      variant: "success",
    });
  }
  async function joinMeeting(_meeting: Meeting, _id: string) {
    try {
      const response = await api.post("/meetings/join/room/participant", {
        userId: _id,
        meetingCode: _meeting.meetingCode,
      });
      setToken(response.data.authToken);
    } catch (error) {
      Toaster.error(`Error ${error}`);
      console.log(error);
    }
  }
  useEffect(() => {
    if (!meetingStore.meeting || !isConnected) return;
    if (!session._id || (token && token.length > 0)) return;
    socket.emit("i-wanna-join", {
      meetingId: meetingStore.meeting.meetingId,
      meetingCode: meetingStore.meeting.meetingCode,
      userId: session._id,
    });
    return;
  }, [meetingStore.meeting, session._id, isConnected]);

  useEffect(() => {
    if (!meetingStore.meeting || !session._id || !isConnected) return;
    socket.on("join-meeting", () => {
      joinMeeting(meetingStore.meeting!, session._id);
    });
    socket.on("close-meeting", () => {
      meetingStore.leaveMeeting();
    });
    socket.on("updated-participants", (participants: Participant[]) => {
      meetingStore.updateParticipants(participants);
    });
    socket.on("highlight-node", (node: { focusNode: string }) => {
      meetingStore.setFocusNode(node.focusNode);
    });
    socket.on("new-chat-message", (msg: Chats) => {
      chatMessages.addMessage(msg);
      toast.success("New Message from " + msg.displayName, {});
    });
    return () => {
      socket.off("close-meeting");
      socket.off("updated-participants");
      socket.off("join-meeting");
      socket.off("new-chat-message");
    };
  }, [meetingStore.meeting, session._id, isConnected]);

  useEffect(() => {
    if (!meetingStore.meeting || !session._id || !isConnected) return;
    if (session._id != meetingStore.meeting.host) return;
    socket.on("can-user-join", (participant: Participant) => {
      canUserJoin(participant);
    });
    return () => {
      socket.off("can-user-join");
    };
  }, [meetingStore.meeting, session._id, isConnected]);
  return { joinMeeting, token, setToken };
};
