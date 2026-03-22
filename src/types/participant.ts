export interface Participant {
  userId: any;
  role: string;
  displayName: String;
  isMuted: boolean;
  isSpeaking: boolean;
  status: "pending" | "accepted" | "rejected";
}
