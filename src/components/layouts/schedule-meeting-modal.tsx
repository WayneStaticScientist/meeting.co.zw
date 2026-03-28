"use client";
import { ModalWrapper } from "./modal";
import { useCreateRoom } from "@/hooks/create-room-hook";
import { Calendar, Check, Globe, X, Lock } from "lucide-react";
import { useState } from "react";
import ZLoader from "../displays/z-loader";

export default function ScheduleMeetingModal({
  closeModal,
}: {
  closeModal: () => void;
}) {
  const room = useCreateRoom();
  const [roomName, setRoomName] = useState("");
  return (
    <ModalWrapper onClose={closeModal}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          room.scheduleRoom(roomName);
        }}
        className="relative w-full max-w-4xl bg-white dark:bg-zinc-900 rounded-[3rem] shadow-2xl border border-zinc-200 dark:border-zinc-800 flex flex-col md:flex-row overflow-hidden animate-in slide-in-from-bottom-20 duration-500 h-[90vh]"
      >
        <button
          onClick={closeModal}
          className="absolute top-6 right-6 p-2 bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-700 dark:hover:bg-zinc-600 text-zinc-600 dark:text-zinc-300 rounded-full transition-colors z-20"
        >
          <X size={20} />
        </button>
        {/* Left: Settings */}
        <div className="flex-1 p-8 md:p-12 overflow-y-auto">
          <h2 className="text-3xl font-black mb-10">Schedule Event</h2>

          <div className="space-y-8">
            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-widest text-zinc-400">
                Meeting Title
              </label>
              <input
                required
                type="text"
                value={roomName}
                placeholder="Design Review..."
                onChange={(e) => setRoomName(e.target.value)}
                className="w-full bg-zinc-50 dark:bg-zinc-800 border-2 border-zinc-100 dark:border-zinc-700 rounded-2xl p-4 font-bold outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex">
              <div className="space-y-3 w-full">
                <label className="text-xs font-black uppercase tracking-widest text-zinc-400">
                  Date And Time
                </label>
                <div className="relative w-full">
                  <Calendar
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
                    size={18}
                  />
                  <input
                    required
                    type="datetime-local"
                    className="w-full bg-zinc-50 dark:bg-zinc-800 border-2 border-zinc-100 dark:border-zinc-700 rounded-2xl p-4 pl-12 font-bold outline-none"
                    onChange={(e) => {
                      const localDate = new Date(e.target.value);
                      room.setMeetingDate(localDate.toISOString());
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-widest text-zinc-400">
                Duration
              </label>
              <div className="flex gap-3">
                {["15m", "30m", "1h", "2h", "2h+"].map((d) => (
                  <button
                    key={d}
                    onClick={(e) => {
                      e.preventDefault();
                      room.setDuration(d);
                    }}
                    className={`flex-1 py-3 rounded-xl text-xs font-black border-2 transition-all ${d === room.duration ? "bg-emerald-600 border-emerald-600 text-white" : "bg-zinc-50 dark:bg-zinc-800 border-transparent text-zinc-400 hover:border-zinc-200"}`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Guest List */}
        <div className="w-full md:w-80 bg-zinc-50 dark:bg-zinc-800/50 p-8 pt-16 md:pt-8 border-l border-zinc-100 dark:border-zinc-800 flex flex-col relative">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  room?.setIsPublic(false);
                }}
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
                onClick={(e) => {
                  e.preventDefault();
                  room?.setIsPublic(true);
                }}
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
          <button className="w-full bg-zinc-900 dark:bg-white dark:text-zinc-900 text-white font-black py-4 rounded-2xl mt-8 shadow-xl shadow-zinc-900/20 flex items-center justify-center gap-2">
            {room.loading ? <ZLoader /> : "Confirm Event"}
            <Check size={18} />
          </button>
        </div>
      </form>
    </ModalWrapper>
  );
}
