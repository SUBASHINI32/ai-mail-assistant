"use client";

import React from "react";
import { Sidebar } from "./Sidebar";
import { Assistant } from "./Assistant";
import { useMail } from "@/lib/context";
import { CheckCircle2, Info, AlertTriangle, X } from "lucide-react";

export function MailLayout({ children }: { children: React.ReactNode }) {
  const { notification, dismissNotification } = useMail();

  return (
    <div className="flex h-screen w-screen bg-slate-100 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 overflow-hidden">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-xl shadow-lg border text-xs font-medium bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white animate-slideDown">
          {notification.type === "success" && (
            <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
          )}
          {notification.type === "info" && (
            <Info className="w-4 h-4 text-indigo-500 flex-shrink-0" />
          )}
          {notification.type === "error" && (
            <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />
          )}
          <span>{notification.message}</span>
          <button
            onClick={dismissNotification}
            className="ml-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Left Sidebar */}
      <Sidebar />

      {/* Center Main Work Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-white dark:bg-slate-900 shadow-inner overflow-hidden">
        {children}
      </main>

      {/* Right AI Assistant Panel (Always Visible) */}
      <Assistant />
    </div>
  );
}
