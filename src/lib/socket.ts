"use client";
import { io, Socket } from "socket.io-client";

// Your Bun + Fastify server URL
const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL;

export const socket: Socket = io(SOCKET_URL, {
  autoConnect: false,
  reconnection: true,
  transports: ["websocket"],
});
