"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { HiUser, HiCheckCircle, HiShare, HiArrowLeft, HiExclamationCircle } from "react-icons/hi";
import { useAuth } from "../../../contexts/AuthContext";
import {
  signPetitionUseCase,
  petitionRepository,
} from "../../../../infrastructure/ServiceLocator";
import { Petition } from "../../../../domain/entities/Petition";
import ButtonClick from "../../../components/ButtonClick";

export default function PetitionDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  
  const id = params.id as string;

  const [petition, setPetition] = useState<Petition | null>(null);
  const [loading, setLoading] = useState(true);
  const [signing, setSigning] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [signError, setSignError] = useState<string | null>(null);
  const [viewIncremented, setViewIncremented] = useState(false);

  // Real-time listener for petition updates
  useEffect(() => {
    if (!id) return;

    const unsubscribe = petitionRepository.onPetitionSnapshot(id, (data) => {
      if (data) {
        setPetition(data);
      } else {
        setError("Pétition introuvable.");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [id]);

  // Increment views once when petition first loads
  useEffect(() => {
    if (petition && !viewIncremented) {
      petitionRepository.incrementViews(id).catch(console.error);
      setViewIncremented(true);
    }
  }, [petition, viewIncremented, id]);

  const handleSign = async () => {
    if (!user || !petition) return;
    setSigning(true);
    setSignError(null);
    try {
      const displayName = user.username || `${user.firstname} ${user.lastname}`;
      await signPetitionUseCase.execute(petition.id, user.id, displayName);
      // No need to manually update state — the real-time listener will push the new data
    } catch (err: any) {
      console.error("Signing error:", err);
      setSignError(err?.message || "Une erreur est survenue lors de la signature.");
    } finally {
      setSigning(false);
    }
  };

  const handleShare = async () => {
    if (!petition) return;
    try {
      const shareUrl = window.location.href;
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      
      await petitionRepository.incrementShares(petition.id);
      // Real-time listener will update the share count
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-128px)] bg-[#0b0b0f] text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-400"></div>
        <p className="mt-4 text-neutral-450 text-sm">Chargement de la pétition...</p>
      </div>
    );
  }

  if (error || !petition) {
    return (
      <div className="max-w-xl mx-auto w-full px-4 py-16 text-center flex flex-col items-center justify-center min-h-[calc(100vh-128px)]">
        <p className="text-red-400 font-bold text-xl">{error || "Pétition introuvable"}</p>
        <button
          onClick={() => router.push("/home")}
          className="mt-6 flex items-center space-x-2 text-neutral-350 hover:text-white bg-neutral-900 border border-white/5 px-6 py-2.5 rounded-full transition-all text-sm font-semibold"
        >
          <HiArrowLeft />
          <span>Retour à l&apos;accueil</span>
        </button>
      </div>
    );
  }

  const hasSigned = user ? petition.signatureUserIds.includes(user.id) : false;
  const signatureGoal = 100;
  const percent = Math.min((petition.signaturesCount / signatureGoal) * 100, 100);

  return (
    <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 flex flex-col space-y-8 relative overflow-hidden">
      
      {/* Background decorations */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-green-500/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Back button */}
      <button
        onClick={() => router.back()}
        className="self-start flex items-center space-x-2 text-neutral-450 hover:text-white transition-colors text-sm font-semibold"
      >
        <HiArrowLeft />
        <span>Retour</span>
      </button>

      {/* Main Container */}
      <div className="flex flex-col lg:flex-row gap-10 items-start relative z-10">
        
        {/* Left Side: Details */}
        <div className="w-full lg:w-2/3 flex flex-col space-y-6">
          <span className="self-start px-3 py-1 bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-bold rounded-full uppercase tracking-wider">
            {petition.category} • {petition.scale}
          </span>
          <h1 className="font-extrabold text-3xl sm:text-4xl md:text-5xl text-white tracking-tight leading-tight font-display">
            {petition.title}
          </h1>

          <div className="rounded-3xl overflow-hidden border border-white/5 shadow-2xl bg-neutral-950/20 max-h-[450px]">
            <img
              src={petition.imageUrl || "/assets/images/libération.jpg"}
              alt="Illustration de la pétition"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Creator details */}
          <div className="flex items-center space-x-3 bg-neutral-900/50 p-4 rounded-2xl border border-white/5 shadow-md">
            <div className="h-10 w-10 rounded-full bg-green-950/30 flex items-center justify-center text-green-400 font-bold border border-green-500/20 shadow-inner">
              <HiUser className="text-xl" />
            </div>
            <div>
              <p className="font-bold text-sm text-white font-display">
                {petition.creatorName}
              </p>
              <p className="text-[10px] text-neutral-450 font-light mt-0.5">
                A lancé cette pétition le {petition.createdAt.toLocaleDateString("fr-FR")}
              </p>
            </div>
          </div>

          {/* Description */}
          <div className="flex flex-col space-y-4 glass-card p-6 sm:p-8 rounded-3xl border border-white/5">
            <div className="flex items-center space-x-2">
              <div className="h-5 w-1 bg-green-500 rounded-full" />
              <h3 className="font-extrabold text-lg text-white font-display">
                Description de la pétition
              </h3>
            </div>
            <p className="text-neutral-350 font-light text-sm sm:text-base leading-relaxed whitespace-pre-wrap">
              {petition.description}
            </p>
          </div>
        </div>

        {/* Right Side: Signatures & Sidebar */}
        <div className="w-full lg:w-1/3 flex flex-col glass-card p-6 sm:p-8 rounded-3xl shadow-2xl border border-white/5 space-y-6">
          <div className="space-y-2">
            <h3 className="text-2xl font-extrabold text-white font-display">
              Soutiens
            </h3>
            <p className="text-xs sm:text-sm text-neutral-450">
              <span className="font-extrabold text-white text-base">{petition.signaturesCount}</span> personnes ont signé. Objectif : {signatureGoal} !
            </p>
          </div>

          {/* Progress bar */}
          <div className="w-full rounded-full bg-neutral-950 border border-white/5 h-4 overflow-hidden shadow-inner p-[2px]">
            <div
              className="bg-gradient-to-r from-green-500 to-emerald-500 h-full rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
              style={{ width: `${percent}%` }}
            />
          </div>

          {/* Sign Error Message */}
          {signError && (
            <div className="flex items-center space-x-2 bg-red-950/20 border border-red-500/20 text-red-400 py-3 px-4 rounded-2xl text-xs font-medium">
              <HiExclamationCircle className="text-lg flex-shrink-0" />
              <span>{signError}</span>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col gap-3 pt-2">
            {hasSigned ? (
              <div className="flex items-center justify-center space-x-2 bg-green-950/20 border border-green-500/20 text-green-400 py-3 rounded-full text-sm font-bold shadow-md shadow-green-950/10">
                <HiCheckCircle className="text-lg" />
                <span>Vous avez soutenu cette cause</span>
              </div>
            ) : (
              <ButtonClick
                text={signing ? "Signature..." : "Soutenir cette cause"}
                classButton="rounded-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-neutral-950 font-extrabold text-sm justify-center w-full py-3.5 shadow-lg shadow-green-950/20 transition-all"
                classArrow="hidden"
                onClick={handleSign}
                disabled={signing}
              />
            )}

            <ButtonClick
              text={copied ? "Lien copié !" : "Partager la pétition"}
              classButton="rounded-full bg-neutral-900 hover:bg-neutral-800/80 border border-white/5 px-6 py-3 text-white font-semibold text-xs justify-center w-full transition-all"
              classArrow="hidden"
              onClick={handleShare}
            />
          </div>

          {/* Signers List */}
          <div className="flex flex-col space-y-4 pt-5 border-t border-white/5">
            <h4 className="text-[10px] font-bold uppercase text-neutral-450 tracking-wider">
              Derniers signataires ({petition.signatureNames.length})
            </h4>
            <div className="flex flex-col space-y-2 max-h-48 overflow-y-auto scrollbar-hidden pr-1">
              {petition.signatureNames.slice().reverse().map((name: string, index: number) => (
                <div key={index} className="flex items-center space-x-2.5 py-2 border-b border-white/5 last:border-0">
                  <div className="h-6 w-6 rounded-full bg-neutral-900/60 flex items-center justify-center text-[10px] text-green-400 border border-white/5 font-bold uppercase">
                    {name.charAt(0)}
                  </div>
                  <p className="text-xs font-semibold text-neutral-300 truncate">
                    {name}
                  </p>
                </div>
              ))}
              {petition.signatureNames.length === 0 && (
                <p className="text-xs text-neutral-500 italic py-2">
                  Aucun signataire pour le moment.
                </p>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
