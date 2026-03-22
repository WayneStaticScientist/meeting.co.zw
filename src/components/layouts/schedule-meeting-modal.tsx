import { ModalWrapper } from "./modal";
import { Calendar, Check, Clock, Plus, Search, X } from "lucide-react";

export default function ScheduleMeetingModal({
  closeModal,
}: {
  closeModal: () => void;
}) {
  return (
    <ModalWrapper onClose={closeModal}>
      <div className="relative w-full max-w-4xl bg-white dark:bg-zinc-900 rounded-[3rem] shadow-2xl border border-zinc-200 dark:border-zinc-800 flex flex-col md:flex-row overflow-hidden animate-in slide-in-from-bottom-20 duration-500 h-[90vh]">
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
                type="text"
                placeholder="Design Review..."
                className="w-full bg-zinc-50 dark:bg-zinc-800 border-2 border-zinc-100 dark:border-zinc-700 rounded-2xl p-4 font-bold outline-none focus:border-emerald-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="text-xs font-black uppercase tracking-widest text-zinc-400">
                  Date
                </label>
                <div className="relative">
                  <Calendar
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
                    size={18}
                  />
                  <input
                    type="date"
                    className="w-full bg-zinc-50 dark:bg-zinc-800 border-2 border-zinc-100 dark:border-zinc-700 rounded-2xl p-4 pl-12 font-bold outline-none"
                  />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-xs font-black uppercase tracking-widest text-zinc-400">
                  Time
                </label>
                <div className="relative">
                  <Clock
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
                    size={18}
                  />
                  <input
                    type="time"
                    className="w-full bg-zinc-50 dark:bg-zinc-800 border-2 border-zinc-100 dark:border-zinc-700 rounded-2xl p-4 pl-12 font-bold outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-widest text-zinc-400">
                Duration
              </label>
              <div className="flex gap-3">
                {["15m", "30m", "1h", "2h"].map((d) => (
                  <button
                    key={d}
                    className={`flex-1 py-3 rounded-xl text-xs font-black border-2 transition-all ${d === "1h" ? "bg-emerald-600 border-emerald-600 text-white" : "bg-zinc-50 dark:bg-zinc-800 border-transparent text-zinc-400 hover:border-zinc-200"}`}
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
          <h3 className="text-lg font-black mb-6">Invite Guests</h3>
          <div className="relative mb-6">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
              size={16}
            />
            <input
              type="text"
              placeholder="Name or email"
              className="w-full bg-white dark:bg-zinc-900 border-none rounded-xl py-2.5 pl-10 text-xs font-medium"
            />
          </div>

          <div className="flex-1 space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-zinc-200 overflow-hidden">
                    <img src={`https://i.pravatar.cc/100?u=${i}`} alt="user" />
                  </div>
                  <p className="text-xs font-bold">User {i}</p>
                </div>
                <button className="p-1.5 text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                  <Plus size={14} />
                </button>
              </div>
            ))}
          </div>

          <button
            onClick={closeModal}
            className="w-full bg-zinc-900 dark:bg-white dark:text-zinc-900 text-white font-black py-4 rounded-2xl mt-8 shadow-xl shadow-zinc-900/20 flex items-center justify-center gap-2"
          >
            Confirm Event
            <Check size={18} />
          </button>
        </div>
      </div>
    </ModalWrapper>
  );
}
