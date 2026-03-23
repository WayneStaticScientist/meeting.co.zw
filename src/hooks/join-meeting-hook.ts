"use client";
import { toast } from "@heroui/react";
import { useEffect, useState } from "react";
import { Participant } from "@/types/participant";
import { useSocket } from "@/providers/socket-provider";
import { useMeetingStore } from "@/stores/meeting-store";
import { useSessionState } from "@/stores/session-store";
import { useWaitingListStore } from "@/stores/waiting-list-store";

export const useJoinMeetingHook = () => {
  const session = useSessionState();
  const waiters = useWaitingListStore();
  const meetingStore = useMeetingStore();
  const [isOwner, setIsOwner] = useState(false);
  const { socket, isConnected } = useSocket();
  const handleJoinRequest = (data: Participant) => {
    toast.info(`${data.displayName}`, {
      actionProps: {
        children: "Add",
        onPress: () => {
          meetingStore.admitParticipant(data);
        },
      },
      description: `${data.displayName} wants to join meeting`,
    });
    waiters.addWaiter(data);
  };
  useEffect(() => {
    if (!isConnected || !session._id || !meetingStore.meeting) return;
    if (session._id == meetingStore.meeting.host) {
      setIsOwner(true);
      return;
    }
    if (
      meetingStore.meeting!.participants.find((e) => e.userId === session._id)
    ) {
      return;
    }
    socket.on(`${session._id}-yes-join`, () => {
      meetingStore.fetchMeeting(meetingStore.meeting!.meetingCode);
    });
    socket.emit("ask-to-join", {
      userId: session._id,
      meetingCode: meetingStore.meeting.meetingCode,
    });
  }, [session._id, isConnected, meetingStore]);
  useEffect(() => {
    if (!isOwner) return;
    socket.on(`${session._id}-user-wanna-join`, handleJoinRequest);
    return () => {
      socket.off(`${session._id}-user-wanna-join`, handleJoinRequest);
    };
  }, [isOwner, socket]);
  useEffect(() => {
    if (!isConnected || !session._id || !meetingStore.meeting) return;
    if (session._id == meetingStore.meeting.host) {
      return;
    }
    if (
      meetingStore.meeting!.participants.find((e) => e.userId === session._id)
    ) {
      socket.emit("try-to-join", {
        userId: session._id,
        meetingCode: meetingStore.meeting.meetingCode,
      });
    }
  }, [session._id, isConnected, meetingStore]);

  return { isOwner };
};
