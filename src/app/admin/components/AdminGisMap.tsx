"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";
import { Petition } from "../../../domain/entities/Petition";
import { HiMapPin, HiTrophy, HiGlobeAlt, HiFire, HiSparkles } from "react-icons/hi2";

interface AdminGisMapProps {
  petitions: Petition[];
}

export default function AdminGisMap({ petitions }: AdminGisMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersLayerRef = useRef<any>(null);

  const [selectedFilter, setSelectedFilter] = useState<"all" | "victory" | "active">("all");
  const [selectedCity, setSelectedCity] = useState<string | null>(null);

  // Calculate City Breakdown Data
  const cityStats = useMemo(() => {
    const stats: Record<string, { name: string; count: number; signatures: number; victory: number }> = {};

    petitions.forEach((p) => {
      const cityName = p.city?.trim() || "Douala";
      if (!stats[cityName]) {
        stats[cityName] = { name: cityName, count: 0, signatures: 0, victory: 0 };
      }
      stats[cityName].count += 1;
      stats[cityName].signatures += p.signaturesCount || 1;
      if (p.status === "victory") stats[cityName].victory += 1;
    });

    return Object.values(stats).sort((a, b) => b.signatures - a.signatures);
  }, [petitions]);

  const filteredPetitions = useMemo(() => {
    return petitions.filter((p) => {
      if (selectedFilter === "victory" && p.status !== "victory") return false;
      if (selectedFilter === "active" && p.status === "victory") return false;
      if (selectedCity && (p.city || "").toLowerCase() !== selectedCity.toLowerCase()) return false;
      return true;
    });
  }, [petitions, selectedFilter, selectedCity]);

  // Leaflet Map Initialization with Safe Re-Init Prevention
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    let L: any;
    import("leaflet").then((leafletModule) => {
      if (!mapContainerRef.current || mapInstanceRef.current) return;

      if ((mapContainerRef.current as any)._leaflet_id) {
        (mapContainerRef.current as any)._leaflet_id = null;
      }

      L = leafletModule.default || leafletModule;

      const map = L.map(mapContainerRef.current, {
        center: [4.05, 9.7], // Default Douala / Global center
        zoom: 5,
        zoomControl: false,
      });

      // Dark CartoDB Tile Layer
      L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
        attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
        subdomains: "abcd",
        maxZoom: 19,
      }).addTo(map);

      L.control.zoom({ position: "bottomright" }).addTo(map);

      const markersGroup = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;
      markersLayerRef.current = markersGroup;

      renderMarkers(L, map, markersGroup, filteredPetitions);
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Markers on filter change
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;

    import("leaflet").then((leafletModule) => {
      const L = leafletModule.default || leafletModule;
      renderMarkers(L, mapInstanceRef.current, markersLayerRef.current, filteredPetitions);
    });
  }, [filteredPetitions]);

  const renderMarkers = React.useCallback(
    (L: any, map: any, markersGroup: any, petitionList: Petition[]) => {
      markersGroup.clearLayers();

      const validPetitions = petitionList.filter((p) => p.latitude && p.longitude);

      validPetitions.forEach((pet) => {
        const isVictory = pet.status === "victory";

        const markerHtml = `
          <div class="relative flex items-center justify-center w-8 h-8 transition-transform duration-300 hover:scale-125 cursor-pointer">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full ${
              isVictory ? "bg-amber-400/40" : "bg-green-500/40"
            }"></span>
            <div class="relative flex items-center justify-center h-6 w-6 rounded-full text-xs font-black shadow-xl border-2 ${
              isVictory
                ? "bg-amber-500 border-amber-300 text-neutral-950"
                : "bg-green-500 border-green-300 text-neutral-950"
            }">
              ${isVictory ? "🏆" : "🌱"}
            </div>
          </div>
        `;

        const customIcon = L.divIcon({
          className: "custom-admin-marker",
          html: markerHtml,
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        });

        const marker = L.marker([pet.latitude, pet.longitude], { icon: customIcon });

        const tooltipContent = `
          <div style="background: #09090b; color: white; padding: 10px 14px; border-radius: 14px; border: 1px solid rgba(255,255,255,0.15); font-family: sans-serif; min-width: 180px;">
            <div style="font-size: 10px; color: ${isVictory ? "#fbbf24" : "#34d399"}; font-weight: bold; margin-bottom: 2px;">
              ${isVictory ? "🏆 VICTOIRE REMPORTÉE" : "🌱 MOBILISATION ACTIVE"}
            </div>
            <div style="font-weight: bold; font-size: 12px; line-height: 1.3;">${pet.title}</div>
            <div style="margin-top: 6px; font-size: 11px; color: #a1a1aa; display: flex; justify-content: space-between;">
              <span>📍 ${pet.city || "National"}</span>
              <span style="color: #34d399; font-weight: bold;">${pet.signaturesCount || 1} sig.</span>
            </div>
          </div>
        `;

        marker.bindTooltip(tooltipContent, { permanent: false, direction: "top", opacity: 1 });
        marker.addTo(markersGroup);
      });
    },
    []
  );

  return (
    <div className="bg-neutral-900 border border-white/10 rounded-3xl p-6 space-y-6 shadow-2xl relative overflow-hidden">
      
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <HiGlobeAlt className="text-cyan-400 text-lg" />
            <h3 className="text-base font-extrabold text-white font-display">
              Impact Géographique & Densité Régionale GIS
            </h3>
          </div>
          <p className="text-xs text-neutral-400 font-light">
            Cartographie temps réel des mobilisations citoyennes et victoires par région.
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => {
              setSelectedFilter("all");
              setSelectedCity(null);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedFilter === "all" && !selectedCity
                ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 shadow-sm"
                : "bg-neutral-950 text-neutral-400 border border-white/5 hover:text-white"
            }`}
          >
            Toutes ({petitions.length})
          </button>

          <button
            onClick={() => setSelectedFilter("victory")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedFilter === "victory"
                ? "bg-amber-500/20 text-amber-400 border border-amber-500/40 shadow-sm"
                : "bg-neutral-950 text-neutral-400 border border-white/5 hover:text-white"
            }`}
          >
            🏆 Victoires ({petitions.filter((p) => p.status === "victory").length})
          </button>

          <button
            onClick={() => setSelectedFilter("active")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedFilter === "active"
                ? "bg-green-500/20 text-green-400 border border-green-500/40 shadow-sm"
                : "bg-neutral-950 text-neutral-400 border border-white/5 hover:text-white"
            }`}
          >
            🌱 En Cours ({petitions.filter((p) => p.status !== "victory").length})
          </button>
        </div>
      </div>

      {/* Map & City Sidebar Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left GIS Leaflet Canvas */}
        <div className="lg:col-span-8 rounded-2xl overflow-hidden border border-white/10 relative h-[380px] bg-neutral-950 shadow-inner">
          <div ref={mapContainerRef} className="w-full h-full z-0" />
          
          {/* Map Overlay Badge */}
          <div className="absolute top-4 left-4 z-10 px-3 py-1.5 rounded-xl bg-neutral-950/90 border border-white/10 backdrop-blur-md text-xs font-mono font-bold text-white flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
            <span>{filteredPetitions.length} causes affichées sur la carte</span>
          </div>
        </div>

        {/* Right City Leaderboard Sidebar */}
        <div className="lg:col-span-4 space-y-3">
          <h4 className="text-xs font-bold text-neutral-300 uppercase tracking-wider flex items-center justify-between">
            <span>Leaderboard des Villes</span>
            <span className="text-[10px] text-cyan-400 font-mono">Densité Signatures</span>
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
                      {c.count} cause(s) • {c.victory} 🏆
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-extrabold text-green-400 font-mono block">
                    {c.signatures}
                  </span>
                  <span className="text-[9px] text-neutral-500 uppercase">signatures</span>
                </div>
              </button>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
