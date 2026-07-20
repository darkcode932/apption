"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import ButtonClick from "../../components/ButtonClick";
import PetItem from "../../components/PetItem";
import HomePet from "../../components/HomePet";
import { getPetitionsUseCase } from "../../../infrastructure/ServiceLocator";
import { Petition } from "../../../domain/entities/Petition";
import { useAuth } from "../../contexts/AuthContext";
import { geolocationService } from "../../../infrastructure/geolocation/geolocationService";
import { useLanguage, useT } from "../../../i18n/LanguageContext";

export default function HomePage() {
  const { user } = useAuth();
  const { locale } = useLanguage();
  const t = useT();
  
  const [petitions, setPetitions] = useState<Petition[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedMode, setFeedMode] = useState<"targeted" | "global">("targeted");

  const fallbackPetitions = [
    {
      id: "1",
      title: locale === "fr" 
        ? "Libération d'un prisonnier à la prison de New-Bell" 
        : "Release of a prisoner from New-Bell prison",
      imageUrl: "/assets/images/libération.jpg",
    },
    {
      id: "2",
      title: locale === "fr"
        ? "Protection de l'environnement contre la déforestation"
        : "Environmental protection against deforestation",
      imageUrl: "/assets/images/feuille.jpg",
    },
    {
      id: "3",
      title: locale === "fr"
        ? "Limitation de vitesse en zone urbaine à 30km/h"
        : "Urban speed limit restricted to 30km/h",
      imageUrl: "/assets/images/limitation.jpg",
    },
  ];

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

  // Filter petitions based on feedMode & geolocation metrics
  const getFilteredPetitions = () => {
    if (feedMode === "global" || !user) {
      return petitions;
    }

    return petitions.filter((pet) => {
      // 1. International is visible to everyone
      if (pet.scale === "International") {
        return true;
      }

      // 2. National is visible to same-country citizens
      if (pet.scale === "National") {
        if (!user.country || !pet.country) return true; // fallback
        return user.country.toLowerCase() === pet.country.toLowerCase();
      }

      // 3. Ville is visible if same city name OR coordinates are within 50km
      if (pet.scale === "Ville") {
        if (user.city && pet.city && user.city.toLowerCase() === pet.city.toLowerCase()) {
          return true;
        }

        if (user.latitude && user.longitude && pet.latitude && pet.longitude) {
          const distance = geolocationService.getDistanceInKm(
            user.latitude,
            user.longitude,
            pet.latitude,
            pet.longitude
          );
          return distance <= 50;
        }

        // fallback if user coordinates are not fully loaded/approved yet
        return true;
      }

      return true;
    });
  };

  const filteredPetitions = getFilteredPetitions();
  const highlightPetition =
    filteredPetitions.find((p) => p.isFeatured) ||
    (filteredPetitions.length > 0 ? filteredPetitions[0] : null);
  const gridPetitions = filteredPetitions
    .filter((p) => p.id !== highlightPetition?.id)
    .slice(0, 3);

  return (
    <div className="flex flex-col py-10 space-y-12 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Decorative Blur Glows */}
      <div className="absolute top-1/4 left-10 w-80 h-80 bg-green-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-10 w-96 h-96 bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Banner Section */}
      <div className="flex flex-col items-center justify-center space-y-8 relative z-10">
        <div className="glass-card flex flex-col items-center justify-center space-y-4 text-white mx-auto px-6 py-14 bg-back5 bg-cover bg-center rounded-3xl w-full border border-white/5 shadow-2xl relative overflow-hidden text-center min-h-[260px]">
          <div className="absolute inset-0 bg-[#0b0b0f]/75 mix-blend-multiply" />
          
          <span className="relative z-10 px-3 py-1 bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-bold rounded-full uppercase tracking-wider">
            {t("home.global_change")}
          </span>
          
          <h1 className="relative z-10 text-3xl sm:text-4xl md:text-6xl font-extrabold tracking-tight max-w-4xl leading-tight text-white drop-shadow-md">
            {t("home.title_primary")}
            <span className="text-red-500">{t("home.title_history")}</span>
          </h1>
          <p className="relative z-10 font-light text-neutral-350 sm:text-lg max-w-2xl">
            {t("home.tagline")}
          </p>
        </div>
        
        <Link href="/launch-petition">
          <ButtonClick
            text={t("home.launch_button")}
            classButton="rounded-full bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 px-10 py-4.5 shadow-xl shadow-red-950/20 transition-all text-lg font-bold"
            classArrow="text-2xl"
          />
        </Link>
      </div>

      {/* Geotargeted Switch */}
      {user && (
        <div className="flex justify-center space-x-2.5 relative z-10">
          <button
            onClick={() => setFeedMode("targeted")}
            className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all border cursor-pointer ${
              feedMode === "targeted"
                ? "bg-green-500 text-neutral-950 border-green-500 shadow-md font-extrabold"
                : "border-white/5 bg-neutral-950/30 text-neutral-400 hover:border-white/10 hover:text-white"
            }`}
          >
            {t("home.around_me")} ({user.city || t("home.local_fallback")})
          </button>
          <button
            onClick={() => setFeedMode("global")}
            className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all border cursor-pointer ${
              feedMode === "global"
                ? "bg-green-500 text-neutral-950 border-green-500 shadow-md font-extrabold"
                : "border-white/5 bg-neutral-950/30 text-neutral-400 hover:border-white/10 hover:text-white"
            }`}
          >
            {t("home.all_causes")} ({t("home.global_fallback")})
          </button>
        </div>
      )}

      {/* Highlight Petition */}
      <div className="space-y-6 relative z-10 pt-2">
        <h2 className="text-center font-extrabold text-red-500 text-2xl tracking-wide uppercase sm:text-3xl font-display">
          {t("home.featured")}
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
            {t("home.popular")}
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
            {filteredPetitions.length > 0 ? (
              <>
                {gridPetitions.map((pet) => (
                  <PetItem
                    key={pet.id}
                    id={pet.id}
                    text={pet.title}
                    link={pet.imageUrl || "/assets/images/libération.jpg"}
                    status={pet.status}
                  />
                ))}
                {gridPetitions.length === 0 && filteredPetitions.length === 1 && (
                  <p className="col-span-full text-neutral-500 text-sm py-4 italic">
                    {t("home.no_other_petitions")}
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

