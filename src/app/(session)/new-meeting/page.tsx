"use client";
import React, { useState } from "react";
import {
  Video,
  Plus,
  Users,
  Calendar,
  Clock,
  Settings,
  LogOut,
  Bell,
  Search,
  MoreVertical,
  ChevronRight,
  Mic,
  MicOff,
  Monitor,
  LayoutGrid,
  History,
  Menu,
  X,
  Play,
  Camera,
  CameraOff,
  Globe,
  Lock,
  ChevronDown,
  Hash,
  Link,
  ShieldCheck,
  Check,
} from "lucide-react";

export default function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeNav, setActiveNav] = useState("dashboard");

  // Modals Control State
  const [activeModal, setActiveModal] = useState<
    null | "new" | "join" | "schedule"
  >(null);

  // Meeting Setup State
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [meetingId, setMeetingId] = useState("");

  // Mock data for upcoming meetings
  const upcomingMeetings = [
    {
      id: 1,
      title: "Design System Sync",
      time: "10:30 AM - 11:30 AM",
      organizer: "Sarah Jenkins",
      participants: 12,
      status: "Starting soon",
      color: "emerald",
    },
    {
      id: 2,
      title: "Q4 Strategy Planning",
      time: "02:00 PM - 03:30 PM",
      organizer: "Michael Chen",
      participants: 5,
      status: "Scheduled",
      color: "zinc",
    },
  ];

  const closeModal = () => setActiveModal(null);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans text-zinc-900 dark:text-zinc-100 flex overflow-hidden">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex w-72 flex-col bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 p-6">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-600/20">
            <Video className="text-white" size={20} fill="currentColor" />
          </div>
          <span className="text-xl font-black tracking-tighter uppercase text-emerald-600">
            ZanuPFMeeting
          </span>
        </div>

        <nav className="flex-1 space-y-2">
          <NavItem
            icon={<LayoutGrid size={20} />}
            label="Dashboard"
            active={activeNav === "dashboard"}
            onClick={() => setActiveNav("dashboard")}
          />
          <NavItem
            icon={<Calendar size={20} />}
            label="Schedule"
            active={activeNav === "schedule"}
            onClick={() => {
              setActiveNav("schedule");
              setActiveModal("schedule");
            }}
          />
          <NavItem
            icon={<History size={20} />}
            label="Recordings"
            active={activeNav === "recordings"}
            onClick={() => setActiveNav("recordings")}
          />
          <NavItem
            icon={<Users size={20} />}
            label="Contacts"
            active={activeNav === "contacts"}
            onClick={() => setActiveNav("contacts")}
          />
        </nav>

        <div className="pt-6 border-t border-zinc-100 dark:border-zinc-800 space-y-2">
          <NavItem icon={<Settings size={20} />} label="Settings" />
          <NavItem
            icon={<LogOut size={20} />}
            label="Sign Out"
            className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10"
          />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <header className="h-20 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between px-6 lg:px-10 z-20">
          <div className="flex items-center gap-4 lg:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg"
            >
              <Menu size={24} />
            </button>
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
              <Video className="text-white" size={16} fill="currentColor" />
            </div>
          </div>

          <div className="hidden md:flex relative w-96 group">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-emerald-500 transition-colors"
              size={18}
            />
            <input
              type="text"
              placeholder="Search meetings, recordings, people..."
              className="w-full bg-zinc-100 dark:bg-zinc-800 border-none rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
            />
          </div>

          <div className="flex items-center gap-3 lg:gap-6">
            <button className="relative p-2 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-all">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-zinc-900" />
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-zinc-200 dark:border-zinc-800">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold">Alex Rivera</p>
                <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">
                  Pro Account
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-emerald-100 border-2 border-emerald-500 overflow-hidden shadow-inner">
                <img src="https://i.pravatar.cc/150?u=alex" alt="profile" />
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 lg:p-10 pb-24 lg:pb-10">
          <div className="max-w-6xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h1 className="text-3xl font-black tracking-tight">
                  Meeting Dashboard
                </h1>
                <p className="text-zinc-500 dark:text-zinc-400 mt-1 font-medium">
                  Welcome back, Alex. You have 3 meetings today.
                </p>
              </div>
              <div className="flex items-center gap-2 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 px-4 py-2 rounded-2xl text-xs font-bold border border-yellow-200 dark:border-yellow-800/30">
                <Clock size={14} />
                Next: Design System Sync in 12 mins
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <ActionCard
                icon={
                  <Video size={28} className="text-white" fill="currentColor" />
                }
                title="New Meeting"
                description="Start an instant call"
                bgColor="bg-emerald-600"
                shadowColor="shadow-emerald-600/20"
                onClick={() => setActiveModal("new")}
              />
              <ActionCard
                icon={<Plus size={28} className="text-emerald-600" />}
                title="Join Meeting"
                description="Use meeting code/link"
                bgColor="bg-white dark:bg-zinc-900"
                borderColor="border-2 border-emerald-100 dark:border-zinc-800"
                textColor="text-emerald-600"
                onClick={() => setActiveModal("join")}
              />
              <ActionCard
                icon={
                  <Calendar
                    size={28}
                    className="text-zinc-600 dark:text-zinc-400"
                  />
                }
                title="Schedule"
                description="Plan a future event"
                bgColor="bg-white dark:bg-zinc-900"
                borderColor="border-2 border-zinc-100 dark:border-zinc-800"
                onClick={() => setActiveModal("schedule")}
              />
              <ActionCard
                icon={
                  <Monitor
                    size={28}
                    className="text-zinc-600 dark:text-zinc-400"
                  />
                }
                title="Share Screen"
                description="Directly to a room"
                bgColor="bg-white dark:bg-zinc-900"
                borderColor="border-2 border-zinc-100 dark:border-zinc-800"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-black">Upcoming Meetings</h3>
                  <button className="text-sm font-bold text-emerald-600 hover:underline">
                    View All
                  </button>
                </div>

                <div className="space-y-4">
                  {upcomingMeetings.map((meeting) => (
                    <div
                      key={meeting.id}
                      className="group relative bg-white dark:bg-zinc-900 p-5 rounded-3xl border border-zinc-100 dark:border-zinc-800 shadow-sm hover:shadow-xl hover:shadow-emerald-600/5 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className={`w-14 h-14 rounded-2xl flex items-center justify-center ${meeting.color === "emerald" ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500"}`}
                        >
                          <Calendar size={24} />
                        </div>
                        <div>
                          <h4 className="font-bold text-lg group-hover:text-emerald-600 transition-colors">
                            {meeting.title}
                          </h4>
                          <div className="flex items-center gap-3 text-sm text-zinc-500 font-medium mt-1">
                            <span className="flex items-center gap-1">
                              <Clock size={14} /> {meeting.time}
                            </span>
                            <span className="flex items-center gap-1">
                              <Users size={14} /> {meeting.participants} joined
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto pt-4 sm:pt-0 border-t sm:border-t-0 border-zinc-50 dark:border-zinc-800">
                        {meeting.color === "emerald" && (
                          <div className="px-3 py-1 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 text-[10px] font-black uppercase tracking-widest rounded-full animate-pulse">
                            Live Now
                          </div>
                        )}
                        <button
                          className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${meeting.color === "emerald" ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/20 hover:bg-emerald-700" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200"}`}
                        >
                          {meeting.color === "emerald"
                            ? "Join Call"
                            : "Details"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-8">
                <div className="bg-linear-to-br from-emerald-600 to-emerald-800 rounded-[2rem] p-8 text-white relative overflow-hidden shadow-2xl shadow-emerald-600/20">
                  <div className="relative z-10">
                    <h3 className="text-emerald-100 text-xs font-black uppercase tracking-widest mb-4">
                      Meeting Usage
                    </h3>
                    <div className="flex items-end gap-2 mb-2">
                      <span className="text-4xl font-black">24.5</span>
                      <span className="text-emerald-200 text-lg font-bold pb-1">
                        hrs
                      </span>
                    </div>
                    <p className="text-emerald-200 text-sm font-medium">
                      Your total time in meetings this month
                    </p>
                  </div>
                  <div className="absolute top-[-20%] right-[-20%] w-48 h-48 bg-white/10 rounded-full blur-3xl pointer-events-none" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* --- MODALS SECTION --- */}

      {/* 1. New Meeting Modal */}
      {activeModal === "new" && (
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
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800"
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
                  defaultValue="Alex's Project Sync"
                />
              </div>
              <button className="w-full bg-emerald-600 text-white font-black py-5 rounded-[1.5rem] mt-10 hover:bg-emerald-700 transition-all">
                Launch Meeting Room
              </button>
            </div>
          </div>
        </ModalWrapper>
      )}

      {/* 2. Join Meeting Modal */}
      {activeModal === "join" && (
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
              <h2 className="text-3xl font-black tracking-tight">
                Join Meeting
              </h2>
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
                disabled={!meetingId}
                className="w-full bg-emerald-600 disabled:opacity-50 text-white font-black py-5 rounded-[1.5rem] flex items-center justify-center gap-3 shadow-xl shadow-emerald-600/20 active:scale-95 transition-all"
              >
                Connect to Room
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </ModalWrapper>
      )}

      {/* 3. Schedule Meeting Screen */}
      {activeModal === "schedule" && (
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
                        <img
                          src={`https://i.pravatar.cc/100?u=${i}`}
                          alt="user"
                        />
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
      )}
    </div>
  );
}

// Utility Layout Components
function ModalWrapper({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 overflow-hidden">
      <div
        className="absolute inset-0 bg-zinc-950/80 backdrop-blur-xl"
        onClick={onClose}
      />
      <div className="relative w-full flex justify-center">{children}</div>
    </div>
  );
}

function NavItem({
  icon,
  label,
  active = false,
  onClick,
  className = "",
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all ${active ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/20" : "text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100"} ${className}`}
    >
      {icon}
      <span>{label}</span>
      {active && (
        <div className="ml-auto w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_8px_white]" />
      )}
    </button>
  );
}

function ActionCard({
  icon,
  title,
  description,
  bgColor,
  borderColor = "border-transparent",
  shadowColor = "shadow-none",
  textColor = "text-inherit",
  onClick,
}: any) {
  return (
    <button
      onClick={onClick}
      className={`p-6 rounded-[2rem] flex flex-col items-start gap-4 text-left transition-all hover:-translate-y-1 hover:shadow-2xl ${bgColor} ${borderColor} ${shadowColor} group`}
    >
      <div
        className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform ${bgColor.includes("white") ? "bg-emerald-50 dark:bg-emerald-900/20" : "bg-white/20"}`}
      >
        {icon}
      </div>
      <div>
        <h4
          className={`text-lg font-black ${textColor === "text-inherit" && !bgColor.includes("white") ? "text-white" : textColor}`}
        >
          {title}
        </h4>
        <p
          className={`text-xs font-medium opacity-70 ${!bgColor.includes("white") ? "text-emerald-50" : "text-zinc-500"}`}
        >
          {description}
        </p>
      </div>
    </button>
  );
}
