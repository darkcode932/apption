"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "../../contexts/AuthContext";
import { getPetitionsByUserIdUseCase } from "../../../infrastructure/ServiceLocator";
import { Petition } from "../../../domain/entities/Petition";
import PetItem from "../../components/PetItem";
import ButtonClick from "../../components/ButtonClick";

export default function MyPetitionsPage() {
  const { user } = useAuth();
  const [petitions, setPetitions] = useState<Petition[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUserPetitions() {
      if (!user) return;
      try {
        const data = await getPetitionsByUserIdUseCase.execute(user.id);
        setPetitions(data);
      } catch (error) {
        console.error("Failed to load user petitions:", error);
      } finally {
        setLoading(false);
      }
    }
    loadUserPetitions();
  }, [user]);

  return (
    <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 flex-grow flex flex-col relative overflow-hidden">

      {/* Background glow */}
      <div className="absolute top-1/4 left-10 w-72 h-72 bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-white/5 pb-6 mb-8 gap-4 relative z-10">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-display">
            Mes Pétitions
          </h1>
          <p className="text-sm text-neutral-450 mt-1.5 font-light">
            Gérez et suivez l&apos;impact des pétitions que vous avez lancées.
          </p>
        </div>

        <Link href="/launch-petition">
          <ButtonClick
            text="Lancer une pétition"
            classButton="rounded-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 px-6 py-2.5 text-neutral-950 font-bold text-sm shadow-lg shadow-green-950/20 transition-all"
            classArrow="hidden"
          />
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-items-center relative z-10">
          {[1, 2, 3].map((n) => (
            <div key={n} className="animate-pulse bg-neutral-900/60 border border-white/5 rounded-2xl h-[280px] w-full max-w-[320px]" />
          ))}
        </div>
      ) : petitions.length === 0 ? (
        <div className="flex-grow flex flex-col items-center justify-center py-16 glass-card rounded-3xl text-center px-4 max-w-xl mx-auto w-full self-center relative z-10">
          <p className="text-neutral-400 font-medium">Vous n&apos;avez lancé aucune pétition pour le moment.</p>
          <p className="text-xs text-neutral-500 mt-1.5 max-w-xs font-light leading-relaxed">
            Avez-vous une cause qui vous tient à cœur ? Exprimez-vous et provoquez le changement en lançant une pétition aujourd&apos;hui !
          </p>
          <Link href="/launch-petition" className="mt-6">
            <ButtonClick
              text="Créer ma première pétition"
              classButton="rounded-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 px-6 py-3 text-neutral-950 font-bold text-sm shadow-lg shadow-green-950/20"
              classArrow="text-lg"
            />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-items-center relative z-10">
          {petitions.map((pet) => (
            <PetItem
              key={pet.id}
              id={pet.id}
              text={pet.title}
              link={pet.imageUrl || "/assets/images/libération.jpg"}
            />
          ))}
        </div>
      )}
    </div>
  );
}
