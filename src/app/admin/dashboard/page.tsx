"use client";

import React, { useEffect, useState } from "react";
import {
  HiUsers,
  HiDocumentText,
  HiHeart,
  HiEye,
  HiArrowRight,
  HiTrophy,
} from "react-icons/hi2";
import Link from "next/link";
import { getPetitionsUseCase, getAllUsersUseCase } from "../../../infrastructure/ServiceLocator";
import { Petition } from "../../../domain/entities/Petition";
import { User } from "../../../domain/entities/User";

export default function AdminDashboardPage() {
  const [petitions, setPetitions] = useState<Petition[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [petData, userData] = await Promise.all([
          getPetitionsUseCase.execute(),
          getAllUsersUseCase.execute(),
        ]);
        setPetitions(petData);
        setUsers(userData);
      } catch (e) {
        console.error("Failed to load admin stats:", e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-white">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-green-500"></div>
        <p className="mt-4 text-xs text-neutral-450 italic">Calcul des statistiques de la plateforme...</p>
      </div>
    );
  }

  // Calculate statistics
  const totalUsers = users.length;
  const totalPetitions = petitions.length;
  
  const activePetitions = petitions.filter((p) => p.status !== "victory").length;
  const victoryPetitions = petitions.filter((p) => p.status === "victory").length;
  const victoryRate = totalPetitions > 0 ? Math.round((victoryPetitions / totalPetitions) * 100) : 0;

  const totalSignatures = petitions.reduce((acc, curr) => acc + (curr.signaturesCount || 0), 0);
  const totalViews = petitions.reduce((acc, curr) => acc + (curr.views || 0), 0);
  const totalShares = petitions.reduce((acc, curr) => acc + (curr.shares || 0), 0);

  const statsCards = [
    {
      title: "Utilisateurs",
      value: totalUsers,
      desc: "Profils enregistrés",
      icon: HiUsers,
      color: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    },
    {
      title: "Total Pétitions",
      value: totalPetitions,
      desc: `${activePetitions} actives, ${victoryPetitions} victoires`,
      icon: HiDocumentText,
      color: "text-green-455 bg-green-500/10 border-green-500/20",
    },
    {
      title: "Taux de Réussite",
      value: `${victoryRate}%`,
      desc: "Pétitions remportées",
      icon: HiTrophy,
      color: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
    },
    {
      title: "Signatures cumulées",
      value: totalSignatures,
      desc: "Soutiens citoyens",
      icon: HiHeart,
      color: "text-red-400 bg-red-500/10 border-red-500/20",
    },
  ];

  return (
    <div className="space-y-10 animate-fadeIn">
      
      {/* Header */}
      <div className="border-b border-white/5 pb-6">
        <h1 className="text-3xl font-extrabold text-white font-display tracking-tight">
          Tableau de Bord
        </h1>
        <p className="text-xs sm:text-sm text-neutral-450 mt-1.5 font-light">
          Aperçu global de l&apos;activité citoyenne et de la croissance d&apos;Apption.
        </p>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="glass-card p-6 rounded-2xl border border-white/5 flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs text-neutral-450 font-semibold uppercase tracking-wider">{stat.title}</p>
                <h3 className="text-3xl font-extrabold text-white font-display">{stat.value}</h3>
                <p className="text-[10px] text-neutral-500 font-light">{stat.desc}</p>
              </div>
              <div className={`h-12 w-12 rounded-xl flex items-center justify-center border text-xl ${stat.color}`}>
                <Icon />
              </div>
            </div>
          );
        })}
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        {/* Engagement Card */}
        <div className="glass-card p-6 sm:p-8 rounded-2xl border border-white/5 space-y-6">
          <h3 className="font-extrabold text-lg text-white font-display">Taux d&apos;engagement</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <span className="text-neutral-400 text-xs sm:text-sm flex items-center space-x-2">
                <HiEye className="text-neutral-500" />
                <span>Vues globales</span>
              </span>
              <span className="font-bold text-sm text-white">{totalViews}</span>
            </div>
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <span className="text-neutral-400 text-xs sm:text-sm flex items-center space-x-2">
                <HiDocumentText className="text-neutral-500" />
                <span>Nombre de partages</span>
              </span>
              <span className="font-bold text-sm text-white">{totalShares}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-neutral-400 text-xs sm:text-sm">Ratio signatures / vues</span>
              <span className="font-bold text-sm text-green-455">
                {totalViews > 0 ? `${Math.round((totalSignatures / totalViews) * 100)}%` : "0%"}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Links Card */}
        <div className="glass-card p-6 sm:p-8 rounded-2xl border border-white/5 space-y-6 flex flex-col justify-between">
          <div>
            <h3 className="font-extrabold text-lg text-white font-display mb-1.5">Raccourcis de Gestion</h3>
            <p className="text-neutral-400 text-xs font-light">Accédez directement aux utilitaires de modération et d&apos;attribution de rôles.</p>
          </div>

          <div className="space-y-3">
            <Link
              href="/admin/users"
              className="flex items-center justify-between p-3.5 rounded-xl bg-neutral-900/40 border border-white/5 hover:border-green-500/20 hover:bg-neutral-900/60 transition-all text-xs font-semibold text-white group"
            >
              <span>Promouvoir des modérateurs ou comptes officiels</span>
              <HiArrowRight className="text-neutral-500 group-hover:text-green-500 transition-colors" />
            </Link>
            <Link
              href="/admin/petitions"
              className="flex items-center justify-between p-3.5 rounded-xl bg-neutral-900/40 border border-white/5 hover:border-green-500/20 hover:bg-neutral-900/60 transition-all text-xs font-semibold text-white group"
            >
              <span>Mettre en avant ou masquer des pétitions</span>
              <HiArrowRight className="text-neutral-500 group-hover:text-green-500 transition-colors" />
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
}
