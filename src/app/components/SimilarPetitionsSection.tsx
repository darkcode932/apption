"use client";

import React, { useEffect, useState } from "react";
import PetItem from "./PetItem";
import { Petition } from "../../domain/entities/Petition";
import { getPetitionsUseCase } from "../../infrastructure/ServiceLocator";
import { HiSparkles } from "react-icons/hi2";
import { useLanguage } from "../../i18n/LanguageContext";

interface SimilarPetitionsSectionProps {
  currentPetitionId: string;
  category: string;
}

export default function SimilarPetitionsSection({
  currentPetitionId,
  category,
}: SimilarPetitionsSectionProps) {
  const { locale } = useLanguage();
  const [similarPetitions, setSimilarPetitions] = useState<Petition[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSimilar() {
      try {
        const all = await getPetitionsUseCase.execute();
        
        // Filter out current petition
        const otherPetitions = all.filter((p) => p.id !== currentPetitionId);
        
        // Match category first, then fallback to rest
        const matchCategory = otherPetitions.filter(
          (p) => p.category?.toLowerCase() === category?.toLowerCase()
        );
        
        let selected = matchCategory;
        if (selected.length < 3) {
          const remaining = otherPetitions.filter((p) => !selected.includes(p));
          selected = [...selected, ...remaining];
        }

        setSimilarPetitions(selected.slice(0, 3));
      } catch (err) {
        console.error("Failed to load similar petitions:", err);
      } finally {
        setLoading(false);
      }
    }

    loadSimilar();
  }, [currentPetitionId, category]);

  if (!loading && similarPetitions.length === 0) return null;

  return (
    <div className="bg-neutral-900 border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/5 pb-4">
        <div className="flex items-center space-x-2.5">
          <HiSparkles className="text-green-400 text-xl animate-pulse" />
          <h3 className="text-lg font-extrabold text-white font-display">
            {locale === "fr" ? "Pétitions Similaires & Causes Proches" : "Similar Petitions & Related Causes"}
          </h3>
        </div>
        <span className="text-xs text-neutral-400 font-mono">
          {category}
        </span>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 rounded-3xl bg-neutral-950/60 border border-white/5 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {similarPetitions.map((pet) => (
            <PetItem
              key={pet.id}
              id={pet.id}
              text={pet.title}
              link={pet.imageUrl || "/assets/images/libération.jpg"}
              status={pet.status}
              signaturesCount={pet.signaturesCount}
              category={pet.category}
              city={pet.city}
              scale={pet.scale}
              creatorName={pet.creatorName}
            />
          ))}
        </div>
      )}

    </div>
  );
}
