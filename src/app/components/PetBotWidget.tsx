"use client";

import React, { useState, useEffect, useRef } from "react";
import { HiChatBubbleLeftRight, HiXMark, HiPaperAirplane, HiSparkles } from "react-icons/hi2";
import { useLanguage, useT } from "../../i18n/LanguageContext";

interface Message {
  role: "user" | "model";
  content: string;
}

export default function PetBotWidget() {
  const t = useT();
  const { locale } = useLanguage();
  
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize with welcome message if empty
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          role: "model",
          content: t("petbot.welcome"),
        },
      ]);
    }
  }, [locale, messages.length, t]);

  // Scroll to bottom whenever messages list changes
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    }
  }, [isOpen]);

  const handleSendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const newMessages: Message[] = [...messages, { role: "user", content: trimmed }];
    setMessages(newMessages);
    setInputValue("");
    setLoading(true);

    try {
      const res = await fetch("/api/petbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages,
          lang: locale,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Error generating response");
      }

      setMessages((prev) => [...prev, { role: "model", content: data.response }]);
    } catch (err: any) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          content:
            locale === "fr"
              ? "Désolé, une erreur est survenue lors de la connexion à PetBot. Veuillez réessayer."
              : "Sorry, an error occurred while connecting to PetBot. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(inputValue);
  };

  const chips = [
    { text: t("petbot.chip_create") },
    { text: t("petbot.chip_write") },
    { text: t("petbot.chip_work") },
    { text: t("petbot.chip_signatures") },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      
      {/* Chat Window Panel */}
      {isOpen && (
        <div className="glass-card mb-4 rounded-3xl w-[360px] sm:w-[380px] h-[520px] shadow-2xl flex flex-col justify-between border border-white/10 overflow-hidden animate-fadeIn relative z-50">
          
          {/* Header */}
          <div className="bg-neutral-950/60 px-5 py-4 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-green-500 to-emerald-600 flex items-center justify-center text-lg text-white shadow-md shadow-green-500/10">
                🐾
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <h4 className="font-extrabold text-sm text-white font-display leading-none">PetBot</h4>
                  <span className="px-1.5 py-0.5 bg-green-500/20 text-green-455 text-[8px] font-extrabold rounded-md uppercase tracking-wider">
                    {t("petbot.badge")}
                  </span>
                </div>
                <div className="flex items-center space-x-1.5 mt-1">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-[10px] text-neutral-500 font-semibold uppercase tracking-wider">En ligne</span>
                </div>
              </div>
            </div>
            
            <button
              onClick={() => setIsOpen(false)}
              className="text-neutral-455 hover:text-white p-1 rounded-lg hover:bg-white/5 border border-transparent transition-all cursor-pointer"
            >
              <HiXMark className="text-base" />
            </button>
          </div>

          {/* Messages Body */}
          <div className="flex-grow overflow-y-auto p-4 space-y-4 scrollbar-hidden bg-neutral-950/10">
            {messages.map((msg, index) => {
              const isBot = msg.role === "model";
              return (
                <div
                  key={index}
                  className={`flex ${isBot ? "justify-start" : "justify-end"} animate-fadeIn`}
                >
                  <div
                    className={`max-w-[82%] px-4 py-3 rounded-2xl text-xs leading-relaxed whitespace-pre-wrap ${
                      isBot
                        ? "bg-neutral-900/60 border border-white/5 text-neutral-250 rounded-tl-sm font-light"
                        : "bg-green-500/15 border border-green-500/20 text-white rounded-tr-sm font-medium"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              );
            })}

            {/* Typing Indicator */}
            {loading && (
              <div className="flex justify-start animate-pulse">
                <div className="bg-neutral-900/60 border border-white/5 px-4 py-3 rounded-2xl rounded-tl-sm flex space-x-1 items-center h-8">
                  <span className="w-1.5 h-1.5 bg-neutral-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-1.5 h-1.5 bg-neutral-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-1.5 h-1.5 bg-neutral-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Quick chips (only visible when conversation is fresh, i.e., only welcome message) */}
          {messages.length === 1 && !loading && (
            <div className="px-4 py-2 border-t border-white/5 bg-neutral-950/20 flex flex-col space-y-1.5">
              <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider pl-1">Suggestions</span>
              <div className="flex flex-wrap gap-1.5">
                {chips.map((chip, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(chip.text)}
                    className="px-2.5 py-1.5 bg-neutral-900/80 hover:bg-green-500/10 border border-white/5 hover:border-green-500/30 text-neutral-400 hover:text-green-400 text-[10px] font-semibold rounded-xl transition-all cursor-pointer text-left leading-tight"
                  >
                    {chip.text}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Message Input Form */}
          <form
            onSubmit={handleFormSubmit}
            className="p-3 border-t border-white/5 bg-neutral-950/40 flex items-center space-x-2"
          >
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={t("petbot.placeholder")}
              disabled={loading}
              className="flex-grow bg-neutral-950 border border-white/5 focus:border-green-550/40 focus:outline-none rounded-xl px-4 py-2.5 text-xs text-white placeholder-neutral-550 transition-all font-light"
            />
            <button
              type="submit"
              disabled={loading || !inputValue.trim()}
              className="p-2.5 rounded-xl bg-green-500 hover:bg-green-600 disabled:opacity-40 disabled:hover:bg-green-500 text-neutral-950 font-bold transition-all cursor-pointer flex items-center justify-center flex-shrink-0"
            >
              <HiPaperAirplane className="text-sm" />
            </button>
          </form>
        </div>
      )}

      {/* Floating Action Button (FAB) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 text-neutral-950 shadow-lg hover:shadow-green-500/20 hover:scale-[1.05] active:scale-[0.95] cursor-pointer transition-all duration-300 border border-green-400/20"
      >
        {/* Glow effect */}
        <span className="absolute inset-0 rounded-full bg-green-500/30 blur-md opacity-50 group-hover:opacity-100 transition-opacity animate-pulse" />
        
        {isOpen ? (
          <HiXMark className="text-xl relative z-10 font-bold" />
        ) : (
          <HiChatBubbleLeftRight className="text-xl relative z-10" />
        )}

        {/* Small Paw Badge when closed */}
        {!isOpen && (
          <span className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-red-600 text-white text-[10px] font-bold flex items-center justify-center border-2 border-[#0b0b0f] shadow-lg animate-bounce">
            🐾
          </span>
        )}
      </button>
      
    </div>
  );
}
