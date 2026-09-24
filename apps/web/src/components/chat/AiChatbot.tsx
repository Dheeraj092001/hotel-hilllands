import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Sparkles,
  MessageSquare,
  X,
  RotateCcw,
  Send,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import { ChatMessage } from "../../types/chat";
import {
  INITIAL_QUICK_PROMPTS,
  processConciergeQuery,
} from "../../services/aiConciergeService";

export default function AiChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome-1",
      sender: "concierge",
      timestamp: "Just now",
      text: "Namaste & warm greetings from Hotel Newlands Shimla! I am **Aria**, your personal Himalayan AI Concierge. How may I assist your journey or reservation today?",
      suggestions: [
        "Tell me about Cedar Ridge Deluxe Room",
        "Best room for couples?",
        "When does it snow in Shimla?",
        "Dining & High Tea options",
      ],
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setHasUnread(false);
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      inputRef.current?.focus();
    }
  }, [isOpen, messages, isTyping]);

  const handleSend = (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Simulate concierge thoughtful response
    setTimeout(() => {
      const reply = processConciergeQuery(query);
      setMessages((prev) => [...prev, reply]);
      setIsTyping(false);
    }, 600);
  };

  const handleReset = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: "concierge",
        timestamp: "Just now",
        text: "Conversation refreshed. How else may I assist with your stay at Hotel Newlands Shimla?",
        suggestions: [
          "Cedar Ridge Deluxe Room details",
          "What dining options are available?",
          "How do I reach the hotel from Mall Road?",
        ],
      },
    ]);
  };

  return (
    <aside aria-label="AI Concierge Assistant" className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50">
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-2.5 bg-deep-forest text-warm-ivory pl-4 pr-5 py-3.5 rounded-full shadow-2xl hover:bg-forest-dark border border-sand/30 transition-all duration-300 hover:scale-105"
          aria-label="Open AI Concierge Chat"
        >
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sand opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-sand" />
          </span>
          <div className="w-8 h-8 rounded-full bg-sand/20 flex items-center justify-center text-sand">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="text-left">
            <span className="block text-xs font-serif tracking-wider font-semibold text-warm-ivory">
              Ask Aria
            </span>
            <span className="block text-[10px] text-sand/80 uppercase tracking-widest -mt-0.5">
              AI Concierge
            </span>
          </div>
          {hasUnread && (
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-terracotta rounded-full border-2 border-white" />
          )}
        </button>
      )}

      {/* Chat Window Drawer */}
      {isOpen && (
        <div className="w-[calc(100vw-2.5rem)] sm:w-[410px] h-[580px] max-h-[85vh] bg-warm-ivory rounded-2xl shadow-2xl border border-black/10 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <div className="bg-deep-forest text-warm-ivory p-4 flex items-center justify-between border-b border-sand/20">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-9 h-9 rounded-full bg-sand/20 flex items-center justify-center text-sand border border-sand/30">
                  <Sparkles className="w-4 h-4" />
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-deep-forest" />
              </div>
              <div>
                <h3 className="font-display text-base tracking-wide font-medium flex items-center gap-1.5 text-warm-ivory">
                  Aria <span className="text-[10px] bg-sand/20 text-sand px-1.5 py-0.5 rounded uppercase tracking-wider">AI</span>
                </h3>
                <p className="text-[11px] text-warm-ivory/70">Newlands Himalayan Concierge</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleReset}
                title="Restart conversation"
                className="p-1.5 text-warm-ivory/70 hover:text-warm-ivory hover:bg-white/10 rounded-lg transition-colors"
                aria-label="Restart chat"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Close chat"
                className="p-1.5 text-warm-ivory/70 hover:text-warm-ivory hover:bg-white/10 rounded-lg transition-colors"
                aria-label="Close chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-sm">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
              >
                <div
                  className={`max-w-[88%] p-3.5 rounded-2xl leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-deep-forest text-warm-ivory rounded-br-none shadow-sm"
                      : "bg-white text-charcoal border border-black/8 rounded-bl-none shadow-sm"
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>

                  {/* Room Card Preview */}
                  {msg.roomCard && (
                    <div className="mt-3 overflow-hidden rounded-xl border border-black/10 bg-warm-ivory/50">
                      <img
                        src={msg.roomCard.image}
                        alt={msg.roomCard.name}
                        className="w-full h-32 object-cover"
                      />
                      <div className="p-3">
                        <div className="flex justify-between items-baseline gap-2">
                          <h4 className="font-display font-semibold text-charcoal text-sm">
                            {msg.roomCard.name}
                          </h4>
                          <span className="text-xs font-bold text-deep-forest whitespace-nowrap">
                            ₹{msg.roomCard.price.toLocaleString("en-IN")}/nt
                          </span>
                        </div>
                        <p className="text-[11px] text-muted-stone mt-1 line-clamp-2">
                          {msg.roomCard.tagline}
                        </p>
                        <div className="mt-2.5 flex items-center gap-2">
                          <Link
                            to={`/rooms/${msg.roomCard.id}`}
                            onClick={() => setIsOpen(false)}
                            className="flex-1 text-center text-xs py-1.5 px-2 bg-deep-forest text-warm-ivory rounded font-medium hover:bg-forest-dark transition-colors"
                          >
                            View Suite
                          </Link>
                          <Link
                            to={`/book?room=${msg.roomCard.id}`}
                            onClick={() => setIsOpen(false)}
                            className="flex-1 text-center text-xs py-1.5 px-2 bg-sand text-deep-forest rounded font-medium hover:bg-sand/90 transition-colors"
                          >
                            Book Room
                          </Link>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  {msg.actionButtons && msg.actionButtons.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {msg.actionButtons.map((btn, idx) => (
                        <Link
                          key={idx}
                          to={btn.url || "/rooms"}
                          onClick={() => setIsOpen(false)}
                          className="inline-flex items-center gap-1 text-xs px-2.5 py-1.5 bg-deep-forest/5 text-deep-forest border border-deep-forest/20 rounded-full font-medium hover:bg-deep-forest hover:text-warm-ivory transition-colors"
                        >
                          {btn.label}
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                <span className="text-[10px] text-muted-stone mt-1 px-1">{msg.timestamp}</span>

                {/* Suggested followups */}
                {msg.suggestions && msg.suggestions.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5 max-w-[90%]">
                    {msg.suggestions.map((sug, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSend(sug)}
                        className="text-[11px] px-2.5 py-1 bg-white hover:bg-sand/20 text-deep-forest border border-black/10 rounded-full transition-all text-left shadow-2xs hover:border-deep-forest/30"
                      >
                        {sug}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 text-xs text-muted-stone">
                <div className="w-6 h-6 rounded-full bg-deep-forest/10 flex items-center justify-center text-deep-forest">
                  <Sparkles className="w-3 h-3 animate-pulse" />
                </div>
                <div className="flex items-center gap-1 p-2 bg-white rounded-xl border border-black/8 shadow-2xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-deep-forest animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-deep-forest animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-deep-forest animate-bounce" />
                </div>
                <span>Aria is consulting the estate ledger...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Carousel */}
          <div className="px-3 py-2 bg-black/[0.02] border-t border-black/5 overflow-x-auto flex gap-1.5 no-scrollbar">
            {INITIAL_QUICK_PROMPTS.map((prompt) => (
              <button
                key={prompt.id}
                onClick={() => handleSend(prompt.query)}
                className="whitespace-nowrap text-[11px] px-2.5 py-1 rounded-full bg-white hover:bg-sand/30 border border-black/10 text-charcoal/80 transition-colors shrink-0"
              >
                {prompt.label}
              </button>
            ))}
          </div>

          {/* Input Area */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-white border-t border-black/10 flex items-center gap-2"
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Aria about suites, dining, snow, or booking..."
              className="flex-1 bg-warm-ivory/50 border border-black/10 rounded-full px-3.5 py-2 text-xs text-charcoal placeholder:text-muted-stone focus:outline-none focus:border-deep-forest focus:ring-1 focus:ring-deep-forest"
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="w-8 h-8 rounded-full bg-deep-forest text-warm-ivory flex items-center justify-center hover:bg-forest-dark disabled:opacity-40 disabled:hover:bg-deep-forest transition-colors shrink-0"
              aria-label="Send message"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </aside>
  );
}
