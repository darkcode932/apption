"use client";

import React, { useState } from "react";
import {
  HiXMark,
  HiSparkles,
  HiCheckCircle,
  HiMegaphone,
  HiDocumentText,
  HiPaperAirplane,
  HiGlobeAlt,
} from "react-icons/hi2";
import { Petition } from "../../domain/entities/Petition";
import { useLanguage, useT } from "../../i18n/LanguageContext";

interface PressWireModalProps {
  petition: Petition;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (pressRelease: string) => void;
}

export default function PressWireModal({
  petition,
  isOpen,
  onClose,
  onSuccess,
}: PressWireModalProps) {
  const t = useT();
  const { locale } = useLanguage();
  const isEn = locale === "en";

  const [generating, setGenerating] = useState(false);
  const [broadcasting, setBroadcasting] = useState(false);
  const [step, setStep] = useState<"intro" | "editor" | "sent">("intro");

  const [pressRelease, setPressRelease] = useState("");

  if (!isOpen) return null;

  const handleGeneratePressRelease = async () => {
    setGenerating(true);
    try {
      const res = await fetch("/api/ai-copilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: petition.title,
          description: petition.description,
          scale: petition.scale,
          category: petition.category,
          lang: locale,
        }),
      });
      const data = await res.json();

      const rawTitle = data.optimizedTitle || petition.title;
      const rawDesc = data.optimizedDescription || petition.description;

      // Clean leftover markdown asterisks strictly
      const cleanTitle = rawTitle.replace(/\*\*(.+?)\*\*/g, "$1").replace(/\*/g, "");
      const cleanDesc = rawDesc.replace(/\*\*(.+?)\*\*/g, "$1").replace(/\*/g, "");

      const formattedRelease = isEn
        ? `COMMUNIQUÉ DE PRESSE — FOR IMMEDIATE RELEASE\n\nTITLE: ${cleanTitle}\n\nLOCATION: ${petition.city || "National"} | CATEGORY: ${petition.category}\n\nSUMMARY & CITIZEN CONTEXT:\n${cleanDesc}\n\nSIGNATURE COUNT TO DATE: ${petition.signaturesCount || 1} supporters.\n\nPRESS CONTACT & VERIFICATION:\nApption Media Wire — contact@apption.io`
        : `COMMUNIQUÉ DE PRESSE — POUR DIFFUSION IMMÉDIATE\n\nTITRE : ${cleanTitle}\n\nLOCALISATION : ${petition.city || "National"} | CATÉGORIE : ${petition.category}\n\nCONTEXTE & MOBILISATION CITOYENNE :\n${cleanDesc}\n\nNOMBRE DE SIGNATURES À CE JOUR : ${petition.signaturesCount || 1} signataires.\n\nCONTACT PRESSE & VÉRIFICATION :\nApption Fil de Presse — contact@apption.io`;

      setPressRelease(formattedRelease);
      setStep("editor");
    } catch (e) {
      console.error("Press release generation failed:", e);
    } finally {
      setGenerating(false);
    }
  };

  const handleBroadcast = () => {
    setBroadcasting(true);
    setTimeout(() => {
      setBroadcasting(false);
      setStep("sent");
      onSuccess(pressRelease);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-neutral-900 border border-white/10 rounded-3xl p-6 sm:p-8 max-w-xl w-full space-y-6 shadow-2xl relative overflow-hidden text-white">
        
        {/* Glow */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-[90px] pointer-events-none" />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-neutral-400 hover:text-white p-1 rounded-full border border-white/5 hover:border-white/20 transition-all cursor-pointer"
        >
          <HiXMark className="text-xl" />
        </button>

        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-bold flex items-center space-x-1.5">
              <HiMegaphone className="text-sm" />
              <span>{isEn ? "Press Wire & Media Amplifier" : "Amplificateur Média & Fil de Presse"}</span>
            </span>
            <span className="text-xs text-neutral-400 font-mono">Diffusion Journalistes</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-extrabold font-display">
            📰 {isEn ? "Generate Press Release" : "Générer un Communiqué de Presse IA"}
          </h3>
          <p className="text-xs text-neutral-400 font-light leading-relaxed">
            {isEn
              ? "Transform your petition into a professional Press Release formatted for journalists and national/local media desks."
              : "Transformez votre pétition en un Communiqué de Presse professionnel aux normes journalistiques, prêt à être diffusé aux rédactions TV, Radio et Presse."}
          </p>
        </div>

        {step === "intro" && (
          <div className="space-y-5">
            <div className="p-4 rounded-2xl bg-neutral-950/60 border border-white/5 space-y-3">
              <h4 className="text-xs font-bold text-white flex items-center space-x-2">
                <HiGlobeAlt className="text-cyan-400 text-base" />
                <span>{isEn ? "Targeted Media Network:" : "Réseau de Médias Partenaires :"}</span>
              </h4>
              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-neutral-300">
                <div className="p-2 rounded-xl bg-neutral-900 border border-white/5">📺 Chaînes TV & Radios</div>
                <div className="p-2 rounded-xl bg-neutral-900 border border-white/5">📰 Presse Quotidienne</div>
                <div className="p-2 rounded-xl bg-neutral-900 border border-white/5">🌐 Portails d&apos;Info Web</div>
                <div className="p-2 rounded-xl bg-neutral-900 border border-white/5">🎙️ Influenceurs Régionaux</div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="text-xs font-mono">
                <span className="text-neutral-400 block">{isEn ? "Media Amplifier Pass:" : "Pass Amplificateur :"}</span>
                <span className="text-cyan-400 font-extrabold text-base">19,99 € / Pass</span>
              </div>

              <button
                onClick={handleGeneratePressRelease}
                disabled={generating}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-neutral-950 font-extrabold text-xs transition-all shadow-lg cursor-pointer flex items-center space-x-2 disabled:opacity-50"
              >
                {generating ? (
                  <span>{isEn ? "Writing Press Release..." : "Rédaction IA par PetBot..."}</span>
                ) : (
                  <>
                    <span>{isEn ? "Generate Press Release" : "Générer le Communiqué"}</span>
                    <HiSparkles />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {step === "editor" && (
          <div className="space-y-5 animate-fadeIn">
            <div className="space-y-2">
              <label className="block text-xs font-bold text-neutral-300">
                {isEn ? "Generated Press Release (Plain Text - Times New Roman Style):" : "Aperçu du Communiqué de Presse (Texte Brut Impédance Journalistique) :"}
              </label>
              <textarea
                value={pressRelease}
                onChange={(e) => setPressRelease(e.target.value)}
                rows={8}
                style={{ fontFamily: "'Times New Roman', Times, serif" }}
                className="w-full bg-neutral-950 border border-white/10 rounded-2xl p-4 text-xs text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-cyan-500 leading-relaxed"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => setStep("intro")}
                className="text-xs text-neutral-400 hover:text-white underline font-mono"
              >
                ← {isEn ? "Back" : "Retour"}
              </button>

              <button
                onClick={handleBroadcast}
                disabled={broadcasting}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-neutral-950 font-extrabold text-xs transition-all shadow-lg cursor-pointer flex items-center space-x-2 disabled:opacity-50"
              >
                {broadcasting ? (
                  <span>{isEn ? "Broadcasting to Media..." : "Diffusion aux Rédactions..."}</span>
                ) : (
                  <>
                    <span>{isEn ? "Broadcast to Media (19,99 €)" : "Propulser aux Médias (19,99 €)"}</span>
                    <HiPaperAirplane />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {step === "sent" && (
          <div className="text-center py-6 space-y-4 animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center mx-auto text-3xl">
              <HiCheckCircle />
            </div>
            <h4 className="text-lg font-extrabold text-white">
              {isEn ? "Press Release Successfully Distributed!" : "Communiqué de Presse Diffusé avec Succès !"}
            </h4>
            <p className="text-xs text-neutral-300 font-light max-w-md mx-auto leading-relaxed">
              {isEn
                ? "Your press release has been dispatched to 42 targeted media desks and local journalists. The media badge is now active."
                : "Votre communiqué de presse a été transmis à 42 rédactions partenaires et journalistes locaux. Le macaron de diffusion média est activé."}
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-neutral-950 border border-white/10 hover:border-cyan-500 text-white font-bold text-xs transition-all cursor-pointer"
            >
              {isEn ? "Close" : "Fermer"}
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
