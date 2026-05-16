"use client";

const HELPLINES = [
  { emoji: "🆘", title: "iCall", contact: "9152987821", note: "Mon–Sat · 8am–10pm · Free · Confidential", href: "tel:9152987821", cls: "border-red-200 bg-red-50", cCls: "text-red-900" },
  { emoji: "📞", title: "Vandrevala Foundation", contact: "1860-2662-345", note: "24/7 · Free · All India", href: "tel:18602662345", cls: "border-orange-200 bg-orange-50", cCls: "text-orange-900" },
  { emoji: "🏥", title: "NIMHANS helpline", contact: "080-46110007", note: "National institute · Free", href: "tel:08046110007", cls: "border-blue-200 bg-blue-50", cCls: "text-blue-900" },
  { emoji: "✉️", title: "iCall email support", contact: "icall@tiss.edu", note: "For those who prefer writing", href: "mailto:icall@tiss.edu", cls: "border-purple-200 bg-purple-50", cCls: "text-purple-900" },
];

const TECHNIQUES = [
  { emoji: "🧩", title: "CBT thought record",     tag: "Anxiety · Low mood",      desc: "Identify the negative thought, examine evidence for and against it, then write a more balanced perspective.", prompt: "Guide me through a CBT thought record. I have a negative thought I want to work through." },
  { emoji: "🌬️", title: "4-7-8 breathing",        tag: "Panic · Stress",          desc: "Inhale for 4 counts, hold for 7, exhale slowly for 8. Repeat 4 cycles. Activates your rest-and-digest system.", prompt: "Guide me step by step through a 4-7-8 breathing exercise right now." },
  { emoji: "🎯", title: "5-4-3-2-1 grounding",    tag: "Anxiety · Panic",         desc: "Name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, 1 you taste. Anchors you to the present.", prompt: "Walk me through a 5-4-3-2-1 grounding exercise. I need to calm down." },
  { emoji: "📓", title: "Reflective journalling",  tag: "Processing emotions",     desc: "Structured prompts to help you put feelings into words, spot patterns, and build self-understanding.", prompt: "Give me some journalling prompts to help me process how I am feeling today." },
  { emoji: "🏃", title: "Physical movement break", tag: "Stress · Low energy",     desc: "Even 10 minutes of walking or stretching releases endorphins and reduces cortisol.", prompt: "I need a quick movement or stretching routine I can do right now in my room." },
];

export default function Resources() {
  function inject(prompt: string) {
    window.dispatchEvent(new CustomEvent("mg:inject", { detail: prompt }));
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-5 max-w-lg mx-auto space-y-6 pb-10">
        <div>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">Crisis helplines — India</p>
          <div className="space-y-2.5">
            {HELPLINES.map((h) => (
              <a key={h.title} href={h.href}
                className={`flex items-center gap-3 rounded-xl border p-3.5 hover:opacity-90 transition-opacity ${h.cls}`}>
                <span className="text-2xl flex-shrink-0">{h.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800">{h.title}</p>
                  <p className={`text-sm font-bold ${h.cCls}`}>{h.contact}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{h.note}</p>
                </div>
                <span className="text-gray-400 flex-shrink-0">→</span>
              </a>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">Therapeutic techniques — tap to practice</p>
          <div className="space-y-2.5">
            {TECHNIQUES.map((t) => (
              <button key={t.title} onClick={() => inject(t.prompt)}
                className="w-full text-left bg-white rounded-xl border border-gray-100 p-4 hover:border-mg-400 hover:bg-mg-50 transition-all group">
                <div className="flex items-start gap-3">
                  <span className="text-2xl flex-shrink-0">{t.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-semibold text-gray-800">{t.title}</p>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-mg-50 text-mg-800">{t.tag}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">{t.desc}</p>
                    <p className="text-xs text-mg-600 mt-1.5 font-medium group-hover:underline">Practice with MindGuard →</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <p className="text-xs text-gray-400 text-center leading-relaxed">
          MindGuard is a supportive companion — not a clinical tool. Always consult a qualified mental health professional for serious concerns.
        </p>
      </div>
    </div>
  );
}