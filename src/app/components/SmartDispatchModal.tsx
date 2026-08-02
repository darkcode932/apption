"use client";

import React, { useState } from "react";
import {
  HiBuildingLibrary,
  HiCheckCircle,
  HiXMark,
  HiPaperAirplane,
  HiSparkles,
  HiShieldCheck,
  HiClock,
  HiEnvelope,
} from "react-icons/hi2";
import { Petition } from "../../domain/entities/Petition";
import { useLanguage, useT } from "../../i18n/LanguageContext";

interface SmartDispatchModalProps {
  petition: Petition;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (recipient: string) => void;
}

export default function SmartDispatchModal({
  petition,
  isOpen,
  onClose,
  onSuccess,
}: SmartDispatchModalProps) {
  const t = useT();
  const { locale } = useLanguage();
  const isEn = locale === "en";

  const [recipient, setRecipient] = useState(
    petition.targetDecisionMaker || (isEn ? "Ministry & Local Authorities" : "Ministères & Autorités Locales")
  );
  const [dispatching, setDispatching] = useState(false);
  const [step, setStep] = useState<"configure" | "preview" | "sent">("configure");

  if (!isOpen) return null;

  const handleLaunchDispatch = async () => {
    setDispatching(true);
    // Simulate official dispatch process with certified digital seal
    setTimeout(() => {
      setDispatching(false);
      setStep("sent");
      onSuccess(recipient);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-neutral-900 border border-white/10 rounded-3xl p-6 sm:p-8 max-w-xl w-full space-y-6 shadow-2xl relative overflow-hidden text-white">
        
        {/* Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/10 rounded-full blur-[90px] pointer-events-none" />

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
            <span className="px-3 py-1 rounded-full bg-green-500/10 border border-green-500/30 text-green-400 text-xs font-mono font-bold flex items-center space-x-1.5">
              <HiShieldCheck className="text-sm" />
              <span>{isEn ? "Premium Dispatch AI" : "Expédition Officielle IA"}</span>
            </span>
            <span className="text-xs text-neutral-400 font-mono">Sceau Numérique Certifié</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-extrabold font-display">
            🏛️ Smart Dispatch AI — {isEn ? "Official Delivery" : "Transmission aux Décideurs"}
          </h3>
          <p className="text-xs text-neutral-400 font-light leading-relaxed">
            {isEn
              ? "Transmettez votre pétition sous forme de lettre recommandée officielle certifiée aux cabinets ministériels et mairies avec accusé de réception."
              : "Expédiez votre pétition sous forme de lettre recommandée électronique officielle certifiée directement aux cabinets ministériels avec accusé de réception."}
          </p>
        </div>

        {step === "configure" && (
          <div className="space-y-5">
            <div className="p-4 rounded-2xl bg-neutral-950/60 border border-white/5 space-y-3">
              <label className="block text-xs font-bold text-neutral-300">
                {isEn ? "Targeted Decision Maker / Institution" : "Institution ou Cabinet Cible"}
              </label>
              <input
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="ex: Cabinet du Maire de Douala, Ministère des Transports"
                className="w-full bg-neutral-900 border border-white/10 rounded-xl p-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-green-500 font-mono"
              />
            </div>

            <div className="p-4 rounded-2xl bg-green-500/10 border border-green-500/20 space-y-2">
              <div className="flex items-center space-x-2 text-green-400 text-xs font-bold">
                <HiSparkles className="text-base" />
                <span>{isEn ? "Included Certified Features:" : "Garanties d'Expédition Officielle :"}</span>
              </div>
              <ul className="text-[11px] text-neutral-300 space-y-1 font-light pl-4 list-disc">
                <li>{isEn ? "Official Legal Notice Stamp & Timestamp" : "Tampon d'Horodatage et Sceau Numérique Légal"}</li>
                <li>{isEn ? "Real-time Tracking (Sent -> Received -> Opened)" : "Suivi en temps réel (Transmis -> Reçu -> Lu)"}</li>
                <li>{isEn ? "Public Certification Badge on Petition Page" : "Badge de Certification Officiel sur la page de votre pétition"}</li>
              </ul>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="text-xs font-mono">
                <span className="text-neutral-400 block">{isEn ? "One-time Pass:" : "Pass Expédition :"}</span>
                <span className="text-green-400 font-extrabold text-base">14,99 € / Pass</span>
              </div>

              <button
                onClick={() => setStep("preview")}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-neutral-950 font-extrabold text-xs transition-all shadow-lg cursor-pointer flex items-center space-x-2"
              >
                <span>{isEn ? "Preview Official File" : "Prévisualiser le Dossier"}</span>
                <HiPaperAirplane />
              </button>
            </div>
          </div>
        )}

        {step === "preview" && (
          <div className="space-y-5 animate-fadeIn">
            <div className="p-5 rounded-2xl bg-neutral-950 border border-white/10 space-y-3 font-serif">
              <div className="flex justify-between items-center text-[10px] font-mono text-neutral-400 border-b border-white/5 pb-2">
                <span>Dossier Réf: APP-{petition.id.substring(0, 6).toUpperCase()}</span>
                <span className="text-green-400 font-bold">● TAMPOUL ET SCEAU OFFICIEL</span>
              </div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                TRANSMISSION OFFICIELLE À : {recipient}
              </h4>
              <p className="text-[11px] text-neutral-300 leading-relaxed italic">
                « Objet : Interpellation Citoyenne — pétition &quot;{petition.title}&quot; soutenue par {petition.signaturesCount || 1} citoyen(s). »
              </p>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => setStep("configure")}
                className="text-xs text-neutral-400 hover:text-white underline font-mono"
              >
                ← {isEn ? "Edit Info" : "Modifier"}
              </button>

              <button
                onClick={handleLaunchDispatch}
                disabled={dispatching}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-neutral-950 font-extrabold text-xs transition-all shadow-lg cursor-pointer flex items-center space-x-2 disabled:opacity-50"
              >
                {dispatching ? (
                  <span>{isEn ? "Sealing & Dispatching..." : "Apposition du Sceau & Expédition..."}</span>
                ) : (
                  <>
                    <span>{isEn ? "Confirm & Transmit" : "Confirmer & Expédier (14,99 €)"}</span>
                    <HiCheckCircle />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {step === "sent" && (
          <div className="text-center py-6 space-y-4 animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-green-500/20 text-green-400 border border-green-500/30 flex items-center justify-center mx-auto text-3xl">
              <HiEnvelope />
            </div>
            <h4 className="text-lg font-extrabold text-white">
              {isEn ? "Dispatch Successfully Triggered!" : "Expédition Officielle Déclenchée !"}
            </h4>
            <p className="text-xs text-neutral-300 font-light max-w-md mx-auto leading-relaxed">
              {isEn
                ? `Your official certified dossier has been transmitted to ${recipient}. The live tracking badge is now active on your petition.`
                : `Votre dossier certifié a été transmis à ${recipient}. Le badge de suivi en direct est désormais activé sur votre pétition.`}
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-neutral-950 border border-white/10 hover:border-green-500 text-white font-bold text-xs transition-all cursor-pointer"
            >
              {isEn ? "Close" : "Fermer"}
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
