"use client";

import React from "react";
import { useMail } from "@/lib/context";
import { Send, Clock } from "lucide-react";

export function Sent() {
  const { sentEmails } = useMail();

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleString([], {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 overflow-hidden">
      {/* Sent Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between flex-shrink-0 bg-slate-50/50 dark:bg-slate-900/50">
        <div>
          <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
            Sent Messages
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              {sentEmails.length} {sentEmails.length === 1 ? "email" : "emails"}
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Outbound messages stored in in-memory sent state
          </p>
        </div>
      </div>

      {/* Sent Emails List */}
      <div className="flex-1 overflow-y-auto">
        {sentEmails.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center text-slate-400">
            <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-3">
              <Send className="w-6 h-6 text-slate-400" />
            </div>
            <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
              No sent messages yet
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Emails sent manually or via the AI will appear here.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-200 dark:divide-slate-800">
            {sentEmails.map((email) => (
              <div
                key={email.id}
                className="p-4 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/40"
              >
                <div className="flex items-baseline justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2 truncate">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                      To:
                    </span>
                    <span className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                      {email.recipient}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-slate-400 flex-shrink-0">
                    <Clock className="w-3 h-3 hidden sm:inline" />
                    <span>{formatDate(email.date)}</span>
                  </div>
                </div>

                <div className="text-sm font-medium text-slate-800 dark:text-slate-200 mb-1">
                  {email.subject}
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                  {email.preview || email.body}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
