"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import {
  updateUserProfileUseCase,
  getPetitionsByUserIdUseCase,
  getPetitionsUseCase,
} from "../../../infrastructure/ServiceLocator";
import { Petition } from "../../../domain/entities/Petition";
import PetItem from "../../components/PetItem";
import ButtonClick from "../../components/ButtonClick";
import { Input } from "../../components/Input";
import { HiUser, HiLocationMarker, HiPencilAlt, HiCheck, HiBriefcase } from "react-icons/hi";

export default function ProfilePage() {
  const { user } = useAuth();
  
  // Profile fields state
  const [isEditing, setIsEditing] = useState(false);
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Lists state
  const [createdPetitions, setCreatedPetitions] = useState<Petition[]>([]);
  const [signedPetitions, setSignedPetitions] = useState<Petition[]>([]);
  const [activeTab, setActiveTab] = useState<"created" | "signed">("created");
  const [loadingLists, setLoadingLists] = useState(true);

  // Initialize fields
  useEffect(() => {
    if (user) {
      setFirstname(user.firstname || "");
      setLastname(user.lastname || "");
      setUsername(user.username || "");
      setBio(user.bio || "");
      setLocation(user.location || "");
    }
  }, [user]);

  // Load lists
  useEffect(() => {
    async function loadLists() {
      if (!user) return;
      setLoadingLists(true);
      try {
        // Created petitions
        const created = await getPetitionsByUserIdUseCase.execute(user.id);
        setCreatedPetitions(created);

        // Signed petitions (filter all petitions client-side to prevent complex index requirement)
        const all = await getPetitionsUseCase.execute();
        const signed = all.filter((p) => p.signatureUserIds.includes(user.id));
        setSignedPetitions(signed);
      } catch (err) {
        console.error("Failed to load profile lists:", err);
      } finally {
        setLoadingLists(false);
      }
    }
    loadLists();
  }, [user]);

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    setError(null);
    try {
      await updateUserProfileUseCase.execute(user.id, {
        firstname,
        lastname,
        username,
        bio,
        location,
      });
      setIsEditing(false);
      
      // Force page reload or state update to sync AuthContext user
      window.location.reload();
    } catch (err: any) {
      console.error(err);
      setError("Une erreur est survenue lors de l'enregistrement.");
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-128px)] text-white">
        <p className="text-neutral-450">Chargement du profil...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 flex flex-col space-y-10 relative overflow-hidden">
      
      {/* Decorative Glows */}
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-green-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Header Profile Section */}
      <div className="glass-card p-6 sm:p-10 rounded-3xl border border-white/5 relative z-10">
        {isEditing ? (
          <form onSubmit={handleProfileSave} className="space-y-6">
            <h2 className="text-xl sm:text-2xl font-extrabold text-white font-display">Modifier votre profil</h2>
            
            {error && (
              <div className="p-3.5 rounded-xl border border-red-500/20 bg-red-950/20 text-red-400 text-xs font-semibold">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1.5 text-xs font-semibold text-neutral-350 pl-1">Prénom</label>
                <Input
                  type="text"
                  value={firstname}
                  onChange={(e) => setFirstname(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block mb-1.5 text-xs font-semibold text-neutral-350 pl-1">Nom</label>
                <Input
                  type="text"
                  value={lastname}
                  onChange={(e) => setLastname(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block mb-1.5 text-xs font-semibold text-neutral-350 pl-1">Nom d&apos;utilisateur</label>
              <Input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block mb-1.5 text-xs font-semibold text-neutral-350 pl-1">Ville / Pays</label>
              <Input
                type="text"
                value={location}
                placeholder="Ex: Douala, Cameroun"
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            <div>
              <label className="block mb-1.5 text-xs font-semibold text-neutral-350 pl-1">Biographie</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                placeholder="Décrivez-vous brièvement..."
                className="block w-full px-4 py-3 rounded-2xl border border-white/5 bg-neutral-950/20 text-white placeholder-neutral-500 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/10 text-sm resize-none transition-all"
              />
            </div>

            <div className="flex space-x-3 pt-2 justify-end">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-5 py-2.5 rounded-full border border-white/5 text-xs font-bold text-neutral-350 hover:text-white transition-colors"
              >
                Annuler
              </button>
              <ButtonClick
                text={saving ? "Enregistrement..." : "Enregistrer"}
                classButton="rounded-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 px-6 py-2.5 text-neutral-950 text-xs font-extrabold shadow-md"
                classArrow="hidden"
                type="submit"
                disabled={saving}
              />
            </div>
          </form>
        ) : (
          <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-6 sm:space-y-0 sm:space-x-8 text-center sm:text-left">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full ring-4 ring-green-500/20 overflow-hidden relative shadow-lg">
              <img
                className="object-cover w-full h-full"
                src={user.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${user.username || user.email}`}
                alt="Profile Avatar"
              />
            </div>
            
            <div className="flex-1 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                <div>
                  <h1 className="text-3xl font-extrabold text-white font-display">
                    {user.firstname} {user.lastname}
                  </h1>
                  <p className="text-sm text-green-400 font-semibold font-mono mt-0.5">@{user.username}</p>
                </div>
                
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center space-x-2 text-xs font-bold border border-white/10 hover:border-white/20 bg-neutral-950/20 hover:bg-neutral-900/50 py-2.5 px-4 rounded-xl transition-all self-center sm:self-start text-neutral-300 hover:text-white"
                >
                  <HiPencilAlt className="text-sm" />
                  <span>Modifier le profil</span>
                </button>
              </div>

              {/* Biography */}
              {user.bio ? (
                <p className="text-neutral-350 text-sm font-light leading-relaxed max-w-2xl">{user.bio}</p>
              ) : (
                <p className="text-neutral-500 text-sm italic font-light">Aucune biographie rédigée.</p>
              )}

              {/* Info chips */}
              <div className="flex flex-wrap justify-center sm:justify-start gap-4 pt-1 text-xs text-neutral-400 font-semibold uppercase tracking-wider">
                <span className="flex items-center space-x-1.5">
                  <HiUser className="text-green-500 text-sm" />
                  <span>{user.email}</span>
                </span>
                {user.location && (
                  <span className="flex items-center space-x-1.5">
                    <HiLocationMarker className="text-green-500 text-sm" />
                    <span>{user.location}</span>
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Tabs Menu */}
      <div className="border-b border-white/5 relative z-10 flex space-x-8 text-sm font-semibold">
        <button
          onClick={() => setActiveTab("created")}
          className={`pb-4 border-b-2 transition-all duration-200 uppercase tracking-wider text-xs ${
            activeTab === "created"
              ? "border-green-500 text-green-400 font-extrabold"
              : "border-transparent text-neutral-500 hover:text-neutral-300"
          }`}
        >
          Mes Pétitions ({createdPetitions.length})
        </button>
        <button
          onClick={() => setActiveTab("signed")}
          className={`pb-4 border-b-2 transition-all duration-200 uppercase tracking-wider text-xs ${
            activeTab === "signed"
              ? "border-green-500 text-green-400 font-extrabold"
              : "border-transparent text-neutral-500 hover:text-neutral-300"
          }`}
        >
          Pétitions Soutenues ({signedPetitions.length})
        </button>
      </div>

      {/* Tab Panels */}
      <div className="relative z-10">
        {loadingLists ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-items-center">
            {[1, 2, 3].map((n) => (
              <div key={n} className="animate-pulse bg-neutral-900/60 border border-white/5 rounded-2xl h-[280px] w-full max-w-[320px]" />
            ))}
          </div>
        ) : activeTab === "created" ? (
          createdPetitions.length === 0 ? (
            <div className="text-center py-16 text-neutral-500">
              <p className="text-sm">Vous n&apos;avez créé aucune pétition pour le moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-items-center">
              {createdPetitions.map((pet) => (
                <PetItem
                  key={pet.id}
                  id={pet.id}
                  text={pet.title}
                  link={pet.imageUrl || "/assets/images/libération.jpg"}
                />
              ))}
            </div>
          )
        ) : signedPetitions.length === 0 ? (
          <div className="text-center py-16 text-neutral-500">
            <p className="text-sm">Vous n&apos;avez soutenu aucune pétition pour le moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-items-center">
            {signedPetitions.map((pet) => (
              <PetItem
                key={pet.id}
                id={pet.id}
                text={pet.title}
                link={pet.imageUrl || "/assets/images/libération.jpg"}
              />
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
