export type Role = "user" | "assistant";

export interface ChatMessage {
  role: Role;
  content: string;
}

export interface MoodEntry {
  id: string;
  emoji: string;
  label: string;
  score: number;
  note: string;
  time: string;
  date: string;
}

export interface AssessmentRecord {
  date: string;
  score: number;
  level: string;
}