"use client";
import { useState, useEffect, useCallback } from "react";
import Sidebar from "@/components/SideBar";
import ChatWindow from "@/components/ChatWindow";
import MoodTracker from "@/components/MoodTracker";
import Assessment from "@/components/Assessment";
import Resources from "@/components/Resources";

type Page = "chat" | "mood" | "assess" | "resources";

const PAGE_META: Record<Page, { title: string; sub: string }> = {
  chat:      { title: "AI Chat",            sub: "Talk to MindGuard — it listens without judgment" },
  mood:      { title: "Mood Log",           sub: "Track how you feel across the day" },
  assess:    { title: "Wellbeing Check-in", sub: "A personal reflection — not a clinical diagnosis" },
  resources: { title: "Resources",          sub: "Therapy techniques and crisis helplines" },
};

export default function Home() {
  const [page, setPage]             = useState<Page>("chat");
  const [chatInject, setChatInject] = useState("");

  useEffect(() => {
    const onNav    = (e: Event) => setPage((e as CustomEvent).detail as Page);
    const onInject = (e: Event) => {
      setPage("chat");
      setChatInject((e as CustomEvent).detail as string);
    };
    window.addEventListener("mg:navigate", onNav);
    window.addEventListener("mg:inject",   onInject);
    return () => {
      window.removeEventListener("mg:navigate", onNav);
      window.removeEventListener("mg:inject",   onInject);
    };
  }, []);

  const handleInjected = useCallback(() => setChatInject(""), []);
  const meta = PAGE_META[page];

  return (
    <div className="flex h-screen max-h-screen overflow-hidden bg-gray-50">
      <Sidebar current={page} onNavigate={setPage} />
      <main className="flex-1 flex flex-col overflow-hidden min-w-0">
        <header className="bg-white border-b border-gray-100 px-6 py-3 flex items-center justify-between flex-shrink-0">
          <div>
            <h1 className="text-sm font-semibold text-gray-900">{meta.title}</h1>
            <p className="text-xs text-gray-400 mt-0.5">{meta.sub}</p>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-medium text-mg-600 bg-mg-50 px-3 py-1.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-mg-400 animate-pulse" />
            AI Active
          </div>
        </header>
        <div className="flex-1 overflow-hidden">
          {page === "chat"      && <ChatWindow  inject={chatInject} onInjected={handleInjected} />}
          {page === "mood"      && <MoodTracker />}
          {page === "assess"    && <Assessment  />}
          {page === "resources" && <Resources   />}
        </div>
      </main>
    </div>
  );
}