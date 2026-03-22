import React, { useState, useEffect } from "react";
import { Wifi } from "lucide-react";

/**
 * GoMeetLoader - Minimalist Visual Version
 * Removed all status text and percentages for a purely cinematic feel.
 */
export const ZMeetLoader = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let interval = setInterval(() => {
      setProgress((prev) => {
        if (prev < 30) return prev + Math.random() * 2;
        if (prev < 60) return prev + Math.random() * 0.5;
        if (prev < 92) return prev + Math.random() * 0.1;
        return prev;
      });
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-9999 bg-[#050505] flex flex-col items-center justify-center overflow-hidden font-sans select-none">
      {/* Dynamic Background Gradients */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-emerald-500/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-75 h-75 bg-blue-500/5 rounded-full blur-[100px]" />

      <div className="relative flex flex-col items-center">
        {/* Animated Ring System */}
        <div className="relative w-56 h-56">
          {/* Outer Rotating Dash Ring */}
          <div className="absolute inset-0 rounded-full border border-dashed border-emerald-500/20 animate-[spin_20s_linear_infinite]" />

          {/* Main Progress Circle */}
          <svg className="w-full h-full -rotate-90 scale-110">
            <circle
              cx="112"
              cy="112"
              r="90"
              fill="transparent"
              stroke="rgba(16, 185, 129, 0.05)"
              strokeWidth="2"
            />
            <circle
              cx="112"
              cy="112"
              r="90"
              fill="transparent"
              stroke="url(#gomeet_grad)"
              strokeWidth="3"
              strokeDasharray="565"
              strokeDashoffset={565 - (565 * progress) / 100}
              strokeLinecap="round"
              className="transition-all duration-300 ease-out"
            />
            <defs>
              <linearGradient
                id="gomeet_grad"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
            </defs>
          </svg>

          {/* Center Branding (No Text) */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative group">
              <div className="absolute inset-0 bg-emerald-500/20 blur-2xl rounded-full scale-150 animate-pulse" />
              <div className="relative w-24 h-24 bg-zinc-900/80 backdrop-blur-xl border border-white/10 rounded-[2rem] flex items-center justify-center shadow-2xl overflow-hidden">
                <div className="absolute inset-0 bg-linear-to-br from-white/5 to-transparent" />

                {/* The GM Mark (Iconography only) */}
                <div className="relative z-10 flex items-center justify-center">
                  <div className="w-8 h-8 border-t-4 border-l-4 border-white rounded-tl-lg mr-1 opacity-80" />
                  <div className="w-8 h-8 border-b-4 border-r-4 border-emerald-500 rounded-br-lg ml-1" />
                </div>

                <div className="absolute top-0 -left-full w-full h-full bg-linear-to-r from-transparent via-white/10 to-transparent skew-x-12 animate-[shimmer_2s_infinite]" />
              </div>
            </div>
          </div>

          {/* Orbiting Tech Node */}
          <div className="absolute inset-0 animate-[spin_3s_cubic-bezier(0.4,0,0.2,1)_infinite]">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-white rounded-full shadow-[0_0_15px_#fff,0_0_30px_#10b981]" />
          </div>
        </div>
      </div>

      {/* Subtle Visual Indicators only (No Text) */}
      <div className="absolute bottom-10 flex gap-4 opacity-30">
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
        <Wifi size={12} className="text-white" />
        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes shimmer { 
          0% { left: -100%; } 
          100% { left: 200%; } 
        }
      `,
        }}
      />
    </div>
  );
};
