"use client";
import { useState } from "react";
import { Video, Mic, Monitor, ShieldCheck } from "lucide-react";
import LoginLayout from "@/components/layouts/login-layout";
import SignUpLayout from "@/components/layouts/sign-up-layout";

export default function App() {
  const [activeTab, setActiveTab] = useState("login");

  // Sample data for Country Select

  return (
    <div className="min-h-screen w-full bg-emerald-50 dark:bg-zinc-950 flex items-center justify-center p-4 md:p-8 font-sans transition-colors duration-300 relative overflow-hidden">
      {/* Dynamic Animated Background */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-5%] w-[50%] h-[50%] bg-emerald-400/20 blur-[120px] rounded-full animate-pulse" />
        <div
          className="absolute bottom-[-10%] right-[-5%] w-[50%] h-[50%] bg-red-400/10 blur-[120px] rounded-full animate-bounce"
          style={{ animationDuration: "8s" }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30%] h-[30%] bg-yellow-400/10 blur-[100px] rounded-full" />

        {/* Abstract Meeting Grid Lines */}
        <div
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
          style={{
            backgroundImage:
              "linear-gradient(#059669 1px, transparent 1px), linear-gradient(90deg, #059669 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      <div className="w-full max-w-250 shadow-2xl rounded-[2.5rem] overflow-hidden bg-white/70 dark:bg-zinc-900/80 backdrop-blur-2xl border border-emerald-100 dark:border-zinc-800 flex flex-col lg:flex-row">
        {/* Left Side: ZanuPFMeeting Visual Branding */}
        <div className="hidden lg:flex w-[42%] bg-emerald-600 p-12 flex-col justify-between text-white relative overflow-hidden">
          <div className="z-10">
            <div className="flex items-center gap-3 mb-12">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-900/20">
                <Video
                  className="text-emerald-600"
                  size={24}
                  fill="currentColor"
                />
              </div>
              <span className="text-2xl font-black tracking-tighter uppercase">
                ZanuPFMeeting
              </span>
            </div>

            <h2 className="text-4xl font-extrabold leading-[1.1] tracking-tight mb-6">
              Connect. <span className="text-yellow-300">Collaborate.</span>{" "}
              <span className="text-red-300">Celebrate.</span>
            </h2>

            <div className="space-y-6 mt-8">
              <div className="flex items-center gap-4 bg-emerald-500/30 p-4 rounded-2xl backdrop-blur-md border border-white/10">
                <Mic className="text-yellow-300" size={20} />
                <p className="text-sm font-medium">
                  Crystal clear spatial audio technology
                </p>
              </div>
              <div className="flex items-center gap-4 bg-emerald-500/30 p-4 rounded-2xl backdrop-blur-md border border-white/10">
                <Monitor className="text-red-300" size={20} />
                <p className="text-sm font-medium">
                  4K Ultra-HD screen sharing capabilities
                </p>
              </div>
              <div className="flex items-center gap-4 bg-emerald-500/30 p-4 rounded-2xl backdrop-blur-md border border-white/10">
                <ShieldCheck className="text-emerald-200" size={20} />
                <p className="text-sm font-medium">
                  End-to-end encrypted video calls
                </p>
              </div>
            </div>
          </div>

          <div className="z-10 pt-8 border-t border-emerald-400/30">
            <div className="flex items-center gap-4">
              <div className="flex -space-x-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-10 w-10 rounded-full border-2 border-emerald-600 bg-zinc-200 overflow-hidden"
                  >
                    <div className="h-1" />
                  </div>
                ))}
              </div>
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-100">
                Stream Way
              </p>
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-yellow-400/20 rounded-full blur-3xl" />
          <div className="absolute top-20 -right-10 w-32 h-32 bg-red-400/20 rounded-full blur-3xl" />
        </div>

        {/* Right Side: Forms */}
        <div className="flex-1 p-8 sm:p-12 lg:p-12 overflow-y-auto max-h-[90vh] lg:max-h-none">
          <div className="flex flex-col w-full">
            {/* Custom Styled Tabs */}
            <div className="flex p-1 bg-zinc-100 dark:bg-zinc-800 rounded-2xl mb-10 w-fit">
              <button
                onClick={() => setActiveTab("login")}
                className={`px-8 py-2.5 text-sm font-bold rounded-xl transition-all ${activeTab === "login" ? "bg-emerald-600 text-white shadow-lg" : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"}`}
              >
                Login
              </button>
              <button
                onClick={() => setActiveTab("signup")}
                className={`px-8 py-2.5 text-sm font-bold rounded-xl transition-all ${activeTab === "signup" ? "bg-emerald-600 text-white shadow-lg" : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"}`}
              >
                Join Now
              </button>
            </div>

            {activeTab === "login" ? <LoginLayout /> : <SignUpLayout />}

            {/* <div className="mt-10">
              <div className="flex items-center gap-4 mb-6">
                <div className="h-px flex-1 bg-zinc-100 dark:bg-zinc-800" />
                <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-black">
                  Fast Authentication
                </span>
                <div className="h-px flex-1 bg-zinc-100 dark:bg-zinc-800" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button className="flex items-center justify-center gap-3 py-3.5 border-2 border-zinc-100 dark:border-zinc-800 rounded-2xl hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:border-emerald-100 transition-all text-sm font-bold">
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  Google
                </button>
                <button className="flex items-center justify-center gap-3 py-3.5 border-2 border-zinc-100 dark:border-zinc-800 rounded-2xl hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:border-emerald-100 transition-all text-sm font-bold">
                  <Github size={20} className="text-zinc-900 dark:text-white" />
                  GitHub
                </button>
              </div>
            </div> */}
          </div>
        </div>
      </div>

      {/* Footer Branding */}
      <div className="fixed bottom-6 text-zinc-400 text-[10px] font-black tracking-widest uppercase flex gap-8">
        <span className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />{" "}
          All Systems Online
        </span>
        <a href="#" className="hover:text-emerald-600 transition-colors">
          ZanuPFMeeting Support
        </a>
      </div>
    </div>
  );
}
