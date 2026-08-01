"use client";

import React from "react";
import Link from "next/link";
import { HiTrophy, HiFire, HiMapPin, HiCheckBadge, HiSparkles, HiArrowRight, HiEye, HiUserGroup } from "react-icons/hi2";
import { Petition } from "../../domain/entities/Petition";
import { useLanguage, useT } from "../../i18n/LanguageContext";

interface HomePetProps {
  petition?: Petition | null;
}

export default function HomePet({ petition }: HomePetProps) {
  const { locale } = useLanguage();
  const t = useT();
  const isFallback = !petition;

  const id = petition?.id || "";
  
  const fallbackTitle = locale === "fr" 
    ? "L'ENSPD sera dotée de toilettes publiques" 
    : "ENSPD will be equipped with public toilets";
  
  const fallbackDescription = locale === "fr"
    ? "Grâce à la collecte de 3500 signatures, les étudiants de l'ENSPD ont eu l'approbation pour la création de toilettes publiques, visant à améliorer la qualité de vie au sein du campus."
    : "Thanks to the collection of 3500 signatures, ENSPD students received approval for public toilets creation, improving campus quality of life.";

  const title = petition?.title || fallbackTitle;
  const description = petition?.description || fallbackDescription;
  const imageUrl = petition?.imageUrl || "/assets/images/card.jpg";
  const creatorName = petition?.creatorName || "Russel Atebede";
  const signaturesCount = petition?.signaturesCount || 3500;
  const isVictory = petition?.status === "victory";
  const category = petition?.category || "Environnement";
  const city = petition?.city;
  const views = petition?.views || 1420;

  // Signature Progress Calculation
  const nextGoal = petition?.targetGoal || Math.max(100, Math.ceil(signaturesCount / 100) * 100);
  const progressPercent = Math.min(100, Math.round((signaturesCount / nextGoal) * 100));

  const href = id ? `/petitions/${id}` : "/petitions";

  const content = (
    <Link
      href={href}
      className="group flex flex-col md:flex-row rounded-3xl overflow-hidden bg-neutral-900 border border-white/10 max-w-5xl w-full shadow-2xl hover:border-green-500/40 hover:shadow-green-500/10 transition-all duration-500 relative transform hover:-translate-y-1"
    >
      {/* Left Column: Hero Media — fixed height, no stretching */}
      <div className="w-full md:w-5/12 h-[200px] md:h-auto relative overflow-hidden border-b md:border-b-0 md:border-r border-white/5 bg-neutral-950 md:min-h-0">
        <img
          alt={title}
          src={imageUrl}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-transparent" />

        {/* Category / Victory badge */}
        <div className="absolute top-3 left-3 z-10 flex items-center space-x-1.5 py-1 px-2.5 rounded-full text-[10px] font-black uppercase tracking-wider shadow-lg bg-neutral-950/85 border border-white/10 backdrop-blur-md">
          {isVictory ? (
            <>
              <HiTrophy className="text-xs text-amber-400 animate-bounce" />
              <span className="text-amber-400">{locale === "fr" ? "Victoire !" : "Victory!"}</span>
            </>
          ) : (
            <>
              <HiFire className="text-xs text-green-400 animate-pulse" />
              <span className="text-green-400">{category}</span>
            </>
          )}
        </div>

        {/* City tag */}
        {city && (
          <div className="absolute top-3 right-3 z-10 flex items-center space-x-1 py-1 px-2.5 rounded-full bg-neutral-950/85 text-neutral-300 text-[10px] font-mono border border-white/10 backdrop-blur-md">
            <HiMapPin className="text-xs text-cyan-400" />
            <span>{city}</span>
          </div>
        )}

        {/* Views watermark bottom-left */}
        <div className="absolute bottom-3 left-3 z-10 flex items-center space-x-1 text-[10px] font-mono text-neutral-400">
          <HiEye className="text-neutral-500" />
          <span>{views}</span>
        </div>
      </div>

      {/* Right Column: Compact Content */}
      <div className="w-full md:w-7/12 p-5 flex flex-col justify-between gap-4">
        
        {/* Title + Description */}
        <div className="space-y-2">
          <h3 className="font-extrabold text-lg sm:text-xl text-white font-display leading-snug group-hover:text-green-400 transition-colors line-clamp-2">
            {title}
          </h3>
          <p className="text-neutral-400 text-xs font-light leading-relaxed line-clamp-2">
            {description}
          </p>
        </div>

        {/* Signature Progress Gauge */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px] font-semibold">
            <span className="text-neutral-300 flex items-center space-x-1">
              <HiUserGroup className="text-green-400 text-sm" />
              <strong className="text-white font-bold">{signaturesCount.toLocaleString()}</strong>
              <span className="text-neutral-400">/ {nextGoal.toLocaleString()} {locale === "fr" ? "signatures" : "signatures"}</span>
            </span>
            <span className="text-green-400 font-mono font-bold">{progressPercent}%</span>
          </div>
          <div className="w-full h-2 bg-neutral-950 rounded-full overflow-hidden border border-white/5 p-0.5">
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

        {/* Footer: Creator + CTA */}
        <div className="flex items-center justify-between border-t border-white/5 pt-3">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-green-500 to-emerald-600 flex items-center justify-center font-bold text-white text-[10px] shadow-md flex-shrink-0">
              {creatorName.charAt(0).toUpperCase()}
            </div>
            <div className="flex items-center space-x-1">
              <span className="font-bold text-white text-xs truncate max-w-[110px]">{creatorName}</span>
              <HiCheckBadge className="text-green-400 text-sm flex-shrink-0" />
            </div>
          </div>

          <div className="inline-flex items-center space-x-1.5 text-xs font-extrabold text-green-400 group-hover:translate-x-1 transition-all">
            <span>{locale === "fr" ? "Soutenir" : "Support"}</span>
            <HiArrowRight className="text-sm" />
          </div>
        </div>

      </div>
    </Link>
  );

  return <div className="flex justify-center w-full px-4">{content}</div>;
}
