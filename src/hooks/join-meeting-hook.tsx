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
import { useWaitingListStore } from "@/stores/waiting-list-store";
import { useRealtimeKitClient } from "@cloudflare/realtimekit-react";

export const useJoinMeetingHook = () => {
  const { isConnected, socket } = useSocket();
  const session = useSessionState();
  const waiting = useWaitingListStore();
  const meetingStore = useMeetingStore();
  const [meeting, initMeeting] = useRealtimeKitClient();
  const [mediaState, setMediaState] = useState<string | null>(null);
  function canUserJoin(user: Participant) {
    if (waiting.pass(user.userId)) return;
    if (meetingStore.pass(user.userId)) return;
    waiting.addWaiter(user);
    toast(`${user.displayName} `, {
      actionProps: {
        children: "Add",
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

  async function startNeeting(meeting: Meeting, _id: string) {
    try {
      const response = await api.post("/meetings/join/room", {
        userId: _id,
        meetingCode: meeting.meetingCode,
      });
      const result = await initMeeting({
        authToken: response.data.authToken,
      });
      result?.join();
    } catch (error) {}
  }
  async function joinMeeting(_meeting: Meeting, _id: string) {
    if (mediaState === "connected" || mediaState === "connecting") {
      return;
    }
    try {
      const response = await api.post("/meetings/join/room/participant", {
        userId: _id,
        meetingCode: _meeting.meetingCode,
        defaults: {
          audio: true, // Force mic on by default
          video: true, // Force cam on by default
        },
      });
      const result = await initMeeting({
        authToken: response.data.authToken,
      });
      result?.join();
    } catch (error) {
      Toaster.error(`Error ${error}`);
      console.log(error);
    }
  }
  useEffect(() => {
    if (!meetingStore.meeting || !isConnected) return;
    if (!session._id) return;
    if (meetingStore.meeting.meetingId) {
      socket.emit("i-wanna-join", {
        meetingId: meetingStore.meeting.meetingId,
        meetingCode: meetingStore.meeting.meetingCode,
        userId: session._id,
      });
      return;
    }
    if (meetingStore.meeting.host != session._id) return;
    startNeeting(meetingStore.meeting, session._id);
  }, [meetingStore.meeting, session._id, isConnected]);

  useEffect(() => {
    if (!meetingStore.meeting || !session._id || !isConnected) return;
    socket.on("join-meeting", () => {
      joinMeeting(meetingStore.meeting!, session._id);
    });
    socket.on("close-meeting", () => {
      meeting.leaveRoom();
      meetingStore.closeMeeting();
    });
    socket.on("updated-participants", (participants: Participant[]) => {
      meetingStore.updateParticipants(participants);
    });
    return () => {
      socket.off("close-meeting");
      socket.off("updated-participants");
      socket.off("join-meeting");
    };
  }, [meetingStore.meeting, session._id, isConnected, meeting]);

  useEffect(() => {
    if (meeting) {
      const handleMediaConnection = ({
        transport,
        state,
      }: {
        transport: string;
        state: string;
      }) => {
        setMediaState(state);
        // transport - 'consuming' | 'producing'
        // state - 'new' | 'connecting' | 'connected' | 'disconnected' | 'reconnecting' | 'failed'
        console.log(`Media connection ${transport} is now ${state}`);
      };

      meeting.meta.on("mediaConnectionUpdate", handleMediaConnection);

      return () => {
        meeting.meta.off("mediaConnectionUpdate", handleMediaConnection);
      };
    }
  }, [meeting]);
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
  return { startNeeting, joinMeeting, meeting, mediaState };
};
