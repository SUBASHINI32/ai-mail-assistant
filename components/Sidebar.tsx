"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMail } from "@/lib/context";
import { Inbox, Send, PenSquare, Mail, Sparkles } from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();
  const { unreadCount, sentEmails } = useMail();

  const navItems = [
    {
      name: "Inbox",
      href: "/inbox",
      icon: Inbox,
      count: unreadCount,
      countLabel: "unread",
    },
    {
      name: "Sent",
      href: "/sent",
      icon: Send,
      count: sentEmails.length,
      countLabel: "sent",
    },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-100 flex flex-col border-r border-slate-800 select-none flex-shrink-0">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center text-white shadow-md">
            <Mail className="w-4 h-4" />
          </div>
          <div>
            <h1 className="font-bold text-sm tracking-tight flex items-center gap-1.5 text-white">
              AI Mail
              <span className="text-[10px] uppercase font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-1.5 py-0.5 rounded">
                Action UI
              </span>
            </h1>
            <p className="text-xs text-slate-400">Autonomous mail client</p>
          </div>
        </div>
      </div>

      {/* Compose Button */}
      <div className="p-4">
        <Link
          href="/compose"
          className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2.5 px-4 rounded-lg shadow-sm transition-all duration-150 active:scale-[0.98]"
        >
          <PenSquare className="w-4 h-4" />
          <span>New Message</span>
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-slate-800 text-white"
                  : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? "text-indigo-400" : "text-slate-400"}`} />
                <span>{item.name}</span>
              </div>
              {item.count > 0 && (
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                    isActive
                      ? "bg-indigo-600 text-white"
                      : "bg-slate-800 text-slate-300 border border-slate-700"
                  }`}
                >
                  {item.count}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer Info */}
      <div className="p-4 border-t border-slate-800 text-xs text-slate-400 flex flex-col gap-1">
        <div className="flex items-center gap-1.5 text-slate-300 font-medium">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>Natural Language Controller</span>
        </div>
        <p className="text-[11px] text-slate-400 leading-tight">
          Assistant returns structured actions directly driving UI state.
        </p>
      </div>
    </aside>
  );
}
