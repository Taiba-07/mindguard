"use client";
import { useState, useEffect } from "react";
import { AssessmentRecord } from "@/lib/types";

const QS = [
  "Feeling down, depressed, or hopeless",
  "Little interest or pleasure in things you usually enjoy",
  "Feeling nervous, anxious, or on edge",
  "Not being able to stop or control worrying",
  "Trouble falling or staying asleep, or sleeping too much",
  "Feeling tired or having very little energy",
  "Trouble concentrating on studies, work, or daily tasks",
];

const OPTS = ["Not at all", "Several days", "More than half", "Nearly every day"];
const KEY = "mg_assess";

function level(score: number) {
  if (score <= 4)  return { label: "Minimal",     cls: "bg-green-50 border-green-200",  textCls: "text-green-800",  advice: "Your responses suggest minimal distress. Keep up with sleep, movement, and social connection." };
  if (score <= 9)  return { label: "Mild",        cls: "bg-amber-50 border-amber-200",  textCls: "text-amber-800",  advice: "Mild distress is very common in college. Small changes like journalling, exercise, talking to a friend can make a real difference." };
  if (score <= 14) return { label: "Moderate",    cls: "bg-orange-50 border-orange-200",textCls: "text-orange-800", advice: "You may be going through a genuinely difficult period. Please consider speaking to a counsellor — iCall (9152987821) offers free, confidential support." };
  return           { label: "Significant", cls: "bg-red-50 border-red-200",    textCls: "text-red-800",    advice: "Please reach out for professional support today — iCall: 9152987821 or Vandrevala: 1860-2662-345. You are not alone." };
}

export default function Assessment() {
  const [answers, setAnswers]     = useState<(number|null)[]>(Array(QS.length).fill(null));
  const [submitted, setSubmitted] = useState(false);
  const [history, setHistory]     = useState<AssessmentRecord[]>([]);

  useEffect(() => {
    try { setHistory(JSON.parse(localStorage.getItem(KEY) ?? "[]")); } catch { /**/ }
  }, []);

  const answered = answers.filter((a) => a !== null).length;
  const score    = submitted ? (answers as number[]).reduce((s, a) => s + a, 0) : null;
  const result   = score !== null ? level(score) : null;

  function submit() {
    if (answered < QS.length) return;
    const s = (answers as number[]).reduce((a, b) => a + b, 0);
    const res = level(s);
    const rec: AssessmentRecord = {
      date: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "2-digit" }),
      score: s, level: res.label,
    };
    const updated = [rec, ...history].slice(0, 10);
    setHistory(updated);
    localStorage.setItem(KEY, JSON.stringify(updated));
    setSubmitted(true);
  }

  function reset() { setAnswers(Array(QS.length).fill(null)); setSubmitted(false); }

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-5 max-w-lg mx-auto space-y-4 pb-10">
        <p className="text-xs text-gray-400 leading-relaxed">
          Based on PHQ-9 and GAD-7 patterns. Over the <strong className="font-medium">past 2 weeks</strong>, how often have you experienced each of the following?
        </p>

        {!submitted ? (
          <>
            {QS.map((q, qi) => (
              <div key={qi} className="bg-white rounded-xl border border-gray-100 p-4">
                <p className="text-sm text-gray-700 mb-3 leading-relaxed">
                  <span className="font-medium text-gray-400 mr-1">{qi + 1}.</span>{q}
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {OPTS.map((opt, oi) => (
                    <button key={oi}
                      onClick={() => { const a = [...answers]; a[qi] = oi; setAnswers(a); }}
                      className={`text-xs px-3 py-2.5 rounded-lg border text-left transition-all leading-tight ${
                        answers[qi] === oi
                          ? "border-mg-400 bg-mg-50 text-mg-800 font-medium"
                          : "border-gray-100 text-gray-500 hover:border-mg-100"}`}>
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            ))}
            <div className="flex items-center justify-between pt-1">
              <span className="text-xs text-gray-400">{answered} of {QS.length} answered</span>
              <button onClick={submit} disabled={answered < QS.length}
                className="bg-mg-400 hover:bg-mg-600 disabled:opacity-40 text-white px-5 py-2 rounded-xl text-sm font-medium transition-colors">
                See my results
              </button>
            </div>
          </>
        ) : result && score !== null && (
          <>
            <div className={`rounded-xl border p-5 ${result.cls}`}>
              <div className="flex items-baseline gap-2 mb-2">
                <span className={`text-base font-semibold ${result.textCls}`}>{result.label} distress</span>
                <span className={`text-sm opacity-60 ${result.textCls}`}>— Score: {score}/{QS.length * 3}</span>
              </div>
              <p className={`text-sm leading-relaxed ${result.textCls}`}>{result.advice}</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => window.dispatchEvent(new CustomEvent("mg:inject", {
                  detail: `I just completed a wellbeing check-in and scored ${score} out of ${QS.length * 3}. The result says "${result.label} distress". Can you help me understand what this means?`
                }))}
                className="flex-1 bg-mg-400 hover:bg-mg-600 text-white py-2.5 rounded-xl text-sm font-medium transition-colors">
                Talk to MindGuard about this
              </button>
              <button onClick={reset}
                className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-500 hover:bg-gray-50 transition-colors">
                Retake
              </button>
            </div>
            {history.length > 1 && (
              <div className="bg-white rounded-xl border border-gray-100 p-4">
                <p className="text-xs font-medium text-gray-500 mb-3">Your assessment history</p>
                <div className="space-y-2.5">
                  {history.map((h, i) => (
                    <div key={i} className="flex items-center justify-between text-sm">
                      <span className="text-gray-400 text-xs">{h.date}</span>
                      <span className="font-medium text-gray-700 text-xs">{h.level}</span>
                      <span className="text-gray-400 text-xs">Score: {h.score}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}