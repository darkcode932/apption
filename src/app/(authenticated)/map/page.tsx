"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import {
  HiGlobeAlt,
  HiTrophy,
  HiFire,
  HiMapPin,
  HiSparkles,
  HiArrowRight,
} from "react-icons/hi2";
import { petitionRepository } from "../../../infrastructure/ServiceLocator";
import { Petition } from "../../../domain/entities/Petition";
import { useT, useLanguage } from "../../../i18n/LanguageContext";
import { geolocationService } from "../../../infrastructure/geolocation/geolocationService";

// Dynamically import Leaflet Map Component with SSR disabled
const ImpactMapComponent = dynamic(
  () => import("../../components/ImpactMapComponent"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full min-h-[480px] bg-neutral-950/60 rounded-3xl border border-white/10 flex items-center justify-center animate-pulse">
        <span className="text-xs text-neutral-400 font-semibold">
          🌍 Chargement de la carte interactive d&apos;impact...
        </span>
      </div>
    ),
  }
);

export default function ImpactMapPage() {
  const t = useT();
  const { locale } = useLanguage();
  const [petitions, setPetitions] = useState<Petition[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<"all" | "victory" | "active">("all");
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const allPetitions = await petitionRepository.getAllPetitions();
        setPetitions(allPetitions);

        // Try getting user location
        const coords = await geolocationService.getCurrentLocation();
        setUserLocation(coords);
      } catch (err) {
        console.error("Failed to load map data:", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const victoriesList = petitions.filter((p) => p.status === "victory");
  const activeList = petitions.filter((p) => p.status !== "victory");

  return (
    <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 space-y-8 relative overflow-hidden">
      
      {/* Background Decorative Blur */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-green-500/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-6">
        <div>
          <div className="flex items-center space-x-2.5 text-green-400">
            <HiGlobeAlt className="text-3xl" />
            <h1 className="text-2xl md:text-4xl font-extrabold text-white font-display uppercase tracking-tight">
              {t("map.title")}
            </h1>
          </div>
          <p className="text-xs md:text-sm text-neutral-400 font-light mt-1.5 leading-relaxed max-w-2xl">
            {t("map.subtitle")}
          </p>
        </div>

        {/* Impact Summary Quick Chips */}
        <div className="flex items-center space-x-3 self-start md:self-auto">
          <div className="px-4 py-2 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center space-x-2">
            <HiTrophy className="text-base" />
            <span className="text-xs font-bold">{victoriesList.length} {t("map.status_victory")}</span>
          </div>

          <div className="px-4 py-2 rounded-2xl bg-green-500/10 border border-green-500/20 text-green-400 flex items-center space-x-2">
            <HiFire className="text-base" />
            <span className="text-xs font-bold">{activeList.length} {t("map.status_active")}</span>
          </div>
        </div>
      </div>

      {/* Map Control Filters Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 glass-card p-3 rounded-2xl border border-white/5">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setSelectedStatus("all")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedStatus === "all"
                ? "bg-green-500 text-neutral-950 shadow-md"
                : "text-neutral-400 hover:text-white hover:bg-white/5"
            }`}
          >
            {t("map.filter_all")} ({petitions.length})
          </button>

          <button
            onClick={() => setSelectedStatus("victory")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedStatus === "victory"
                ? "bg-amber-500 text-neutral-950 shadow-md"
                : "text-neutral-400 hover:text-white hover:bg-white/5"
            }`}
          >
            {t("map.filter_victories")} ({victoriesList.length})
          </button>

          <button
            onClick={() => setSelectedStatus("active")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedStatus === "active"
                ? "bg-green-500 text-neutral-950 shadow-md"
                : "text-neutral-400 hover:text-white hover:bg-white/5"
            }`}
          >
            {t("map.filter_active")} ({activeList.length})
          </button>
        </div>

        {/* Around Me Geolocation Focus Button */}
        {userLocation && (
          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold">
            <HiMapPin className="text-sm animate-bounce" />
            <span>{t("map.filter_around_me")}</span>
          </div>
        )}
      </div>

      {/* Main Grid: Map (Left) & Wall of Victories (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Map Container (Takes 2 Columns on Large Screens) */}
        <div className="lg:col-span-2 h-[520px] w-full">
          {loading ? (
            <div className="w-full h-full min-h-[480px] bg-neutral-950/60 rounded-3xl border border-white/10 flex items-center justify-center animate-pulse">
              <span className="text-xs text-neutral-400 font-semibold">
                Chargement des données cartographiques...
              </span>
            </div>
          ) : (
            <ImpactMapComponent
              petitions={petitions}
              userLocation={userLocation}
              selectedStatus={selectedStatus}
            />
          )}
        </div>

        {/* Wall of Victories Column */}
        <div className="glass-card p-6 sm:p-8 rounded-3xl border border-white/5 space-y-6 flex flex-col max-h-[520px] overflow-hidden">
          <div className="flex items-center space-x-2 text-amber-400">
            <HiTrophy className="text-2xl" />
            <h3 className="text-lg font-extrabold text-white font-display">
              {t("map.wall_title")}
            </h3>
          </div>

          <div className="flex-1 overflow-y-auto scrollbar-hidden space-y-4 pr-1">
            {victoriesList.length === 0 ? (
              <div className="text-center py-10 text-neutral-500 space-y-2">
                <HiSparkles className="text-2xl mx-auto text-neutral-600" />
                <p className="text-xs">
                  {locale === "fr"
                    ? "Les prochaines victoires apparaîtront ici."
                    : "Upcoming victories will appear here."}
                </p>
              </div>
            ) : (
              victoriesList.map((victory) => (
                <div
                  key={victory.id}
                  className="bg-neutral-950/40 p-4 rounded-2xl border border-amber-500/20 hover:border-amber-500/40 transition-all space-y-2 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-amber-500/20 text-amber-400 uppercase tracking-wider">
                      Victoire !
                    </span>
                    <span className="text-[10px] text-neutral-400 font-mono">
                      📍 {victory.city || victory.country || "Mondial"}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-white font-display group-hover:text-amber-400 transition-colors line-clamp-2">
                    {victory.title}
                  </h4>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-neutral-400 font-semibold">
                      ✍️ {victory.signaturesCount} {t("map.signatures")}
                    </span>

                    <Link
                      href={`/petitions/${victory.id}`}
                      className="inline-flex items-center space-x-1 text-[11px] font-extrabold text-amber-400 hover:underline"
                    >
                      <span>{t("map.view_petition")}</span>
                      <HiArrowRight className="text-xs" />
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
