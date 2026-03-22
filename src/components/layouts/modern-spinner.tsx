"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Video, Mic, Users, Monitor, Shield, Sparkles } from "lucide-react";

export const ZanuPFMeetSpinner = () => {
  const [progress, setProgress] = useState(0);
  const [statusIndex, setStatusIndex] = useState(0);

  const loadingStatuses = [
    "Optimizing connection...",
    "Securing meeting room...",
    "Calibrating audio & video...",
    "Checking permissions...",
    "Joining the conversation...",
  ];

  const statusIcons = [
    { icon: <Video className="w-5 h-5" />, label: "Camera" },
    { icon: <Mic className="w-5 h-5" />, label: "Audio" },
    { icon: <Users className="w-5 h-5" />, label: "Participants" },
    { icon: <Shield className="w-5 h-5" />, label: "Encryption" },
    { icon: <Monitor className="w-5 h-5" />, label: "Presenting" },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 100 : prev + 0.8));
    }, 40);

    const statusTimer = setInterval(() => {
      setStatusIndex((prev) => (prev + 1) % loadingStatuses.length);
    }, 2000);

    return () => {
      clearInterval(timer);
      clearInterval(statusTimer);
    };
  }, []);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-slate-950 text-white font-sans overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-125 h-125 bg-blue-600/10 blur-[120px] rounded-full" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-75 h-75 bg-indigo-500/10 blur-[80px] rounded-full" />

      {/* Main Spinner Container */}
      <div className="relative flex flex-col items-center">
        {/* Concentric Ripple Rings */}
        {[1, 2, 3].map((i) => (
          <motion.div
            key={i}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{
              scale: [0.8, 1.5],
              opacity: [0.5, 0],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              delay: i * 0.8,
              ease: "easeOut",
            }}
            className="absolute border border-blue-400/30 rounded-full"
            style={{ width: "120px", height: "120px" }}
          />
        ))}

        {/* Central Logo/Icon Core */}
        <div className="relative z-10 w-24 h-24 flex items-center justify-center">
          <motion.div
            animate={{
              rotate: 360,
              boxShadow: [
                "0 0 20px rgba(59, 130, 246, 0.3)",
                "0 0 40px rgba(59, 130, 246, 0.6)",
                "0 0 20px rgba(59, 130, 246, 0.3)",
              ],
            }}
            transition={{
              rotate: { duration: 10, repeat: Infinity, ease: "linear" },
              boxShadow: { duration: 2, repeat: Infinity },
            }}
            className="absolute inset-0 bg-linear-to-tr from-blue-600 to-indigo-500 rounded-3xl opacity-20"
          />

          <motion.div
            className="bg-white/10 backdrop-blur-xl border border-white/20 p-5 rounded-2xl shadow-2xl flex items-center justify-center"
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="relative">
              <Video className="w-10 h-10 text-white" />
              <motion.div
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-slate-950"
              />
            </div>
          </motion.div>
        </div>

        {/* Floating Feature Icons Orbiting */}
        <div className="mt-12 flex space-x-6">
          {statusIcons.map((item, idx) => (
            <motion.div
              key={idx}
              animate={{
                y: idx === statusIndex ? -5 : 0,
                opacity: idx === statusIndex ? 1 : 0.3,
                scale: idx === statusIndex ? 1.1 : 1,
                color: idx === statusIndex ? "#60a5fa" : "#94a3b8",
              }}
              className="flex flex-col items-center transition-all"
            >
              <div
                className={`p-2 rounded-lg ${idx === statusIndex ? "bg-blue-500/10 border border-blue-500/20" : ""}`}
              >
                {item.icon}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Text and Branding */}
        <div className="mt-12 text-center space-y-3">
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-linear-to-r from-white to-slate-400"
          >
            GoMeet
          </motion.h1>

          <div className="h-6 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.p
                key={statusIndex}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                className="text-slate-400 text-sm font-medium"
              >
                {loadingStatuses[statusIndex]}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>

        {/* Progress Bar Container */}
        <div className="mt-8 w-64 h-1.5 bg-slate-800 rounded-full overflow-hidden relative">
          <motion.div
            className="h-full bg-linear-to-r from-blue-600 via-indigo-400 to-blue-600"
            initial={{ width: "0%" }}
            animate={{ width: `${progress}%` }}
            transition={{ ease: "easeOut" }}
          />
          {/* Shimmer Effect on Progress */}
          <motion.div
            animate={{ x: ["-100%", "200%"] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            className="absolute top-0 bottom-0 w-1/2 bg-white/20 skew-x-12"
          />
        </div>

        {/* Percentage Label */}
        <motion.span
          className="mt-3 text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Connecting &bull; {Math.floor(progress)}%
        </motion.span>
      </div>

      {/* Security Badge */}
      <div className="absolute bottom-10 flex items-center space-x-2 text-slate-500 px-4 py-2 bg-slate-900/50 border border-slate-800 rounded-full">
        <Shield className="w-3.5 h-3.5" />
        <span className="text-[10px] font-semibold uppercase tracking-wider">
          End-to-End Encrypted
        </span>
        <Sparkles className="w-3.5 h-3.5 text-blue-400" />
      </div>
    </div>
  );
};
