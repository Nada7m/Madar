import { useEffect, useRef, useState } from "react";
import { Bot, Send, Sparkles, X, ArrowLeft } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { getCityAssistantReply } from "@/data/ai-city-assistant";
import { getLocale } from "@/lib/i18n";

const suggestedPrompts = [
  "ما هو مشروع رؤى المدينة؟",
  "ما أفضل الفنادق القريبة من المسجد النبوي؟",
  "اقترح أماكن للزيارة في المدينة",
  "ما المشاريع السياحية؟",
  "ما أهم معالم المدينة؟",
];

type ChatMessage = {
  id: number;
  role: "user" | "assistant";
  text: string;
  projectId?: string;
};

export function CityAssistant() {
  const [open, setOpen] = useState(false);
  const [locale, setLocale] = useState(getLocale);
  const [input, setInput] = useState("");
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const dragRef = useRef<{ id: number; offsetX: number; offsetY: number } | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      role: "assistant",
      text: "أهلاً بك! أنا مساعد مدار الذكي. أسألني عن مشاريع المدينة، الفنادق، أو أماكن الزيارة.",
    },
  ]);

  useEffect(() => {
    const openAssistant = () => setOpen(true);
    const updateLocale = () => setLocale(getLocale());
    window.addEventListener("madar-open-city-assistant", openAssistant);
    window.addEventListener("madar-language-change", updateLocale);
    return () => {
      window.removeEventListener("madar-open-city-assistant", openAssistant);
      window.removeEventListener("madar-language-change", updateLocale);
    };
  }, []);

  useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      if (!dragRef.current) return;

      const nextX = Math.min(
        Math.max(event.clientX - dragRef.current.offsetX, 8),
        window.innerWidth - 180,
      );
      const nextY = Math.min(
        Math.max(event.clientY - dragRef.current.offsetY, 8),
        window.innerHeight - 80,
      );

      setPosition({ x: nextX, y: nextY });
    };

    const handlePointerUp = () => {
      dragRef.current = null;
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
    window.addEventListener("pointercancel", handlePointerUp);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointercancel", handlePointerUp);
    };
  }, []);

  const handleDragStart = (event: React.PointerEvent<HTMLButtonElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    dragRef.current = {
      id: event.pointerId,
      offsetX: event.clientX - rect.left,
      offsetY: event.clientY - rect.top,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const sendMessage = (value?: string) => {
    const trimmed = (value ?? input).trim();
    if (!trimmed) return;

    const userMessage: ChatMessage = {
      id: Date.now() + 1,
      role: "user",
      text: trimmed,
    };

    const assistantReply = getCityAssistantReply(trimmed);
    const responseMessage: ChatMessage = {
      id: Date.now() + 2,
      role: "assistant",
      text: assistantReply.answer,
      projectId: assistantReply.projectId,
    };

    setMessages((prev) => [...prev, userMessage, responseMessage]);
    setInput("");
  };

  return (
    <>
      <button
        type="button"
        onPointerDown={handleDragStart}
        onClick={() => setOpen((prev) => !prev)}
        aria-label={locale === "ar" ? "مساعد مدار الذكي" : "Madar Smart Assistant"}
        aria-expanded={open}
        className="fixed z-50 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-bold text-primary-foreground shadow-[0_18px_40px_rgba(14,40,36,0.45)] transition hover:scale-[1.02]"
        style={{ left: `${position.x}px`, top: `${position.y}px`, touchAction: "none" }}
      >
        <Sparkles className="h-4 w-4" />
        {locale === "ar" ? "اكتشف المدينة" : "Discover Madinah"}
      </button>

      {open && (
        <div
          className="fixed z-50 w-[min(420px,calc(100vw-1.5rem))] overflow-hidden rounded-3xl border border-border bg-card shadow-[0_28px_80px_rgba(15,23,42,0.25)]"
          style={{ left: `${Math.min(position.x + 10, window.innerWidth - 430)}px`, top: `${Math.min(position.y + 62, window.innerHeight - 280)}px` }}
        >
          <div className="flex items-center justify-between border-b border-border bg-secondary px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Bot className="h-4 w-4" />
              </div>
              <div>
                <div className="text-sm font-bold text-foreground">اكتشف المدينة</div>
                <div className="text-[10px] text-muted-foreground">مساعد ذكي تجريبي</div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-full p-1.5 text-muted-foreground hover:bg-background"
              aria-label="إغلاق المساعد"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="max-h-[420px] space-y-3 overflow-y-auto bg-background p-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-7 ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "border border-border bg-card text-foreground"
                  }`}
                  style={{ whiteSpace: "pre-line" }}
                >
                  {message.text}
                  {message.projectId && message.role === "assistant" && (
                    <div className="mt-3">
                      <Link
                        to="/projects/$id"
                        params={{ id: message.projectId }}
                        className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-[11px] font-semibold text-primary hover:bg-secondary/80"
                      >
                        عرض المشروع <ArrowLeft className="h-3 w-3" />
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-border bg-card p-3">
            <div className="mb-2 flex flex-wrap gap-2">
              {suggestedPrompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => sendMessage(prompt)}
                  className="rounded-full border border-border bg-secondary px-2.5 py-1.5 text-[11px] text-foreground hover:bg-muted"
                >
                  {prompt}
                </button>
              ))}
            </div>

            <div className="flex items-end gap-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                rows={2}
                className="w-full resize-none rounded-2xl border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                placeholder="اكتب سؤالك عن المدينة..."
              />
              <button
                type="button"
                onClick={() => sendMessage()}
                className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground transition hover:opacity-90"
                aria-label="إرسال السؤال"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
