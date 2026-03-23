"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { socket } from "@/lib/socket";

const SocketContext = createContext({
  socket: socket,
  isConnected: false,
});

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    // 1. Guard against multiple connection attempts
    if (socket.connected) {
      setIsConnected(true);
    }

    function onConnect() {
      console.log("🚀 Socket connected:", socket.id);
      setIsConnected(true);
    }

    function onDisconnect() {
      console.log("🔌 Socket disconnected");
      setIsConnected(false);
    }

    // 2. Listen for built-in events
    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    // 3. Manual connect (only if not already connecting/connected)
    if (!socket.connected) {
      socket.connect();
    }

    return () => {
      // 4. Cleanup is crucial to prevent "Transition was skipped" errors
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);

      // OPTIONAL: In a single-page app, you might NOT want to disconnect
      // globally on every small unmount, but for a meeting app,
      // it's safer to keep it unless you're navigating between meeting pages.
      // socket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
