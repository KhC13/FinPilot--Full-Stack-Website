'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Sparkles, MessageCircle } from 'lucide-react';
import Navbar from '@/components/Navbar';
import AuthGuard from '@/components/AuthGuard';
import GlassCard from '@/components/GlassCard';
import { chatApi, ChatMessage } from '@/lib/authApi';
import { useFinancial } from '@/lib/FinancialContext';

const STARTER_QUESTIONS = [
  'How can I improve my financial health score?',
  'What SIPs should I start with Rs. 5,000/month?',
  'How much emergency fund do I need?',
  'Should I pay off debt or invest first?',
  'How do I start investing in mutual funds?'
];

export default function ChatPage() {
  const { inputs } = useFinancial();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function sendMessage(content: string) {
    if (!content.trim() || loading) return;
    const userMsg: ChatMessage = { role: 'user', content: content.trim() };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput('');
    setLoading(true);

    try {
      const { reply } = await chatApi.send(updated, {
        income: inputs.income,
        expenses: inputs.expenses,
        savings: inputs.savings,
        debt: inputs.debt
      });
      setMessages([...updated, { role: 'assistant', content: reply }]);
    } catch (err: any) {
      setMessages([...updated, {
        role: 'assistant',
        content: `Sorry, I couldn't respond right now. Please try again. (${err.message})`
      }]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  }

  return (
    <AuthGuard>
      <main className="relative min-h-screen">
  {/* Background image with dark overlay so text stays readable */}
  <div
    className="pointer-events-none fixed inset-0 -z-10"
    style={{
      backgroundImage: 'url(/adv.png)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed'
    }}
  />
  {/* Dark overlay — adjust opacity to taste (currently 80%) */}
  <div className="pointer-events-none fixed inset-0 -z-10 bg-base-950/60" />
        <Navbar />
        <div className="mx-auto flex max-w-4xl flex-col px-6 py-14 md:px-10" style={{ height: 'calc(100vh - 73px)' }}>

          <GlassCard className="flex flex-1 flex-col overflow-hidden p-0">

            {/* Header */}
            <div className="flex items-center gap-4 border-b border-glass-border px-6 py-5">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-primary shadow-glow">
                <Bot className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="section-eyebrow">AI Financial Advisor</p>
                <h2 className="font-display text-lg font-semibold text-ink">Ask FinPilot anything</h2>
              </div>
            </div>

            {/* Messages area */}
            <div className="flex-1 space-y-4 overflow-y-auto p-6 no-scrollbar">

              {messages.length === 0 && (
                <div className="flex flex-col items-center py-10 text-center">
                  <MessageCircle className="h-12 w-12 text-ink-faint mb-4" />
                  <p className="font-display text-base font-semibold text-ink">Your personal financial advisor</p>
                  <p className="mt-2 max-w-sm text-sm text-ink-muted">
                    Ask anything about budgeting, investing, debt, or your FinPilot numbers. I'll give advice tailored to your financial profile.
                  </p>

                  {/* Starter questions */}
                  <div className="mt-6 flex flex-wrap justify-center gap-2">
                    {STARTER_QUESTIONS.map(q => (
                      <button
                        key={q}
                        onClick={() => sendMessage(q)}
                        className="rounded-xl border border-glass-border bg-glass px-3.5 py-2 text-xs text-ink-muted transition-all hover:border-accent-purple/40 hover:bg-accent-purple/10 hover:text-ink"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((msg, i) => (
                <div key={i} className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  {/* Avatar */}
                  <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${msg.role === 'user' ? 'bg-accent-purple/20 border border-accent-purple/30' : 'bg-gradient-primary shadow-glow'}`}>
                    {msg.role === 'user'
                      ? <User className="h-4 w-4 text-accent-purple" />
                      : <Bot className="h-4 w-4 text-white" />
                    }
                  </div>

                  {/* Bubble */}
                  <div className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'rounded-tr-sm bg-accent-purple/20 border border-accent-purple/25 text-ink'
                      : 'rounded-tl-sm glass-panel text-ink'
                  }`}>
                    {msg.content.split('\n').map((line, j) => (
                      <span key={j}>
                        {line}
                        {j < msg.content.split('\n').length - 1 && <br />}
                      </span>
                    ))}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-primary shadow-glow">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                  <div className="glass-panel rounded-2xl rounded-tl-sm px-4 py-3">
                    <Loader2 className="h-4 w-4 animate-spin text-ink-muted" />
                  </div>
                </div>
              )}

              <div ref={bottomRef} />
            </div>

            {/* Input bar */}
            <div className="border-t border-glass-border p-4">
              <div className="flex items-center gap-3">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && sendMessage(input)}
                  placeholder="Ask your financial advisor…"
                  className="input-field flex-1"
                  disabled={loading}
                />
                <button
                  onClick={() => sendMessage(input)}
                  disabled={loading || !input.trim()}
                  className="btn-primary shrink-0 !px-4 !py-2.5 disabled:opacity-50"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
              <p className="mt-2 text-center text-[11px] text-ink-faint">
                AI advice is informational only — not a substitute for a certified financial planner.
              </p>
            </div>
          </GlassCard>
        </div>
      </main>
    </AuthGuard>
  );
}
