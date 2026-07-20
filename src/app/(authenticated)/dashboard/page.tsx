"use client";

import React, { useEffect, useState } from "react";

import Profile from "../../components/Profile";
import PetStat from "../../components/PetStat";
import { useAuth } from "../../contexts/AuthContext";
import { getPetitionsByUserIdUseCase } from "../../../infrastructure/ServiceLocator";
import { Petition } from "../../../domain/entities/Petition";
import { useT } from "../../../i18n/LanguageContext";

export default function DashboardPage() {
  const { user } = useAuth();
  const t = useT();
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
    <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 flex flex-col md:flex-row gap-8 relative overflow-hidden">
      
      {/* Decorative Glows */}
      <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-green-555/5 bg-green-500/5 rounded-full blur-[110px] pointer-events-none" />

      {/* Left Column (Profile card) */}
      <div className="w-full md:w-1/3 flex flex-col relative z-10">
        <Profile />
      </div>

      {/* Right Column (Petition list and statistics) */}
      <div className="w-full md:w-2/3 flex flex-col glass-card p-6 sm:p-10 rounded-3xl relative z-10 border border-white/5">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-green-400 tracking-tight mb-8 font-display">
          {t("dashboard.title")}
        </h1>
        
        <div className="space-y-6">
          <div className="flex items-center space-x-2.5">
            <div className="h-5 w-1 bg-green-500 rounded-full" />
            <h2 className="text-lg font-bold text-neutral-200 font-display">
              {t("dashboard.impact_performance")}
            </h2>
          </div>
          
          {loading ? (
            <div className="space-y-4 animate-pulse">
              <div className="bg-neutral-800/50 border border-white/5 h-40 rounded-2xl w-full"></div>
              <div className="bg-neutral-800/50 border border-white/5 h-40 rounded-2xl w-full"></div>
            </div>
          ) : (
            <div className="max-h-[600px] overflow-y-auto scrollbar-hidden pr-1">
              <PetStat petitions={petitions} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

