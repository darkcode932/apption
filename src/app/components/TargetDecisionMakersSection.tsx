"use client";

import React from "react";
import { HiBuildingLibrary, HiCheckBadge, HiClock, HiEnvelope, HiDocumentText, HiShieldCheck } from "react-icons/hi2";
import { TimelineEvent } from "../../domain/entities/TimelineEvent";
import { useLanguage } from "../../i18n/LanguageContext";

interface TargetDecisionMakersSectionProps {
  targetAudience?: string;
  city?: string;
  country?: string;
  timelineEvents?: TimelineEvent[];
  petitionTitle: string;
}

export default function TargetDecisionMakersSection({
  targetAudience = "Mairie & Autorités Locales",
  city,
  country = "Cameroun",
  timelineEvents = [],
  petitionTitle,
}: TargetDecisionMakersSectionProps) {
  const { locale } = useLanguage();

  const officialResponses = timelineEvents.filter(
    (event) => event.isOfficialResponse || event.type === "official_response"
  );

  const hasOfficialResponse = officialResponses.length > 0;

  return (
    <div className="bg-neutral-900 border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
      
      {/* Top Glow Ambient Accent */}
      <div className="absolute top-0 right-0 w-64 h-32 bg-cyan-500/10 rounded-full blur-[80px] pointer-events-none" />

      {/* Header Title */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/5 pb-4 relative z-10">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <HiBuildingLibrary className="text-xl" />
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-white font-display flex items-center space-x-2">
              <span>Décideurs Ciblés & Suivi Officiel</span>
              <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 text-[10px] font-mono border border-cyan-500/20">
                Légalité
              </span>
            </h3>
            <p className="text-xs text-neutral-400 font-light">
              Suivi en temps réel de l&apos;interpellation des autorités publiques et institutions concernées.
            </p>
          </div>
        </div>

        {/* Global Response Status Badge */}
        <div className="flex items-center space-x-2">
          {hasOfficialResponse ? (
            <span className="px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/30 text-green-400 text-xs font-black uppercase tracking-wider flex items-center space-x-1.5 shadow-sm">
              <HiShieldCheck className="text-sm" />
              <span>Réponse Officielle Reçue</span>
            </span>
          ) : (
            <span className="px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-black uppercase tracking-wider flex items-center space-x-1.5 shadow-sm">
              <HiClock className="text-sm animate-pulse" />
              <span>Interpellation en Cours</span>
            </span>
          )}
        </div>
      </div>

      {/* Decision Maker Entity Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
        
        {/* Main Target Institution */}
        <div className="p-4 rounded-2xl bg-neutral-950/80 border border-white/5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400">
              Autorité Destinataire
            </span>
            <span className="px-2 py-0.5 rounded-full bg-neutral-900 text-neutral-300 text-[9px] font-bold border border-white/5">
              Officiel
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white font-extrabold text-sm shadow-md">
              🏛️
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-bold text-white truncate">{targetAudience}</h4>
              <p className="text-[11px] text-neutral-400 truncate">
                {city ? `${city}, ` : ""}{country}
              </p>
            </div>
          </div>

          <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs text-neutral-400">
            <span className="flex items-center space-x-1">
              <HiEnvelope className="text-cyan-400 text-sm" />
              <span>Dossier transmis</span>
            </span>
            <span className="text-green-400 font-bold font-mono">Notifié</span>
          </div>
        </div>

        {/* Verification Status Summary */}
        <div className="p-4 rounded-2xl bg-neutral-950/80 border border-white/5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400">
              Garantie d&apos;Impact Citoyen
            </span>
            <span className="px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 text-[9px] font-bold border border-green-500/20">
              Vérifié
            </span>
          </div>

          <div className="space-y-1">
            <div className="flex items-center space-x-1.5 text-xs text-white font-bold">
              <HiCheckBadge className="text-green-400 text-base" />
              <span>Pétition Certifiée Conforme</span>
            </div>
            <p className="text-[11px] text-neutral-400 font-light leading-relaxed">
              Les signatures sont soumises à vérification anti-fraude pour transmission légale aux autorités.
            </p>
          </div>

          <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-neutral-400 font-mono">
            <span>Dépôt officiel</span>
            <span className="text-white font-bold">Apption Citizen Protocol</span>
          </div>
        </div>

      </div>

      {/* Official Responses Feed Section */}
      <div className="space-y-4 pt-2 border-t border-white/5 relative z-10">
        <h4 className="text-xs font-extrabold uppercase tracking-wider text-neutral-300 flex items-center space-x-2 font-display">
          <HiDocumentText className="text-cyan-400 text-sm" />
          <span>Communiqués & Réponses Officielles ({officialResponses.length})</span>
        </h4>

        {hasOfficialResponse ? (
          <div className="space-y-3">
            {officialResponses.map((res) => (
              <div
                key={res.id}
                className="p-4.5 rounded-2xl bg-green-500/5 border border-green-500/20 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-green-400 text-xs font-display">
                    📜 {res.title}
                  </span>
                  <span className="text-[10px] font-mono text-neutral-400">
                    {new Date(res.createdAt).toLocaleDateString("fr-FR")}
                  </span>
                </div>
                <p className="text-neutral-300 font-light leading-relaxed">
                  {res.description}
                </p>
                <div className="pt-1 text-[10px] text-neutral-400 font-bold flex items-center space-x-1">
                  <HiCheckBadge className="text-green-400" />
                  <span>Publié par l&apos;autorité certifiée : {res.authorName}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 rounded-2xl bg-neutral-950/40 border border-dashed border-white/10 text-center space-y-2">
            <HiClock className="text-2xl text-neutral-500 mx-auto animate-pulse" />
            <p className="text-xs text-neutral-400 font-light">
              Aucune réponse officielle enregistrée pour l&apos;instant. Les autorités ciblées ont été notifiées de la mobilisation.
            </p>
          </div>
        )}
      </div>

    </div>
  );
}
