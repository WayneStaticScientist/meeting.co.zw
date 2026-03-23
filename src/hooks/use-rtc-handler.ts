import { useSocket } from "@/providers/socket-provider";
import { useMediaStream } from "@/stores/media-stream-store";
import { useMeetingStore } from "@/stores/meeting-store";
import { useEffect, useRef, useState, useCallback } from "react";

export const useRTCHandler = (sessionUserId: string) => {
  const { localStream } = useMediaStream();
  const { socket } = useSocket();
  const meeting = useMeetingStore();
  const [remoteStreams, setRemoteStreams] = useState<{
    [userId: string]: MediaStream;
  }>({});
  const polite = useRef<{ [userId: string]: boolean }>({});
  const peers = useRef<{ [userId: string]: RTCPeerConnection }>({});
  const isMakingOffer = useRef<{ [userId: string]: boolean }>({});
  // Track users we are currently handshaking with
  const processedUsers = useRef<Set<string>>(new Set());

  const iceConfig = {
    iceServers: [
      { urls: "stun:stun.l.google.com:19302" },
      { urls: "stun:stun1.l.google.com:19302" },
    ],
  };
  const replaceTracks = (stream: MediaStream) => {
    Object.values(peers.current).forEach((pc) => {
      const senders = pc.getSenders();

      stream.getTracks().forEach((track) => {
        const sender = senders.find(
          (s) => s.track && s.track.kind === track.kind,
        );

        if (sender) {
          console.log(`🔁 Replacing ${track.kind}`);
          sender.replaceTrack(track);
        } else {
          console.warn(`⚠️ No sender for ${track.kind} — skipping`);
        }
      });
    });
  };
  useEffect(() => {
    if (!localStream) return;

    Object.entries(peers.current).forEach(async ([userId, pc]) => {
      const senders = pc.getSenders();

      localStream.getTracks().forEach((track: any) => {
        // Check if we are already sending this kind of track (video/audio)
        const exists = senders.find((s) => s.track?.kind === track.kind);

        if (!exists) {
          // If it's a new track, add it. This triggers 'onnegotiationneeded'
          pc.addTrack(track, localStream);
        } else {
          // If we already had a "blank/dummy" track, replace it
          exists.replaceTrack(track);
        }
      });
    });
  }, [localStream]);
  const createPeer = useCallback(
    (targetUserId: string, initiator: boolean) => {
      // 1. Cleanup old connection thoroughly
      if (peers.current[targetUserId]) {
        console.log(`🧹 Closing existing peer for ${targetUserId}`);
        peers.current[targetUserId].onicecandidate = null;
        peers.current[targetUserId].ontrack = null;
        peers.current[targetUserId].onnegotiationneeded = null;
        peers.current[targetUserId].close();
        delete peers.current[targetUserId];
      }

      const pc = new RTCPeerConnection(iceConfig);
      peers.current[targetUserId] = pc;
      polite.current[targetUserId] = sessionUserId > targetUserId;
      console.log(`🏗️ PC Created: ${targetUserId} | Initiator: ${initiator}`);

      // 2. Add Local Tracks
      if (localStream) {
        const existingKinds = pc.getSenders().map((s) => s.track?.kind);

        localStream.getTracks().forEach((track: any) => {
          if (!existingKinds.includes(track.kind)) {
            pc.addTrack(track, localStream);
          }
        });
      }

      // 3. Handle Incoming Tracks
      pc.ontrack = (event) => {
        console.log(`🔥 TRACK RECEIVED from ${targetUserId}`);
        const stream = event.streams[0];
        setRemoteStreams((prev) => ({ ...prev, [targetUserId]: stream }));
      };

      // 4. ICE Candidates
      pc.onicecandidate = (event) => {
        if (event.candidate && socket) {
          socket.emit("signal", {
            to: targetUserId,
            candidate: event.candidate,
            meetingCode: meeting.meeting?.meetingCode,
          });
        }
      };

      // 5. Negotiation Logic
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
            console.log(`📤 Offer sent to ${targetUserId}`);
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
    socket.on("existing-users", (users: string[]) => {
      console.log("👥 Existing users:", users);
      users.forEach((userId) => {
        createPeer(userId, true); // 🔥 ALWAYS INITIATE
      });
    });
    socket.on("user-joined", ({ userId }) => {
      if (userId === sessionUserId) return;

      // cleanup old
      if (peers.current[userId]) {
        peers.current[userId].close();
        delete peers.current[userId];
      }

      // 🔥 ALWAYS INITIATE
      createPeer(userId, true);
    });

    socket.on("signal", async ({ from, offer, answer, candidate }) => {
      let pc = peers.current[from];

      // If we get a signal but have no PC, create one as a receiver (initiator: false)
      if (!pc) {
        console.log(`📡 New signal from ${from}, creating receiver PC`);
        pc = createPeer(from, false);
      }
      const isPolite = polite.current[from];
      try {
        if (offer) {
          const offerCollision =
            isMakingOffer.current[from] || pc.signalingState !== "stable";

          if (offerCollision && !isPolite) {
            console.log("🚫 Ignoring offer (collision)");
            return;
          }

          console.log(`📥 Offer received from ${from}`);
          await pc.setRemoteDescription(new RTCSessionDescription(offer));
          const ans = await pc.createAnswer();
          await pc.setLocalDescription(ans);
          socket.emit("signal", {
            to: from,
            answer: ans,
            meetingCode: meeting.meeting?.meetingCode,
          });
        } else if (answer) {
          console.log(`📥 Answer received from ${from}`);
          await pc.setRemoteDescription(new RTCSessionDescription(answer));
        } else if (candidate) {
          await pc.addIceCandidate(new RTCIceCandidate(candidate));
        }
      } catch (err) {
        console.error("Signal Error:", err);
      }
    });

    socket.on("user-left", ({ userId }) => {
      console.log(`🏃 User Left: ${userId}`);
      processedUsers.current.delete(userId);
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

  return { remoteStreams, replaceTracks };
};
function useMediaStore(): { localStream: any } {
  throw new Error("Function not implemented.");
}
