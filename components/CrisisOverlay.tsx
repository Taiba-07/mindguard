"use client";

export default function CrisisOverlay({ onDismiss }: { onDismiss: () => void }) {
  return (
    <div className="absolute inset-0 z-50 bg-red-50 flex items-center justify-center p-6">
      <div className="bg-white border-2 border-red-300 rounded-2xl p-8 max-w-sm w-full text-center">
        <div className="text-5xl mb-4">🆘</div>
        <h2 className="text-lg font-semibold text-red-800 mb-2">You are not alone</h2>
        <p className="text-sm text-red-700 leading-relaxed mb-6">
          It sounds like you may be going through something very painful. Please reach out to someone who can truly help right now.
        </p>
        <div className="space-y-3 mb-6">
          <a href="tel:9152987821" className="flex flex-col items-center bg-red-600 hover:bg-red-700 text-white rounded-xl py-3 px-4 transition-colors">
            <span className="font-semibold text-sm">iCall — 9152987821</span>
            <span className="text-xs opacity-80 mt-0.5">Mon–Sat · 8am–10pm · Free · Confidential</span>
          </a>
          <a href="tel:18602662345" className="flex flex-col items-center bg-orange-500 hover:bg-orange-600 text-white rounded-xl py-3 px-4 transition-colors">
            <span className="font-semibold text-sm">Vandrevala — 1860-2662-345</span>
            <span className="text-xs opacity-80 mt-0.5">Available 24/7 · Free · All India</span>
          </a>
          <a href="tel:08046110007" className="flex flex-col items-center bg-blue-500 hover:bg-blue-600 text-white rounded-xl py-3 px-4 transition-colors">
            <span className="font-semibold text-sm">NIMHANS — 080-46110007</span>
            <span className="text-xs opacity-80 mt-0.5">National mental health helpline</span>
          </a>
        </div>
        <button onClick={onDismiss} className="text-xs text-gray-400 underline hover:text-gray-600">
          I am safe — continue to MindGuard
        </button>
      </div>
    </div>
  );
}