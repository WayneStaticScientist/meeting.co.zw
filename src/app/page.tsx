"use client";
import { ZanuPFMeetSpinner } from "@/components/layouts/modern-spinner";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    window.location.href = "/dashboard";
  }, []);
  return <ZanuPFMeetSpinner />;
}
