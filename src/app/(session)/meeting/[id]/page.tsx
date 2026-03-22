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
  MessageSquare,
  PhoneOff,
  PenTool,
  UserPlus,
  UserMinus,
  Send,
  Smile,
  Pencil,
  Eraser,
  Square,
  Circle,
  Type,
} from "lucide-react";

export default function MeetingRoomView({}: {}) {
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isWhiteboardActive, setIsWhiteboardActive] = useState(false);
  const [activeSidebar, setActiveSidebar] = useState<
    "none" | "chat" | "participants"
  >("none");

  const [chatInput, setChatInput] = useState("");

  // Mock State for the Meeting
  const [participants, setParticipants] = useState([
    {
      id: "1",
      name: "Sarah Jenkins",
      role: "Participant",
      avatar: "https://i.pravatar.cc/150?u=sarah",
      isMuted: false,
    },
    {
      id: "2",
      name: "Michael Chen",
      role: "Participant",
      avatar: "https://i.pravatar.cc/150?u=mike",
      isMuted: true,
    },
    {
      id: "3",
      name: "Emma Watson",
      role: "Participant",
      avatar: "https://i.pravatar.cc/150?u=emma",
      isMuted: false,
    },
  ]);

  const [waitingRoom, setWaitingRoom] = useState([
    {
      id: "4",
      name: "David Smith",
      avatar: "https://i.pravatar.cc/150?u=david",
    },
  ]);

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "Sarah Jenkins",
      text: "Hey everyone, glad we could sync today!",
      time: "10:02 AM",
    },
    {
      id: 2,
      sender: "Michael Chen",
      text: "Can someone share the figma link?",
      time: "10:05 AM",
    },
  ]);

  const removeParticipant = (id: string) => {
    setParticipants(participants.filter((p) => p.id !== id));
  };

  const admitUser = (user: any) => {
    setParticipants([
      ...participants,
      { ...user, role: "Participant", isMuted: true },
    ]);
    setWaitingRoom(waitingRoom.filter((u) => u.id !== user.id));
  };

  const declineUser = (id: string) => {
    setWaitingRoom(waitingRoom.filter((u) => u.id !== id));
  };

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    setMessages([
      ...messages,
      {
        id: Date.now(),
        sender: "You",
        text: chatInput,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);
    setChatInput("");
  };

  return (
    <div className="min-h-screen max-h-screen bg-zinc-950 text-white flex flex-col font-sans overflow-hidden animate-in fade-in duration-700">
      {/* Top Header */}
      <header className="h-16 flex items-center justify-between px-6 border-b border-zinc-800/50 bg-zinc-950/80 backdrop-blur-md z-20">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-zinc-900 px-3 py-1.5 rounded-full border border-zinc-800">
            <ShieldCheck size={14} className="text-emerald-500" />
            <span className="text-xs font-bold text-zinc-300">
              End-to-End Encrypted
            </span>
          </div>
          <div className="h-4 w-px bg-zinc-800" />
          <h1 className="text-sm font-bold tracking-wide">
            Design System Sync
          </h1>
          <span className="bg-red-500 text-white text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md animate-pulse">
            Live
          </span>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-zinc-800 rounded-lg transition-colors text-zinc-400">
            <LayoutGrid size={20} />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Stage Area */}
        <div className="flex-1 flex flex-col p-4 relative transition-all duration-300">
          {/* Top Floating Participants Strip */}
          <div className="h-32 mb-4 w-full flex gap-4 overflow-x-auto hide-scrollbar z-10 px-2">
            <div className="min-w-50 h-full bg-zinc-900 rounded-2xl border border-zinc-800 relative overflow-hidden group">
              {camOn ? (
                <img
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400"
                  className="w-full h-full object-cover"
                  alt="You"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-800/50">
                  <div className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center text-lg font-bold">
                    A
                  </div>
                </div>
              )}
              <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-2">
                {!micOn && <MicOff size={12} className="text-red-500" />}
                <span className="text-xs font-bold">You</span>
              </div>
            </div>

            {participants.map((p) => (
              <div
                key={p.id}
                className="min-w-50 h-full bg-zinc-900 rounded-2xl border border-zinc-800 relative overflow-hidden"
              >
                <img
                  src={p.avatar}
                  className="w-full h-full object-cover"
                  alt={p.name}
                />
                <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-2">
                  {p.isMuted && <MicOff size={12} className="text-red-500" />}
                  <span className="text-xs font-bold">{p.name}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Main Focus Area (Active Speaker, Screen Share, or Whiteboard) */}
          <div className="flex-1 rounded-[2rem] overflow-hidden relative border border-zinc-800 bg-zinc-900 shadow-2xl flex items-center justify-center">
            {isWhiteboardActive ? (
              <div className="w-full h-full bg-[#1e293b] relative overflow-hidden cursor-crosshair">
                {/* Mock Chalkboard Background/Texture */}
                <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                  <PenTool
                    size={64}
                    className="mx-auto text-emerald-500/30 mb-4"
                  />
                  <h2 className="text-2xl font-black text-slate-300">
                    Collaborative Whiteboard
                  </h2>
                  <p className="text-slate-500 mt-2 font-medium">
                    Use tools below to draw
                  </p>
                </div>

                {/* Floating Tool Palette */}
                <div className="absolute left-6 top-1/2 -translate-y-1/2 bg-zinc-900/90 backdrop-blur-xl border border-zinc-700 p-2 rounded-2xl flex flex-col gap-2 shadow-xl z-20">
                  <button className="p-3 bg-emerald-600 text-white rounded-xl">
                    <Pencil size={18} />
                  </button>
                  <button className="p-3 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-xl transition-all">
                    <Eraser size={18} />
                  </button>
                  <button className="p-3 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-xl transition-all">
                    <Square size={18} />
                  </button>
                  <button className="p-3 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-xl transition-all">
                    <Circle size={18} />
                  </button>
                  <button className="p-3 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-xl transition-all">
                    <Type size={18} />
                  </button>
                </div>
              </div>
            ) : isScreenSharing ? (
              <div className="w-full h-full bg-zinc-800 relative flex items-center justify-center">
                <img
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200"
                  alt="Screen Share"
                  className="max-w-full max-h-full object-contain"
                />
                <div className="absolute top-4 left-4 bg-emerald-600 px-3 py-1.5 rounded-lg font-bold text-xs flex items-center gap-2 shadow-lg">
                  <Monitor size={14} /> You are sharing your screen
                </div>
              </div>
            ) : (
              <div className="w-full h-full relative">
                <img
                  src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=1200"
                  className="w-full h-full object-cover"
                  alt="Active Speaker"
                />
                <div className="absolute bottom-6 left-6 bg-black/50 backdrop-blur-xl px-4 py-2 rounded-xl border border-white/10 flex items-center gap-3">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse" />
                  <span className="font-bold text-sm">
                    Sarah Jenkins (Speaking)
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar (Chat / Participants) */}
        {activeSidebar !== "none" && (
          <div className="w-80 bg-zinc-900 border-l border-zinc-800 flex flex-col animate-in slide-in-from-right-10 duration-300 z-20">
            <div className="flex items-center justify-between p-4 border-b border-zinc-800">
              <h3 className="font-black text-lg">
                {activeSidebar === "chat" ? "Meeting Chat" : "Participants"}
              </h3>
              <button
                onClick={() => setActiveSidebar("none")}
                className="p-1.5 text-zinc-400 hover:bg-zinc-800 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            {/* Chat Panel */}
            {activeSidebar === "chat" && (
              <>
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${msg.sender === "You" ? "items-end" : "items-start"}`}
                    >
                      <span className="text-[10px] text-zinc-500 font-bold mb-1">
                        {msg.sender} • {msg.time}
                      </span>
                      <div
                        className={`px-4 py-2.5 rounded-2xl max-w-[85%] text-sm ${msg.sender === "You" ? "bg-emerald-600 text-white rounded-br-sm" : "bg-zinc-800 text-zinc-200 rounded-bl-sm"}`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  ))}
                </div>
                <form
                  onSubmit={sendMessage}
                  className="p-4 border-t border-zinc-800 bg-zinc-950"
                >
                  <div className="relative flex items-center">
                    <button
                      type="button"
                      className="absolute left-3 text-zinc-400 hover:text-white"
                    >
                      <Smile size={18} />
                    </button>
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder="Type a message..."
                      className="w-full bg-zinc-800 border-none rounded-xl py-3 pl-10 pr-12 text-sm focus:ring-1 focus:ring-emerald-500 outline-none text-white"
                    />
                    <button
                      type="submit"
                      disabled={!chatInput.trim()}
                      className="absolute right-2 p-1.5 bg-emerald-600 disabled:opacity-50 text-white rounded-lg"
                    >
                      <Send size={14} />
                    </button>
                  </div>
                </form>
              </>
            )}

            {/* Participants Panel */}
            {activeSidebar === "participants" && (
              <div className="flex-1 overflow-y-auto">
                {/* Waiting Room */}
                {waitingRoom.length > 0 && (
                  <div className="p-4 border-b border-zinc-800">
                    <h4 className="text-xs font-black uppercase text-zinc-500 mb-3 tracking-widest">
                      Waiting Room ({waitingRoom.length})
                    </h4>
                    <div className="space-y-3">
                      {waitingRoom.map((user) => (
                        <div
                          key={user.id}
                          className="flex items-center justify-between bg-zinc-950 p-2 rounded-xl border border-zinc-800/50"
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={user.avatar}
                              className="w-8 h-8 rounded-full"
                              alt="avatar"
                            />
                            <span className="text-sm font-bold">
                              {user.name}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => admitUser(user)}
                              className="p-1.5 bg-emerald-600 hover:bg-emerald-500 rounded-md text-white"
                            >
                              <Check size={14} />
                            </button>
                            <button
                              onClick={() => declineUser(user.id)}
                              className="p-1.5 bg-zinc-800 hover:bg-red-500/20 hover:text-red-500 rounded-md text-zinc-400"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Active Participants */}
                <div className="p-4">
                  <h4 className="text-xs font-black uppercase text-zinc-500 mb-3 tracking-widest">
                    In Meeting ({participants.length + 1})
                  </h4>
                  <div className="space-y-2">
                    {/* You */}
                    <div className="flex items-center justify-between p-2 hover:bg-zinc-800/50 rounded-xl transition-colors group">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center font-bold text-sm">
                          A
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold">
                            Alex Rivera (You)
                          </span>
                          <span className="text-[10px] text-zinc-500 font-bold">
                            Host
                          </span>
                        </div>
                      </div>
                      {micOn ? (
                        <Mic size={14} className="text-emerald-500" />
                      ) : (
                        <MicOff size={14} className="text-red-500" />
                      )}
                    </div>

                    {/* Others */}
                    {participants.map((p) => (
                      <div
                        key={p.id}
                        className="flex items-center justify-between p-2 hover:bg-zinc-800/50 rounded-xl transition-colors group"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={p.avatar}
                            className="w-8 h-8 rounded-full"
                            alt="avatar"
                          />
                          <span className="text-sm font-bold text-zinc-300">
                            {p.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {p.isMuted ? (
                            <MicOff size={14} className="text-red-500" />
                          ) : (
                            <Mic size={14} className="text-emerald-500" />
                          )}
                          <button
                            onClick={() => removeParticipant(p.id)}
                            className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-500/20 hover:text-red-500 text-zinc-500 rounded-md transition-all"
                          >
                            <UserMinus size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Bottom Control Bar */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-zinc-900/80 backdrop-blur-xl border border-zinc-700/50 px-6 py-3 rounded-full shadow-2xl z-30">
          <button
            onClick={() => setMicOn(!micOn)}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${micOn ? "bg-zinc-800 hover:bg-zinc-700 text-white" : "bg-red-500 hover:bg-red-600 text-white"}`}
          >
            {micOn ? <Mic size={20} /> : <MicOff size={20} />}
          </button>

          <button
            onClick={() => setCamOn(!camOn)}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${camOn ? "bg-zinc-800 hover:bg-zinc-700 text-white" : "bg-red-500 hover:bg-red-600 text-white"}`}
          >
            {camOn ? <Video size={20} /> : <CameraOff size={20} />}
          </button>

          <div className="w-px h-8 bg-zinc-700 mx-2" />

          <button
            onClick={() => {
              setIsScreenSharing(!isScreenSharing);
              setIsWhiteboardActive(false);
            }}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${isScreenSharing ? "bg-emerald-600 text-white shadow-[0_0_15px_rgba(5,150,105,0.5)]" : "bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white"}`}
            title="Share Screen"
          >
            <Monitor size={20} />
          </button>

          <button
            onClick={() => {
              setIsWhiteboardActive(!isWhiteboardActive);
              setIsScreenSharing(false);
            }}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${isWhiteboardActive ? "bg-emerald-600 text-white shadow-[0_0_15px_rgba(5,150,105,0.5)]" : "bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white"}`}
            title="Whiteboard"
          >
            <PenTool size={20} />
          </button>

          <div className="w-px h-8 bg-zinc-700 mx-2" />

          <button
            onClick={() =>
              setActiveSidebar(
                activeSidebar === "participants" ? "none" : "participants",
              )
            }
            className={`w-12 h-12 rounded-full flex items-center justify-center relative transition-all ${activeSidebar === "participants" ? "bg-zinc-700 text-white" : "bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white"}`}
          >
            <Users size={20} />
            {waitingRoom.length > 0 && (
              <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-zinc-900" />
            )}
          </button>

          <button
            onClick={() =>
              setActiveSidebar(activeSidebar === "chat" ? "none" : "chat")
            }
            className={`w-12 h-12 rounded-full flex items-center justify-center relative transition-all ${activeSidebar === "chat" ? "bg-zinc-700 text-white" : "bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white"}`}
          >
            <MessageSquare size={20} />
          </button>

          <div className="w-px h-8 bg-zinc-700 mx-2" />

          <button
            onClick={() => {}}
            className="px-6 h-12 rounded-full bg-red-600 hover:bg-red-700 text-white font-bold flex items-center gap-2 transition-all shadow-lg shadow-red-900/50"
          >
            <PhoneOff size={18} />
            End Call
          </button>
        </div>
      </div>
    </div>
  );
}
