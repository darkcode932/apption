"use client";

import React, { useEffect } from "react";
import { HiTrophy, HiSparkles, HiXMark, HiShare, HiArrowRight } from "react-icons/hi2";
import { FaTwitter, FaFacebook, FaWhatsapp } from "react-icons/fa";
import { useLanguage } from "../../i18n/LanguageContext";

interface MilestoneCelebrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  petitionTitle: string;
  milestoneCount: number;
  isVictory?: boolean;
  onOpenViralStudio?: () => void;
}

export default function MilestoneCelebrationModal({
  isOpen,
  onClose,
  petitionTitle,
  milestoneCount,
  isVictory = false,
  onOpenViralStudio,
}: MilestoneCelebrationModalProps) {
  const { locale } = useLanguage();

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

  const handleShare = (platform: "twitter" | "facebook" | "whatsapp") => {
    if (typeof window === "undefined") return;
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(
      isVictory
        ? `🏆 VICTOIRE ! La pétition "${petitionTitle}" a triomphé sur Apption !`
        : `🚀 PALIER ATTEINT ! "${petitionTitle}" vient de franchir ${milestoneCount} signatures sur Apption !`
    );

    let shareUrl = "";
    if (platform === "twitter") shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
    if (platform === "facebook") shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
    if (platform === "whatsapp") shareUrl = `https://api.whatsapp.com/send?text=${text}%20${url}`;

    if (shareUrl) {
      window.open(shareUrl, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/85 backdrop-blur-md animate-fadeIn">
      
      {/* Backdrop overlay */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Modal Container */}
      <div className="relative w-full max-w-md bg-neutral-900 border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-center z-10 overflow-hidden">
        
        {/* Ambient Top Glow */}
        <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 rounded-full blur-[80px] pointer-events-none ${
          isVictory ? "bg-amber-500/20" : "bg-green-500/20"
        }`} />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-neutral-400 hover:text-white hover:bg-white/10 transition-colors z-20"
        >
          <HiXMark className="text-lg" />
        </button>

        {/* Hero Icon Badge */}
        <div className="relative z-10 mx-auto w-20 h-20 rounded-3xl bg-neutral-950 border border-white/10 flex items-center justify-center shadow-xl">
          {isVictory ? (
            <HiTrophy className="text-4xl text-amber-400 animate-bounce" />
          ) : (
            <HiSparkles className="text-4xl text-green-400 animate-pulse" />
          )}
        </div>

        {/* Headline & Description */}
        <div className="relative z-10 space-y-2">
          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
            isVictory
              ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
              : "bg-green-500/20 text-green-400 border border-green-500/30"
          }`}>
            {isVictory ? "🏆 Victoire Historique !" : "🎉 Palier d'Impact Franchi !"}
          </span>

          <h3 className="text-2xl font-extrabold text-white font-display pt-1">
            {isVictory
              ? (locale === "fr" ? "Victoire Remportée !" : "Victory Achieved!")
              : `${milestoneCount} ${locale === "fr" ? "Signatures Récoltées !" : "Signatures Reached!"}`}
          </h3>

          <p className="text-xs text-neutral-300 font-light leading-relaxed max-w-xs mx-auto">
            {isVictory
              ? `Félicitations ! La pétition "${petitionTitle}" a atteint son objectif suprême.`
              : `La cause "${petitionTitle}" vient de franchir un cap majeur de mobilisation.`}
          </p>
        </div>

        {/* Quick Social Share Action */}
        <div className="relative z-10 space-y-3 pt-2 border-t border-white/5">
          <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block">
            Propagez la bonne nouvelle
          </span>

          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => handleShare("whatsapp")}
              className="flex-1 py-2.5 rounded-xl bg-neutral-950 hover:bg-white/5 border border-white/10 text-xs font-bold text-green-400 flex items-center justify-center space-x-2 transition-all cursor-pointer"
            >
              <FaWhatsapp className="text-sm" />
              <span>WhatsApp</span>
            </button>

            <button
              onClick={() => handleShare("twitter")}
              className="flex-1 py-2.5 rounded-xl bg-neutral-950 hover:bg-white/5 border border-white/10 text-xs font-bold text-cyan-400 flex items-center justify-center space-x-2 transition-all cursor-pointer"
            >
              <FaTwitter className="text-sm" />
              <span>X / Twitter</span>
            </button>

            <button
              onClick={() => handleShare("facebook")}
              className="flex-1 py-2.5 rounded-xl bg-neutral-950 hover:bg-white/5 border border-white/10 text-xs font-bold text-blue-400 flex items-center justify-center space-x-2 transition-all cursor-pointer"
            >
              <FaFacebook className="text-sm" />
              <span>Facebook</span>
            </button>
          </div>

          {/* Launch PetBot Viral Studio Trigger */}
          {onOpenViralStudio && (
            <button
              onClick={() => {
                onClose();
                onOpenViralStudio();
              }}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-neutral-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-green-500/20 flex items-center justify-center space-x-2 transition-all cursor-pointer"
            >
              <HiSparkles className="text-sm" />
              <span>Générer un visuel Story 9:16 avec PetBot Studio</span>
            </button>
          )}
        </div>

      </div>

    </div>
  );
}
