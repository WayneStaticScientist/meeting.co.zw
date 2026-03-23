import { create } from "zustand";
import api from "../../interceptior";
import { Meeting } from "@/types/meeting";
import { Toaster } from "@/utils/toast-marker";
import { immer } from "zustand/middleware/immer";
import { Participant } from "@/types/participant";

export const useMeetingStore = create<{
  meeting?: Meeting | null;
  leaving: boolean;
  loading: boolean;
  meetings: Meeting[];
  leaveMeeting: () => void;
  currentAdmissionId: string;
  fetchMeeting: (id: string) => void;
  fetchMeetings: (page: number) => void;
  admitParticipant: (participant: Participant) => Promise<string | undefined>;
}>()(
  immer((set, get) => ({
    meeting: undefined,
    loading: false,
    leaving: false,
    currentAdmissionId: "",
    meetings: [],
    updateParticipants: (participants: Participant[]) => {
      set((state) => {
        state.meeting!.participants = participants;
      });
    },
    fetchMeeting: async (meetingId?: string) => {
      if (!meetingId) return;
      set((state) => {
        state.loading = true;
      });
      try {
        const response = await api.get("/meetings/room/" + meetingId);
        set((state) => {
          state.meeting = response.data.meeting;
          state.loading = false;
        });
      } catch (e) {
        Toaster.errorHttp(e);
        set((state) => {
          state.loading = false;
        });
      }
    },
    admitParticipant: async (
      participant: Participant,
    ): Promise<string | any> => {
      try {
        set((state) => {
          state.currentAdmissionId = participant.userId;
        });
        const response = await api.post("/meetings/room/add-participant", {
          participant,
          meetingCode: useMeetingStore.getState().meeting?.meetingCode,
        });
        set((state) => {
          state.meeting!.participants = response.data.meeting.participants;
          state.loading = false;
        });
        Toaster.success(`Participant ${participant.displayName} added`);

        return participant.userId;
      } catch (e) {
        Toaster.errorHttp(e);
        set((state) => {
          state.loading = false;
        });
      } finally {
        set((state) => {
          state.currentAdmissionId = "";
        });
      }
    },
    closeMeeting: async () => {
      Toaster.success("meeting closed");
      set((state) => {
        state.meeting = null;
      });
    },
    leaveMeeting: async () => {
      if (!get().meeting) return;
      try {
        set((state) => {
          state.leaving = true;
        });
        await api.delete("/meetings/" + get().meeting?.meetingCode);
        set((state) => {
          state.leaving = false;
          state.meeting = null;
        });
      } catch (e) {
        set((state) => {
          state.leaving = false;
        });
      }
    },
    fetchMeetings: async (page = 1) => {
      try {
        set((state) => {
          state.loading = true;
        });
        const response = await api.get("/meetings/all?page=" + page);
        set((state) => {
          state.meetings = response.data.meetings;
          state.loading = false;
        });
      } catch (e) {
        set((state) => {
          state.loading = false;
        });
      }
    },
  })),
);
