"use client";

import React, { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Petition } from "../../domain/entities/Petition";

interface ImpactMapComponentProps {
  petitions: Petition[];
  userLocation: { latitude: number; longitude: number } | null;
  selectedStatus: "all" | "victory" | "active";
}

export default function ImpactMapComponent({
  petitions,
  userLocation,
  selectedStatus,
}: ImpactMapComponentProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersLayerRef = useRef<any>(null);
  const router = useRouter();

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    let L: any;
    import("leaflet").then((leafletModule) => {
      L = leafletModule.default || leafletModule;

      const initialLat = userLocation?.latitude || 4.05; // Default Douala / Paris center
      const initialLng = userLocation?.longitude || 9.7;

      const map = L.map(mapContainerRef.current, {
        center: [initialLat, initialLng],
        zoom: userLocation ? 7 : 4,
        zoomControl: false,
      });

      // CartoDB Dark Matter tile layer
      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
        {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
          subdomains: "abcd",
          maxZoom: 19,
        }
      ).addTo(map);

      // Add Zoom Control at bottom right
      L.control.zoom({ position: "bottomright" }).addTo(map);

      // Markers Layer Group
      const markersGroup = L.layerGroup().addTo(map);

      mapInstanceRef.current = map;
      markersLayerRef.current = markersGroup;

      renderMarkers(L, map, markersGroup);
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Memoize filtered petitions to avoid redundant calculations
  const filteredPetitionsMemo = React.useMemo(() => {
    return petitions.filter((p) => {
      if (selectedStatus === "victory" && p.status !== "victory") return false;
      if (selectedStatus === "active" && p.status === "victory") return false;
      return true;
    });
  }, [petitions, selectedStatus]);

  // Update Markers on petition / filter change
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;

    import("leaflet").then((leafletModule) => {
      const L = leafletModule.default || leafletModule;
      renderMarkers(L, mapInstanceRef.current, markersLayerRef.current, filteredPetitionsMemo);
    });
  }, [filteredPetitionsMemo, userLocation, selectedStatus]);

  const renderMarkers = React.useCallback(
    (L: any, map: any, markersGroup: any, petitionList?: any[]) => {
      markersGroup.clearLayers();
      const targetPetitions = petitionList || filteredPetitionsMemo;

      // 1. Add User Location Marker
      if (userLocation) {
        const userIcon = L.divIcon({
          className: "custom-user-marker",
          html: `
            <div class="relative flex items-center justify-center w-8 h-8">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-4 w-4 bg-cyan-400 border-2 border-white shadow-lg"></span>
            </div>
          `,
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        });

        L.marker([userLocation.latitude, userLocation.longitude], {
          icon: userIcon,
        })
          .addTo(markersGroup)
          .bindTooltip("📍 Votre Position", { permanent: false, direction: "top" });
      }

      // 2. Filter Petitions for valid coordinates
      const filtered = targetPetitions.filter((p) => p.latitude && p.longitude);

      // 3. Add Petition Markers
      filtered.forEach((pet) => {
        const isVictory = pet.status === "victory";

        const markerHtml = `
          <div class="relative flex items-center justify-center w-9 h-9 transition-transform duration-300 hover:scale-125 cursor-pointer">
            <span class="animate-pulse absolute inline-flex h-full w-full rounded-full ${
              isVictory ? "bg-amber-400/40" : "bg-green-500/40"
            }"></span>
            <div class="relative flex items-center justify-center h-7 w-7 rounded-full text-xs font-black shadow-xl border-2 ${
              isVictory
                ? "bg-amber-500 border-amber-300 text-neutral-950"
                : "bg-green-500 border-green-300 text-neutral-950"
            }">
              ${isVictory ? "🏆" : "🌱"}
            </div>
          </div>
        `;

        const customIcon = L.divIcon({
          className: "custom-petition-marker",
          html: markerHtml,
          iconSize: [36, 36],
          iconAnchor: [18, 18],
        });

        const popupHtml = `
          <div style="font-family: inherit; color: #fff; background: #0f1015; border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 14px; min-width: 220px; max-width: 280px; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.5);">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
              <span style="font-size: 10px; font-weight: 800; text-transform: uppercase; padding: 2px 8px; border-radius: 9999px; background: ${
                isVictory ? "rgba(245, 158, 11, 0.2)" : "rgba(34, 197, 94, 0.2)"
              }; color: ${isVictory ? "#fbbf24" : "#4ade80"}; border: 1px solid ${
          isVictory ? "rgba(245, 158, 11, 0.3)" : "rgba(34, 197, 94, 0.3)"
        };">
                ${isVictory ? "🏆 Victoire Citoyenne !" : "🔥 Pétition Active"}
              </span>
              <span style="font-size: 10px; color: #a3a3a3; font-weight: 600;">
                📍 ${pet.city || pet.country || "Local"}
              </span>
            </div>

            <h4 style="font-size: 13px; font-weight: 800; margin: 0 0 6px 0; color: #fff; line-height: 1.3;">
              ${pet.title}
            </h4>

            <p style="font-size: 11px; color: #a3a3a3; margin: 0 0 10px 0;">
              ✍️ <strong>${pet.signaturesCount}</strong> signatures
            </p>

            <a href="/petitions/${pet.id}" 
               style="display: block; text-align: center; background: ${
                 isVictory ? "#f59e0b" : "#22c55e"
               }; color: #0b0b0f; font-size: 11px; font-weight: 800; padding: 8px 12px; border-radius: 12px; text-decoration: none; transition: all 0.2s;"
               onmouseover="this.style.opacity='0.85'" 
               onmouseout="this.style.opacity='1'">
              Voir la pétition &rarr;
            </a>
          </div>
        `;

        const marker = L.marker([pet.latitude, pet.longitude], {
          icon: customIcon,
        }).addTo(markersGroup);

        marker.bindPopup(popupHtml, {
          className: "custom-leaflet-popup",
          closeButton: false,
        });
      });
    },
    [petitions, selectedStatus, userLocation]
  );

  return (
    <div className="relative w-full h-full rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
      <div ref={mapContainerRef} className="w-full h-full min-h-[480px] z-10" />

      {/* Global CSS Overrides for Leaflet Popup Transparent Container */}
      <style jsx global>{`
        .leaflet-popup-content-wrapper {
          background: transparent !important;
          box-shadow: none !important;
          padding: 0 !important;
        }
        .leaflet-popup-tip {
          background: #0f1015 !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
        }
      `}</style>
    </div>
  );
}
