import React from "react";
import Link from "next/link";
import {
  HiSparkles,
  HiGlobeAlt,
  HiTrophy,
  HiUserGroup,
  HiArrowRight,
  HiCheckBadge,
  HiShieldCheck,
  HiChatBubbleLeftRight,
} from "react-icons/hi2";
import ButtonClick from "./components/ButtonClick";

export default function WelcomePage() {
  return (
    <div className="min-h-screen bg-[#0b0b0f] text-white flex flex-col justify-between relative overflow-hidden font-sans">
      
      {/* Background Subtle Gradient Halo */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-green-500/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Pre-Login Top Navigation Bar */}
      <header className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between relative z-10 border-b border-white/5">
        <Link href="/" className="flex items-center space-x-2">
          <span className="font-extrabold text-2xl bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent tracking-widest font-display">
            APPTION
          </span>
        </Link>

        <div className="flex items-center space-x-4">
          <Link
            href="/login"
            className="text-xs font-bold text-neutral-300 hover:text-white px-4 py-2 rounded-xl transition-colors"
          >
            Se connecter
          </Link>
          <Link href="/register">
            <ButtonClick
              text="Rejoindre"
              classArrow="hidden"
              classButton="rounded-xl bg-green-500 hover:bg-green-400 text-neutral-950 px-5 py-2 text-xs font-extrabold shadow-md transition-all cursor-pointer"
            />
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-16 md:py-24 space-y-20 relative z-10">
        
        <div className="text-center max-w-4xl mx-auto space-y-8">
          
          {/* Top Pill Badge */}
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-neutral-900 border border-green-500/30 text-green-400 text-xs font-semibold shadow-sm">
            <HiSparkles className="text-sm" />
            <span>La plateforme citoyenne mondiale d&apos;impact</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-tight font-display">
            Transformez votre voix en{" "}
            <span className="bg-gradient-to-r from-green-400 via-emerald-400 to-teal-300 bg-clip-text text-transparent">
              impact réel.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-xl text-neutral-300 font-light max-w-2xl mx-auto leading-relaxed">
            Créez des pétitions percutantes, rassemblez des signatures citoyennes et mobilisez l&apos;Agent IA PetBot pour faire triompher vos causes.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/register">
              <ButtonClick
                text="Démarrer le changement"
                classArrow="text-xl"
                classButton="rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-neutral-950 px-8 py-4 text-sm font-extrabold shadow-lg shadow-green-500/20 transition-all cursor-pointer"
              />
            </Link>

            <Link
              href="/petitions"
              className="px-8 py-4 rounded-2xl bg-neutral-900 hover:bg-neutral-850 border border-white/10 text-xs font-bold text-neutral-200 hover:text-white transition-all flex items-center space-x-2"
            >
              <span>Explorer les pétitions</span>
              <HiGlobeAlt className="text-base text-cyan-400" />
            </Link>
          </div>

        </div>

        {/* Stats Counter Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {[
            { icon: HiUserGroup, value: "120,000+", label: "Signatures récoltées", color: "text-green-400" },
            { icon: HiTrophy, value: "850+", label: "Victoires citoyennes", color: "text-amber-400" },
            { icon: HiGlobeAlt, value: "150+", label: "Pays engagés", color: "text-cyan-400" },
          ].map((stat, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-neutral-900/80 border border-white/5 flex items-center space-x-4 shadow-lg"
            >
              <div className={`p-3 rounded-xl bg-neutral-950 border border-white/5 ${stat.color}`}>
                <stat.icon className="text-2xl" />
              </div>
              <div>
                <div className="text-2xl font-extrabold text-white font-display">{stat.value}</div>
                <div className="text-xs text-neutral-400 font-medium">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Core Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8">
          
          {/* Card 1: PetBot AI Agent */}
          <div className="p-8 rounded-3xl bg-neutral-900/60 border border-white/5 space-y-4 hover:border-green-500/30 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-green-500/10 border border-green-500/20 text-green-400 flex items-center justify-center">
              <HiSparkles className="text-2xl" />
            </div>
            <h3 className="text-lg font-bold text-white font-display">PetBot Agent IA Autonomous</h3>
            <p className="text-xs text-neutral-400 font-light leading-relaxed">
              PetBot analyse votre cause en temps réel, vous aide à rédiger un titre percutant et génère des plans de mobilisation virale.
            </p>
          </div>

          {/* Card 2: Interactive Impact Map */}
          <div className="p-8 rounded-3xl bg-neutral-900/60 border border-white/5 space-y-4 hover:border-cyan-500/30 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <HiGlobeAlt className="text-2xl" />
            </div>
            <h3 className="text-lg font-bold text-white font-display">Carte d&apos;Impact GIS</h3>
            <p className="text-xs text-neutral-400 font-light leading-relaxed">
              Visualisez la carte mondiale interactive des victoires et mobilisations citoyennes géolocalisées près de chez vous.
            </p>
          </div>

          {/* Card 3: Security & Moderation */}
          <div className="p-8 rounded-3xl bg-neutral-900/60 border border-white/5 space-y-4 hover:border-amber-500/30 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
              <HiShieldCheck className="text-2xl" />
            </div>
            <h3 className="text-lg font-bold text-white font-display">Modération & Vérité</h3>
            <p className="text-xs text-neutral-400 font-light leading-relaxed">
              Chaque pétition et commentaire est protégé contre les spams et discours haineux grâce à notre modérateur sémantique.
            </p>
          </div>

        </div>

        {/* 3-Step Action Workflow */}
        <div className="p-8 sm:p-12 rounded-3xl bg-neutral-900 border border-white/5 space-y-8">
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display">Comment ça marche ?</h2>
            <p className="text-xs text-neutral-400 font-light">Trois étapes simples pour transformer une idée en une victoire collective.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { step: "01", title: "Lancez votre cause", desc: "Créez votre pétition en 2 minutes avec un objectif clair et une photo inspirante." },
              { step: "02", title: "Mobilisez avec l'IA", desc: "Bénéficiez du soutien de PetBot IA pour relayer votre pétition sur les réseaux." },
              { step: "03", title: "Remportez la victoire", desc: "Suivez le cap des signatures et obtenez des réponses officielles des décideurs." },
            ].map((item, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-neutral-950 border border-white/5 space-y-3">
                <span className="text-xs font-mono font-bold text-green-400">Étape {item.step}</span>
                <h4 className="text-base font-bold text-white font-display">{item.title}</h4>
                <p className="text-xs text-neutral-400 font-light leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA Banner */}
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-neutral-900 via-neutral-900 to-green-950/40 border border-green-500/20 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-2xl font-extrabold text-white font-display">Prêt à faire entendre votre voix ?</h3>
            <p className="text-xs text-neutral-400 font-light max-w-md">Rejoignez des milliers de citoyens qui font bouger les lignes sur Apption.</p>
          </div>

          <Link href="/register">
            <ButtonClick
              text="Créer mon compte gratuitement"
              classArrow="text-lg"
              classButton="rounded-2xl bg-green-500 hover:bg-green-400 text-neutral-950 px-8 py-3.5 text-xs font-extrabold shadow-lg shadow-green-500/20 transition-all cursor-pointer whitespace-nowrap"
            />
          </Link>
        </div>

      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 gap-4 relative z-10">
        <div className="flex items-center space-x-2">
          <span className="font-extrabold text-white font-display">APPTION</span>
          <span>© 2026 Tous droits réservés.</span>
        </div>
        <div className="flex items-center space-x-6">
          <Link href="/petitions" className="hover:text-white transition-colors">Pétitions</Link>
          <Link href="/map" className="hover:text-white transition-colors">Carte d&apos;Impact</Link>
          <Link href="/login" className="hover:text-white transition-colors">Connexion</Link>
        </div>
      </footer>

    </div>
  );
}
