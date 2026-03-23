import { useSocket } from "@/providers/socket-provider";
import { useMeetingStore } from "@/stores/meeting-store";
import { useEffect, useRef, useState, useCallback } from "react";

export const useRTCHandler = (
  localStream: MediaStream | null,
  sessionUserId: string,
) => {
  const { socket } = useSocket();
  const meeting = useMeetingStore();
  const [remoteStreams, setRemoteStreams] = useState<{
    [userId: string]: MediaStream;
  }>({});

  // Refs to keep track of state without triggering re-renders
  const peers = useRef<{ [userId: string]: RTCPeerConnection }>({});
  const isMakingOffer = useRef<{ [userId: string]: boolean }>({});

  const iceConfig = {
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
  };

  const createPeer = useCallback(
    (targetUserId: string, initiator: boolean) => {
      // 1. Prevent duplicate PeerConnections
      if (peers.current[targetUserId]) return peers.current[targetUserId];

      const pc = new RTCPeerConnection(iceConfig);
      peers.current[targetUserId] = pc;

      console.log(
        `🏗️ Creating PeerConnection for: ${targetUserId} (Initiator: ${initiator})`,
      );

      // 2. Add Local Tracks
      if (localStream) {
        localStream
          .getTracks()
          .forEach((track) => pc.addTrack(track, localStream));
      }

      // 3. Handle Incoming Tracks
      pc.ontrack = (event) => {
        console.log(`🔥 TRACK RECEIVED from ${targetUserId}`);
        const remoteStream = event.streams[0];
        setRemoteStreams((prev) => {
          if (prev[targetUserId]?.id === remoteStream.id) return prev;
          return { ...prev, [targetUserId]: remoteStream };
        });
      };

      // 4. ICE Candidates
      pc.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit("signal", {
            to: targetUserId,
            candidate: event.candidate,
            meetingCode: meeting.meeting?.meetingCode,
          });
        }
      };

      // 5. Negotiation (Only for Initiator)
      if (initiator) {
        pc.onnegotiationneeded = async () => {
          try {
            if (isMakingOffer.current[targetUserId]) return;
            isMakingOffer.current[targetUserId] = true;

            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);

            socket.emit("signal", {
              to: targetUserId,
              offer: pc.localDescription,
              meetingCode: meeting.meeting?.meetingCode,
            });
          } catch (err) {
            console.error("Negotiation Error:", err);
          } finally {
            isMakingOffer.current[targetUserId] = false;
          }
        };
      }

      return pc;
    },
    [localStream, socket, meeting.meeting?.meetingCode],
  );

  useEffect(() => {
    if (!socket || !meeting.meeting?.meetingCode) return;

    // A. Listen for users joining (Only trigger if WE are the ones already there)
    socket.on("user-joined", ({ userId }) => {
      if (userId === sessionUserId) return;
      console.log("👋 New user joined, starting call:", userId);
      createPeer(userId, true);
    });

    // B. Handle all incoming signals (Offer, Answer, ICE)
    socket.on("signal", async ({ from, offer, answer, candidate }) => {
      console.log(
        `📡 Signal from ${from}:`,
        offer ? "Offer" : answer ? "Answer" : "Candidate",
      );

      let pc = peers.current[from];
      if (!pc) pc = createPeer(from, false);

      try {
        if (offer) {
          await pc.setRemoteDescription(new RTCSessionDescription(offer));
          const ans = await pc.createAnswer();
          await pc.setLocalDescription(ans);
          socket.emit("signal", {
            to: from,
            answer: ans,
            meetingCode: meeting.meeting?.meetingCode,
          });
        } else if (answer) {
          await pc.setRemoteDescription(new RTCSessionDescription(answer));
        } else if (candidate) {
          await pc.addIceCandidate(new RTCIceCandidate(candidate));
        }
      } catch (err) {
        console.error("Signal Handling Error:", err);
      }
    });

    // C. Clean up departed users
    socket.on("user-left", ({ userId }) => {
      console.log("🏃 User left:", userId);
      if (peers.current[userId]) {
        peers.current[userId].close();
        delete peers.current[userId];
        setRemoteStreams((prev) => {
          const updated = { ...prev };
          delete updated[userId];
          return updated;
        });
      }
    });

    return () => {
      socket.off("user-joined");
      socket.off("signal");
      socket.off("user-left");
    };
  }, [socket, sessionUserId, meeting.meeting?.meetingCode, createPeer]);

  return { remoteStreams };
};
