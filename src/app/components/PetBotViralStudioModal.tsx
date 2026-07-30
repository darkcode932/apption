"use client";

import React, { useState, useEffect } from "react";
import { HiSparkles, HiXMark, HiArrowDownTray, HiShare, HiCheck, HiQrCode } from "react-icons/hi2";
import { FaInstagram, FaWhatsapp, FaTwitter, FaFacebook, FaTiktok } from "react-icons/fa";
import { useLanguage } from "../../i18n/LanguageContext";

interface PetBotViralStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  petitionTitle: string;
  category?: string;
  signaturesCount?: number;
  goalCount?: number;
  city?: string;
  creatorName?: string;
}

export default function PetBotViralStudioModal({
  isOpen,
  onClose,
  petitionTitle,
  category = "Mobilisation",
  signaturesCount = 1250,
  goalCount = 2000,
  city = "Douala",
  creatorName = "Russel Atebede",
}: PetBotViralStudioModalProps) {
  const { locale } = useLanguage();

  const [activeTheme, setActiveTheme] = useState<"emerald" | "gold" | "cyber" | "minimal">("emerald");
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const progressPercent = Math.min(100, Math.round((signaturesCount / goalCount) * 100));

  const handleDownloadImage = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      alert(locale === "fr" ? "Visuel Story 9:16 exporté avec succès !" : "Story 9:16 image exported successfully!");
    }, 1200);
  };

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/85 backdrop-blur-md animate-fadeIn overflow-y-auto">
      
      {/* Backdrop overlay */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Modal Container */}
      <div className="relative w-full max-w-4xl bg-neutral-900 border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 z-10 overflow-hidden my-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-neutral-400 hover:text-white hover:bg-white/10 transition-colors z-20"
        >
          <HiXMark className="text-lg" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-3 border-b border-white/5 pb-4">
          <div className="w-10 h-10 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-400">
            <HiSparkles className="text-xl animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white font-display flex items-center space-x-2">
              <span>PetBot Viral Studio</span>
              <span className="px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 text-[10px] font-mono border border-green-500/20">
                IA 9:16
              </span>
            </h2>
            <p className="text-xs text-neutral-400 font-light">
              Générez un visuel de Story 9:16 ultra-attractif pour Instagram, WhatsApp, TikTok, X et Facebook.
            </p>
          </div>
        </div>

        {/* Studio Content Grid: Left Preview Canvas / Right Options */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: 9:16 Story Mobile Preview Canvas */}
          <div className="lg:col-span-5 flex justify-center">
            <div
              className={`w-[260px] h-[460px] rounded-3xl p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden border border-white/10 transition-all duration-500 transform hover:scale-[1.02] ${
                activeTheme === "emerald"
                  ? "bg-neutral-950 text-white"
                  : activeTheme === "gold"
                  ? "bg-gradient-to-b from-neutral-950 via-neutral-900 to-amber-950/40 text-white"
                  : activeTheme === "cyber"
                  ? "bg-neutral-950 text-white border-cyan-500/30"
                  : "bg-neutral-900 text-white"
              }`}
            >
              {/* Top Card Ambient Glow */}
              <div
                className={`absolute -top-10 -left-10 w-40 h-40 rounded-full blur-[50px] pointer-events-none ${
                  activeTheme === "emerald"
                    ? "bg-green-500/20"
                    : activeTheme === "gold"
                    ? "bg-amber-500/20"
                    : activeTheme === "cyber"
                    ? "bg-cyan-500/20"
                    : "bg-emerald-500/10"
                }`}
              />

              {/* Story Header */}
              <div className="relative z-10 flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-md text-[9px] font-black uppercase tracking-wider text-green-400 border border-white/10">
                  ⚡ {category}
                </span>
                <span className="text-[10px] font-mono text-neutral-400">Apption.org</span>
              </div>

              {/* Story Main Body Content */}
              <div className="relative z-10 space-y-4 my-auto">
                <h4 className="font-extrabold text-lg leading-snug font-display line-clamp-3">
                  &quot;{petitionTitle}&quot;
                </h4>

                <div className="space-y-1.5 p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                  <div className="flex items-center justify-between text-[10px] font-mono">
                    <span className="text-neutral-300">Mobilisation</span>
                    <span className="text-green-400 font-bold">{signaturesCount} signatures</span>
                  </div>
                  <div className="w-full h-2 bg-neutral-950 rounded-full overflow-hidden p-0.5">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-green-500 to-emerald-400"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Story Footer QR & CTA */}
              <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-xl bg-white p-1 flex items-center justify-center text-neutral-950 shadow-md">
                    <HiQrCode className="text-xl" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-white leading-tight">Scannez pour signer</span>
                    <span className="text-[8px] text-neutral-400">Par {creatorName}</span>
                  </div>
                </div>
                <span className="text-[10px] font-extrabold text-green-400 uppercase tracking-wider">
                  Agissons →
                </span>
              </div>

            </div>
          </div>

          {/* Right Column: Customization Controls & Social Share */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Theme Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider block">
                1. Choisissez le Style de Thème Visuel
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <button
                  onClick={() => setActiveTheme("emerald")}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    activeTheme === "emerald"
                      ? "border-green-500 bg-green-500/10 text-white"
                      : "border-white/5 bg-neutral-950 text-neutral-400 hover:border-white/10"
                  }`}
                >
                  <span className="block text-xs font-bold">Émeraude Sombre</span>
                  <span className="text-[10px] text-neutral-500">Thème Signature</span>
                </button>

                <button
                  onClick={() => setActiveTheme("gold")}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    activeTheme === "gold"
                      ? "border-amber-500 bg-amber-500/10 text-white"
                      : "border-white/5 bg-neutral-950 text-neutral-400 hover:border-white/10"
                  }`}
                >
                  <span className="block text-xs font-bold text-amber-400">Or Victoire</span>
                  <span className="text-[10px] text-neutral-500">Spécial Succès</span>
                </button>

                <button
                  onClick={() => setActiveTheme("cyber")}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    activeTheme === "cyber"
                      ? "border-cyan-500 bg-cyan-500/10 text-white"
                      : "border-white/5 bg-neutral-950 text-neutral-400 hover:border-white/10"
                  }`}
                >
                  <span className="block text-xs font-bold text-cyan-400">Cyber Neon</span>
                  <span className="text-[10px] text-neutral-500">Haute Visibilité</span>
                </button>

                <button
                  onClick={() => setActiveTheme("minimal")}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    activeTheme === "minimal"
                      ? "border-white bg-white/10 text-white"
                      : "border-white/5 bg-neutral-950 text-neutral-400 hover:border-white/10"
                  }`}
                >
                  <span className="block text-xs font-bold">Épuré Minimal</span>
                  <span className="text-[10px] text-neutral-500">Classique</span>
                </button>
              </div>
            </div>

            {/* Platform Indicators */}
            <div className="space-y-2 pt-2 border-t border-white/5">
              <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider block">
                2. Format Optimisé pour les Réseaux
              </label>

              <div className="flex items-center space-x-4 text-neutral-400 text-xs">
                <span className="flex items-center space-x-1 text-pink-400 font-semibold">
                  <FaInstagram /> <span>Instagram Story</span>
                </span>
                <span className="flex items-center space-x-1 text-green-400 font-semibold">
                  <FaWhatsapp /> <span>Statut WhatsApp</span>
                </span>
                <span className="flex items-center space-x-1 text-cyan-400 font-semibold">
                  <FaTwitter /> <span>X / Twitter</span>
                </span>
                <span className="flex items-center space-x-1 text-blue-400 font-semibold">
                  <FaFacebook /> <span>Facebook</span>
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-white/5 flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleDownloadImage}
                disabled={downloading}
                className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-neutral-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-green-500/20 flex items-center justify-center space-x-2 transition-all cursor-pointer"
              >
                <HiArrowDownTray className="text-base" />
                <span>{downloading ? "Génération du visuel..." : "Télécharger le Visuel (Story 9:16)"}</span>
              </button>

              <button
                onClick={handleCopyLink}
                className="py-3.5 px-6 rounded-2xl bg-neutral-950 hover:bg-white/5 border border-white/10 text-xs font-bold text-white flex items-center justify-center space-x-2 transition-all cursor-pointer"
              >
                {copied ? <HiCheck className="text-green-400 text-base" /> : <HiShare className="text-base text-neutral-400" />}
                <span>{copied ? "Lien Copié !" : "Copier le Lien"}</span>
              </button>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
