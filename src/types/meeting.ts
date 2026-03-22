export interface Meeting {
  keyCode?: string;
  roomName: string;
  meetingCode: string;
  host: any;
  participants: {
    userId: string;
    role: string;
    displayName: string;
    email: string;
    isMuted: boolean;
    isSpeaking: boolean;
    status: "pending" | "accepted" | "rejected";
  }[];
  status: "Active" | "Waiting" | "Ended";
}
