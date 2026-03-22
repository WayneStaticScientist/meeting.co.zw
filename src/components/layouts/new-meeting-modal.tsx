"use client";
import React, { useState } from "react";
import { ModalWrapper } from "./modal";
import { Camera, CameraOff, Mic, X } from "lucide-react";
import { useCreateRoom } from "@/hooks/create-room-hook";
import ZLoader from "../displays/z-loader";
import { Button } from "@heroui/react";

export default function NewMeetingModal({
  closeModal,
}: {
  closeModal: () => void;
}) {
  const room = useCreateRoom();
  const [isMicOn, setIsMicOn] = useState(true);
  const [roomName, setRoomName] = useState("");
  const [isCameraOn, setIsCameraOn] = useState(true);
  return (
    <ModalWrapper onClose={closeModal}>
      <div className="relative w-full max-w-5xl bg-white dark:bg-zinc-900 rounded-[3rem] shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden flex flex-col lg:flex-row animate-in zoom-in-95 slide-in-from-bottom-10 duration-500 max-h-[90vh]">
        <button
          onClick={closeModal}
          className="absolute top-6 right-6 p-2 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-500 rounded-full transition-colors z-10"
        >
          <X size={20} />
        </button>
        <div className="lg:w-[55%] p-6 md:p-10 flex flex-col bg-zinc-50 dark:bg-zinc-800/30">
          <h2 className="text-2xl font-black tracking-tight mb-2">
            Setup Room
          </h2>
          <div className="relative aspect-video rounded-3xl bg-zinc-900 overflow-hidden shadow-2xl">
            {isCameraOn ? (
              <img
                className="w-full h-full object-cover opacity-80"
                alt="Preview"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-zinc-500">
                <CameraOff size={40} />
              </div>
            )}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-4">
              <button
                onClick={() => setIsMicOn(!isMicOn)}
                className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isMicOn ? "bg-white/20" : "bg-red-500"}`}
              >
                <Mic size={20} />
              </button>
              <button
                onClick={() => setIsCameraOn(!isCameraOn)}
                className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isCameraOn ? "bg-white/20" : "bg-red-500"}`}
              >
                <Camera size={20} />
              </button>
            </div>
          </div>
        </div>
        <div className="flex-1 p-10 flex flex-col justify-between pt-16 lg:pt-10">
          <div>
            <h3 className="text-3xl font-black mb-8">Meeting Details</h3>
            <input
              type="text"
              placeholder="Room Name"
              className="w-full bg-zinc-100 dark:bg-zinc-800 border-none rounded-2xl p-4 font-bold"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
            />
          </div>
          <Button
            onClick={() => {
              room.createRoom(roomName.trim());
            }}
            className="w-full bg-emerald-600 text-white font-black py-5 rounded-[1.5rem] mt-10 hover:bg-emerald-700 transition-all"
          >
            {room.loading ? <ZLoader /> : "Create Room"}
          </Button>
        </div>
      </div>
    </ModalWrapper>
  );
}
