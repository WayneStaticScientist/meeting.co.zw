import { useEffect, useRef, useState } from "react";
import { useSocket } from "@/providers/socket-provider";

export const useRTCHandler = (
  localStream: MediaStream | null,
  sessionUserId: string,
) => {
  const { socket } = useSocket();
  const [remoteStreams, setRemoteStreams] = useState<{
    [userId: string]: MediaStream;
  }>({});
  const peers = useRef<{ [userId: string]: RTCPeerConnection }>({});

  const iceConfig = {
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
  };

  // Helper to create a connection
  const createPeer = (targetUserId: string, initiator: boolean) => {
    const pc = new RTCPeerConnection(iceConfig);
    peers.current[targetUserId] = pc;

    // Add local tracks so the other person can see YOU
    localStream
      ?.getTracks()
      .forEach((track) => pc.addTrack(track, localStream));

    // Receive remote tracks so YOU can see them
    pc.ontrack = (event) => {
      setRemoteStreams((prev) => ({
        ...prev,
        [targetUserId]: event.streams[0],
      }));
    };

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("signal", { to: targetUserId, candidate: event.candidate });
      }
    };

    // If we are the initiator, we create the offer
    if (initiator) {
      pc.onnegotiationneeded = async () => {
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        socket.emit("signal", { to: targetUserId, offer });
      };
    }

    return pc;
  };

  useEffect(() => {
    if (!socket || !localStream) return;

    // 1. Listen for new users
    socket.on("user-joined", ({ userId }) => {
      if (userId === sessionUserId) return;
      console.log("User joined, initiating call to:", userId);
      createPeer(userId, true); // We initiate the call
    });

    // 2. Handle incoming signals (Offer, Answer, Candidates)
    socket.on("signal", async ({ from, offer, answer, candidate }) => {
      let pc = peers.current[from];

      // If no PC exists for this user yet, create one (Non-initiator)
      if (!pc) pc = createPeer(from, false);

      try {
        if (offer) {
          await pc.setRemoteDescription(new RTCSessionDescription(offer));
          const ans = await pc.createAnswer();
          await pc.setLocalDescription(ans);
          socket.emit("signal", { to: from, answer: ans });
        } else if (answer) {
          await pc.setRemoteDescription(new RTCSessionDescription(answer));
        } else if (candidate) {
          await pc.addIceCandidate(new RTCIceCandidate(candidate));
        }
      } catch (e) {
        console.log(e);
      }
    });

    // 3. Cleanup on leave
    socket.on("user-left", ({ userId }) => {
      if (peers.current[userId]) {
        peers.current[userId].close();
        delete peers.current[userId];
        setRemoteStreams((prev) => {
          const newStreams = { ...prev };
          delete newStreams[userId];
          return newStreams;
        });
      }
    });

    return () => {
      socket.off("user-joined");
      socket.off("signal");
      socket.off("user-left");
    };
  }, [socket, localStream]);

  return { remoteStreams };
};
