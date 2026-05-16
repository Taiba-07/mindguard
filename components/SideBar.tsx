"use client";

type Page = "chat" | "mood" | "assess" | "resources";
interface Props { current: Page; onNavigate: (p: Page) => void; }

const NAV: { id: Page; emoji: string; label: string; sub: string }[] = [
  { id: "chat",      emoji: "💬", label: "AI Chat",    sub: "Talk to MindGuard" },
  { id: "assess",    emoji: "✅", label: "Check-in",   sub: "Wellbeing reflection" },
  { id: "resources", emoji: "📄", label: "Resources",  sub: "Therapy & crisis" },
  { id: "mood",      emoji: "📊", label: "Mood Log",   sub: "Track your day" },
];

export default function Sidebar({ current, onNavigate }: Props) {
  return (
    <aside className="w-52 bg-white border-r border-gray-100 flex flex-col flex-shrink-0 h-full">
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-mg-400 rounded-xl flex items-center justify-center">
            <span className="text-white text-sm font-bold">MG</span>
          </div>
          <div>
            <div className="text-sm font-semibold text-gray-900 leading-tight">MindGuard</div>
            <div className="text-xs text-gray-400 leading-tight">AI Support · India</div>
          </div>
        </div>
      </div>
      <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto">
        {NAV.map((item) => (
          <button key={item.id} onClick={() => onNavigate(item.id)}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-left transition-all ${
              current === item.id
                ? "bg-mg-50 text-mg-800"
                : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"}`}>
            <span className="text-base leading-none">{item.emoji}</span>
            <div>
              <div className="text-xs font-medium leading-tight">{item.label}</div>
              <div className="text-xs opacity-60 leading-tight">{item.sub}</div>
            </div>
          </button>
        ))}
      </nav>
      <div className="p-3 border-t border-gray-100">
        <div className="bg-red-50 border border-red-100 rounded-lg p-2.5">
          <p className="text-xs font-medium text-red-800 mb-0.5">Crisis helpline</p>
          <a href="tel:9152987821" className="text-xs text-red-700 underline block">iCall: 9152987821</a>
          <a href="tel:18602662345" className="text-xs text-red-700 underline block">Vandrevala: 1860-2662-345</a>
        </div>
      </div>
    </aside>
  );
}