"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Petition } from "../../domain/entities/Petition";
import { HiEye, HiShare, HiCheckCircle, HiTrophy, HiArrowRight, HiClipboardDocumentCheck } from "react-icons/hi2";
import { useLanguage, useT } from "../../i18n/LanguageContext";

interface PetStatProps {
  petitions: Petition[];
}

export default function PetStat({ petitions }: PetStatProps) {
  const { locale } = useLanguage();
  const t = useT();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (petitions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 glass-card rounded-3xl text-center text-neutral-400 border border-white/5 space-y-3">
        <span className="text-3xl">🚀</span>
        <p className="text-sm font-bold text-white">{t("dashboard.no_petitions")}</p>
        <p className="text-xs text-neutral-400 font-light max-w-sm">
          {locale === "fr" 
            ? "Créez votre première pétition pour suivre son impact et sa portée en temps réel !" 
            : "Create your first petition to track its real-time impact here!"}
        </p>
      </div>
    );
  }

  const handleCopy = (petId: string, link: string) => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(link);
      setCopiedId(petId);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  return (
    <div className="flex flex-col space-y-6">
      {petitions.map((pet) => {
        const isVictory = pet.status === "victory";
        const nextGoal = Math.max(100, Math.ceil((pet.signaturesCount || 1) / 100) * 100);
        const percent = Math.min(100, Math.round(((pet.signaturesCount || 1) / nextGoal) * 100));

        const shareLink = typeof window !== "undefined"
          ? `${window.location.origin}/petitions/${pet.id}`
          : `/petitions/${pet.id}`;

        return (
          <div
            key={pet.id}
            className="flex flex-col p-6 rounded-3xl glass-card border border-white/10 hover:border-green-500/30 space-y-5 transition-all duration-300 shadow-xl group"
          >
            {/* Header Title & Status */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="space-y-1">
                <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                  isVictory
                    ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                    : "bg-green-500/20 text-green-400 border border-green-500/30"
                }`}>
                  {isVictory ? "🏆 Victoire Remportée" : "🔥 En cours"}
                </span>

                <h4 className="font-extrabold text-lg text-white tracking-tight line-clamp-1 font-display group-hover:text-green-400 transition-colors">
                  {pet.title}
                </h4>
              </div>

              <Link
                href={`/petitions/${pet.id}`}
                className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-green-500/10 border border-white/10 text-xs font-bold text-neutral-300 hover:text-green-400 flex items-center space-x-1 transition-all"
              >
                <span>{locale === "fr" ? "Voir la pétition" : "View petition"}</span>
                <HiArrowRight className="text-xs" />
              </Link>
            </div>

            {/* Signature Progress Bar */}
            <div className="w-full space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-neutral-300">
                  ✍️ <strong className="text-white font-bold">{pet.signaturesCount}</strong> / {nextGoal} {locale === "fr" ? "signataires" : "signers"}
                </span>
                <span className="text-green-400 font-mono font-bold">{percent}%</span>
              </div>

              <div className="w-full rounded-full bg-neutral-950 border border-white/5 h-3 overflow-hidden p-0.5">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    isVictory
                      ? "bg-gradient-to-r from-amber-500 to-yellow-400"
                      : "bg-gradient-to-r from-green-500 to-emerald-400"
                  }`}
                  style={{ width: `${Math.max(5, percent)}%` }}
                />
              </div>
            </div>

            {/* Metrics Analytics Cards */}
            <div className="grid grid-cols-3 gap-3 bg-neutral-950/60 p-4 rounded-2xl border border-white/5 text-center text-xs">
              <div className="flex flex-col items-center justify-center space-y-1">
                <HiEye className="text-neutral-500 text-lg" />
                <p className="text-[11px] text-neutral-400 font-light">
                  <strong className="text-green-400 text-sm font-bold block">{pet.views || 0}</strong> {t("dashboard.views")}
                </p>
              </div>
              <div className="flex flex-col items-center justify-center space-y-1">
                <HiShare className="text-neutral-500 text-lg" />
                <p className="text-[11px] text-neutral-400 font-light">
                  <strong className="text-cyan-400 text-sm font-bold block">{pet.shares || 0}</strong> {t("dashboard.shares")}
                </p>
              </div>
              <div className="flex flex-col items-center justify-center space-y-1">
                <HiCheckCircle className="text-neutral-500 text-lg" />
                <p className="text-[11px] text-neutral-400 font-light">
                  <strong className="text-emerald-400 text-sm font-bold block">{pet.signaturesCount || 0}</strong> Signatures
                </p>
              </div>
            </div>

            {/* Share Link Copier */}
            <div className="flex items-center space-x-2 pt-1">
              <div className="flex-1 bg-neutral-950 border border-white/10 px-3.5 py-2 rounded-xl text-xs font-mono text-neutral-400 truncate">
                {shareLink}
              </div>
              <button
                onClick={() => handleCopy(pet.id, shareLink)}
                className="px-3.5 py-2 rounded-xl bg-neutral-900 hover:bg-white/10 border border-white/10 text-xs font-extrabold text-white transition-all cursor-pointer flex items-center space-x-1"
              >
                {copiedId === pet.id ? (
                  <>
                    <HiClipboardDocumentCheck className="text-green-400 text-sm" />
                    <span className="text-green-400">Copié !</span>
                  </>
                ) : (
                  <span>Copier</span>
                )}
              </button>
            </div>

          </div>
        );
      })}
    </div>
  );
}
