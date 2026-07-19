import React from "react";
import { Petition } from "../../domain/entities/Petition";
import { HiEye, HiShare, HiCheckCircle } from "react-icons/hi";

interface PetStatProps {
  petitions: Petition[];
}

export default function PetStat({ petitions }: PetStatProps) {
  if (petitions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 glass-card rounded-2xl text-center text-neutral-400">
        <p className="text-sm">Vous n&apos;avez pas encore lancé de pétition.</p>
        <p className="text-xs text-neutral-500 mt-1">Créez votre première pétition pour suivre son impact ici !</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-6">
      {petitions.map((pet) => {
        const signatureGoal = 100;
        const percent = Math.min((pet.signaturesCount / signatureGoal) * 100, 100);

        const shareLink = typeof window !== "undefined"
          ? `${window.location.origin}/petitions/${pet.id}`
          : `/petitions/${pet.id}`;

        return (
          <div
            key={pet.id}
            className="flex flex-col p-6 rounded-2xl bg-neutral-900/40 border border-white/5 space-y-4 hover:border-green-500/15 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <div>
              <h4 className="font-extrabold text-xl text-white tracking-tight line-clamp-1 font-display">
                {pet.title}
              </h4>
            </div>

            {/* Signature Progress Bar */}
            <div className="w-full space-y-1.5">
              <div className="w-full rounded-full bg-neutral-950 border border-white/5 h-3.5 overflow-hidden p-[2px]">
                <div
                  className="bg-gradient-to-r from-green-500 to-emerald-500 h-full rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]"
                  style={{ width: `${percent}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-neutral-450">
                <span>{pet.signaturesCount} signataires</span>
                <span>Objectif: {signatureGoal}</span>
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-3 gap-3 bg-neutral-950/40 px-4 py-3.5 rounded-xl border border-white/5 text-center text-sm">
              <div className="flex flex-col items-center justify-center space-y-1">
                <HiEye className="text-neutral-500 text-lg" />
                <p className="text-xs text-neutral-400 font-light">
                  <span className="font-bold text-red-400 text-sm">{pet.views}</span> Vues
                </p>
              </div>
              <div className="flex flex-col items-center justify-center space-y-1">
                <HiShare className="text-neutral-500 text-lg" />
                <p className="text-xs text-neutral-400 font-light">
                  <span className="font-bold text-red-400 text-sm">{pet.shares}</span> Partages
                </p>
              </div>
              <div className="flex flex-col items-center justify-center space-y-1">
                <HiCheckCircle className="text-neutral-500 text-lg" />
                <p className="text-xs text-neutral-400 font-light">
                  <span className="font-bold text-red-400 text-sm">{pet.signaturesCount}</span> Signatures
                </p>
              </div>
            </div>

            {/* Share Link */}
            <div className="space-y-1.5">
              <p className="text-xs font-bold text-neutral-350">Lien de partage :</p>
              <div className="flex justify-between items-center bg-neutral-950/50 border border-white/5 px-4 py-2.5 rounded-full text-xs font-mono text-green-400 select-all overflow-hidden text-ellipsis">
                <span className="truncate">{shareLink}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
