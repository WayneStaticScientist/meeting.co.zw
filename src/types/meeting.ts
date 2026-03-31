import { Participant } from "./participant";

export interface Meeting {
  host: any;
  duration: string;
  public: boolean;
  keyCode?: string;
  roomName: string;
  scheduleTime: Date;
  meetingCode: string;
  meetingId?: string;
  focuseNode?: string;
  participants: Participant[];
  status: "Active" | "Waiting" | "Ended" | "Scheduled";
}
