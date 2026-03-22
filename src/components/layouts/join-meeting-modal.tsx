import { useState } from "react";
import { ModalWrapper } from "./modal";
import { X, Link, ShieldCheck, ChevronRight, Hash } from "lucide-react";

export default function JoinMeetingModal({
  closeModal,
}: {
  closeModal: () => void;
}) {
  const [meetingId, setMeetingId] = useState("");

  return (
    <ModalWrapper onClose={closeModal}>
      <div className="relative w-full max-w-lg bg-white dark:bg-zinc-900 rounded-[3rem] shadow-2xl border border-zinc-200 dark:border-zinc-800 p-8 md:p-12 animate-in zoom-in-95 duration-300">
        <button
          onClick={closeModal}
          className="absolute top-6 right-6 p-2 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-500 rounded-full transition-colors z-10"
        >
          <X size={20} />
        </button>
        <div className="text-center space-y-4 mb-10">
          <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/10">
            <Hash size={32} />
          </div>
          <h2 className="text-3xl font-black tracking-tight">Join Meeting</h2>
          <p className="text-zinc-500 font-medium">
            Enter the meeting ID or link to join the session
          </p>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">
              Meeting Identifier
            </label>
            <div className="relative">
              <Link
                className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
                size={18}
              />
              <input
                type="text"
                placeholder="ABC-DEFG-HIJ"
                onChange={(e) => setMeetingId(e.target.value)}
                className="w-full bg-zinc-100 dark:bg-zinc-800 border-2 border-transparent focus:border-emerald-500 rounded-2xl py-4 pl-12 pr-4 outline-none font-bold text-center tracking-widest uppercase"
              />
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl">
            <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-white">
              <ShieldCheck size={20} />
            </div>
            <p className="text-xs font-bold text-zinc-500">
              Encrypted end-to-end meeting
            </p>
          </div>

          <button
            onClick={() => {
              if (window) {
                window.location.href = `/meeting/${meetingId}`;
              }
            }}
            disabled={!meetingId}
            className="w-full bg-emerald-600 disabled:opacity-50 text-white font-black py-5 rounded-[1.5rem] flex items-center justify-center gap-3 shadow-xl shadow-emerald-600/20 active:scale-95 transition-all"
          >
            Connect to Room
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </ModalWrapper>
  );
}
