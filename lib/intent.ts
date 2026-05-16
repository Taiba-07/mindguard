export type Intent = "vent" | "technique" | "info" | "general";

export function classifyIntent(text: string): Intent {
  const t = text.toLowerCase();

  if (/breath|calm down|groun|meditat|panic attack|relax|anxiety attack/.test(t))
    return "technique";

  if (/counsel|therapist|professional|helpline|doctor|resource|refer|where can i/.test(t))
    return "info";

  if (/feel|feeling|sad|hopeless|stress|overwhelm|lonely|lost|cry|numb|tired|exhausted|depressed|anxious/.test(t))
    return "vent";

  return "general";
}