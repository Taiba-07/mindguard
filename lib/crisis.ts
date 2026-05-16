const CRISIS_WORDS = [
  "kill myself", "want to die", "end my life", "suicide", "suicidal",
  "self harm", "self-harm", "hurt myself", "cut myself",
  "no reason to live", "better off dead", "don't want to be here",
  "can't go on", "ending it all", "end it all",
];

export function detectCrisis(text: string): boolean {
  const lower = text.toLowerCase();
  return CRISIS_WORDS.some((w) => lower.includes(w));
}