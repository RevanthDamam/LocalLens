const OLLAMA_BASE = import.meta.env.VITE_OLLAMA_URL ?? "/api/ollama";

export interface OllamaMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface OllamaChatResponse {
  message: { role: string; content: string };
  done: boolean;
}

const MODEL = "phi3:mini";

/** Append instruction so the model keeps replies short with bullet points */
export const BULLET_INSTRUCTION = "Reply in 2-5 short bullet points. Be concise. Use a single line per bullet.";

export async function chat(messages: OllamaMessage[]): Promise<string> {
  const res = await fetch(`${OLLAMA_BASE}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model: MODEL, messages, stream: false }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Ollama error: ${res.status}`);
  }
  const data = await res.json();
  return data.message?.content ?? "";
}

export function isOllamaConfigured(): boolean {
  return true;
}
