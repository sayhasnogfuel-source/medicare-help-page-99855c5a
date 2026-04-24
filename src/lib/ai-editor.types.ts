export interface ChatTurn {
  role: "user" | "assistant";
  text: string;
}

export interface EditResult {
  patch: Record<string, unknown> | null;
  reply: string;
  error?: string;
}