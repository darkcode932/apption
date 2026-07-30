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

      {/* Hero Banner Section */}
      <div className="relative z-10 p-8 sm:p-12 rounded-3xl bg-neutral-900 border border-white/10 shadow-2xl flex flex-col items-center justify-center space-y-6 text-center overflow-hidden">
        
        {/* Top Ambient Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-48 bg-green-500/10 rounded-full blur-[100px] pointer-events-none" />

        {/* Top Pill Badge */}
        <span className="relative z-10 px-4 py-1 rounded-full bg-neutral-950 border border-green-500/30 text-green-400 text-xs font-black uppercase tracking-widest flex items-center space-x-1.5 shadow-sm">
          <span>🌱</span>
          <span>{t("home.global_change")}</span>
        </span>

        {/* Main Title */}
        <h1 className="relative z-10 text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight max-w-4xl leading-tight text-white font-display">
          {t("home.title_primary")}
          <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
            {t("home.title_history")}
          </span>
        </h1>

        {/* Subtitle Tagline */}
        <p className="relative z-10 font-light text-neutral-300 sm:text-lg max-w-2xl leading-relaxed">
          {t("home.tagline")}
        </p>

        {/* CTA Launch Button */}
        <div className="relative z-10 pt-2">
          <Link href="/launch-petition">
            <ButtonClick
              text={t("home.launch_button")}
              classButton="rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-neutral-950 px-8 py-3.5 shadow-lg shadow-green-500/20 transition-all text-sm font-black uppercase tracking-wider cursor-pointer"
              classArrow="text-xl"
            />
          </Link>
        </div>

        {/* Quick Impact Stats Row */}
        <div className="pt-6 border-t border-white/5 w-full max-w-2xl grid grid-cols-3 gap-4 text-center text-xs text-neutral-400 relative z-10">
          <div>
            <strong className="text-white font-bold block text-sm sm:text-base">120,000+</strong>
            <span>Signatures</span>
          </div>
          <div>
            <strong className="text-amber-400 font-bold block text-sm sm:text-base">850+</strong>
            <span>Victoires</span>
          </div>
          <div>
            <strong className="text-cyan-400 font-bold block text-sm sm:text-base">150+</strong>
            <span>Pays</span>
          </div>
        </div>

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
      <div className="space-y-4 relative z-10 pt-2">
        <div className="flex items-center space-x-3">
          <div className="h-6 w-1 bg-green-500 rounded-full" />
          <h2 className="text-xl sm:text-2xl font-extrabold text-white font-display tracking-tight">
            {t("home.featured")}
          </h2>
        </div>
        {loading ? (
          <div className="flex justify-center py-4">
            <div className="animate-pulse bg-neutral-900/60 border border-white/5 rounded-3xl h-[240px] w-full max-w-5xl"></div>
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

