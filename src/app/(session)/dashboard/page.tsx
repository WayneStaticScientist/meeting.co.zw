"use client";
import React, { useEffect, useState } from "react";
import {
  Video,
  Plus,
  Users,
  Calendar,
  Settings,
  LogOut,
  Bell,
  Search,
  Monitor,
  LayoutGrid,
  History,
  Menu,
} from "lucide-react";
import NewMeetingModal from "@/components/layouts/new-meeting-modal";
import JoinMeetingModal from "@/components/layouts/join-meeting-modal";
import ScheduleMeetingModal from "@/components/layouts/schedule-meeting-modal";
import { useMeetingStore } from "@/stores/meeting-store";
import { useSessionState } from "@/stores/session-store";
import MeetingList from "@/components/layouts/meetings-list";

export default function App() {
  const meetingStore = useMeetingStore();
  const sessionState = useSessionState();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeNav, setActiveNav] = useState("dashboard");
  // Modals Control State
  const [activeModal, setActiveModal] = useState<
    null | "new" | "join" | "schedule"
  >(null);
  useEffect(() => {
    meetingStore.fetchMeetings(1);
  }, []);
  // Meeting Setup State
  const closeModal = () => setActiveModal(null);
  const activeMeetings = meetingStore.meetings.reduce(
    (prev, e) => (e.status == "Active" ? prev + 1 : 0),
    0,
  );
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
                <p className="text-sm font-bold">
                  {sessionState.firstName} {sessionState.lastName}
                </p>
                <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">
                  {sessionState.email}
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-emerald-100 border-2 border-emerald-500 overflow-hidden shadow-inner flex items-center justify-center">
                <div>{sessionState.firstName[0]}</div>
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
                  Welcome back, {sessionState.firstName}. You have{" "}
                  {activeMeetings} meetings today.
                </p>
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
                <MeetingList />
              </div>

              <div className="space-y-8">
                <div className="bg-linear-to-br from-emerald-600 to-emerald-800 rounded-[2rem] p-8 text-white relative overflow-hidden shadow-2xl shadow-emerald-600/20">
                  <div className="relative z-10">
                    <h3 className="text-emerald-100 text-xs font-black uppercase tracking-widest mb-4">
                      Meeting
                    </h3>
                    <div className="flex items-end gap-2 mb-2">
                      <span className="text-4xl font-black">
                        {meetingStore.totalMeetings}
                      </span>
                      <span className="text-emerald-200 text-lg font-bold pb-1">
                        Meetings
                      </span>
                    </div>
                    <p className="text-emerald-200 text-sm font-medium">
                      In Total
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
      {activeModal === "new" && <NewMeetingModal closeModal={closeModal} />}

      {/* 2. Join Meeting Modal */}
      {activeModal === "join" && <JoinMeetingModal closeModal={closeModal} />}

      {/* 3. Schedule Meeting Screen */}
      {activeModal === "schedule" && (
        <ScheduleMeetingModal closeModal={closeModal} />
      )}
    </div>
  );
}

// Utility Layout Components

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
