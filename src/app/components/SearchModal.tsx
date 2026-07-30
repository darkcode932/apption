"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  HiMagnifyingGlass,
  HiXMark,
  HiTrophy,
  HiFire,
  HiTag,
  HiDocumentText,
  HiArrowRight,
} from "react-icons/hi2";
import { SearchEngine, SearchResults } from "../../infrastructure/search/SearchEngine";
import { useT, useLanguage } from "../../i18n/LanguageContext";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const t = useT();
  const { locale } = useLanguage();
  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<SearchResults>({ petitions: [], comments: [], categories: [] });
  const [searching, setSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when modal opens & reset query
  useEffect(() => {
    if (isOpen) {
      setSearchTerm("");
      setResults({ petitions: [], comments: [], categories: [] });
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  // Global Keyboard Event Listener (Escape to close, Ctrl+K / Cmd+K to toggle)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Perform search on query change
  useEffect(() => {
    if (!searchTerm.trim()) {
      setResults({ petitions: [], comments: [], categories: [] });
      setSearching(false);
      return;
    }

    setSearching(true);
    const timer = setTimeout(async () => {
      try {
        const searchResults = await SearchEngine.search(searchTerm);
        setResults(searchResults);
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setSearching(false);
      }
    }, 150);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleSelectPetition = (id: string) => {
    onClose();
    router.push(`/petitions/${id}`);
  };

  const handleSelectCategory = (cat: string) => {
    onClose();
    router.push(`/petitions?category=${encodeURIComponent(cat)}`);
  };

  if (!isOpen) return null;

  const hasResults = results.petitions.length > 0 || results.categories.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-neutral-950/80 backdrop-blur-md animate-fadeIn">
      
      {/* Click Outside Backdrop */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Spotlight Card Window */}
      <div className="relative w-full max-w-2xl glass-card rounded-3xl border border-white/10 shadow-2xl overflow-hidden z-10 transition-all duration-300 transform scale-100">
        
        {/* Search Header Bar */}
        <div className="p-4 sm:p-5 border-b border-white/5 flex items-center space-x-3 bg-neutral-950/60">
          <HiMagnifyingGlass className="text-xl text-green-400 flex-shrink-0" />
          
          <input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={
              locale === "fr"
                ? "Rechercher une pétition, une thématique, un lieu..."
                : "Search a petition, cause, location..."
            }
            className="w-full bg-transparent border-none text-white text-sm md:text-base font-light placeholder-neutral-500 focus:outline-none"
          />

          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="text-neutral-500 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-all"
            >
              <HiXMark className="text-lg" />
            </button>
          )}

          <div className="hidden sm:flex items-center space-x-1 px-2 py-1 rounded-md bg-neutral-900 border border-white/10 text-[10px] font-mono text-neutral-400">
            <span>ESC</span>
          </div>
        </div>

        {/* Search Results Body */}
        <div className="max-h-[60vh] overflow-y-auto p-4 sm:p-6 space-y-6 scrollbar-hidden bg-neutral-950/30">
          
          {/* Searching Loader */}
          {searching && (
            <div className="py-8 text-center text-xs text-neutral-400 animate-pulse space-y-2">
              <span className="inline-block animate-spin text-lg">🔍</span>
              <p>{locale === "fr" ? "Recherche en cours..." : "Searching..."}</p>
            </div>
          )}

          {/* Initial State / Suggestions when empty */}
          {!searchTerm.trim() && !searching && (
            <div className="py-6 text-center text-neutral-500 space-y-4">
              <p className="text-xs font-light">
                {locale === "fr"
                  ? "Tapez un mot-clé pour explorer les causes, pétitions et catégories."
                  : "Type a keyword to explore causes, petitions, and categories."}
              </p>

              {/* Quick Tags Suggestions */}
              <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                {["Environnement", "Droits de l'homme", "Santé", "Politique"].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSearchTerm(cat)}
                    className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-green-500/10 border border-white/5 hover:border-green-500/30 text-xs font-medium text-neutral-300 hover:text-green-400 transition-all cursor-pointer"
                  >
                    🏷️ {cat}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* No Results Found */}
          {searchTerm.trim() && !searching && !hasResults && (
            <div className="py-12 text-center text-neutral-400 space-y-2">
              <p className="text-sm font-semibold">
                {locale === "fr" ? "Aucun résultat trouvé" : "No results found"}
              </p>
              <p className="text-xs text-neutral-500">
                {locale === "fr"
                  ? `Aucune pétition ou catégorie ne correspond à "${searchTerm}".`
                  : `No petitions or categories matched "${searchTerm}".`}
              </p>
            </div>
          )}

          {/* Petitions Results Section */}
          {!searching && results.petitions.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-xs font-bold text-neutral-400 uppercase tracking-wider">
                <HiDocumentText className="text-green-400 text-sm" />
                <span>{locale === "fr" ? "Pétitions" : "Petitions"} ({results.petitions.length})</span>
              </div>

              <div className="grid grid-cols-1 gap-2.5">
                {results.petitions.map((pet) => {
                  const isVictory = pet.status === "victory";
                  return (
                    <div
                      key={pet.id}
                      onClick={() => handleSelectPetition(pet.id)}
                      className="p-3.5 rounded-2xl bg-neutral-900/60 hover:bg-neutral-900 border border-white/5 hover:border-green-500/30 transition-all cursor-pointer flex items-center justify-between group"
                    >
                      <div className="space-y-1 pr-4 min-w-0">
                        <div className="flex items-center space-x-2">
                          <span
                            className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider ${
                              isVictory
                                ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                                : "bg-green-500/20 text-green-400 border border-green-500/30"
                            }`}
                          >
                            {isVictory ? "🏆 Victoire" : "🔥 En cours"}
                          </span>
                          <span className="text-[10px] text-neutral-400 font-medium">
                            🏷️ {pet.category}
                          </span>
                          {pet.city && (
                            <span className="text-[10px] text-neutral-500 font-mono">
                              📍 {pet.city}
                            </span>
                          )}
                        </div>

                        <h4 className="text-xs sm:text-sm font-bold text-white font-display group-hover:text-green-400 transition-colors truncate">
                          {pet.title}
                        </h4>
                      </div>

                      <div className="flex items-center space-x-3 flex-shrink-0">
                        <span className="text-xs text-neutral-400 font-semibold hidden sm:inline">
                          ✍️ {pet.signaturesCount}
                        </span>
                        <HiArrowRight className="text-neutral-500 group-hover:text-green-400 group-hover:translate-x-1 transition-all" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Categories Results Section */}
          {!searching && results.categories.length > 0 && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center space-x-2 text-xs font-bold text-neutral-400 uppercase tracking-wider">
                <HiTag className="text-cyan-400 text-sm" />
                <span>{locale === "fr" ? "Thématiques & Tags" : "Categories & Tags"}</span>
              </div>

              <div className="flex flex-wrap gap-2">
                {results.categories.map((cat) => (
                  <button
                    key={cat.name}
                    onClick={() => handleSelectCategory(cat.name)}
                    className="px-3.5 py-2 rounded-xl bg-neutral-900 hover:bg-cyan-500/10 border border-white/5 hover:border-cyan-500/30 text-xs font-bold text-neutral-200 hover:text-cyan-400 transition-all cursor-pointer flex items-center space-x-2"
                  >
                    <span>🏷️ {cat.name}</span>
                    <span className="px-1.5 py-0.5 rounded-md bg-white/5 text-[10px] font-mono text-neutral-400">
                      {cat.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer Hint */}
        <div className="p-3 border-t border-white/5 bg-neutral-950/80 px-6 flex items-center justify-between text-[11px] text-neutral-500">
          <span>Apption Omni-Search Engine</span>
          <span className="font-mono text-[10px] text-neutral-400">Ctrl + K / Cmd + K</span>
        </div>

      </div>

    </div>
  );
}
