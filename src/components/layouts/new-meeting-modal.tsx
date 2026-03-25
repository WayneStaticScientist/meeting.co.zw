"use client";
import React, { useState } from "react";
import { Camera, CameraOff, Mic, X, Lock, Globe } from "lucide-react";
import { useCreateRoom } from "@/hooks/create-room-hook";

/**
 * UPDATED COMPONENT:
 * 1. Removed 'overflow-hidden' from the main wrapper to allow scrolling.
 * 2. Added 'overflow-y-auto' and 'max-h-full' to ensure content is reachable on small screens.
 * 3. Adjusted padding and layout for better mobile stacking.
 */

export default function NewMeetingModal({
  closeModal,
}: {
  closeModal: () => void;
}) {
  const [isMicOn, setIsMicOn] = useState(true);
  const [roomName, setRoomName] = useState("");
  const [isCameraOn, setIsCameraOn] = useState(true);

  // Fallback for the hook if not passed via props in your environment
  const room = useCreateRoom();

  return (
    /* ModalWrapper should ideally handle the backdrop. 
       Ensure ModalWrapper has: display: flex, justify-content: center, align-items: center, padding: 1rem 
    */
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-white dark:bg-zinc-900 rounded-[2rem] md:rounded-[3rem] shadow-2xl border border-zinc-200 dark:border-zinc-800 flex flex-col lg:flex-row animate-in zoom-in-95 duration-300 my-auto">
        {/* Close Button */}
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 md:top-6 md:right-6 p-2 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-500 rounded-full transition-colors z-20"
        >
          <X size={20} />
        </button>

        {/* Left Side: Preview (Camera/Mic) */}
        <div className="w-full lg:w-[55%] p-6 md:p-10 flex flex-col bg-zinc-50 dark:bg-zinc-800/30 rounded-t-[2rem] lg:rounded-t-none lg:rounded-l-[3rem]">
          <h2 className="text-xl md:text-2xl font-black tracking-tight mb-4">
            Setup Room
          </h2>
          <div className="relative aspect-video rounded-2xl md:rounded-3xl bg-zinc-900 overflow-hidden shadow-2xl">
            {isCameraOn ? (
              <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
                {/* Placeholder for /zanu.jpg */}
                <img
                  src="/zanu.jpg"
                  className="w-full h-full object-cover opacity-80"
                  alt="Preview"
                />
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-zinc-500">
                <CameraOff size={40} />
              </div>
            )}

            {/* Media Controls */}
            <div className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 flex gap-3 md:gap-4">
              <button
                onClick={() => setIsMicOn(!isMicOn)}
                className={`w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center transition-all ${
                  isMicOn
                    ? "bg-white/20 text-white backdrop-blur-md"
                    : "bg-red-500 text-white"
                }`}
              >
                <Mic size={20} />
              </button>
              <button
                onClick={() => setIsCameraOn(!isCameraOn)}
                className={`w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center transition-all ${
                  isCameraOn
                    ? "bg-white/20 text-white backdrop-blur-md"
                    : "bg-red-500 text-white"
                }`}
              >
                <Camera size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Details & Actions */}
        <div className="flex-1 p-6 md:p-10 flex flex-col justify-between">
          <div className="space-y-6 md:space-y-8">
            <h3 className="text-2xl md:text-3xl font-black">Meeting Details</h3>

            <input
              type="text"
              placeholder="Room Name"
              className="w-full bg-zinc-100 dark:bg-zinc-800 border-2 border-transparent focus:border-emerald-500 outline-none rounded-2xl p-4 font-bold transition-all  "
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
            />

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => room?.setIsPublic(false)}
                  className={`flex items-center gap-3 p-3 md:p-4 rounded-2xl md:rounded-3xl border-2 transition-all ${
                    !room?.isPublic
                      ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10"
                      : "border-zinc-100 dark:border-zinc-800 bg-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  <div
                    className={`p-2 rounded-xl ${!room?.isPublic ? "bg-emerald-500 text-white" : "bg-zinc-200 dark:bg-zinc-700 text-zinc-500"}`}
                  >
                    <Lock size={18} />
                  </div>
                  <div className="text-left">
                    <p
                      className={`text-sm font-black ${!room?.isPublic ? "text-emerald-900 dark:text-emerald-100" : "text-zinc-500"}`}
                    >
                      Private
                    </p>
                  </div>
                </button>

                <button
                  onClick={() => room?.setIsPublic(true)}
                  className={`flex items-center gap-3 p-3 md:p-4 rounded-2xl md:rounded-3xl border-2 transition-all ${
                    room?.isPublic
                      ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10"
                      : "border-zinc-100 dark:border-zinc-800 bg-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  <div
                    className={`p-2 rounded-xl ${room?.isPublic ? "bg-emerald-500 text-white" : "bg-zinc-200 dark:bg-zinc-700 text-zinc-500"}`}
                  >
                    <Globe size={18} />
                  </div>
                  <div className="text-left">
                    <p
                      className={`text-sm font-black ${room?.isPublic ? "text-emerald-900 dark:text-emerald-100" : "text-zinc-500"}`}
                    >
                      Public
                    </p>
                  </div>
                </button>
              </div>

              {/* Status Notice */}
              <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/30 border border-dashed border-zinc-200 dark:border-zinc-700">
                <div className="flex gap-3">
                  <p className="text-xs text-zinc-500 leading-relaxed font-medium">
                    <span className="font-black text-zinc-700 dark:text-zinc-200 mr-1 italic">
                      {room?.isPublic ? "Public Meeting:" : "Private Meeting:"}
                    </span>
                    {room?.isPublic
                      ? "Meeting will be available to anyone (registered) on the dashboard, searchable and listable."
                      : "You have to share the meeting link; otherwise, it's not visible on the dashboard."}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => room?.createRoom(roomName.trim(), room.isPublic)}
            disabled={room?.loading || !roomName.trim()}
            className="w-full bg-emerald-600 text-white font-black py-4 md:py-5 rounded-[1.25rem] md:rounded-[1.5rem] mt-8 md:mt-10 hover:bg-emerald-700 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {room?.loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              "Create Room"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
