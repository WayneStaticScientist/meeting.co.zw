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
  useEffect(() => {
    if (!localStream) return;

    console.log("🎥 Local stream ready, adding tracks + renegotiating");

    Object.entries(peers.current).forEach(async ([userId, pc]) => {
      const senders = pc.getSenders();

      let added = false;

      localStream.getTracks().forEach((track) => {
        const exists = senders.find(
          (s) => s.track && s.track.kind === track.kind,
        );

        if (!exists) {
          console.log(`➕ Adding ${track.kind} to ${userId}`);
          pc.addTrack(track, localStream);
          added = true;
        }
      });

      // 🔥 THIS IS THE FIX
      if (added) {
        try {
          console.log(`🔄 Forcing renegotiation with ${userId}`);

          const offer = await pc.createOffer();
          await pc.setLocalDescription(offer);

          socket.emit("signal", {
            to: userId,
            offer: pc.localDescription,
            meetingCode: meeting.meeting?.meetingCode,
          });
        } catch (err) {
          console.error("Renegotiation error:", err);
        }
      }
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
        localStream
          .getTracks()
          .forEach((track) => pc.addTrack(track, localStream));
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

  return { remoteStreams };
};
