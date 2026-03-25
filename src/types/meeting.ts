import { Participant } from "./participant";

export interface Meeting {
  keyCode?: string;
  roomName: string;
  meetingCode: string;
  host: any;
  createdAt: string;
  meetingId?: string;
  participants: Participant[];
  status: "Active" | "Waiting" | "Ended";
}
