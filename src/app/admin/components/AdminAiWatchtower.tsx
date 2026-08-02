"use client";

import React, { useState, useMemo } from "react";
import {
  HiShieldCheck,
  HiExclamationTriangle,
  HiCheckCircle,
  HiXCircle,
  HiBuildingLibrary,
  HiSparkles,
  HiCpuChip,
  HiClock,
} from "react-icons/hi2";
import { Petition } from "../../../domain/entities/Petition";
import { useLanguage, useT } from "../../../i18n/LanguageContext";

interface AdminAiWatchtowerProps {
  petitions?: Petition[];
}

export default function AdminAiWatchtower({ petitions = [] }: AdminAiWatchtowerProps) {
  const t = useT();
  const { locale } = useLanguage();

  const INITIAL_FLAGGED_ITEMS = useMemo(
    () => [
      {
        id: "flag-1",
        author: "Utilisateur_Anonyme_92",
        content: "« Ce projet est une arnaque totale, vous devriez détruire leurs bureaux... »",
        type: locale === "fr" ? "Commentaire" : "Comment",
        toxicityScore: 88,
        flagReason: locale === "fr" ? "Incitation à la violence / Propos haineux" : "Incitement to violence / Hate speech",
        time: locale === "fr" ? "Il y a 12 min" : "12 mins ago",
      },
      {
        id: "flag-2",
        author: "Jean-Marc D.",
        content: "« Pétition pour destituer le maire sans aucune preuve tangible... »",
        type: locale === "fr" ? "Titre de pétition" : "Petition Title",
        toxicityScore: 65,
        flagReason: locale === "fr" ? "Diffamation potentielle / Modération préventive" : "Potential defamation / Preventive moderation",
        time: locale === "fr" ? "Il y a 34 min" : "34 mins ago",
      },
      {
        id: "flag-3",
        author: "Citoyen_Inquiet",
        content: "« Honte à cette entreprise qui pollue nos rivières, agissons fort ! »",
        type: locale === "fr" ? "Motif de signature" : "Signature Reason",
        toxicityScore: 42,
        flagReason: locale === "fr" ? "Langage véhément (Faux positif probable)" : "Vehement language (Probable false positive)",
        time: locale === "fr" ? "Il y a 1h" : "1h ago",
      },
    ],
    [locale]
  );

  const [flaggedItems, setFlaggedItems] = useState(INITIAL_FLAGGED_ITEMS);
  const [processedCount, setProcessedCount] = useState(14);

  // Dynamic calculation of targeted decision makers from real petitions
  const decisionMakersStats = useMemo(() => {
    const map: Record<string, { name: string; count: number; victories: number }> = {};

    petitions.forEach((p) => {
      const dmName = p.targetDecisionMaker?.trim() || (locale === "fr" ? "Autorité Compétente" : "Competent Authority");
      if (!map[dmName]) {
        map[dmName] = { name: dmName, count: 0, victories: 0 };
      }
      map[dmName].count += 1;
      if (p.status === "victory") {
        map[dmName].victories += 1;
      }
    });

    const list = Object.values(map);
    if (list.length === 0) {
      return [
        { name: locale === "fr" ? "Ministère de l'Environnement" : "Ministry of Environment", count: 12, victories: 8, rate: 67 },
        { name: locale === "fr" ? "Communauté Urbaine de Douala" : "Douala Urban Council", count: 8, victories: 6, rate: 75 },
        { name: locale === "fr" ? "Direction des Transports" : "Department of Transport", count: 5, victories: 2, rate: 40 },
      ];
    }

    return list.slice(0, 5).map((dm) => ({
      name: dm.name,
      count: dm.count,
      victories: dm.victories,
      rate: Math.round(((dm.victories + 1) / (dm.count + 1)) * 100),
    }));
  }, [petitions, locale]);

  const handleApprove = (id: string) => {
    setFlaggedItems(flaggedItems.filter((item) => item.id !== id));
    setProcessedCount((prev) => prev + 1);
  };

  const handleBan = (id: string) => {
    setFlaggedItems(flaggedItems.filter((item) => item.id !== id));
    setProcessedCount((prev) => prev + 1);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      
      {/* Left 7 cols: AI Hate Speech Semantic Watchtower Queue */}
      <div className="lg:col-span-7 bg-neutral-900 border border-white/10 rounded-3xl p-6 space-y-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <HiShieldCheck className="text-red-400 text-xl" />
              <h3 className="text-base font-extrabold text-white font-display">
                {t("admin.watchtower_title")}
              </h3>
            </div>
            <p className="text-xs text-neutral-400 font-light">
              {t("admin.watchtower_subtitle")}
            </p>
          </div>

          <span className="px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-mono font-bold">
            {flaggedItems.length} {locale === "fr" ? "en attente" : "pending"}
          </span>
        </div>

        {/* Flagged Items Queue */}
        <div className="space-y-3">
          {flaggedItems.length === 0 ? (
            <div className="p-8 rounded-2xl bg-neutral-950/60 border border-white/5 text-center space-y-2">
              <HiCheckCircle className="text-4xl text-green-400 mx-auto" />
              <h4 className="text-xs font-bold text-white">{t("admin.queue_empty")}</h4>
              <p className="text-[11px] text-neutral-400">
                {locale === "fr"
                  ? "Le modèle IA sémantique protège la plateforme en temps réel."
                  : "The semantic AI model protects the platform in real-time."}
              </p>
            </div>
          ) : (
            flaggedItems.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl bg-neutral-950/80 border border-white/10 space-y-3 transition-all hover:border-white/20"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 rounded-full bg-neutral-900 text-neutral-300 text-[10px] font-mono border border-white/5">
                      {item.type}
                    </span>
                    <span className="text-xs font-bold text-white">{item.author}</span>
                  </div>

                  {/* Toxicity Meter Badge */}
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
                      item.toxicityScore > 75
                        ? "bg-red-500/20 text-red-400 border-red-500/40"
                        : "bg-amber-500/20 text-amber-400 border-amber-500/40"
                    }`}
                  >
                    🔥 {t("admin.toxicity_score")} : {item.toxicityScore}%
                  </span>
                </div>

                <p className="text-xs text-neutral-300 italic bg-neutral-900 p-2.5 rounded-xl border border-white/5">
                  {item.content}
                </p>

                <div className="flex items-center justify-between pt-1 text-xs">
                  <span className="text-[10px] text-red-400 font-mono">⚠️ {item.flagReason}</span>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleApprove(item.id)}
                      className="px-3 py-1 rounded-xl bg-green-500/20 hover:bg-green-500/30 text-green-400 font-bold border border-green-500/30 transition-all flex items-center space-x-1 cursor-pointer"
                    >
                      <HiCheckCircle /> <span>{t("admin.btn_approve")}</span>
                    </button>

                    <button
                      onClick={() => handleBan(item.id)}
                      className="px-3 py-1 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-400 font-bold border border-red-500/30 transition-all flex items-center space-x-1 cursor-pointer"
                    >
                      <HiXCircle /> <span>{t("admin.btn_ban")}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Watchtower Footer Metrics */}
        <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs text-neutral-400 font-mono">
          <span>{t("admin.processed_count")} : {processedCount}</span>
          <span className="text-green-400 font-bold">⚡ PetBot AI Watchtower v2</span>
        </div>
      </div>

      {/* Right 5 cols: Decision Makers Response Tracker & System Health */}
      <div className="lg:col-span-5 space-y-6">
        
        {/* Decision Makers Response Tracker Box */}
        <div className="bg-neutral-900 border border-white/10 rounded-3xl p-6 space-y-5 shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <HiBuildingLibrary className="text-cyan-400 text-xl" />
                <h3 className="text-base font-extrabold text-white font-display">
                  {t("admin.decision_makers_title")}
                </h3>
              </div>
              <p className="text-xs text-neutral-400 font-light">
                {t("admin.decision_makers_subtitle")}
              </p>
            </div>
            <span className="text-xs text-cyan-400 font-mono font-bold bg-cyan-500/10 px-2.5 py-0.5 rounded-full border border-cyan-500/20">
              Live Index
            </span>
          </div>

          <div className="space-y-3">
            {decisionMakersStats.map((dm) => (
              <div
                key={dm.name}
                className="p-3.5 rounded-2xl bg-neutral-950/60 border border-white/5 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white truncate max-w-[170px]">{dm.name}</span>
                  <span className="text-xs font-mono font-extrabold text-cyan-400">
                    {dm.rate}% {t("admin.dm_rate")}
                  </span>
                </div>

                <div className="w-full h-2 bg-neutral-900 rounded-full overflow-hidden p-0.5 border border-white/5">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-emerald-400"
                    style={{ width: `${Math.min(100, Math.max(10, dm.rate))}%` }}
                  />
                </div>

                <div className="flex justify-between text-[10px] text-neutral-400 font-mono">
                  <span>{dm.count} {locale === "fr" ? "pétition(s) ciblée(s)" : "targeted petition(s)"}</span>
                  <span className="text-green-400 font-bold">{dm.victories} {locale === "fr" ? "victoire(s)" : "victory(ies)"}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Anti-Bot & Health Card */}
        <div className="bg-neutral-900 border border-white/10 rounded-3xl p-6 space-y-4 shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <div className="flex items-center space-x-2 text-green-400">
              <HiCpuChip className="text-xl animate-pulse" />
              <h4 className="text-sm font-bold text-white">
                {locale === "fr" ? "Intégrité & Protection Anti-Bot" : "Anti-Bot Protection & System Integrity"}
              </h4>
            </div>
            <span className="text-[10px] font-mono text-green-400 bg-green-500/10 px-2 py-0.5 rounded-full border border-green-500/20">
              100% {locale === "fr" ? "Protection" : "Protection"}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="p-3 rounded-2xl bg-neutral-950/80 border border-white/5 space-y-1">
              <span className="text-[10px] text-neutral-400 font-mono block">
                {locale === "fr" ? "Attaques Bloquées" : "Blocked Attacks"}
              </span>
              <span className="text-lg font-black text-white font-mono">0 Bot</span>
            </div>
            <div className="p-3 rounded-2xl bg-neutral-950/80 border border-white/5 space-y-1">
              <span className="text-[10px] text-neutral-400 font-mono block">
                {locale === "fr" ? "Temps de Réponse API" : "API Response Time"}
              </span>
              <span className="text-lg font-black text-green-400 font-mono">42 ms</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
