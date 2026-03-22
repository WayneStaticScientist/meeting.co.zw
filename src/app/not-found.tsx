"use client";
import { motion } from "framer-motion";
import {
  Home,
  RefreshCcw,
  VideoOff,
  WifiOff,
  AlertTriangle,
  Search,
} from "lucide-react";

/**
 * GoMeet Modern 404 Not Found Screen
 * Featuring:
 * 1. Animated Glitch effects for the "404" text
 * 2. Floating 3D-transformed glassmorphism card
 * 3. Particle background with emerald and amber accents
 * 4. Interactive "Lost Connection" visual metaphors
 */

const NotFoundPage = () => {
  // Animation variants for the "404" glitch effect
  const glitchVariants: any = {
    animate: {
      x: [0, -2, 2, -1, 1, 0],
      y: [0, 1, -1, 2, -2, 0],
      transition: {
        duration: 0.2,
        repeat: Infinity,
        repeatType: "mirror",
      },
    },
  };

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-slate-950 text-white font-sans overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 blur-[120px] rounded-full animate-pulse" />
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-yellow-500/10 blur-[120px] rounded-full animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-red-500/5 blur-[100px] rounded-full" />
      </div>

      {/* Floating Particles */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-emerald-400/30 rounded-full"
          initial={{
            x: Math.random() * 100 + "%",
            y: Math.random() * 100 + "%",
            opacity: 0,
          }}
          animate={{
            y: [null, "-100%"],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            ease: "linear",
            delay: Math.random() * 5,
          }}
        />
      ))}

      <div className="relative z-10 flex flex-col items-center max-w-2xl px-6 text-center">
        {/* Main 404 Hero Section */}
        <div className="relative mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 100 }}
            className="relative"
          >
            {/* The Glitch Layers */}
            <motion.h1
              variants={glitchVariants}
              animate="animate"
              className="text-[12rem] font-black leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-emerald-400 to-emerald-700 opacity-20 select-none"
            >
              404
            </motion.h1>

            <h1 className="absolute inset-0 flex items-center justify-center text-9xl font-black tracking-tighter text-white drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]">
              404
            </h1>

            {/* Floating Warning Icon */}
            <motion.div
              animate={{ rotate: [0, 10, -10, 0], y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute -top-4 -right-4 p-3 bg-yellow-500 rounded-2xl shadow-lg shadow-yellow-500/20"
            >
              <AlertTriangle className="w-8 h-8 text-slate-950" />
            </motion.div>
          </motion.div>
        </div>

        {/* Content Card */}
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white/5 backdrop-blur-2xl border border-white/10 p-8 rounded-3xl shadow-2xl relative overflow-hidden group"
        >
          {/* Internal Glow */}
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-emerald-500/20 blur-3xl rounded-full transition-transform group-hover:scale-150 duration-700" />

          <div className="relative z-10">
            <div className="flex justify-center mb-6 space-x-4">
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                <VideoOff className="w-6 h-6 text-red-400" />
              </div>
              <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
                <WifiOff className="w-6 h-6 text-yellow-400" />
              </div>
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                <Search className="w-6 h-6 text-emerald-400" />
              </div>
            </div>

            <h2 className="text-3xl font-bold mb-3">Meeting Room Not Found</h2>
            <p className="text-slate-400 mb-8 leading-relaxed max-w-md mx-auto">
              The link you followed might be broken, or the room has been closed
              by the host. Double-check your invitation or head back home.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto px-8 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl flex items-center justify-center space-x-2 transition-colors"
              >
                <Home className="w-5 h-5" />
                <span>Return Home</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto px-8 py-3 bg-white/5 hover:bg-white/10 border border-white/10 font-bold rounded-xl flex items-center justify-center space-x-2 transition-all"
              >
                <RefreshCcw className="w-5 h-5 text-emerald-400" />
                <span>Try Again</span>
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Support Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-12 flex items-center space-x-6 text-sm text-slate-500 font-medium"
        >
          <a href="#" className="hover:text-emerald-400 transition-colors">
            Contact Support
          </a>
          <span className="w-1 h-1 bg-slate-700 rounded-full" />
          <a href="#" className="hover:text-emerald-400 transition-colors">
            Help Center
          </a>
          <span className="w-1 h-1 bg-slate-700 rounded-full" />
          <a href="#" className="hover:text-emerald-400 transition-colors">
            Check System Status
          </a>
        </motion.div>
      </div>

      {/* Decorative Brand Tag */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 opacity-30 select-none">
        <span className="text-xs tracking-[0.4em] font-black uppercase text-emerald-500">
          GoMeet Presence
        </span>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <div className="min-h-screen bg-slate-950">
      <NotFoundPage />
    </div>
  );
}
