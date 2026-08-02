"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";
import { Petition } from "../../../domain/entities/Petition";
import { HiGlobeAlt } from "react-icons/hi2";
import { useLanguage, useT } from "../../../i18n/LanguageContext";

interface AdminGisMapProps {
  petitions: Petition[];
}

export default function AdminGisMap({ petitions }: AdminGisMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersLayerRef = useRef<any>(null);

  const t = useT();
  const { locale } = useLanguage();

  const [selectedFilter, setSelectedFilter] = useState<"all" | "victory" | "active">("all");
  const [selectedCity, setSelectedCity] = useState<string | null>(null);

  const cityStats = useMemo(() => {
    const stats: Record<string, { name: string; count: number; signatures: number; victory: number }> = {};

    petitions.forEach((p) => {
      const cityName = p.city?.trim() || "Douala";
      if (!stats[cityName]) {
        stats[cityName] = { name: cityName, count: 0, signatures: 0, victory: 0 };
      }
      stats[cityName].count += 1;
      stats[cityName].signatures += p.signaturesCount || 1;
      if (p.status === "victory") {
        stats[cityName].victory += 1;
      }
    });

    return Object.values(stats).sort((a, b) => b.signatures - a.signatures);
  }, [petitions]);

  const filteredPetitions = useMemo(() => {
    return petitions.filter((p) => {
      if (selectedFilter === "victory" && p.status !== "victory") return false;
      if (selectedFilter === "active" && p.status === "victory") return false;
      if (selectedCity && (p.city?.trim() || "Douala") !== selectedCity) return false;
      return true;
    });
  }, [petitions, selectedFilter, selectedCity]);

  useEffect(() => {
    let L: any;
    import("leaflet").then((leafletModule) => {
      if (!mapContainerRef.current || mapInstanceRef.current) return;

      if ((mapContainerRef.current as any)._leaflet_id) {
        (mapContainerRef.current as any)._leaflet_id = null;
      }

      L = leafletModule.default || leafletModule;
      const map = L.map(mapContainerRef.current, {
        center: [4.05, 9.7],
        zoom: 5,
        zoomControl: false,
      });

      L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
        attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
        subdomains: "abcd",
        maxZoom: 19,
      }).addTo(map);

      L.control.zoom({ position: "bottomright" }).addTo(map);
      const group = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;
      markersLayerRef.current = group;

      renderMarkers(L, map, group, filteredPetitions);
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (mapInstanceRef.current && markersLayerRef.current) {
      import("leaflet").then((leafletModule) => {
        const L = leafletModule.default || leafletModule;
        renderMarkers(L, mapInstanceRef.current, markersLayerRef.current, filteredPetitions);
      });
    }
  }, [filteredPetitions]);

  const renderMarkers = (L: any, map: any, group: any, list: Petition[]) => {
    group.clearLayers();

    list.forEach((p) => {
      const lat = p.latitude && p.latitude !== 0 ? p.latitude : 4.05 + (Math.random() - 0.5) * 0.1;
      const lng = p.longitude && p.longitude !== 0 ? p.longitude : 9.7 + (Math.random() - 0.5) * 0.1;

      const isVictory = p.status === "victory";

      const iconHtml = `
        <div class="relative flex items-center justify-center">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full ${
            isVictory ? "bg-amber-400 opacity-75" : "bg-green-400 opacity-75"
          }"></span>
          <div class="relative w-8 h-8 rounded-full border-2 border-white flex items-center justify-center font-bold text-xs shadow-lg ${
            isVictory ? "bg-amber-500 text-neutral-950" : "bg-green-500 text-neutral-950"
          }">
            ${isVictory ? "🏆" : "✊"}
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        html: iconHtml,
        className: "custom-admin-marker",
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      const marker = L.marker([lat, lng], { icon: customIcon });

      const popupHtml = `
        <div style="font-family: sans-serif; padding: 4px; color: #fff; background: #171717; border-radius: 8px;">
          <strong style="font-size: 12px; color: #10b981; display: block;">${p.title}</strong>
          <span style="font-size: 10px; color: #a3a3a3;">📍 ${p.city || "Ville"} • ${p.signaturesCount} signatures</span>
        </div>
      `;

      marker.bindPopup(popupHtml);
      group.addLayer(marker);
    });
  };

  return (
    <div className="bg-neutral-900 border border-white/10 rounded-3xl p-6 space-y-6 shadow-2xl relative overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <HiGlobeAlt className="text-cyan-400 text-lg" />
            <h3 className="text-base font-extrabold text-white font-display">
              {t("admin.gis_title")}
            </h3>
          </div>
          <p className="text-xs text-neutral-400 font-light">
            {t("admin.gis_subtitle")}
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => { setSelectedFilter("all"); setSelectedCity(null); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedFilter === "all" && !selectedCity
                ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 shadow-sm"
                : "bg-neutral-950 text-neutral-400 border border-white/5 hover:text-white"
            }`}
          >
            {t("admin.gis_filter_all")} ({petitions.length})
          </button>

          <button
            onClick={() => setSelectedFilter("victory")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedFilter === "victory"
                ? "bg-amber-500/20 text-amber-400 border border-amber-500/40 shadow-sm"
                : "bg-neutral-950 text-neutral-400 border border-white/5 hover:text-white"
            }`}
          >
            {t("admin.gis_filter_victories")} ({petitions.filter((p) => p.status === "victory").length})
          </button>

          <button
            onClick={() => setSelectedFilter("active")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedFilter === "active"
                ? "bg-green-500/20 text-green-400 border border-green-500/40 shadow-sm"
                : "bg-neutral-950 text-neutral-400 border border-white/5 hover:text-white"
            }`}
          >
            {t("admin.gis_filter_active")} ({petitions.filter((p) => p.status !== "victory").length})
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-8 rounded-2xl overflow-hidden border border-white/10 relative h-[380px] bg-neutral-950 shadow-inner">
          <div ref={mapContainerRef} className="w-full h-full z-0" />
          <div className="absolute top-4 left-4 z-10 px-3 py-1.5 rounded-xl bg-neutral-950/90 border border-white/10 backdrop-blur-md text-xs font-mono font-bold text-white flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
            <span>{filteredPetitions.length} {t("admin.gis_map_shown")}</span>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-3">
          <h4 className="text-xs font-bold text-neutral-300 uppercase tracking-wider flex items-center justify-between">
            <span>{t("admin.gis_leaderboard_title")}</span>
            <span className="text-[10px] text-cyan-400 font-mono">{t("admin.gis_leaderboard_density")}</span>
          </h4>

          <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1 scrollbar-hidden">
            {cityStats.map((c, i) => (
              <button
                key={c.name}
                onClick={() => setSelectedCity(selectedCity === c.name ? null : c.name)}
                className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                  selectedCity === c.name
                    ? "bg-cyan-500/10 border-cyan-500/40 text-white"
                    : "bg-neutral-950/60 border-white/5 hover:border-white/10 text-neutral-300"
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <div className="w-7 h-7 rounded-xl bg-neutral-900 border border-white/10 flex items-center justify-center font-mono text-xs font-bold text-cyan-400">
                    #{i + 1}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">{c.name}</span>
                    <span className="text-[10px] text-neutral-400 font-mono">
                      {c.count} {t("admin.gis_count")} • {c.victory} 🏆
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-extrabold text-green-400 font-mono block">{c.signatures}</span>
                  <span className="text-[9px] text-neutral-500 uppercase">{t("admin.gis_signatures")}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
