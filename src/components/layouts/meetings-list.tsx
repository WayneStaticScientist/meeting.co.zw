"use client";
import {
  ListFilter,
  Calendar,
  Clock,
  Users,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import React, { useMemo } from "react";
import ZLoader from "../displays/z-loader";
import { useMeetingStore } from "@/stores/meeting-store";
import { Lerper } from "@/utils/lerper";

export default function MeetingList() {
  const meetingStore = useMeetingStore();
  const meetings = useMeetingStore((state) => state.meetings || []);
  const currentPage = useMeetingStore((state) => state.currentPage);
  const rowsPerPage = useMeetingStore((state) => state.rowsPerPage);
  const totalPages = useMeetingStore((state) => state.totalPages);
  const handleRowsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    meetingStore.setRowsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const setCurrentPage = (page: number) => {
    meetingStore.fetchMeetings(page);
  };
  const paginationRange = useMemo(() => {
    const range = [];
    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - 1 && i <= currentPage + 1)
      ) {
        range.push(i);
      } else if (i === currentPage - 2 || i === currentPage + 2) {
        range.push("...");
      }
    }
    return [...new Set(range)];
  }, [currentPage, totalPages]);

  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center py-20 text-zinc-500 border-2 border-dashed border-zinc-100 dark:border-zinc-800 rounded-3xl bg-zinc-50/50 dark:bg-zinc-900/20">
      <div className="p-4 bg-zinc-100 dark:bg-zinc-800 rounded-full mb-4">
        <ListFilter size={32} className="opacity-20" />
      </div>
      <p className="font-medium">No Meetings at the Moment</p>
      <p className="text-xs opacity-60 text-center max-w-50">
        When you schedule or join meetings, they will appear here.
      </p>
    </div>
  );

  return (
    <div className="space-y-6 w-full max-w-4xl mx-auto p-4">
      {/* List Content */}
      <div className="space-y-4 min-h-100">
        {Lerper.lerp(
          meetingStore?.loading,
          <div className="flex justify-center items-center py-20">
            <ZLoader />
          </div>,
          Lerper.lerp(
            meetings.length === 0,
            renderEmptyState(),
            <>
              {meetingStore.meetings.map((meeting, index) => (
                <div
                  key={index}
                  className="group relative bg-white dark:bg-zinc-900 p-5 rounded-3xl border border-zinc-100 dark:border-zinc-800 shadow-sm hover:shadow-xl hover:shadow-emerald-600/5 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${
                        meeting.status === "Active"
                          ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600"
                          : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500"
                      }`}
                    >
                      <Calendar size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg group-hover:text-emerald-600 transition-colors line-clamp-1">
                        {meeting.roomName}
                      </h4>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-zinc-500 font-medium mt-1">
                        <span className="flex items-center gap-1.5">
                          <Clock size={14} className="opacity-70" />{" "}
                          {meeting.createdAt}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Users size={14} className="opacity-70" />{" "}
                          {meeting.participants?.length || 0} joined
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto pt-4 sm:pt-0 border-t sm:border-t-0 border-zinc-50 dark:border-zinc-800">
                    {meeting.status === "Active" && (
                      <div className="px-3 py-1 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 text-[10px] font-black uppercase tracking-widest rounded-full animate-pulse">
                        Live Now
                      </div>
                    )}
                    <button
                      onClick={() => {
                        if (
                          meeting.status === "Active" &&
                          typeof window !== "undefined"
                        ) {
                          window.location.href = `/meeting/${meeting.meetingCode}`;
                        }
                      }}
                      className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap active:scale-95 ${
                        meeting.status === "Active"
                          ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/20 hover:bg-emerald-700"
                          : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                      }`}
                    >
                      {meeting.status === "Active" ? "Join Call" : "Details"}
                    </button>
                  </div>
                </div>
              ))}
            </>,
          ),
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 0 && (
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 px-2 pt-6 border-t border-zinc-100 dark:border-zinc-800">
          {/* Items Per Page Selector */}
          <div className="flex items-center gap-3 order-2 md:order-1">
            <span className="text-xs text-zinc-400 uppercase font-black tracking-tighter">
              Show
            </span>
            <div className="relative inline-block">
              <select
                className="appearance-none bg-zinc-100 dark:bg-zinc-800 border-none rounded-xl text-sm font-bold pl-4 pr-10 py-2.5 focus:ring-2 focus:ring-emerald-500 transition-all outline-none cursor-pointer"
                value={rowsPerPage}
                onChange={handleRowsPerPageChange}
              >
                <option value={5}>5 per page</option>
                <option value={10}>10 per page</option>
                <option value={20}>20 per page</option>
                <option value={50}>50 per page</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400">
                <ChevronRight size={14} className="rotate-90" />
              </div>
            </div>
          </div>

          {/* Numeric Pagination */}
          <div className="flex items-center gap-2 order-1 md:order-2">
            <button
              disabled={currentPage === 1}
              onClick={() =>
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }
              className="p-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-500 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
            >
              <ChevronLeft size={18} />
            </button>

            <div className="flex items-center gap-1">
              {paginationRange.map((page, idx) => (
                <button
                  key={idx}
                  disabled={page === "..."}
                  onClick={() =>
                    typeof page === "number" && setCurrentPage(page)
                  }
                  className={`w-10 h-10 rounded-xl text-sm font-bold transition-all ${
                    currentPage === page
                      ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/30"
                      : page === "..."
                        ? "text-zinc-400 cursor-default"
                        : "text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              disabled={currentPage === totalPages}
              onClick={() =>
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }
              className="p-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-500 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
