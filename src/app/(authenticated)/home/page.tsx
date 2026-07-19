"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import ButtonClick from "../../components/ButtonClick";
import PetItem from "../../components/PetItem";
import HomePet from "../../components/HomePet";
import { getPetitionsUseCase } from "../../../infrastructure/ServiceLocator";
import { Petition } from "../../../domain/entities/Petition";

const fallbackPetitions = [
  {
    id: "1",
    title: "Libération d'un prisonnier à la prison de New-Bell",
    imageUrl: "/assets/images/libération.jpg",
  },
  {
    id: "2",
    title: "Protection de l'environnement contre la déforestation",
    imageUrl: "/assets/images/feuille.jpg",
  },
  {
    id: "3",
    title: "Limitation de vitesse en zone urbaine à 30km/h",
    imageUrl: "/assets/images/limitation.jpg",
  },
];

export default function HomePage() {
  const [petitions, setPetitions] = useState<Petition[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPetitions() {
      try {
        const data = await getPetitionsUseCase.execute();
        setPetitions(data);
      } catch (error) {
        console.error("Failed to load petitions:", error);
      } finally {
        setLoading(false);
      }
    }
    loadPetitions();
  }, []);

  const highlightPetition = petitions.length > 0 ? petitions[0] : null;
  const gridPetitions = petitions.length > 1 ? petitions.slice(1, 4) : [];

  return (
    <div className="flex flex-col py-10 space-y-16 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Decorative Blur Glows */}
      <div className="absolute top-1/4 left-10 w-80 h-80 bg-green-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-10 w-96 h-96 bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Banner Section */}
      <div className="flex flex-col items-center justify-center space-y-8 relative z-10">
        <div className="glass-card flex flex-col items-center justify-center space-y-4 text-white mx-auto px-6 py-14 bg-back5 bg-cover bg-center rounded-3xl w-full border border-white/5 shadow-2xl relative overflow-hidden text-center min-h-[260px]">
          <div className="absolute inset-0 bg-[#0b0b0f]/75 mix-blend-multiply" />
          
          <span className="relative z-10 px-3 py-1 bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-bold rounded-full uppercase tracking-wider">
            Changement Global
          </span>
          
          <h1 className="relative z-10 text-3xl sm:text-4xl md:text-6xl font-extrabold tracking-tight max-w-4xl leading-tight text-white drop-shadow-md">
            La plateforme mondiale pour le changement, l&apos;influence de l&apos;
            <span className="text-red-500">histoire</span>
          </h1>
          <p className="relative z-10 font-light text-neutral-350 sm:text-lg max-w-2xl">
            Des milliers de personnes agissent sur le destin de notre planète{" "}
            <span className="text-red-400 font-semibold">chaque jour</span>.
          </p>
        </div>
        
        <Link href="/launch-petition">
          <ButtonClick
            text="Lancer une pétition"
            classButton="rounded-full bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 px-10 py-4.5 shadow-xl shadow-red-950/20 transition-all text-lg font-bold"
            classArrow="text-2xl"
          />
        </Link>
      </div>

      {/* Highlight Petition */}
      <div className="space-y-6 relative z-10">
        <h2 className="text-center font-extrabold text-red-500 text-2xl tracking-wide uppercase sm:text-3xl font-display">
          À la une
        </h2>
        {loading ? (
          <div className="flex justify-center py-10">
            <div className="animate-pulse bg-neutral-900/60 border border-white/5 rounded-3xl h-[350px] w-full max-w-5xl"></div>
          </div>
        ) : (
          <HomePet petition={highlightPetition} />
        )}
      </div>

      {/* Popular Petitions Grid */}
      <div className="flex flex-col space-y-8 relative z-10">
        <div className="flex items-center space-x-3">
          <div className="h-6 w-1 bg-green-500 rounded-full" />
          <h2 className="text-xl sm:text-2xl font-extrabold text-white font-display tracking-tight">
            Pétitions populaires
          </h2>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-items-center">
            {[1, 2, 3].map((n) => (
              <div key={n} className="animate-pulse bg-neutral-900 border border-white/5 rounded-2xl h-[280px] w-full max-w-[320px]"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-items-center">
            {petitions.length > 0 ? (
              <>
                {gridPetitions.map((pet) => (
                  <PetItem
                    key={pet.id}
                    id={pet.id}
                    text={pet.title}
                    link={pet.imageUrl || "/assets/images/libération.jpg"}
                  />
                ))}
                {gridPetitions.length === 0 && petitions.length === 1 && (
                  <p className="col-span-full text-neutral-500 text-sm py-4 italic">
                    Aucune autre pétition pour le moment.
                  </p>
                )}
              </>
            ) : (
              fallbackPetitions.map((pet) => (
                <PetItem
                  key={pet.id}
                  text={pet.title}
                  link={pet.imageUrl}
                />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
