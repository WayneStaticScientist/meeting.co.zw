export interface Participant {
  userId: any;
  role: string;
  chatToken: string;
  isFocused: boolean;
  displayName: String;
  isMicMuted: boolean;
  isCameraMuted: boolean;
  status: "pending" | "accepted" | "rejected";
}
