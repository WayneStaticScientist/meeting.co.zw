"use client";
import {
  Calendar,
  Clock,
  Users,
  Video,
  ChevronRight,
  ShieldCheck,
  Lock,
  AlertCircle,
} from "lucide-react";
import ZLoader from "../displays/z-loader";
import { useMeetingStore } from "@/stores/meeting-store";
import { useSessionState } from "@/stores/session-store";

// Types derived from your interface

const MeetingLobby = () => {
  // Mock data based on your interface
  const meeting = useMeetingStore();
  const session = useSessionState();

  // Format the date/time
  const eventDate = new Date(meeting.meeting!.scheduleTime!);
  const formattedTime = eventDate.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  const formattedDate = eventDate.toLocaleDateString([], {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  // Color Mapping Helper
  const getStatusColor = () => {
    switch (meeting.meeting!.status) {
      case "Active":
        return "text-emerald-400";
      case "Scheduled":
        return "text-amber-400";
      case "Ended":
        return "text-rose-500";
      default:
        return "text-emerald-400";
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col items-center justify-center p-6 font-sans">
      {/* Background Decorative Elements - Theme Colors */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[45%] h-[45%] bg-emerald-900/20 blur-[130px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[45%] h-[45%] bg-amber-900/10 blur-[130px] rounded-full" />
        <div className="absolute top-[20%] right-[-5%] w-[30%] h-[30%] bg-rose-900/10 blur-[120px] rounded-full opacity-50" />
      </div>

      <main className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
        {/* Left Side: Visual State & Animation */}
        <div className="flex flex-col items-center justify-center space-y-10">
          <div className="relative flex items-center justify-center">
            {/* Animated Rings for Waiting State - Primary Green */}
            {meeting.meeting!.status === "Waiting" && (
              <>
                <div className="absolute w-48 h-48 border border-emerald-500/30 rounded-full animate-[ping_3s_linear_infinite]" />
                <div className="absolute w-64 h-64 border border-emerald-400/20 rounded-full animate-[ping_3s_linear_infinite_1s]" />
                <div className="absolute w-80 h-80 border border-emerald-300/10 rounded-full animate-[ping_3s_linear_infinite_2s]" />
              </>
            )}

            {/* Core Visual Box */}
            <div className="relative w-44 h-44 bg-neutral-900 border border-emerald-900/30 rounded-[2.5rem] shadow-2xl flex items-center justify-center overflow-hidden group">
              <div className="absolute inset-0 bg-linear-to-br from-emerald-600/10 via-transparent to-amber-600/5" />

              {meeting.meeting!.status === "Waiting" ||
              meeting.meeting!.status === "Scheduled" ? (
                <div className="flex flex-col items-center space-y-3 animate-pulse">
                  <div className="p-4 bg-emerald-500/10 rounded-2xl">
                    <Video className="w-14 h-14 text-emerald-400" />
                  </div>
                  <span className="text-[10px] uppercase tracking-[0.3em] text-emerald-500/70 font-black">
                    Lobby
                  </span>
                </div>
              ) : meeting.meeting!.status === "Ended" ? (
                <div className="text-rose-500 flex flex-col items-center space-y-2">
                  <AlertCircle className="w-14 h-14" />
                  <span className="text-[10px] uppercase font-black tracking-widest text-rose-500/70">
                    Closed
                  </span>
                </div>
              ) : (
                <div className="text-emerald-400">
                  <ShieldCheck className="w-14 h-14" />
                </div>
              )}
            </div>
          </div>

          <div className="text-center space-y-4">
            <h2
              className={`text-3xl font-bold tracking-tight ${getStatusColor()}`}
            >
              {meeting.meeting!.status === "Waiting"
                ? "Waiting for Entrance..."
                : meeting.meeting!.status === "Scheduled"
                  ? "Scheduled Session"
                  : meeting.meeting!.status === "Ended"
                    ? "Meeting Concluded"
                    : "Live Session"}
            </h2>
            <p className="text-neutral-400 max-w-xs mx-auto text-sm leading-relaxed font-medium">
              {meeting.meeting!.status === "Waiting" &&
                "The host is reviewing participants. Sit tight, you'll be admitted momentarily."}
              {meeting.meeting!.status === "Scheduled" &&
                `This session is locked until ${formattedTime}. Please return shortly.`}
              {meeting.meeting!.status === "Ended" &&
                "This meeting room is no longer active. Contact support for recordings."}
            </p>
          </div>
        </div>

        {/* Right Side: Meeting Details Card */}
        <div className="bg-neutral-900/40 backdrop-blur-2xl border border-neutral-800 p-8 rounded-[2rem] shadow-2xl ring-1 ring-white/5 space-y-8">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2">
              <span
                className={`w-2.5 h-2.5 rounded-full animate-pulse ${meeting.meeting!.status === "Scheduled" ? "bg-amber-400" : "bg-emerald-500"}`}
              />
              <span>{meeting.meeting!.status}</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight leading-tight">
              {meeting.meeting!.roomName}
            </h1>
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded text-[10px] font-bold uppercase">
                ID
              </span>
              <p className="text-neutral-500 font-mono text-xs tracking-wider">
                {meeting.meeting!.meetingCode}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-emerald-500/5 rounded-2xl border border-emerald-500/10 flex items-center space-x-3 group hover:border-emerald-500/30 transition-colors">
              <div className="p-2 bg-emerald-500/10 rounded-xl">
                <Calendar className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] text-neutral-500 uppercase font-black">
                  Date
                </span>
                <span className="text-sm font-semibold">{formattedDate}</span>
              </div>
            </div>
            <div className="p-4 bg-amber-500/5 rounded-2xl border border-amber-500/10 flex items-center space-x-3 group hover:border-amber-500/30 transition-colors">
              <div className="p-2 bg-amber-500/10 rounded-xl">
                <Clock className="w-5 h-5 text-amber-400" />
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] text-neutral-500 uppercase font-black">
                  Time
                </span>
                <span className="text-sm font-semibold">{formattedTime}</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between text-[11px] uppercase font-bold tracking-wider">
              <span className="text-neutral-400 flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-500" />
                Waitlist ({meeting.meeting!.participants.length})
              </span>
              <span className="text-emerald-500/70">
                Host: {meeting.meeting!.participants[0]?.displayName}
              </span>
            </div>

            <div className="flex -space-x-2.5 overflow-hidden items-center gap-2">
              <div className="inline-flex h-11 w-11 rounded-full ring-4 ring-neutral-900 bg-neutral-800 items-center justify-center text-[10px] font-black text-amber-500 border border-amber-500/20">
                {meeting.meeting?.participants.length}
              </div>
              Participants
            </div>
          </div>

          <div className="pt-2">
            {!meeting.meeting?.participants.find(
              (e) => e.userId == session._id,
            ) && (
              <button
                onClick={() => {
                  meeting.requestToJoinScheduledMeeting(session._id);
                }}
                disabled={meeting.meeting!.status === "Ended"}
                className={`group w-full font-black py-4.5 px-6 rounded-2xl transition-all duration-300 flex items-center justify-center space-x-2 shadow-xl active:scale-[0.97]
                  ${
                    meeting.meeting!.status === "Ended"
                      ? "bg-neutral-800 text-neutral-600 cursor-not-allowed border border-neutral-700"
                      : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/20"
                  }`}
              >
                {meeting.requestingAccess && <ZLoader />}
                {!meeting.requestingAccess && (
                  <>
                    <span className="uppercase tracking-widest text-sm">
                      Request Access
                    </span>
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            )}
          </div>

          <div className="flex items-center justify-center space-x-2 text-[10px] text-neutral-600 font-black uppercase tracking-tighter">
            <Lock className="w-3 h-3 text-rose-500" />
            <span>Secure Enterprise Channel</span>
          </div>
        </div>
      </main>

      {/* Footer Info */}
      <footer className="mt-16 text-neutral-700 text-[10px] font-bold uppercase tracking-[0.3em] flex items-center space-x-6">
        <span className="hover:text-emerald-600 transition-colors cursor-default">
          ID: {meeting.meeting!.meetingCode}
        </span>
        <span className="w-1 h-1 bg-neutral-800 rounded-full" />
        <span className="hover:text-amber-600 transition-colors cursor-default">
          Duration: {meeting.meeting!.duration}
        </span>
        <span className="w-1 h-1 bg-neutral-800 rounded-full" />
        <span className="hover:text-rose-600 transition-colors cursor-default">
          Status: {meeting.meeting!.status}
        </span>
      </footer>
    </div>
  );
};

export default MeetingLobby;
