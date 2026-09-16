"use client";

import React from "react";
import Link from "next/link";
import { Email } from "@/lib/types";
import { Mail, Clock } from "lucide-react";

interface EmailListProps {
  emails: Email[];
  emptyMessage?: string;
}

export function EmailList({ emails, emptyMessage = "No emails found" }: EmailListProps) {
  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      const now = new Date();
      const diffMs = now.getTime() - d.getTime();
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      if (diffDays === 0) {
        return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
      } else if (diffDays === 1) {
        return "Yesterday";
      } else if (diffDays < 7) {
        return `${diffDays}d ago`;
      } else {
        return d.toLocaleDateString([], { month: "short", day: "numeric" });
      }
    } catch {
      return dateStr;
    }
  };

  if (emails.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center text-slate-400">
        <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-3">
          <Mail className="w-6 h-6 text-slate-400" />
        </div>
        <p className="text-sm font-medium text-slate-600 dark:text-slate-300">{emptyMessage}</p>
        <p className="text-xs text-slate-400 mt-1">Try clearing filters or asking the AI assistant.</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-slate-200 dark:divide-slate-800">
      {emails.map((email) => {
        return (
          <Link
            key={email.id}
            href={`/email/${email.id}`}
            className={`flex items-start gap-4 p-4 transition-colors duration-150 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer ${
              !email.read
                ? "bg-indigo-50/40 dark:bg-indigo-950/20"
                : "bg-white dark:bg-slate-900"
            }`}
          >
            {/* Unread Status Indicator */}
            <div className="pt-1.5 flex-shrink-0">
              <span
                className={`block w-2.5 h-2.5 rounded-full ${
                  !email.read
                    ? "bg-indigo-600 ring-4 ring-indigo-100 dark:ring-indigo-900/40"
                    : "bg-transparent"
                }`}
                title={!email.read ? "Unread email" : "Read email"}
              />
            </div>

            {/* Email Core Content */}
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline justify-between gap-2 mb-1">
                <div className="flex items-center gap-2 truncate">
                  <span
                    className={`text-sm truncate ${
                      !email.read
                        ? "font-bold text-slate-900 dark:text-white"
                        : "font-medium text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    {email.senderName}
                  </span>
                  <span className="text-xs text-slate-400 truncate hidden sm:inline">
                    &lt;{email.sender}&gt;
                  </span>
                </div>

                <div className="flex items-center gap-1 text-xs text-slate-400 flex-shrink-0">
                  <Clock className="w-3 h-3 hidden sm:inline" />
                  <span>{formatDate(email.date)}</span>
                </div>
              </div>

              <div
                className={`text-sm truncate mb-1 ${
                  !email.read
                    ? "font-semibold text-slate-800 dark:text-slate-200"
                    : "font-normal text-slate-600 dark:text-slate-400"
                }`}
              >
                {email.subject}
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                {email.preview}
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
