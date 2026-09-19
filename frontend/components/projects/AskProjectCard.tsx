"use client";

import { useRef, useState } from "react";
import { Send, Sparkles } from "@/components/ui/Icons";
import { DashboardData } from "@/types/dashboard";

interface Props {
  data: DashboardData;
}

interface Message {
  role: "user" | "ai";
  text: string;
}

const SUGGESTIONS = [
  "Is this project on track?",
  "What's driving the biggest costs?",
  "How much budget is left?",
  "Any risks I should know about?",
];

export default function AskProjectCard({ data }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  async function ask(question: string) {
    const trimmed = question.trim();
    if (!trimmed || loading) return;

    setMessages((prev) => [...prev, { role: "user", text: trimmed }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: trimmed, data }),
      });

      const json = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: res.ok
            ? json.answer
            : "Couldn't reach the AI right now — try again in a moment.",
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: "Something went wrong. Try again." },
      ]);
    } finally {
      setLoading(false);
      requestAnimationFrame(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      });
    }
  }

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-7 backdrop-blur-xl">
      <div className="pointer-events-none absolute -left-16 -top-16 h-56 w-56 rounded-full bg-gradient-to-br from-[#22D3EE] to-[#A78BFA] opacity-[0.10] blur-[90px]" />

      <div className="relative mb-5 flex items-center gap-2">
        <div
          className="flex h-9 w-9 items-center justify-center rounded-2xl text-[#A78BFA]"
          style={{
            background: "linear-gradient(135deg,#A78BFA22,#22D3EE22)",
            boxShadow: "0 0 20px rgba(167,139,250,0.35)",
          }}
        >
          <Sparkles size={16} />
        </div>
        <h2 className="text-[1.2rem] font-semibold tracking-tight text-[#F5F5F7] [font-family:var(--font-display)]">
          Ask this project
        </h2>
      </div>

      {messages.length === 0 ? (
        <div className="relative mb-5 flex flex-wrap gap-2">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => ask(s)}
              className="rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-2 text-[13px] text-[#9A97A6] transition hover:border-white/20 hover:bg-white/[0.08] hover:text-[#F5F5F7]"
            >
              {s}
            </button>
          ))}
        </div>
      ) : (
        <div className="relative mb-5 max-h-72 space-y-4 overflow-y-auto pr-1">
          {messages.map((m, i) => (
            <div
              key={i}
              className={
                m.role === "user" ? "flex justify-end" : "flex justify-start"
              }
            >
              <div
                className={
                  m.role === "user"
                    ? "max-w-[85%] rounded-2xl rounded-br-md bg-white/[0.08] px-4 py-2.5 text-[14px] text-[#F5F5F7]"
                    : "max-w-[85%] rounded-2xl rounded-bl-md border border-white/10 px-4 py-2.5 text-[14px] leading-relaxed text-[#F5F5F7]"
                }
                style={
                  m.role === "ai"
                    ? {
                        background:
                          "linear-gradient(135deg,#22D3EE0D,#A78BFA0D)",
                      }
                    : undefined
                }
              >
                {m.text}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-md border border-white/10 px-4 py-3">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#9A97A6]" />
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#9A97A6] [animation-delay:150ms]" />
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#9A97A6] [animation-delay:300ms]" />
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          ask(input);
        }}
        className="relative flex items-center gap-2"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask anything about this project…"
          className="flex-1 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2.5 text-[14px] text-[#F5F5F7] outline-none transition placeholder:text-[#6B6875] focus:border-[#22D3EE]/50 focus:bg-white/[0.06]"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white shadow-[0_0_20px_rgba(34,211,238,0.35)] transition-transform hover:scale-105 disabled:opacity-40 disabled:hover:scale-100"
          style={{ background: "linear-gradient(135deg,#22D3EE,#A78BFA)" }}
        >
          <Send size={15} />
        </button>
      </form>
    </div>
  );
}
