"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { HiArrowRight, HiArrowLeft, HiLocationMarker, HiCheck } from "react-icons/hi";
import { FaCity, FaGlobeAfrica, FaWarehouse } from "react-icons/fa";
import { useAuth } from "../../contexts/AuthContext";
import { createPetitionUseCase } from "../../../infrastructure/ServiceLocator";
import ButtonClick from "../../components/ButtonClick";
import { Input } from "../../components/Input";

const scales = [
  { id: "Ville", name: "Ville", icon: FaCity, desc: "Portée locale (quartier, commune, ville)" },
  { id: "National", name: "National", icon: FaWarehouse, desc: "Portée nationale (pays entier)" },
  { id: "International", name: "International", icon: FaGlobeAfrica, desc: "Portée mondiale (plusieurs pays)" },
];

const categories = [
  "Politique",
  "Education",
  "Sport",
  "Art",
  "Santé",
  "Droits de l&apos;homme",
  "Environnement",
  "Autres...",
];

export default function LaunchPetitionPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [step, setStep] = useState(0);
  const [scale, setScale] = useState("National");
  const [category, setCategory] = useState("Environnement");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setError("Le titre et la description sont obligatoires.");
      return;
    }

    if (!user) {
      setError("Vous devez être connecté pour lancer une pétition.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const newPetition = await createPetitionUseCase.execute(
        title,
        description,
        scale,
        category,
        user.id,
        user.username || `${user.firstname} ${user.lastname}`,
        imageFile
      );
      router.push(`/petitions/${newPetition.id}`);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Une erreur est survenue lors de la création de la pétition.");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 flex-grow flex flex-col justify-center min-h-[calc(100vh-128px)] relative overflow-hidden">
      
      {/* Background radial decorations */}
      <div className="absolute top-1/3 left-1/4 w-[350px] h-[350px] bg-green-500/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Wizard Progress Indicator */}
      <div className="mb-10 w-full relative z-10">
        <div className="flex items-center justify-between max-w-md mx-auto relative">
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-neutral-800 -translate-y-1/2 z-0" />
          <div
            className="absolute top-1/2 left-0 h-0.5 bg-green-500 -translate-y-1/2 z-0 transition-all duration-300"
            style={{ width: `${step * 50}%` }}
          />
          {[0, 1, 2].map((s) => (
            <button
              key={s}
              onClick={() => s < step && setStep(s)}
              disabled={s >= step || loading}
              className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border transition-all duration-300 ${
                s < step
                  ? "bg-green-500 border-green-500 text-neutral-950 hover:scale-105"
                  : s === step
                  ? "bg-[#0b0b0f] border-green-500 text-green-400 ring-4 ring-green-500/20 scale-105"
                  : "bg-[#0b0b0f] border-neutral-800 text-neutral-500"
              }`}
            >
              {s < step ? <HiCheck className="text-lg" /> : s + 1}
            </button>
          ))}
        </div>
        <div className="flex justify-between max-w-lg mx-auto text-[10px] sm:text-xs text-neutral-450 mt-3 px-2 font-semibold uppercase tracking-wider">
          <span className={step >= 0 ? "text-green-450" : ""}>Échelle</span>
          <span className={step >= 1 ? "text-green-450" : ""}>Thématique</span>
          <span className={step >= 2 ? "text-green-450" : ""}>Détails</span>
        </div>
      </div>

      {/* Wizard Card */}
      <div className="glass-card p-6 sm:p-12 rounded-3xl shadow-2xl relative z-10 border border-white/5 min-h-[440px] flex flex-col justify-between">
        {error && (
          <div className="mb-6 p-4 rounded-xl border border-red-500/30 bg-red-950/20 text-red-400 text-xs sm:text-sm">
            {error}
          </div>
        )}

        {/* Step 1: Scale Selection */}
        {step === 0 && (
          <div className="space-y-6 flex-grow animate-fadeIn">
            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
                Faites votre premier pas vers le changement
              </h2>
              <p className="text-neutral-400 font-light text-sm sm:text-base">
                Sélectionnez la portée géographique de votre cause pour cibler la bonne audience.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-4">
              {scales.map((s) => {
                const IconComponent = s.icon;
                const isSelected = scale === s.id;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setScale(s.id)}
                    className={`flex flex-col items-center sm:items-start text-center sm:text-left p-6 rounded-2xl border transition-all duration-300 hover:scale-[1.03] cursor-pointer ${
                      isSelected
                        ? "border-green-500 bg-green-500/10 text-white shadow-xl shadow-green-500/5"
                        : "border-white/5 bg-neutral-950/30 text-neutral-350 hover:border-white/10"
                    }`}
                  >
                    <IconComponent className={`text-3xl mb-4 ${isSelected ? "text-green-400" : "text-neutral-500"}`} />
                    <h3 className="font-extrabold text-lg text-white font-display">{s.name}</h3>
                    <p className="text-xs text-neutral-450 mt-1.5 font-light leading-relaxed">{s.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 2: Category Selection */}
        {step === 1 && (
          <div className="space-y-6 flex-grow animate-fadeIn">
            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
                Quelle est la thématique principale ?
              </h2>
              <p className="text-neutral-400 font-light text-sm sm:text-base">
                Classer votre pétition aide les signataires à la découvrir.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
              {categories.map((cat) => {
                const isSelected = category === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`py-3.5 px-4 rounded-2xl border text-sm font-semibold text-center transition-all ${
                      isSelected
                        ? "border-green-500 bg-green-500 text-neutral-950 shadow-lg scale-105 font-bold"
                        : "border-white/5 bg-neutral-950/30 text-neutral-300 hover:border-white/10 hover:bg-neutral-900/40"
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 3: Title, Description, and Image */}
        {step === 2 && (
          <form className="space-y-6 flex-grow animate-fadeIn" onSubmit={handleFormSubmit}>
            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
                Rédigez et publiez votre pétition
              </h2>
              <p className="text-neutral-400 font-light text-xs sm:text-sm">
                Choisissez un titre percutant et décrivez clairement le changement que vous souhaitez obtenir.
              </p>
            </div>

            <div className="space-y-5 pt-2">
              {/* Title input */}
              <div className="relative rounded-2xl border border-white/5 px-4 py-2.5 bg-neutral-950/20 focus-within:border-green-500 focus-within:ring-2 focus-within:ring-green-500/10 transition-all">
                <label
                  htmlFor="title"
                  className="absolute -top-2 left-3 -mt-px inline-block bg-[#16161c] px-1.5 text-[10px] font-semibold text-green-455 text-green-400 uppercase tracking-wider"
                >
                  Titre de la pétition
                </label>
                <input
                  type="text"
                  name="title"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="block w-full border-0 p-0 text-white placeholder-neutral-500 bg-transparent focus:ring-0 sm:text-sm outline-none font-medium"
                  placeholder="Ex: Rendons sa liberté à Onomo"
                  required
                  disabled={loading}
                />
              </div>

              {/* Description textarea */}
              <div className="space-y-1.5">
                <label htmlFor="description" className="block text-xs font-semibold text-neutral-350 pl-1">
                  Description de la pétition
                </label>
                <textarea
                  rows={5}
                  name="description"
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="block w-full px-4 py-3.5 rounded-2xl border border-white/5 bg-neutral-950/20 text-white placeholder-neutral-500 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/10 sm:text-sm resize-none transition-all"
                  placeholder="Expliquez le problème qui vous tient à cœur, pourquoi il est important et l'impact qu'il aura sur votre communauté..."
                  required
                  disabled={loading}
                />
              </div>

              {/* File upload */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-neutral-350 pl-1">
                  Photo d&apos;illustration (Optionnelle)
                </label>
                <div className="mt-1 flex justify-center rounded-2xl border border-dashed border-white/10 px-6 pt-6 pb-6 bg-neutral-950/10 hover:border-white/20 transition-colors">
                  <div className="space-y-2 text-center flex flex-col items-center">
                    <svg
                      className="mx-auto h-10 w-10 text-neutral-500"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                      aria-hidden="true"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    
                    <div className="flex text-sm text-neutral-400">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer rounded-md font-semibold text-green-450 hover:text-green-400 focus-within:outline-none focus-within:ring-2 focus-within:ring-green-500 transition-colors"
                      >
                        <span>Charger une photo</span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          accept="image/*"
                          className="sr-only"
                          onChange={handleImageChange}
                          disabled={loading}
                        />
                      </label>
                      <p className="pl-1">ou glissez-déposez ici</p>
                    </div>
                    <p className="text-xs text-neutral-500">PNG, JPG, GIF jusqu&apos;à 10 Mo</p>
                    
                    {imagePreview && (
                      <div className="mt-4 relative rounded-xl overflow-hidden max-w-xs border border-white/5">
                        <img src={imagePreview} className="max-h-40 w-auto object-cover" alt="Prévisualisation" />
                        <button
                          type="button"
                          onClick={() => {
                            setImageFile(null);
                            setImagePreview(null);
                          }}
                          className="absolute top-1.5 right-1.5 bg-neutral-950/80 hover:bg-neutral-900 text-white rounded-full p-1 border border-white/5 text-xs transition-colors"
                        >
                          Retirer
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </form>
        )}

        {/* Wizard Controls */}
        <div className="flex justify-between items-center pt-6 border-t border-white/5 mt-8">
          <div className="flex items-center">
            {step > 0 && (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                disabled={loading}
                className="flex items-center space-x-2 text-neutral-450 hover:text-white font-semibold transition-all border border-white/5 hover:bg-neutral-900 px-5 py-2.5 rounded-full text-xs"
              >
                <HiArrowLeft />
                <span>Retour</span>
              </button>
            )}
          </div>

          <div>
            {step < 2 ? (
              <ButtonClick
                text="Continuer"
                classButton="rounded-full bg-green-500 hover:bg-green-600 px-6 py-2.5 text-neutral-950 text-xs font-extrabold flex items-center space-x-1 shadow-md hover:shadow-green-500/10"
                classArrow="hidden"
                onClick={() => setStep(step + 1)}
              />
            ) : (
              <ButtonClick
                text={loading ? "Publication..." : "Publier la pétition"}
                classButton="rounded-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-neutral-950 px-8 py-3 text-xs font-extrabold shadow-lg shadow-green-950/20"
                type="submit"
                onClick={handleFormSubmit}
                disabled={loading || !title.trim() || !description.trim()}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
