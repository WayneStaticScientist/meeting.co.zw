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
    const currentWaiters = useWaitingListStore.getState().waiters;
    const currentParticipants =
      useMeetingStore.getState().meeting?.participants || [];
    const isAlreadyWaiting = currentWaiters.some(
      (w) => w.userId === data.userId,
    );
    const isAlreadyInMeeting = currentParticipants.some(
      (p) => p.userId === data.userId,
    );

    if (isAlreadyWaiting || isAlreadyInMeeting) {
      console.log("🚫 User already processed, ignoring duplicate event.");
      return;
    }
    toast.info(`${data.displayName}`, {
      actionProps: {
        children: "Add",
        onPress: async () => {
          const user = await meetingStore.admitParticipant(data);
          if (!user) return;
          waiters.removeWaiter(user);
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
    return () => {
      socket.off(`${session._id}-yes-join`);
      socket.off(`ask-to-join`);
    };
  }, [session._id, isConnected, meetingStore.meeting?.meetingCode]);
  useEffect(() => {
    if (!isOwner) return;
    socket.on(`${session._id}-user-wanna-join`, handleJoinRequest);
    return () => {
      socket.off(`${session._id}-user-wanna-join`, handleJoinRequest);
    };
  }, [isOwner, socket]);
  useEffect(() => {
    if (!isConnected || !session._id || !meetingStore.meeting) return;
    if (
      meetingStore.meeting!.participants.find((e) => e.userId === session._id)
    ) {
      socket.emit("try-to-join", {
        userId: session._id,
        meetingCode: meetingStore.meeting.meetingCode,
      });
    }
  }, [session._id, isConnected, meetingStore.meeting]);

  return { isOwner };
};
