"use client";

import React from "react";
import Link from "next/link";
import { HiTrophy, HiFire, HiMapPin, HiCheckBadge, HiArrowRight, HiTag } from "react-icons/hi2";
import { useLanguage } from "../../i18n/LanguageContext";

interface PetItemProps {
  id?: string;
  text: string;
  link: string;
  status?: string;
  signaturesCount?: number;
  category?: string;
  city?: string;
  scale?: string;
  creatorName?: string;
}

export default function PetItem({
  id,
  text,
  link,
  status,
  signaturesCount = 1,
  category = "Environnement",
  city,
  scale,
  creatorName,
}: PetItemProps) {
  const { locale } = useLanguage();
  const href = id ? `/petitions/${id}` : "#";
  const isVictory = status === "victory";

  // Category Icon Mapping
  const getCategoryIcon = (catName: string) => {
    if (catName.includes("Politique")) return "🏛️";
    if (catName.includes("Environnement")) return "🌱";
    if (catName.includes("Santé")) return "🏥";
    if (catName.includes("Droits")) return "⚖️";
    if (catName.includes("Education")) return "🎓";
    if (catName.includes("Sport")) return "⚽";
    if (catName.includes("Art")) return "🎨";
    return "🏷️";
  };

  // Dynamic Goal calculation
  const nextGoal = Math.max(100, Math.ceil(signaturesCount / 100) * 100);
  const progressPercent = Math.min(100, Math.round((signaturesCount / nextGoal) * 100));

  return (
    <Link
      href={href}
      className="group relative flex flex-col bg-neutral-900 p-4 sm:p-5 rounded-3xl w-full max-w-[340px] border border-white/10 hover:border-green-500/40 shadow-xl hover:shadow-2xl hover:shadow-green-500/10 transition-all duration-300 transform hover:-translate-y-1.5 overflow-hidden"
    >
      {/* Top Image Container */}
      <div className="relative w-full h-[195px] rounded-2xl overflow-hidden border border-white/5 bg-neutral-950">
        <img
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          alt={text}
          src={link || "/assets/images/libération.jpg"}
        />

        {/* Gradient Overlay for high text contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-transparent opacity-80" />

        {/* Top-Left: Ultra-Visible Category Tag */}
        <div className="absolute top-3 left-3 z-10 flex items-center space-x-1.5 py-1 px-3 rounded-full text-xs font-black uppercase tracking-wider shadow-xl bg-neutral-950/95 text-green-400 border border-green-500/40 backdrop-blur-md">
          <span>{getCategoryIcon(category)}</span>
          <span className="font-display">{category}</span>
        </div>

        {/* Top-Right: Status Badge Tag */}
        <div className="absolute top-3 right-3 z-10 flex items-center space-x-1 py-1 px-3 rounded-full text-[10px] font-black uppercase tracking-wider shadow-xl backdrop-blur-md">
          {isVictory ? (
            <div className="flex items-center space-x-1 py-0.5 px-2.5 rounded-full bg-amber-500 text-neutral-950 font-black shadow-md border border-amber-300">
              <HiTrophy className="text-xs animate-bounce text-neutral-950" />
              <span>{locale === "fr" ? "Victoire !" : "Victory!"}</span>
            </div>
          ) : (
            <div className="flex items-center space-x-1 py-0.5 px-2.5 rounded-full bg-neutral-950/80 text-emerald-400 border border-emerald-500/30">
              <HiFire className="text-xs text-emerald-400 animate-pulse" />
              <span>{locale === "fr" ? "En cours" : "Active"}</span>
            </div>
          )}
        </div>

        {/* Bottom-Right of Image: City Tag if available */}
        {city && (
          <div className="absolute bottom-3 right-3 z-10 flex items-center space-x-1 py-1 px-2.5 rounded-full bg-neutral-950/90 text-neutral-300 text-[10px] font-mono border border-white/10 backdrop-blur-md">
            <HiMapPin className="text-xs text-cyan-400" />
            <span>{city}</span>
          </div>
        )}
      </div>

      {/* Title & Description */}
      <div className="flex-grow pt-4 space-y-3 flex flex-col justify-between">
        <h3 className="text-sm sm:text-base font-extrabold text-white font-display line-clamp-2 leading-snug group-hover:text-green-400 transition-colors">
          {text}
        </h3>

        {/* Signature Progress Section */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-neutral-300">
              ✍️ <strong className="text-white font-bold">{signaturesCount}</strong> / {nextGoal} {locale === "fr" ? "signataires" : "signatures"}
            </span>
            <span className="text-green-400 font-mono font-bold">{progressPercent}%</span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2.5 bg-neutral-950 rounded-full overflow-hidden border border-white/5 p-0.5">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isVictory
                  ? "bg-gradient-to-r from-amber-500 to-yellow-400"
                  : "bg-gradient-to-r from-green-500 to-emerald-400"
              }`}
              style={{ width: `${Math.max(5, progressPercent)}%` }}
            />
          </div>
        </div>

        {/* Card Footer: Creator info & CTA */}
        <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs text-neutral-400">
          <div className="flex items-center space-x-1.5">
            <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-green-500 to-emerald-600 flex items-center justify-center font-bold text-white text-[10px]">
              {creatorName ? creatorName.charAt(0).toUpperCase() : "A"}
            </div>
            <div className="flex items-center space-x-1">
              <span className="truncate max-w-[130px] font-bold text-white text-[11px]">
                {creatorName || (locale === "fr" ? "Citoyen" : "Citizen")}
              </span>
              <HiCheckBadge className="text-green-400 text-xs" />
            </div>
          </div>

          <div className="inline-flex items-center space-x-1 text-xs font-extrabold text-green-400 group-hover:translate-x-1 transition-all">
            <span>{locale === "fr" ? "Soutenir" : "Support"}</span>
            <HiArrowRight className="text-xs" />
          </div>
        </div>

      </div>
    </Link>
  );
}
