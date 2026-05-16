"use client";
import { useState, useEffect } from "react";
import { MoodEntry } from "@/lib/types";

const MOODS = [
  { emoji: "😄", label: "Excellent",   score: 5 },
  { emoji: "🙂", label: "Good",        score: 4 },
  { emoji: "😐", label: "Okay",        score: 3 },
  { emoji: "😔", label: "Low",         score: 2 },
  { emoji: "😢", label: "Distressed",  score: 1 },
  { emoji: "😰", label: "Anxious",     score: 2 },
  { emoji: "😩", label: "Overwhelmed", score: 1 },
  { emoji: "😠", label: "Angry",       score: 2 },
  { emoji: "🌱", label: "Hopeful",     score: 4 },
  { emoji: "🧘", label: "Calm",        score: 5 },
];

const KEY = "mg_mood";
function load(): MoodEntry[] {
  try { return JSON.parse(localStorage.getItem(KEY) ?? "[]"); } catch { return []; }
}
function save(e: MoodEntry[]) { localStorage.setItem(KEY, JSON.stringify(e)); }
function today() { return new Date().toISOString().slice(0, 10); }

function buildChart(entries: MoodEntry[]) {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const ds = d.toISOString().slice(0, 10);
    const dayE = entries.filter((e) => e.date === ds);
    return {
      label: d.toLocaleDateString("en-IN", { weekday: "short" }),
      avg: dayE.length ? dayE.reduce((s, e) => s + e.score, 0) / dayE.length : null,
      isToday: ds === today(),
    };
  });
}

export default function MoodTracker() {
  const [entries, setEntries]   = useState<MoodEntry[]>([]);
  const [selected, setSelected] = useState<typeof MOODS[0] | null>(null);
  const [note, setNote]         = useState("");
  const [flash, setFlash]       = useState(false);

  useEffect(() => { setEntries(load()); }, []);

  function logMood() {
    if (!selected) return;
    const now = new Date();
    const entry: MoodEntry = {
      id: Date.now().toString(),
      emoji: selected.emoji, label: selected.label, score: selected.score,
      note: note.trim(),
      time: now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
      date: now.toISOString().slice(0, 10),
    };
    const updated = [entry, ...entries];
    setEntries(updated); save(updated);
    setSelected(null); setNote("");
    setFlash(true); setTimeout(() => setFlash(false), 2000);
  }

  const chart = buildChart(entries);
  const maxH  = 72;
  const scores3 = chart.slice(-3).map((d) => d.avg).filter((v) => v !== null) as number[];
  const downward = scores3.length === 3 && scores3[0] > scores3[1] && scores3[1] > scores3[2];

  function barColor(avg: number) {
    if (avg >= 4) return "#1D9E75";
    if (avg >= 3) return "#EF9F27";
    return "#D85A30";
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-5 max-w-lg mx-auto space-y-5 pb-10">
        {downward && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 flex gap-3">
            <span className="text-xl flex-shrink-0">💛</span>
            <div>
              <p className="text-sm font-medium text-amber-800">Your mood has been declining</p>
              <p className="text-xs text-amber-700 mt-0.5 leading-relaxed">
                MindGuard noticed a downward trend over 3 days.{" "}
                <button className="underline font-medium"
                  onClick={() => window.dispatchEvent(new CustomEvent("mg:inject", {
                    detail: "My mood has been declining for the past few days. Can you help me figure out what's going on?"
                  }))}>
                  Talk about it
                </button>
              </p>
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <p className="text-xs font-medium text-gray-500 mb-3">7-day mood trend</p>
          <div className="flex items-end gap-1.5" style={{ height: maxH + 20 }}>
            {chart.map((day, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                <div className="w-full rounded-t-md transition-all duration-500"
                  style={{
                    height: day.avg !== null ? Math.max(4, (day.avg / 5) * maxH) : 4,
                    background: day.avg !== null ? barColor(day.avg) : "#E5E7EB",
                    opacity: day.isToday ? 1 : 0.7,
                  }} />
                <span className={`text-xs ${day.isToday ? "text-mg-600 font-medium" : "text-gray-400"}`}>
                  {day.label}
                </span>
              </div>
            ))}
          </div>
          <div className="flex gap-4 mt-3">
            {[["#1D9E75","Good"],["#EF9F27","Okay"],["#D85A30","Low"]].map(([c,l]) => (
              <span key={l} className="flex items-center gap-1 text-xs text-gray-400">
                <span className="w-2 h-2 rounded-sm" style={{ background: c }} />{l}
              </span>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs font-medium text-gray-500 mb-2">How are you feeling right now?</p>
          <div className="grid grid-cols-5 gap-2">
            {MOODS.map((m) => (
              <button key={m.label} onClick={() => setSelected(m)}
                className={`flex flex-col items-center gap-1 py-2.5 rounded-xl border transition-all ${
                  selected?.label === m.label
                    ? "border-mg-400 bg-mg-50"
                    : "border-gray-100 bg-white hover:border-mg-100"}`}>
                <span className="text-xl leading-none">{m.emoji}</span>
                <span className="text-xs text-gray-500 leading-tight">{m.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs font-medium text-gray-500 mb-1.5">Add a note (optional)</p>
          <textarea value={note} onChange={(e) => setNote(e.target.value)}
            placeholder="Any triggers, thoughts, or context..."
            rows={2}
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm resize-none focus:outline-none focus:border-mg-400 bg-gray-50" />
        </div>

        <button onClick={logMood} disabled={!selected}
          className="w-full bg-mg-400 hover:bg-mg-600 disabled:opacity-40 text-white py-2.5 rounded-xl text-sm font-medium transition-colors">
          {flash ? "✓ Mood logged!" : "Log my mood"}
        </button>

        {entries.length > 0 && (
          <div>
            <p className="text-xs font-medium text-gray-500 mb-2">Recent entries</p>
            <div className="space-y-2">
              {entries.slice(0, 10).map((e) => (
                <div key={e.id} className="flex items-center gap-3 bg-white rounded-xl border border-gray-100 px-3 py-2.5">
                  <span className="text-xl leading-none">{e.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-medium text-gray-700">{e.label}</span>
                    {e.note && <p className="text-xs text-gray-400 truncate mt-0.5">{e.note}</p>}
                  </div>
                  <span className="text-xs text-gray-400 flex-shrink-0">{e.time}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}