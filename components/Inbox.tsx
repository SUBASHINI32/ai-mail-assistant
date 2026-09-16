"use client";

import React from "react";
import { useMail } from "@/lib/context";
import { EmailList } from "./EmailList";
import { Filter, X, RefreshCw } from "lucide-react";

export function Inbox() {
  const { filteredEmails, emails, inboxFilter, clearFilter } = useMail();

  const isFiltered = Boolean(inboxFilter && (inboxFilter.days !== undefined || inboxFilter.sender));

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 overflow-hidden">
      {/* Inbox Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between flex-shrink-0 bg-slate-50/50 dark:bg-slate-900/50">
        <div>
          <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
            Inbox
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              {filteredEmails.length} {filteredEmails.length === 1 ? "email" : "emails"}
              {isFiltered && ` of ${emails.length}`}
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Incoming communications and announcements
          </p>
        </div>
      </div>

      {/* Visible Filter Status Banner */}
      {isFiltered && (
        <div className="px-4 py-2.5 bg-indigo-50 dark:bg-indigo-950/40 border-b border-indigo-100 dark:border-indigo-900/50 flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2 text-xs text-indigo-900 dark:text-indigo-200 font-medium">
            <Filter className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>
              {inboxFilter?.days
                ? `Filtered: Last ${inboxFilter.days} days`
                : `Filtered: sender contains "${inboxFilter?.sender}"`}
            </span>
            <span className="text-indigo-500 text-[11px]">
              ({filteredEmails.length} matching)
            </span>
          </div>
          <button
            onClick={clearFilter}
            className="flex items-center gap-1 text-xs bg-white dark:bg-slate-800 hover:bg-indigo-100 dark:hover:bg-slate-700 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-slate-700 px-2.5 py-1 rounded shadow-sm transition-colors cursor-pointer"
          >
            <X className="w-3 h-3" />
            <span>Clear Filter</span>
          </button>
        </div>
      )}

      {/* Scrollable Email List */}
      <div className="flex-1 overflow-y-auto">
        <EmailList
          emails={filteredEmails}
          emptyMessage={
            isFiltered
              ? "No emails found matching the active filter criteria."
              : "No emails in your inbox."
          }
        />
      </div>
    </div>
  );
}
