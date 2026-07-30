"use client";

import React, { useState } from "react";
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

// Mock flagged content items for AI Semantic Moderation Watchtower
const INITIAL_FLAGGED_ITEMS = [
  {
    id: "flag-1",
    author: "Utilisateur_Anonyme_92",
    content: "« Ce projet est une arnaque totale, vous devriez détruire leurs bureaux... »",
    type: "Commentaire",
    toxicityScore: 88,
    flagReason: "Incitation à la violence / Propos haineux",
    time: "Il y a 12 min",
  },
  {
    id: "flag-2",
    author: "Jean-Marc D.",
    content: "« Pétition pour destituer le maire sans aucune preuve tangible... »",
    type: "Titre de pétition",
    toxicityScore: 65,
    flagReason: "Diffamation potentielle / Modération préventive",
    time: "Il y a 34 min",
  },
  {
    id: "flag-3",
    author: "Citoyen_Inquiet",
    content: "« Honte à cette entreprise qui pollue nos rivières, agissons fort ! »",
    type: "Motif de signature",
    toxicityScore: 42,
    flagReason: "Langage véhément (Faux positif probable)",
    time: "Il y a 1h",
  },
];

// Mock Decision Maker Response Tracker Data
const DECISION_MAKERS = [
  {
    name: "Ministère de l'Environnement",
    targetedPetitions: 12,
    responsesReceived: 8,
    responseRate: 67,
    status: "Active",
  },
  {
    name: "Communauté Urbaine de Douala",
    targetedPetitions: 8,
    responsesReceived: 6,
    responseRate: 75,
    status: "Modèle",
  },
  {
    name: "Direction Générale des Transports",
    targetedPetitions: 5,
    responsesReceived: 2,
    responseRate: 40,
    status: "Lent",
  },
];

export default function AdminAiWatchtower() {
  const [flaggedItems, setFlaggedItems] = useState(INITIAL_FLAGGED_ITEMS);
  const [processedCount, setProcessedCount] = useState(14);

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
                Tour de Contrôle IA — Détections Sémantiques & Discours Haineux
              </h3>
            </div>
            <p className="text-xs text-neutral-400 font-light">
              Analyse automatique par modèle sémantique Google Gemini avec score de toxicité.
            </p>
          </div>

          <span className="px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-mono font-bold">
            {flaggedItems.length} en attente
          </span>
        </div>

        {/* Flagged Items Queue */}
        <div className="space-y-3">
          {flaggedItems.length === 0 ? (
            <div className="p-8 rounded-2xl bg-neutral-950/60 border border-white/5 text-center space-y-2">
              <HiCheckCircle className="text-4xl text-green-400 mx-auto" />
              <h4 className="text-xs font-bold text-white">Aucun contenu haineux en attente</h4>
              <p className="text-[11px] text-neutral-400">Le modèle IA sémantique protège la plateforme en temps réel.</p>
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
                    🔥 Toxicité : {item.toxicityScore}%
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
                      <HiCheckCircle /> <span>Valider (Faux Positif)</span>
                    </button>

                    <button
                      onClick={() => handleBan(item.id)}
                      className="px-3 py-1 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-400 font-bold border border-red-500/30 transition-all flex items-center space-x-1 cursor-pointer"
                    >
                      <HiXCircle /> <span>Masquer & Bannir</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Watchtower Footer Metrics */}
        <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs text-neutral-400 font-mono">
          <span>Total modéré ce mois : {processedCount} éléments</span>
          <span className="text-green-400 font-bold">⚡ IA Gemini Sémantique v2</span>
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
                  Taux de Réponse des Décideurs
                </h3>
              </div>
              <p className="text-xs text-neutral-400 font-light">
                Indice de réactivité des institutions publiques interpellées.
              </p>
            </div>
            <span className="text-xs text-cyan-400 font-mono font-bold bg-cyan-500/10 px-2.5 py-0.5 rounded-full border border-cyan-500/20">
              Index Officiel
            </span>
          </div>

          <div className="space-y-3">
            {DECISION_MAKERS.map((dm) => (
              <div
                key={dm.name}
                className="p-3.5 rounded-2xl bg-neutral-950/60 border border-white/5 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">{dm.name}</span>
                  <span className="text-xs font-mono font-extrabold text-cyan-400">
                    {dm.responseRate}% de réponse
                  </span>
                </div>

                <div className="w-full h-2 bg-neutral-900 rounded-full overflow-hidden p-0.5 border border-white/5">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-emerald-400"
                    style={{ width: `${dm.responseRate}%` }}
                  />
                </div>

                <div className="flex justify-between text-[10px] text-neutral-400 font-mono">
                  <span>{dm.targetedPetitions} pétition(s) ciblée(s)</span>
                  <span className="text-green-400 font-bold">{dm.responsesReceived} réponse(s) officielle(s)</span>
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
              <h4 className="text-sm font-bold text-white">Intégrité & Protection Anti-Bot</h4>
            </div>
            <span className="text-[10px] font-mono text-green-400 bg-green-500/10 px-2 py-0.5 rounded-full border border-green-500/20">
              100% Protection
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="p-3 rounded-2xl bg-neutral-950/80 border border-white/5 space-y-1">
              <span className="text-[10px] text-neutral-400 font-mono block">Attaques Bloquées</span>
              <span className="text-lg font-black text-white font-mono">0 Bot</span>
            </div>
            <div className="p-3 rounded-2xl bg-neutral-950/80 border border-white/5 space-y-1">
              <span className="text-[10px] text-neutral-400 font-mono block">Temps de Réponse API</span>
              <span className="text-lg font-black text-green-400 font-mono">42 ms</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
