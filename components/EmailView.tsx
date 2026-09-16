"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMail } from "@/lib/context";
import { ArrowLeft, Reply, User, Calendar, Mail as MailIcon } from "lucide-react";
import { createReplyDraft } from "@/lib/actions";

interface EmailViewProps {
  id: string;
}

export function EmailView({ id }: EmailViewProps) {
  const router = useRouter();
  const { emails, markAsRead, setCurrentEmailId, setComposeDraft } = useMail();

  const email = emails.find((e) => e.id === id);

  useEffect(() => {
    if (id) {
      setCurrentEmailId(id);
      markAsRead(id);
    }
    return () => {
      // Don't immediately clear if navigating within
    };
  }, [id, setCurrentEmailId, markAsRead]);

  if (!email) {
    return (
      <div className="p-8 text-center">
        <p className="text-slate-500 mb-4">Email not found or has been removed.</p>
        <Link
          href="/inbox"
          className="inline-flex items-center gap-1.5 text-sm text-indigo-600 hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Inbox
        </Link>
      </div>
    );
  }

  const handleReply = () => {
    const draft = createReplyDraft(email);
    setComposeDraft(draft);
    router.push("/compose");
  };

  const formattedDate = new Date(email.date).toLocaleString([], {
    dateStyle: "full",
    timeStyle: "short",
  });

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 overflow-y-auto">
      {/* Action Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between flex-shrink-0 bg-slate-50/50 dark:bg-slate-900/50">
        <Link
          href="/inbox"
          className="inline-flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white px-2.5 py-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Inbox</span>
        </Link>

        <button
          onClick={handleReply}
          className="inline-flex items-center gap-1.5 text-sm bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-3.5 py-1.5 rounded-lg shadow-sm transition-all duration-150 active:scale-95"
        >
          <Reply className="w-4 h-4" />
          <span>Reply</span>
        </button>
      </div>

      {/* Email Body & Header Details */}
      <div className="p-6 max-w-4xl">
        <h1 className="text-xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
          {email.subject}
        </h1>

        <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-900 dark:text-white">
                {email.senderName}
              </span>
              <span className="text-slate-500 dark:text-slate-400 text-xs">
                &lt;{email.sender}&gt;
              </span>
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              To: {email.recipient}
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Calendar className="w-3.5 h-3.5" />
            <span>{formattedDate}</span>
          </div>
        </div>

        {/* Formatted Full Body */}
        <div className="prose dark:prose-invert max-w-none text-slate-800 dark:text-slate-200 text-sm leading-relaxed whitespace-pre-line">
          {email.body}
        </div>
      </div>
    </div>
  );
}
