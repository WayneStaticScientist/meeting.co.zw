"use client";
import React, { useEffect } from "react";
import { useSessionState } from "@/stores/session-store";
import { ZanuPFMeetSpinner } from "@/components/layouts/modern-spinner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = useSessionState();
  useEffect(() => {
    session.verifyUserSessionState();
  }, []);

  if (!session.verifiedSession) return <ZanuPFMeetSpinner />;
  return <React.Fragment>{children}</React.Fragment>;
}
