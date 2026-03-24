"use client";
import { useState } from "react";
import api from "../../interceptior";
import { Toaster } from "@/utils/toast-marker";

export const useCreateRoom = () => {
  const [loading, setLoading] = useState(false);
  const [isPublic, setIsPublic] = useState(false);
  const createRoom = async (room: string, isPublic: boolean) => {
    try {
      if (room.trim() === "") return Toaster.error("invalid room key");
      setLoading(true);
      const response = await api.post("/meetings/create/room", {
        room: room.trim(),
        isPublic,
      });

      const data = response.data.meeting.meetingCode;
      Toaster.success("Meeting creation success");
      if (window) {
        window.location.href = `/meeting/${data}`;
      }
      setLoading(false);
    } catch (e) {
      setLoading(false);
      Toaster.errorHttp(e);
    }
  };
  return { loading, createRoom, isPublic, setIsPublic };
};
