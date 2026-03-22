import { create } from "zustand";
import api from "../../interceptior";
import { Meeting } from "@/types/meeting";
import { Toaster } from "@/utils/toast-marker";
import { immer } from "zustand/middleware/immer";
import { Participant } from "@/types/participant";

export const useMeetingStore = create<{
  meeting?: Meeting;
  loading: boolean;
  currentAdmissionId: string;
  admitParticipant: (participant: Participant) => Promise<string | undefined>;
  fetchMeeting: (id: string) => void;
}>()(
  immer((set) => ({
    meeting: undefined,
    loading: false,
    currentAdmissionId: "",
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
  })),
);
