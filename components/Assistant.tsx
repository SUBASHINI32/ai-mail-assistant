"use client";

import React, { useState, useRef, useEffect } from "react";
import { useMail } from "@/lib/context";
import {
  Sparkles,
  Send,
  Loader2,
  AlertCircle,
  HelpCircle,
  Terminal,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

export function Assistant() {
  const { aiMessages, isAiLoading, aiError, submitUserCommand } = useMail();
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    "Open latest email",
    "Show emails from last 7 days",
    "Send email to hari@gmail.com with subject meeting and body let's meet tomorrow",
    "Open the email from HR",
    "Reply to this",
    "Go to sent mail",
    "Send an email", // Test ambiguous command
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [aiMessages, isAiLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isAiLoading) return;
    const command = input;
    setInput("");
    await submitUserCommand(command);
  };

  const handleQuickPrompt = (prompt: string) => {
    if (isAiLoading) return;
    submitUserCommand(prompt);
  };

  return (
    <aside className="w-80 lg:w-96 bg-slate-900 text-slate-100 flex flex-col border-l border-slate-800 flex-shrink-0 select-none">
      {/* Assistant Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-indigo-600/30 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-indigo-400" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white flex items-center gap-2">
              AI Controller
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </h2>
            <p className="text-[11px] text-slate-400">Controls Mail UI in real-time</p>
          </div>
        </div>
      </div>

      {/* Chat Messages List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {aiMessages.map((msg) => {
          const isUser = msg.role === "user";

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}
            >
              <div
                className={`max-w-[90%] rounded-xl px-3.5 py-2.5 text-xs leading-relaxed shadow-sm ${
                  isUser
                    ? "bg-indigo-600 text-white rounded-br-xs"
                    : "bg-slate-800 border border-slate-700/80 text-slate-200 rounded-bl-xs"
                }`}
              >
                <div className="flex items-center justify-between gap-4 mb-1">
                  <span className="font-semibold text-[10px] uppercase tracking-wider text-slate-300">
                    {isUser ? "You" : "AI Controller"}
                  </span>
                  <span className="text-[10px] text-slate-400">{msg.timestamp}</span>
                </div>

                <p className="whitespace-pre-wrap">{msg.content}</p>

                {/* Structured Action Execution Badge */}
                {msg.action && msg.action.action !== "clarify" && (
                  <div className="mt-2.5 pt-2 border-t border-slate-700/60 flex flex-col gap-1 text-[11px] font-mono bg-slate-950/50 p-2 rounded-lg text-emerald-300">
                    <div className="flex items-center gap-1.5 font-sans font-semibold text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                      <span>UI Action Executed</span>
                    </div>
                    <div className="text-[10px] text-slate-300">
                      <span className="text-slate-400">Action:</span>{" "}
                      <span className="text-indigo-300 font-bold uppercase">
                        {msg.action.action}
                      </span>
                    </div>
                    {msg.action.action === "compose" && (
                      <div className="text-[10px] text-slate-400 truncate">
                        to: {msg.action.to} | subject: {msg.action.subject}
                      </div>
                    )}
                    {msg.action.action === "filter" && (
                      <div className="text-[10px] text-slate-400">
                        cutoff: last {msg.action.days} days
                      </div>
                    )}
                    {msg.action.action === "open_email" && (
                      <div className="text-[10px] text-slate-400">
                        email_id: {msg.action.email_id}
                      </div>
                    )}
                    {msg.action.action === "navigate" && (
                      <div className="text-[10px] text-slate-400">
                        route: /{msg.action.page}
                      </div>
                    )}
                  </div>
                )}

                {/* Clarification prompt badge */}
                {msg.action && msg.action.action === "clarify" && (
                  <div className="mt-2 pt-1.5 border-t border-slate-700/60 flex items-center gap-1.5 text-[10px] text-amber-300 font-sans">
                    <HelpCircle className="w-3 h-3 text-amber-400 flex-shrink-0" />
                    <span>Awaiting user clarification</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Loading Bubble */}
        {isAiLoading && (
          <div className="flex items-center gap-2 bg-slate-800 border border-slate-700 text-slate-300 px-3.5 py-2.5 rounded-xl text-xs w-max">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-400" />
            <span>Interpreting command & planning UI action...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Error display if any */}
      {aiError && (
        <div className="mx-3 mb-2 p-2.5 bg-red-950/40 border border-red-800/60 rounded-lg text-xs text-red-200 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold text-red-300">Action Failed</p>
            <p className="text-[11px] text-red-400 leading-tight mt-0.5">{aiError}</p>
          </div>
        </div>
      )}

      {/* Quick Prompts Shelf */}
      <div className="px-3 py-2 border-t border-slate-800/80 bg-slate-950/20">
        <div className="text-[10px] font-semibold uppercase text-slate-400 mb-1.5 tracking-wider">
          Suggested Commands
        </div>
        <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto pr-1">
          {quickPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleQuickPrompt(prompt)}
              disabled={isAiLoading}
              className="text-[11px] bg-slate-800/80 hover:bg-slate-700 hover:text-white text-slate-300 border border-slate-700/60 px-2 py-1 rounded-md transition-colors text-left truncate max-w-full disabled:opacity-50 cursor-pointer"
              title={prompt}
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Input Form */}
      <form
        onSubmit={handleSubmit}
        className="p-3 border-t border-slate-800 bg-slate-950/40 flex items-center gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type natural command (e.g. Open latest email)..."
          disabled={isAiLoading}
          className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={!input.trim() || isAiLoading}
          className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white p-2 rounded-lg shadow-sm transition-colors cursor-pointer flex-shrink-0"
          title="Send command"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </aside>
  );
}
