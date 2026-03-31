import ZLoader from "../displays/z-loader";
import { Participant } from "@/types/participant";
import { useSessionState } from "@/stores/session-store";
import { useMeetingStore } from "@/stores/meeting-store";
import { Check, Mic, MicOff, Sparkles, UserMinus, X } from "lucide-react";
import { useWaitingListStore } from "@/stores/waiting-list-store";
import {
  TrackReferenceOrPlaceholder,
  useTracks,
} from "@livekit/components-react";
import { Track } from "livekit-client";
import { Button, Modal } from "@heroui/react";

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
  const tracks = useTracks([
    { source: Track.Source.Microphone, withPlaceholder: true },
  ]);
  function declineUser(id: any): void {}

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
        {tracks.map((p: TrackReferenceOrPlaceholder) => (
          <div
            key={p.participant?.identity}
            className="flex items-center justify-between py-2 group"
          >
            <div className="flex items-center gap-2">
              {p.participant?.identity == sessionStore._id ? (
                <div className="w-7 h-7 bg-emerald-600 rounded-full flex items-center justify-center text-[10px] font-bold">
                  A
                </div>
              ) : (
                <div className="w-7 h-7 rounded-full bg-green-400 flex items-center justify-center text-[10px] font-bold text-white">
                  {p.participant?.name?.charAt(0)?.toUpperCase() ?? ""}
                </div>
              )}
              <span className="text-xs font-medium">
                {p.participant?.name}
                {p.participant?.identity == sessionStore._id && "(Me)"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                isIconOnly
                onPress={() => {
                  if (sessionStore._id != meetingStore.meeting?.host) return;
                  meetingStore.sendMeetingCommand(
                    p.publication?.isMuted ? "unmute" : "mute",
                    p.participant?.identity,
                  );
                }}
                variant="ghost"
                className="group-hover:opacity-100 text-white transition-all outline-green-400!"
              >
                {p.publication?.isMuted ? (
                  <MicOff size={14} className="text-red-500" />
                ) : (
                  <Mic size={14} className="text-emerald-500" />
                )}
              </Button>
              {!(p.participant?.identity == sessionStore._id) &&
                sessionStore._id == meetingStore.meeting?.host && (
                  <Modal>
                    <Button
                      isIconOnly
                      variant="ghost"
                      className=" group-hover:opacity-100 text-white transition-all"
                    >
                      <UserMinus size={14} />
                    </Button>
                    <Modal.Backdrop>
                      <Modal.Container>
                        <Modal.Dialog>
                          <Modal.CloseTrigger />
                          <Modal.Header className="items-center text-center">
                            <Modal.Icon className="bg-accent-soft text-accent-soft-foreground">
                              <Sparkles className="size-5" />
                            </Modal.Icon>
                            <Modal.Heading className="text-black">
                              Remove Participant
                            </Modal.Heading>
                          </Modal.Header>
                          <Modal.Body>
                            <p>
                              Are you sure you want to remove{" "}
                              <span className="font-bold">
                                {p.participant?.name}
                              </span>{" "}
                              from the meeting?
                            </p>
                          </Modal.Body>
                          <Modal.Footer>
                            <Button className="w-full" slot="close">
                              Close
                            </Button>
                            <Button
                              onPress={() => {
                                meetingStore.sendMeetingCommand(
                                  "remove",
                                  p.participant?.identity,
                                );
                              }}
                              className="w-full"
                              slot="close"
                              variant="danger"
                            >
                              Remove
                            </Button>
                          </Modal.Footer>
                        </Modal.Dialog>
                      </Modal.Container>
                    </Modal.Backdrop>
                  </Modal>
                )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
