"use client";

import React from "react";
import Link from "next/link";
import { HiTrophy, HiFire, HiMapPin, HiCheckBadge, HiSparkles } from "react-icons/hi2";
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

  // Dynamic Goal calculation
  const nextGoal = Math.max(100, Math.ceil(signaturesCount / 100) * 100);
  const progressPercent = Math.min(100, Math.round((signaturesCount / nextGoal) * 100));

  return (
    <Link
      href={href}
      className="group relative flex flex-col glass-card p-4 sm:p-5 rounded-3xl w-full max-w-[340px] border border-white/10 hover:border-green-500/40 shadow-xl hover:shadow-2xl hover:shadow-green-500/10 transition-all duration-300 transform hover:-translate-y-1.5 overflow-hidden"
    >
      {/* Top Image Container */}
      <div className="relative w-full h-[190px] rounded-2xl overflow-hidden border border-white/5 bg-neutral-950">
        <img
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          alt={text}
          src={link || "/assets/images/libération.jpg"}
        />

        {/* Gradient Overlay for image readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent opacity-80" />

        {/* Status Badge Tag */}
        <div className="absolute top-3 left-3 z-10 flex items-center space-x-1.5 py-1 px-3 rounded-full text-[10px] font-black uppercase tracking-wider shadow-lg backdrop-blur-md border border-white/10 ${
          isVictory
            ? 'bg-amber-500/90 text-neutral-950 border-amber-300'
            : 'bg-neutral-950/80 text-green-400 border-green-500/30'
        }">
          {isVictory ? (
            <>
              <HiTrophy className="text-xs text-neutral-950 animate-bounce" />
              <span>{locale === "fr" ? "Victoire !" : "Victory!"}</span>
            </>
          ) : (
            <>
              <HiFire className="text-xs text-green-400 animate-pulse" />
              <span>{category}</span>
            </>
          )}
        </div>

        {/* City/Location Tag if available */}
        {city && (
          <div className="absolute top-3 right-3 z-10 flex items-center space-x-1 py-1 px-2.5 rounded-full bg-neutral-950/80 text-neutral-300 text-[10px] font-mono border border-white/10 backdrop-blur-md">
            <HiMapPin className="text-xs text-cyan-400" />
            <span>{city}</span>
          </div>
        )}
      </div>

      {/* Title & Description */}
      <div className="flex-grow pt-4 space-y-2 flex flex-col justify-between">
        <h3 className="text-sm font-extrabold text-white font-display line-clamp-2 leading-snug group-hover:text-green-400 transition-colors">
          {text}
        </h3>

        {/* Signature Progress Section */}
        <div className="space-y-1.5 pt-2">
          <div className="flex items-center justify-between text-[11px] font-semibold">
            <span className="text-neutral-300 flex items-center space-x-1">
              <span>✍️</span>
              <strong className="text-white font-bold">{signaturesCount}</strong>
              <span className="text-neutral-400">/ {nextGoal}</span>
            </span>
            <span className="text-green-400 font-mono font-bold">{progressPercent}%</span>
          </div>

          {/* Animated Progress Bar */}
          <div className="w-full h-2 bg-neutral-900 rounded-full overflow-hidden border border-white/5 p-0.5">
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

        {/* Card Footer: Creator info */}
        {creatorName && (
          <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-neutral-400">
            <div className="flex items-center space-x-1.5">
              <HiCheckBadge className="text-xs text-green-400" />
              <span className="truncate max-w-[150px]">{creatorName}</span>
            </div>
            <span className="text-green-400 font-bold group-hover:underline">
              {locale === "fr" ? "Soutenir →" : "Support →"}
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}
