"use client";

import { User } from "@/types/user";
import { useState } from "react";
import { useSessionState } from "@/stores/session-store";
import { Mail, EyeOff, Eye, ChevronRight, Lock } from "lucide-react";
import FormInput from "../inputs/form-input";
import ZLoader from "../displays/z-loader";

export default function LoginLayout() {
  const [isVisible, setIsVisible] = useState(false);
  const formData = useSessionState((state) => state);
  const updateField = useSessionState((state) => state.updateField);
  const toggleVisibility = () => setIsVisible(!isVisible);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const name = e.target.name as keyof User;
    updateField(name, value);
  };
  const { loading, login } = useSessionState();
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
          Welcome Back
        </h1>
        <p className="text-zinc-500 mt-2 font-medium">
          Ready for your next big meeting?
        </p>
      </div>

      <form
        className="space-y-5"
        onSubmit={(e) => {
          e.preventDefault();
          login();
        }}
      >
        <FormInput
          required
          title={"Email"}
          Icon={Mail}
          placeholder="Email"
          type="email"
          name={"email"}
          value={formData.email}
          onchange={handleChange}
        />

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-zinc-400 ml-1">
            Secure Password
          </label>
          <div className="relative group">
            <Lock
              className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-emerald-500 transition-colors"
              size={18}
            />
            <input
              name={"password"}
              value={formData.password}
              onChange={handleChange}
              type={isVisible ? "text" : "password"}
              placeholder="••••••••"
              className="w-full bg-white dark:bg-zinc-800 border-2 border-zinc-100 dark:border-zinc-700 rounded-2xl py-3.5 pl-12 pr-12 outline-none focus:border-emerald-500 transition-all text-zinc-900 dark:text-zinc-100"
            />
            <button
              type="button"
              onClick={toggleVisibility}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-emerald-600"
            >
              {isVisible ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div className="flex justify-between items-center py-1">
          <label className="flex items-center gap-2 cursor-pointer group">
            <div className="relative">
              <input type="checkbox" className="peer sr-only" />
              <div className="w-5 h-5 border-2 border-zinc-200 dark:border-zinc-700 rounded-lg peer-checked:bg-emerald-600 peer-checked:border-emerald-600 transition-all" />
              <svg
                className="absolute top-1 left-1 w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="4"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <span className="text-sm font-semibold text-zinc-500 group-hover:text-zinc-700 dark:group-hover:text-zinc-300">
              Keep me synced
            </span>
          </label>
          <a
            href="#"
            className="text-sm font-bold text-red-500 hover:text-red-600 hover:underline"
          >
            Forgot?
          </a>
        </div>

        <button className="w-full bg-emerald-600 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-emerald-700 active:scale-[0.98] transition-all shadow-xl shadow-emerald-600/20">
          {loading ? (
            <ZLoader />
          ) : (
            <>
              Login
              <ChevronRight size={18} />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
