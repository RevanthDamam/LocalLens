import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Send, Bot, User, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { chat, BULLET_INSTRUCTION, type OllamaMessage } from "@/lib/ollama";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const SYSTEM_PROMPT = `You are a helpful assistant for LocalLens, a local shop discovery app.
${BULLET_INSTRUCTION}
Answer ONLY about: finding local shops, categories, explore, hours, and how to use the app. If the user asks about anything else (sports, news, general knowledge, other websites, etc.), reply with exactly: "I can only help with LocalLens and local shops. I can't answer other topics." in one short sentence. Do not answer off-topic questions.`;

export function AIChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<OllamaMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([{
        role: "assistant",
        content: "• Ask me about local shops\n• Categories & how to explore\n• I'll keep answers short with bullet points",
      }]);
    }
  }, [open]);

  /** Render message content; assistant messages with bullet lines shown as list */
  function renderContent(content: string, role: string) {
    const lines = content.trim().split(/\n/).filter(Boolean);
    const hasBullets = role === "assistant" && lines.some((l) => /^[\s]*[-*•]\s/.test(l) || /^[\s]*\d+\.\s/.test(l));
    if (role === "user" || !hasBullets)
      return <p className="text-sm leading-relaxed whitespace-pre-wrap">{content}</p>;
    return (
      <ul className="list-none space-y-1.5 text-sm leading-relaxed">
        {lines.map((line, i) => {
          const bullet = line.replace(/^[\s]*[-*•]\s*/, "").replace(/^[\s]*\d+\.\s*/, "").trim();
          if (!bullet) return null;
          return (
            <li key={i} className="flex gap-2">
              <span className="text-primary shrink-0">•</span>
              <span>{bullet}</span>
            </li>
          );
        })}
      </ul>
    );
  }

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    const userMsg: OllamaMessage = { role: "user", content: text };
    setMessages((m) => [...m, userMsg]);
    setLoading(true);
    try {
      const history: OllamaMessage[] = [
        { role: "system", content: SYSTEM_PROMPT },
        ...messages.filter((x) => x.role !== "system"),
        userMsg,
      ];
      const reply = await chat(history);
      setMessages((m) => [...m, { role: "assistant", content: reply }]);
    } catch (err: any) {
      toast.error(err.message || "Could not reach AI. Is Ollama running with phi3:mini?");
      setMessages((m) => [...m, { role: "assistant", content: "Sorry, I couldn't connect. Please make sure Ollama is running (e.g. `ollama run phi3:mini`) and try again." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <motion.button
            className="fixed bottom-6 right-6 z-[100] flex h-14 w-14 cursor-pointer items-center justify-center rounded-full border-2 border-primary/30 bg-primary text-primary-foreground shadow-lg transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring"
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Open AI assistant"
          >
            <MessageCircle className="h-6 w-6" />
          </motion.button>
        </SheetTrigger>
        <SheetContent side="right" className="flex w-full flex-col border-l bg-card sm:max-w-md">
          <SheetHeader className="pb-2">
            <SheetTitle className="flex items-center gap-2 font-display text-lg">
              <Bot className="h-5 w-5 text-primary" />
              LocalLens Assistant
            </SheetTitle>
            <p className="text-xs text-muted-foreground">Short, bullet-point answers</p>
          </SheetHeader>
          <div className="flex flex-1 flex-col gap-3 overflow-hidden pt-2">
            <ScrollArea className="flex-1 pr-2">
              <div className="flex flex-col gap-3">
                <AnimatePresence initial={false}>
                  {messages.map((msg, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className={cn(
                        "flex gap-2.5 rounded-lg px-3 py-2.5",
                        msg.role === "user" ? "ml-6 bg-primary/10" : "mr-6 bg-muted/50"
                      )}
                    >
                      {msg.role === "assistant" ? (
                        <Bot className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                      ) : (
                        <User className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
                      )}
                      <div className="min-w-0 flex-1">{renderContent(msg.content, msg.role)}</div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {loading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex gap-2.5 rounded-lg px-3 py-2.5 mr-6 bg-muted/50"
                  >
                    <Loader2 className="h-4 w-4 shrink-0 animate-spin text-primary" />
                    <p className="text-sm text-muted-foreground">Thinking...</p>
                  </motion.div>
                )}
                <div ref={scrollRef} />
              </div>
            </ScrollArea>
            <div className="flex gap-2 border-t pt-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send()}
                placeholder="Ask about shops, categories..."
                className="flex-1 rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                disabled={loading}
              />
              <Button size="icon" onClick={send} disabled={loading || !input.trim()} className="shrink-0 rounded-lg">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
