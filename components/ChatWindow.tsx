"use client";
import { useState, useRef, useEffect } from "react";
import CrisisOverlay from "./CrisisOverlay";
import { ChatMessage } from "@/lib/types";

interface Props {
  inject?: string;
  onInjected?: () => void;
}

const INTENT_BADGE: Record<string, { label: string; cls: string }> = {
  vent:      { label: "Listening mode",  cls: "bg-purple-100 text-purple-800" },
  technique: { label: "Technique mode",  cls: "bg-blue-100 text-blue-800" },
  info:      { label: "Resource mode",   cls: "bg-amber-100 text-amber-800" },
  general:   { label: "Companion mode",  cls: "bg-mg-50 text-mg-800" },
};

const SUGGESTIONS = [
  "I feel overwhelmed with exams",
  "I can't sleep properly",
  "I feel very lonely at college",
  "Help me with a breathing exercise",
  "I am stressed about placements",
];

interface Msg extends ChatMessage { id: string; }

export default function ChatWindow({ inject, onInjected }: Props) {
  const [msgs, setMsgs] = useState<Msg[]>([{
    id: "0", role: "assistant",
    content: "Hello, I'm MindGuard — your private mental health companion. I'm here to listen without any judgment. Whatever you're going through, you don't have to face it alone. What's on your mind today?",
  }]);
  const [input, setInput]     = useState("");
  const [loading, setLoading] = useState(false);
  const [crisis, setCrisis]   = useState(false);
  const [intent, setIntent]   = useState("general");
  const [history, setHistory] = useState<ChatMessage[]>([]);
  const bottomRef             = useRef<HTMLDivElement>(null);
  const inputRef              = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, loading]);

  useEffect(() => {
    if (inject && inject.trim()) { send(inject); onInjected?.(); }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inject]);

  async function send(text?: string) {
    const content = (text ?? input).trim();
    if (!content || loading) return;
    const userMsg: Msg = { id: Date.now().toString(), role: "user", content };
    setMsgs((p) => [...p, userMsg]);
    setInput("");
    setLoading(true);
    const newHistory: ChatMessage[] = [...history, { role: "user", content }];
    try {
      const res  = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newHistory }),
      });
      const data = await res.json();
      if (data.crisis) { setCrisis(true); setLoading(false); return; }
      const reply = data.reply ?? "I'm here for you. Can you tell me more?";
      if (data.intent) setIntent(data.intent);
      setHistory([...newHistory, { role: "assistant", content: reply }]);
      setMsgs((p) => [...p, { id: Date.now().toString() + "a", role: "assistant", content: reply }]);
    } catch {
      setMsgs((p) => [...p, {
        id: Date.now().toString() + "e", role: "assistant",
        content: "I had a moment of difficulty connecting. Please try again — I'm still here.",
      }]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  }

  const badge = INTENT_BADGE[intent] ?? INTENT_BADGE.general;

  return (
    <div className="flex flex-col h-full relative overflow-hidden">
      {crisis && <CrisisOverlay onDismiss={() => setCrisis(false)} />}
      <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 border-b border-gray-100 flex-shrink-0 overflow-x-auto">
        <div className="flex gap-1.5 flex-1 overflow-x-auto">
          {SUGGESTIONS.map((s) => (
            <button key={s} onClick={() => send(s)}
              className="text-xs px-3 py-1.5 rounded-full border border-mg-100 text-mg-800 bg-white whitespace-nowrap hover:bg-mg-50 transition-colors flex-shrink-0">
              {s}
            </button>
          ))}
        </div>
        <span className={`text-xs px-2.5 py-1 rounded-full font-medium flex-shrink-0 ${badge.cls}`}>
          {badge.label}
        </span>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {msgs.map((m) => (
          <div key={m.id} className={`flex gap-2 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 mt-0.5 ${
              m.role === "assistant" ? "bg-mg-50 text-mg-800" : "bg-blue-100 text-blue-800"}`}>
              {m.role === "assistant" ? "MG" : "U"}
            </div>
            <div className={`max-w-sm lg:max-w-lg px-4 py-3 rounded-2xl text-sm leading-relaxed ${
              m.role === "assistant"
                ? "bg-white border border-gray-100 text-gray-800 rounded-tl-sm"
                : "bg-mg-400 text-white rounded-tr-sm"}`}>
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex gap-2">
            <div className="w-8 h-8 rounded-full bg-mg-50 text-mg-800 flex items-center justify-center text-xs font-semibold">MG</div>
            <div className="bg-white border border-gray-100 px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-1">
              {[0,1,2].map((i) => (
                <div key={i} className="w-2 h-2 bg-mg-400 rounded-full animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }} />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
      <div className="border-t border-gray-100 p-3 bg-white flex gap-2 items-end flex-shrink-0">
        <textarea ref={inputRef} value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
          placeholder="Share how you're feeling..."
          rows={1}
          className="flex-1 resize-none border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-mg-400 bg-gray-50 transition-colors" />
        <button onClick={() => send()} disabled={loading || !input.trim()}
          className="w-10 h-10 bg-mg-400 hover:bg-mg-600 disabled:opacity-40 rounded-xl flex items-center justify-center text-white transition-colors flex-shrink-0">
          <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4">
            <path d="M14 8L2 2l3 6-3 6 12-6z" fill="white"/>
          </svg>
        </button>
      </div>
    </div>
  );
}