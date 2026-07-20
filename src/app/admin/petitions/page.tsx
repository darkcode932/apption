"use client";

import React, { useEffect, useState } from "react";

import { HiMagnifyingGlass, HiTrash, HiStar } from "react-icons/hi2";
import {
  getPetitionsUseCase,
  deletePetitionUseCase,
  updatePetitionFeaturedUseCase,
} from "../../../infrastructure/ServiceLocator";
import { Petition } from "../../../domain/entities/Petition";
import { useLanguage, useT } from "../../../i18n/LanguageContext";

export default function AdminPetitionsPage() {
  const { locale } = useLanguage();
  const t = useT();
  const [petitions, setPetitions] = useState<Petition[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  async function loadPetitions() {
    try {
      const data = await getPetitionsUseCase.execute();
      setPetitions(data);
    } catch (e) {
      console.error("Failed to load petitions:", e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPetitions();
  }, []);

  const handleDelete = async (petition: Petition) => {
    const confirmMsg = locale === "fr" 
      ? `Êtes-vous sûr de vouloir SUPPRIMER DÉFINITIVEMENT la pétition "${petition.title}" ? Cette action est irréversible.`
      : `Are you sure you want to PERMANENTLY DELETE the petition "${petition.title}"? This action is irreversible.`;
    if (!confirm(confirmMsg)) return;

    setLoading(true);
    try {
      await deletePetitionUseCase.execute(petition.id);
      await loadPetitions();
    } catch (err) {
      console.error(err);
      alert(locale === "fr" ? "Erreur lors de la suppression de la pétition." : "Error while deleting petition.");
      setLoading(false);
    }
  };

  const handleToggleFeatured = async (petition: Petition) => {
    const newFeatured = !petition.isFeatured;
    
    // Optimistic state update for fluid UI response
    setPetitions((prev) =>
      prev.map((p) => (p.id === petition.id ? { ...p, isFeatured: newFeatured } : p))
    );

    try {
      await updatePetitionFeaturedUseCase.execute(petition.id, newFeatured);
    } catch (err) {
      console.error(err);
      alert(locale === "fr" ? "Erreur lors de la mise à jour de la mise en avant." : "Error updating featured status.");
      // Rollback on failure
      setPetitions((prev) =>
        prev.map((p) => (p.id === petition.id ? { ...p, isFeatured: !newFeatured } : p))
      );
    }
  };

  const filteredPetitions = petitions.filter((p) => {
    const title = p.title.toLowerCase();
    const desc = p.description.toLowerCase();
    const search = searchTerm.toLowerCase();
    return title.includes(search) || desc.includes(search);
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-white">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-green-500"></div>
        <p className="mt-4 text-xs text-neutral-455 italic">
          {locale === "fr" ? "Chargement des pétitions..." : "Loading petitions..."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-fadeIn">
      
      {/* Header */}
      <div className="border-b border-white/5 pb-6">
        <h1 className="text-3xl font-extrabold text-white font-display tracking-tight">
          {t("admin.moderation_title")}
        </h1>
        <p className="text-xs sm:text-sm text-neutral-455 mt-1.5 font-light">
          {t("admin.moderation_subtitle")}
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md relative z-10">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
          <HiMagnifyingGlass className="h-5 w-5 text-neutral-500" />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={locale === "fr" ? "Rechercher par titre ou mots clés..." : "Search by title or keywords..."}
          className="block w-full rounded-2xl border border-white/5 bg-neutral-950/40 py-3.5 pl-11 pr-4 text-sm text-white placeholder-neutral-500 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/10 transition-all"
        />
      </div>

      {/* Petitions Table Grid */}
      <div className="glass-card rounded-3xl border border-white/5 overflow-hidden shadow-2xl relative z-10">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-white/5 text-left text-sm">
            <thead className="bg-neutral-950/50 text-neutral-400 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-4 px-6">{locale === "fr" ? "Pétition" : "Petition"}</th>
                <th className="py-4 px-6">{locale === "fr" ? "Créateur" : "Creator"}</th>
                <th className="py-4 px-6">Signatures</th>
                <th className="py-4 px-6">{locale === "fr" ? "Échelle / Catégorie" : "Scale / Category"}</th>
                <th className="py-4 px-6 text-right">{t("admin.actions")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-medium text-neutral-250">
              {filteredPetitions.map((p) => (
                <tr key={p.id} className="hover:bg-white/[0.01] transition-colors">
                  
                  {/* Title & Preview Image */}
                  <td className="py-4 px-6 flex items-center space-x-3.5 min-w-[280px]">
                    <div className="h-10 w-16 rounded-lg overflow-hidden border border-white/5 flex-shrink-0">
                      <img src={p.imageUrl || "/assets/images/libération.jpg"} className="h-full w-full object-cover" alt="" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-white truncate max-w-[240px] leading-tight">
                        {p.title}
                      </p>
                      <p className="text-[10px] text-neutral-500 mt-1">
                        {locale === "fr" ? "Créée le" : "Created on"} {p.createdAt.toLocaleDateString(locale === "fr" ? "fr-FR" : "en-US")}
                      </p>
                    </div>
                  </td>

                  {/* Creator */}
                  <td className="py-4 px-6 text-neutral-300 font-light whitespace-nowrap">
                    {p.creatorName}
                  </td>

                  {/* Signatures */}
                  <td className="py-4 px-6 font-semibold whitespace-nowrap text-green-455">
                    {p.signaturesCount} {locale === "fr" ? "soutiens" : "supports"}
                  </td>

                  {/* Scale & Category */}
                  <td className="py-4 px-6 whitespace-nowrap">
                    <span className="text-xs text-neutral-400">
                      {p.category}
                    </span>
                    <span className="text-[10px] text-neutral-500 block font-light mt-0.5">
                      {p.scale}
                    </span>
                  </td>

                  {/* Actions buttons */}
                  <td className="py-4 px-6 text-right space-x-2.5 whitespace-nowrap">
                    {/* Feature Campaign "À la une" Toggle */}
                    <button
                      onClick={() => handleToggleFeatured(p)}
                      className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer border transition-all ${
                        p.isFeatured
                          ? "bg-yellow-500/10 border-yellow-500/30 text-yellow-400 font-bold"
                          : "border-white/5 text-neutral-455 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      <HiStar className="text-sm" />
                      <span>{p.isFeatured ? (locale === "fr" ? "À la une" : "Featured") : (locale === "fr" ? "Mettre à la une" : "Feature")}</span>
                    </button>

                    {/* Delete Petition Button */}
                    <button
                      onClick={() => handleDelete(p)}
                      className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold border border-white/5 hover:border-red-500/20 hover:text-red-450 transition-all cursor-pointer text-red-500/70"
                    >
                      <HiTrash className="text-sm" />
                      <span>{t("admin.delete")}</span>
                    </button>
                  </td>

                </tr>
              ))}

              {filteredPetitions.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-neutral-500 italic">
                    {locale === "fr" ? "Aucune pétition trouvée." : "No petitions found."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

