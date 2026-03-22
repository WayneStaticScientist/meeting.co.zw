"use client";
import {
  User as Ui,
  Lock,
  Eye,
  Mail,
  Phone,
  EyeOff,
  MapPin,
  IdCard,
  Calendar,
} from "lucide-react";
import { useState } from "react";
import { User } from "@/types/user";
import ZLoader from "../displays/z-loader";
import FormInput from "../inputs/form-input";
import { useSessionState } from "@/stores/session-store";

export default function SignUpLayout() {
  const { loading, register } = useSessionState();
  const [isVisible, setIsVisible] = useState(false);
  const formData = useSessionState((state) => state);
  const toggleVisibility = () => setIsVisible(!isVisible);
  const updateField = useSessionState((state) => state.updateField);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const name = e.target.name as keyof User;
    updateField(name, value);
  };
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
          Get Started
        </h1>
        <p className="text-zinc-500 mt-2 font-medium">
          The professional way to meet online.
        </p>
      </div>

      <form
        className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-5"
        onSubmit={(e) => {
          if (loading) return;
          e.preventDefault();
          register();
        }}
      >
        <FormInput
          required
          title={"First Name"}
          Icon={Ui}
          placeholder="first name"
          name={"firstName"}
          value={formData.firstName}
          onchange={handleChange}
        />
        <FormInput
          required
          title={"Last Name"}
          Icon={Ui}
          placeholder="last name"
          name={"lastName"}
          value={formData.lastName}
          onchange={handleChange}
        />
        {/* Email & Phone */}
        <FormInput
          required
          title={"Email"}
          Icon={Mail}
          placeholder="email"
          type="email"
          name={"email"}
          value={formData.email}
          onchange={handleChange}
        />
        <FormInput
          required
          title={"Phone Number"}
          Icon={Phone}
          placeholder="+2637870001000"
          name={""}
        />
        <FormInput title={"City"} Icon={MapPin} placeholder="city" name={""} />
        <FormInput
          title={"Id Number"}
          Icon={IdCard}
          placeholder="63-xxxx-x"
          name={"phoneNumber"}
          value={formData.phoneNumber}
          onchange={handleChange}
        />

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-zinc-400 ml-1">
            Birth Date
          </label>
          <div className="relative">
            <Calendar
              className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
              size={18}
            />
            <input
              name={"dateOfBirthday"}
              value={formData.dateOfBirthday}
              onChange={handleChange}
              type="date"
              className="w-full bg-white dark:bg-zinc-800 border-2 border-zinc-100 dark:border-zinc-700 rounded-2xl py-3 pl-12 pr-4 outline-none focus:border-emerald-500 transition-all text-zinc-900 dark:text-zinc-100"
            />
          </div>
        </div>

        {/* Password */}
        <div className="md:col-span-2 space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-zinc-400 ml-1">
            Create Password
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
              placeholder="Min 8 characters"
              className="w-full bg-white dark:bg-zinc-800 border-2 border-zinc-100 dark:border-zinc-700 rounded-2xl py-3 pl-12 pr-12 outline-none focus:border-emerald-500 transition-all text-zinc-900 dark:text-zinc-100"
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

        <div className="md:col-span-2 mt-4 bg-yellow-50 dark:bg-yellow-900/10 p-4 rounded-2xl border border-yellow-200 dark:border-yellow-800/30">
          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              className="mt-1 w-4 h-4 rounded border-emerald-300 text-emerald-600 focus:ring-emerald-500"
            />
            <span className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              I agree to
              <span className="font-bold text-emerald-600">
                ZanuPFMeeting Premium
              </span>
              Terms of Service and data protection policies.
            </span>
          </label>
        </div>

        <button
          disabled={loading}
          className="md:col-span-2 w-full bg-emerald-600 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-emerald-700 active:scale-[0.98] transition-all mt-4 shadow-xl shadow-emerald-600/20"
        >
          {loading ? <ZLoader /> : "Create Account"}
        </button>
      </form>
    </div>
  );
}
