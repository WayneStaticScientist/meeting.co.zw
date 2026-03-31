import { create } from "zustand";
import api from "../../interceptior";
import { Meeting } from "@/types/meeting";
import { Toaster } from "@/utils/toast-marker";
import { immer } from "zustand/middleware/immer";
import { Participant } from "@/types/participant";
export type MeetingCommand =
  | "mute"
  | "unmute"
  | "camera"
  | "uncamera"
  | "unscreen"
  | "remove";
export const useMeetingStore = create<{
  leaving: boolean;
  rejoin: boolean;
  loading: boolean;
  currentPage: number;
  rowsPerPage: number;
  totalPages: number;
  meetings: Meeting[];
  totalMeetings: number;
  updatingFocus: boolean;
  meeting?: Meeting | null;
  requestingAccess: boolean;
  closeMeeting: () => void;
  currentAdmissionId: string;
  pass: (userId: string) => boolean;
  fetchMeeting: (id: string) => void;
  setFocusNode(node: string): unknown;
  leaveMeeting: () => Promise<boolean>;
  updateFocusNode(node: string): unknown;
  setRowsPerPage: (newRows: number) => void;
  fetchMeetings: (page: number, limit?: number) => void;
  requestToJoinScheduledMeeting: (userId: string) => void;
  updateParticipants: (participants: Participant[]) => void;
  sendMeetingCommand: (command: MeetingCommand, targetUserId: string) => void;
  admitParticipant: (participant: Participant) => Promise<string | undefined>;
}>()(
  immer((set, get) => ({
    meetings: [],
    rejoin: true,
    totalPages: 0,
    loading: false,
    rowsPerPage: 10,
    currentPage: 1,
    leaving: false,
    totalMeetings: 0,
    meeting: undefined,
    updatingFocus: false,
    currentAdmissionId: "",
    requestingAccess: false,
    setFocusNode: (node: string) => {
      set((state) => {
        state.meeting!.focuseNode = node;
      });
    },
    setRowsPerPage: (newRows: number) => {
      set((state) => {
        state.rowsPerPage = newRows;
      });
    },
    pass: (userId: string): boolean => {
      if (get().meeting!.participants.find((w) => w.userId === userId)) {
        return true;
      }
      return false;
    },
    updateParticipants: (participants: Participant[]) => {
      set((state) => {
        state.meeting!.participants = participants;
      });
    },
    fetchMeeting: async (meetingId?: string) => {
      if (!meetingId || !get().rejoin) return;
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
      set((state) => {
        state.meeting = null;
        state.rejoin = false;
      });
    },
    leaveMeeting: async (): Promise<boolean> => {
      if (!get().meeting) return false;
      try {
        set((state) => {
          state.leaving = true;
        });
        await api.delete("/meetings/" + get().meeting?.meetingCode);
        Toaster.success("Meeting left");
        set((state) => {
          state.leaving = false;
          state.meeting = null;
          state.rejoin = false;
        });
        return true;
      } catch (e) {
        Toaster.errorHttp(e);
        set((state) => {
          state.leaving = false;
        });
      }
      return false;
    },

    fetchMeetings: async (page = 1, limit?: number) => {
      try {
        set((state) => {
          state.loading = true;
        });
        const response = await api.get(
          "/meetings/all?page=" +
            page +
            "&limit=" +
            (limit ?? get().rowsPerPage),
        );
        set((state) => {
          state.meetings = response.data.meetings;
          state.loading = false;
          state.totalPages = response.data.meta.lastPage;
          state.currentPage = response.data.meta.page;
          state.rowsPerPage = response.data.meta.limit;
          state.totalMeetings = response.data.meta.total;
        });
      } catch (e) {
        set((state) => {
          state.loading = false;
        });
      }
    },
    updateFocusNode: async (focusNode?: string) => {
      try {
        set((state) => {
          state.updatingFocus = true;
        });
        await api.put("/meetings/focus-node", {
          meetingCode: get().meeting?.meetingCode,
          focusNode,
        });
      } catch (e) {
        Toaster.errorHttp(e);
      } finally {
        set((state) => {
          state.updatingFocus = false;
        });
      }
    },
    requestToJoinScheduledMeeting: async (userId: string) => {
      try {
        set((state) => {
          state.requestingAccess = true;
        });
        const respone = await api.post("/meetings/room/participant-request", {
          userId,
          meetingCode: get().meeting!.meetingCode,
        });
        set((state) => {
          state.meeting = respone.data.meeting;
          state.requestingAccess = false;
        });
      } catch (e) {
        set((state) => {
          state.requestingAccess = false;
        });
        Toaster.errorHttp(e);
      }
    },
    sendMeetingCommand: async (
      command: MeetingCommand,
      targetUserId: string,
    ) => {
      try {
        await api.post("/meetings/command", {
          meetingCode: get().meeting?.meetingCode,
          command,
          targetUserId,
        });
      } catch (e) {
        Toaster.errorHttp(e);
      }
    },
  })),
);
