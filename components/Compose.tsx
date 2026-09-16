"use client";

import React, { useState } from "react";
import { useMail } from "@/lib/context";
import { Send, Trash2, Sparkles, Loader2 } from "lucide-react";

export function Compose() {
  const { composeDraft, setComposeDraft, sendEmail, discardDraft } = useMail();
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    try {
      await sendEmail(composeDraft);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 overflow-y-auto">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between flex-shrink-0 bg-slate-50/50 dark:bg-slate-900/50">
        <div>
          <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
            New Message
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-200/50 dark:border-indigo-800/40 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              AI Controllable Form
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Values update automatically when instructed via AI assistant commands
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={discardDraft}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Discard
          </button>
        </div>
      </div>

      {/* Compose Form */}
      <form onSubmit={handleSubmit} className="p-6 flex flex-col flex-1 max-w-4xl">
        <div className="space-y-4 flex-1 flex flex-col">
          {/* To field */}
          <div className="flex items-center border-b border-slate-200 dark:border-slate-800 pb-2">
            <label
              htmlFor="to-input"
              className="w-16 text-xs font-semibold text-slate-500 uppercase tracking-wider"
            >
              To:
            </label>
            <input
              id="to-input"
              type="text"
              required
              placeholder="recipient@example.com"
              value={composeDraft.to}
              onChange={(e) =>
                setComposeDraft((prev) => ({ ...prev, to: e.target.value }))
              }
              className="flex-1 bg-transparent px-2 py-1 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
            />
          </div>

          {/* Subject field */}
          <div className="flex items-center border-b border-slate-200 dark:border-slate-800 pb-2">
            <label
              htmlFor="subject-input"
              className="w-16 text-xs font-semibold text-slate-500 uppercase tracking-wider"
            >
              Subject:
            </label>
            <input
              id="subject-input"
              type="text"
              required
              placeholder="What is this email regarding?"
              value={composeDraft.subject}
              onChange={(e) =>
                setComposeDraft((prev) => ({ ...prev, subject: e.target.value }))
              }
              className="flex-1 bg-transparent px-2 py-1 text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
            />
          </div>

          {/* Body textarea */}
          <div className="flex-1 flex flex-col pt-2 min-h-[260px]">
            <textarea
              id="body-input"
              required
              placeholder="Write your email body here or instruct the AI assistant to compose it..."
              value={composeDraft.body}
              onChange={(e) =>
                setComposeDraft((prev) => ({ ...prev, body: e.target.value }))
              }
              className="w-full flex-1 bg-transparent text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none resize-none leading-relaxed p-2"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="text-xs text-slate-400">
            Press Send to store to in-memory Sent state
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={discardDraft}
              className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              Discard
            </button>
            <button
              type="submit"
              disabled={isSending}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-medium text-xs px-5 py-2.5 rounded-lg shadow-sm transition-all duration-150 active:scale-95 cursor-pointer"
            >
              {isSending ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Email</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
