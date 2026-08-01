"use client";

import React from "react";
import Link from "next/link";
import { HiHome, HiMegaphone, HiSparkles } from "react-icons/hi2";
import { useLanguage } from "../i18n/LanguageContext";

export default function NotFound() {
  const { locale } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col bg-neutral-950 text-white justify-center items-center">
      <main className="flex-grow flex flex-col justify-center items-center w-full relative overflow-hidden p-6 py-16 select-none">
        
        {/* Soft Ambient Background Glows */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-green-500/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/3 w-[300px] h-[300px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />

        {/* Main Container */}
        <div className="max-w-xl w-full text-center space-y-8 relative z-10">
          
          {/* Top Mini Tag */}
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-neutral-900 border border-white/10 shadow-sm">
            <HiSparkles className="text-green-400 text-sm animate-pulse" />
            <span className="text-xs font-mono font-bold text-neutral-300">
              {locale === "fr" ? "Erreur 404 • Apption Civic Tech" : "Error 404 • Apption Civic Tech"}
            </span>
          </div>

          {/* Giant Realistic 404 Typography */}
          <div className="relative">
            <h1 className="font-extrabold text-9xl sm:text-[140px] tracking-tight leading-none bg-clip-text text-transparent bg-gradient-to-b from-white via-neutral-200 to-neutral-500 opacity-90">
              404
            </h1>
            <span className="absolute inset-0 font-extrabold text-9xl sm:text-[140px] tracking-tight leading-none bg-clip-text text-transparent bg-gradient-to-r from-green-400 via-emerald-500 to-cyan-400 blur-2xl opacity-20 pointer-events-none">
              404
            </span>
          </div>

          {/* Headline & Description */}
          <div className="space-y-3 px-4">
            <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-white tracking-tight">
              {locale === "fr" ? "Cause ou Page Introuvable" : "Cause or Page Not Found"}
            </h2>
            <p className="text-sm sm:text-base text-neutral-400 font-light leading-relaxed max-w-md mx-auto">
              {locale === "fr"
                ? "La page que vous cherchez n'existe pas ou a été déplacée. Vos actions citoyennes vous attendent sur les pétitions en cours."
                : "The page you are looking for does not exist or has been moved. Your civic action awaits on active petitions."}
            </p>
          </div>

          {/* Realistic High-Contrast Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            
            {/* Primary CTA: Return Home */}
            <Link
              href="/home"
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-green-500 hover:bg-green-400 text-neutral-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-green-500/20 flex items-center justify-center space-x-2 transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              <HiHome className="text-base" />
              <span>{locale === "fr" ? "Retourner à l'Accueil" : "Return to Home"}</span>
            </Link>

            {/* Secondary CTA: Browse Petitions */}
            <Link
              href="/petitions"
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-neutral-900 hover:bg-neutral-800 border border-white/10 hover:border-white/20 text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 transition-all cursor-pointer"
            >
              <HiMegaphone className="text-base text-green-400" />
              <span>{locale === "fr" ? "Découvrir les Pétitions" : "Explore Petitions"}</span>
            </Link>

          </div>

        </div>

      </main>
    </div>
  );
}
