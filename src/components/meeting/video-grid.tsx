"use client";
import { useEffect } from "react";
import { useRealtimeKitMeeting } from "@cloudflare/realtimekit-react";
import {
  RtkGrid,
  RtkParticipantsAudio,
} from "@cloudflare/realtimekit-react-ui";

export default function VideoGrid() {
  const { meeting } = useRealtimeKitMeeting();
  useEffect(() => {
    // initMeeting({ authToken: "<auth-token>" });
  }, []);

  return (
    <div className="h-full w-full bg-black">
      <RtkGrid meeting={meeting} />
      <RtkParticipantsAudio meeting={meeting} />
    </div>
  );
}
