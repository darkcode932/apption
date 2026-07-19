import React from "react";
import Link from "next/link";
import { UserGroupIcon, BanknotesIcon, UserIcon } from "@heroicons/react/24/outline";
import { HiTrophy } from "react-icons/hi2";
import { Petition } from "../../domain/entities/Petition";

interface HomePetProps {
  petition?: Petition | null;
}

export default function HomePet({ petition }: HomePetProps) {
  const isFallback = !petition;

  const id = petition?.id || "";
  const title = petition?.title || "L'ENSPD sera dotée de toilettes publiques";
  const description =
    petition?.description ||
    "Grâce à la collecte de 3500 signatures, les étudiants de l'ENSPD ont eu l'approbation pour la création de toilettes publiques, ceci visant l'amélioration de la qualité de vie au sein de campus.";
  const imageUrl = petition?.imageUrl || "/assets/images/card.jpg";
  const creatorName = petition?.creatorName || "Russel Atebede";
  const signaturesCount = petition?.signaturesCount || 3500;
  const isVictory = petition?.status === "victory";

  const content = (
    <div className="group flex flex-col md:flex-row rounded-3xl overflow-hidden glass-card max-w-5xl w-full md:h-[350px] transition-all duration-300 hover:border-green-500/20 hover:shadow-[0_12px_48px_rgba(0,0,0,0.5)] relative">
      <div className="w-full md:w-1/2 h-[200px] md:h-full overflow-hidden border-b md:border-b-0 md:border-r border-white/5">
        <img
          alt="Highlight petition image"
          src={imageUrl}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </div>
      <div className="w-full md:w-1/2 flex flex-col justify-between">
        <div className="flex flex-col space-y-4 py-8 px-6 md:px-8">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase text-red-500 font-bold tracking-widest">
              À la une
            </span>
            {isVictory && (
              <span className="flex items-center space-x-1.5 py-1 px-3 bg-yellow-500 text-neutral-950 font-extrabold text-[10px] uppercase tracking-wider rounded-full shadow-md shadow-yellow-500/10 animate-pulse">
                <HiTrophy className="text-xs" />
                <span>Victoire !</span>
              </span>
            )}
          </div>
          <h3 className="font-extrabold text-2xl text-white line-clamp-2 leading-snug font-display">
            {title}
          </h3>
          <p className="text-neutral-450 text-sm font-light leading-relaxed line-clamp-3">
            {description}
          </p>
        </div>

        <div className="grid grid-cols-3 h-20 divide-x divide-white/5 border-t border-white/5 bg-neutral-950/30">
          <div className="flex items-center justify-center space-x-2 px-2">
            <UserIcon className="h-5 w-5 text-green-500 flex-shrink-0" />
            <div className="flex flex-col min-w-0">
              <span className="font-semibold text-xs text-white truncate">{creatorName}</span>
              <span className="text-[10px] text-neutral-500">Auteur</span>
            </div>
          </div>
          <div className="flex items-center justify-center space-x-2 px-2">
            <UserGroupIcon className="h-5 w-5 text-green-500 flex-shrink-0" />
            <div className="flex flex-col min-w-0">
              <span className="font-bold text-sm text-white">{signaturesCount}</span>
              <span className="text-[10px] text-neutral-500">Signataires</span>
            </div>
          </div>
          <div className="flex items-center justify-center space-x-2 px-2">
            <BanknotesIcon className="h-5 w-5 text-green-500 flex-shrink-0" />
            <div className="flex flex-col min-w-0">
              <span className="font-semibold text-xs text-white">Sponsorisée</span>
              <span className="text-[10px] text-neutral-500">Non</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (isFallback) {
    return <div className="flex justify-center w-full px-4">{content}</div>;
  }

  return (
    <div className="flex justify-center w-full px-4">
      <Link href={`/petitions/${id}`} className="w-full flex justify-center cursor-pointer">
        {content}
      </Link>
    </div>
  );
}
