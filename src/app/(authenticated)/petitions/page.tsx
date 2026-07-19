"use client";

import React, { useEffect, useState } from "react";
import { getPetitionsUseCase } from "../../../infrastructure/ServiceLocator";
import { Petition } from "../../../domain/entities/Petition";
import PetItem from "../../components/PetItem";
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import { useAuth } from "../../contexts/AuthContext";
import { geolocationService } from "../../../infrastructure/geolocation/geolocationService";

const categories = [
  "Toutes",
  "Politique",
  "Education",
  "Sport",
  "Art",
  "Santé",
  "Droits de l'homme",
  "Environnement",
  "Autres...",
];

const scales = [
  "Toutes",
  "Ville",
  "National",
  "International",
];

export default function PetitionsListPage() {
  const { user } = useAuth();
  const [petitions, setPetitions] = useState<Petition[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState("Toutes");
  const [selectedScale, setSelectedScale] = useState("Toutes");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("recent"); // "recent" | "popular" | "views"
  const [feedMode, setFeedMode] = useState<"targeted" | "global">("targeted");

  useEffect(() => {
    async function loadFilteredPetitions() {
      setLoading(true);
      try {
        const catFilter = selectedCategory === "Toutes" ? undefined : selectedCategory;
        const scaleFilter = selectedScale === "Toutes" ? undefined : selectedScale;
        const data = await getPetitionsUseCase.execute(catFilter, scaleFilter);
        setPetitions(data);
      } catch (error) {
        console.error("Failed to load petitions:", error);
      } finally {
        setLoading(false);
      }
    }

    loadFilteredPetitions();
  }, [selectedCategory, selectedScale]);

  // Client-side searching, sorting and geotargeted filtering
  const filteredAndSortedPetitions = petitions
    .filter((pet) => {
      // 1. Text Search Filter
      const matchSearch =
        pet.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pet.description.toLowerCase().includes(searchTerm.toLowerCase());
      if (!matchSearch) return false;

      // 2. Geotargeted Range Filter
      if (feedMode === "targeted" && user) {
        if (pet.scale === "National") {
          if (user.country && pet.country && user.country.toLowerCase() !== pet.country.toLowerCase()) {
            return false;
          }
        } else if (pet.scale === "Ville") {
          const sameCity = user.city && pet.city && user.city.toLowerCase() === pet.city.toLowerCase();
          let withinRadius = false;
          if (user.latitude && user.longitude && pet.latitude && pet.longitude) {
            const distance = geolocationService.getDistanceInKm(
              user.latitude,
              user.longitude,
              pet.latitude,
              pet.longitude
            );
            withinRadius = distance <= 50;
          }
          if (!sameCity && !withinRadius) {
            return false;
          }
        }
      }

      return true;
    })
    .sort((a, b) => {
      if (sortBy === "popular") {
        return b.signaturesCount - a.signaturesCount;
      }
      if (sortBy === "views") {
        return b.views - a.views;
      }
      // default to "recent"
      return b.createdAt.getTime() - a.createdAt.getTime();
    });

  return (
    <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 flex-grow flex flex-col relative overflow-hidden">

      {/* Background glow */}
      <div className="absolute top-1/3 right-10 w-80 h-80 bg-green-500/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Header */}
      <div className="border-b border-white/5 pb-6 mb-8 relative z-10">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-display">
          Explorer les Pétitions
        </h1>
        <p className="text-sm text-neutral-450 mt-1.5 font-light">
          Recherchez et découvrez les causes de la communauté. Prêtez votre voix pour créer un réel impact.
        </p>
      </div>

      {/* Search Bar & Filters */}
      <div className="space-y-4 mb-8 relative z-10">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          {/* Text Search Input */}
          <div className="relative w-full md:flex-1">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
              <MagnifyingGlassIcon className="h-5 w-5 text-neutral-500" aria-hidden="true" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher par titre ou description..."
              className="block w-full rounded-2xl border border-white/5 bg-neutral-950/40 py-3 pl-11 pr-4 text-sm text-white placeholder-neutral-500 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/10 transition-all"
            />
          </div>

          {/* Sort Dropdown */}
          <div className="flex flex-col min-w-[180px] w-full md:w-auto">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-neutral-950/50 border border-white/5 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 cursor-pointer transition-all"
            >
              <option value="recent">Plus Récentes</option>
              <option value="popular">Plus Populaires (Signatures)</option>
              <option value="views">Plus Consultées (Vues)</option>
            </select>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="flex flex-col lg:flex-row gap-4 bg-[#16161c]/40 border border-white/5 p-4 rounded-2xl items-center justify-between">
          <div className="flex flex-wrap gap-4 items-center w-full">
            {/* Targeted Switch */}
            {user && (
              <div className="flex bg-neutral-955 border border-white/5 rounded-full p-[2px] items-center">
                <button
                  type="button"
                  onClick={() => setFeedMode("targeted")}
                  className={`px-3 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    feedMode === "targeted"
                      ? "bg-green-500 text-neutral-950 font-extrabold"
                      : "text-neutral-450 hover:text-white"
                  }`}
                >
                  📍 Autour de moi
                </button>
                <button
                  type="button"
                  onClick={() => setFeedMode("global")}
                  className={`px-3 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    feedMode === "global"
                      ? "bg-green-500 text-neutral-950 font-extrabold"
                      : "text-neutral-450 hover:text-white"
                  }`}
                >
                  🌍 Global
                </button>
              </div>
            )}

            <div className="hidden lg:block h-6 w-px bg-white/10" />

            {/* Category selection list */}
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => {
                const isSelected = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`py-1.5 px-3 rounded-full text-xs font-semibold border transition-all ${
                      isSelected
                        ? "bg-green-500 border-green-500 text-neutral-950 font-bold"
                        : "bg-neutral-950/30 border-white/5 text-neutral-350 hover:bg-neutral-900 hover:text-white"
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            <div className="hidden lg:block h-6 w-px bg-white/10" />

            {/* Scale Filter select */}
            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <label htmlFor="scale" className="text-[10px] font-bold text-neutral-450 uppercase tracking-wider whitespace-nowrap">
                Échelle :
              </label>
              <select
                id="scale"
                value={selectedScale}
                onChange={(e) => setSelectedScale(e.target.value)}
                className="bg-neutral-950/50 border border-white/5 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-green-500 cursor-pointer transition-all"
              >
                {scales.map((s) => (
                  <option key={s} value={s}>
                    {s === "Toutes" ? "Toutes" : s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="text-xs text-neutral-500 self-end lg:self-center whitespace-nowrap pt-2 lg:pt-0 pl-1 font-medium">
            <span className="text-green-400 font-bold">{filteredAndSortedPetitions.length}</span> pétition(s) trouvée(s)
          </div>
        </div>
      </div>

      {/* Grid List */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-items-center relative z-10">
          {[1, 2, 3].map((n) => (
            <div key={n} className="animate-pulse bg-neutral-900/60 border border-white/5 rounded-2xl h-[280px] w-full max-w-[320px]" />
          ))}
        </div>
      ) : filteredAndSortedPetitions.length === 0 ? (
        <div className="flex-grow flex flex-col items-center justify-center py-16 text-center text-neutral-400 relative z-10">
          <p className="font-semibold">Aucune pétition ne correspond à vos critères.</p>
          <p className="text-xs text-neutral-500 mt-1.5">Essayez d&apos;ajuster la recherche, le filtre de géolocalisation ou les filtres d&apos;échelle.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-items-center relative z-10">
          {filteredAndSortedPetitions.map((pet) => (
            <PetItem
              key={pet.id}
              id={pet.id}
              text={pet.title}
              link={pet.imageUrl || "/assets/images/libération.jpg"}
              status={pet.status}
            />
          ))}
        </div>
      )}
    </div>
  );
}
