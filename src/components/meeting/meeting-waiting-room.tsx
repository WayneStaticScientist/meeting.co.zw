import ZLoader from "../displays/z-loader";
import { Participant } from "@/types/participant";
import { useSessionState } from "@/stores/session-store";
import { useMeetingStore } from "@/stores/meeting-store";
import { Check, Mic, MicOff, UserMinus, X } from "lucide-react";
import { useWaitingListStore } from "@/stores/waiting-list-store";

export default function MeetingWaitingRoom() {
  const waiters = useWaitingListStore();
  const sessionStore = useSessionState();
  const meetingStore = useMeetingStore();
  async function admitUser(w: Participant) {
    const result = await meetingStore.admitParticipant(w);
    if (result) {
      waiters.removeWaiter(w.userId);
    }
  }
  function declineUser(id: any): void {}

  function removeParticipant(id: any): void {}
  const waitersFromStore =
    meetingStore.meeting?.participants.filter((e) => e.status == "pending") ??
    [];
  return (
    <div className="space-y-6">
      {sessionStore._id == meetingStore.meeting?.host &&
        (waiters.waiters.length || waitersFromStore.length > 0) && (
          <div>
            <h3 className="text-[10px] font-black uppercase text-zinc-500 tracking-widest mb-3">
              Waiting Room
            </h3>
            {[...waiters.waiters, ...waitersFromStore].map((w: Participant) => (
              <div
                key={w.userId}
                className="flex items-center justify-between bg-black/20 p-2 rounded-lg border border-white/5 mb-2"
              >
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-green-400 flex items-center justify-center text-[10px] font-bold text-white">
                    {w.displayName[0].toUpperCase()}
                  </div>
                  <span className="text-xs font-bold">{w.displayName}</span>
                </div>
                <div className="flex gap-1">
                  {meetingStore.currentAdmissionId == w.userId ? (
                    <ZLoader />
                  ) : (
                    <>
                      <button
                        onClick={() => admitUser(w)}
                        className="p-1 bg-emerald-600 rounded text-white"
                      >
                        <Check size={12} />
                      </button>
                      <button
                        onClick={() => declineUser(w.userId)}
                        className="p-1 bg-zinc-800 rounded text-zinc-400"
                      >
                        <X size={12} />
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      <div>
        <h3 className="text-[10px] font-black uppercase text-zinc-500 tracking-widest mb-3">
          In Meeting
        </h3>
        {meetingStore
          .meeting!.participants.filter((e) => e.status === "accepted")
          .map((p: Participant) => (
            <div
              key={p.userId}
              className="flex items-center justify-between py-2 group"
            >
              <div className="flex items-center gap-2">
                {p.userId == sessionStore._id ? (
                  <div className="w-7 h-7 bg-emerald-600 rounded-full flex items-center justify-center text-[10px] font-bold">
                    A
                  </div>
                ) : (
                  <div className="w-7 h-7 rounded-full bg-green-400 flex items-center justify-center text-[10px] font-bold text-white">
                    {p.displayName[0].toUpperCase()}
                  </div>
                )}
                <span className="text-xs font-medium">
                  {p.displayName} {p.userId == sessionStore._id && "(Me)"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {p.isMuted ? (
                  <MicOff size={14} className="text-red-500" />
                ) : (
                  <Mic size={14} className="text-emerald-500" />
                )}
                {!(p.userId == sessionStore._id) && (
                  <button
                    onClick={() => removeParticipant(p)}
                    className="opacity-0 group-hover:opacity-100 text-zinc-600 hover:text-red-500 transition-all"
                  >
                    <UserMinus size={14} />
                  </button>
                )}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
