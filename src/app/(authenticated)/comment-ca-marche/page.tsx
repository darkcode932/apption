"use client";

import React, { useRef } from "react";
import Link from "next/link";
import {
  HiSparkles,
  HiMapPin,
  HiUserGroup,
  HiTrophy,
  HiShieldCheck,
  HiCpuChip,
  HiArrowRight,
  HiCheckCircle,
  HiBolt,
  HiGlobeAlt,
  HiHeart,
  HiChatBubbleLeftRight,
} from "react-icons/hi2";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

// ─── Timeline Steps ────────────────────────────────────────────────────────────
const steps = [
  {
    number: "01",
    icon: HiUserGroup,
    title: "Créez votre compte en 2 minutes",
    description:
      "Inscrivez-vous avec votre email ou via Google. Renseignez votre ville et votre pays pour accéder au flux géolocalisé des pétitions près de chez vous.",
    color: "text-green-400",
    bg: "bg-green-500/10 border-green-500/20",
    glow: "shadow-green-500/10",
  },
  {
    number: "02",
    icon: HiSparkles,
    title: "Lancez votre pétition avec l'IA",
    description:
      "Décrivez votre cause en quelques mots. Notre IA Copilot génère un titre percutant, un texte argumenté et une image adaptée à votre combat citoyen.",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10 border-emerald-500/20",
    glow: "shadow-emerald-500/10",
  },
  {
    number: "03",
    icon: HiGlobeAlt,
    title: "Mobilisez votre réseau",
    description:
      "Partagez votre pétition via WhatsApp, Instagram, Twitter/X et email. Le Viral Studio Pro génère des visuels optimisés pour chaque réseau en un clic.",
    color: "text-cyan-400",
    bg: "bg-cyan-500/10 border-cyan-500/20",
    glow: "shadow-cyan-500/10",
  },
  {
    number: "04",
    icon: HiTrophy,
    title: "Atteignez vos objectifs & gagnez",
    description:
      "Quand les signatures atteignent un seuil critique, soumettez le dossier officiel au décideur cible. Célébrez votre victoire sur la Carte d'Impact mondiale.",
    color: "text-amber-400",
    bg: "bg-amber-500/10 border-amber-500/20",
    glow: "shadow-amber-500/10",
  },
];

// ─── Features ─────────────────────────────────────────────────────────────────
const features = [
  {
    icon: HiCpuChip,
    title: "IA Copilot",
    description: "Rédigez votre pétition en 30 secondes. Notre IA analyse votre cause et génère un texte professionnel et persuasif.",
    color: "text-green-400",
    bg: "bg-green-500/10",
  },
  {
    icon: HiMapPin,
    title: "Carte d'Impact",
    description: "Visualisez toutes les pétitions géolocalisées dans votre ville, pays ou dans le monde entier sur une carte interactive.",
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
  },
  {
    icon: HiBolt,
    title: "Viral Studio Pro",
    description: "Générez des visuels de partage optimisés pour tous les réseaux sociaux en un seul clic.",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
  },
  {
    icon: HiShieldCheck,
    title: "Modération IA",
    description: "Chaque contenu est analysé en temps réel par notre IA sémantique pour garantir un espace respectueux et sûr.",
    color: "text-purple-400",
    bg: "bg-purple-500/10",
  },
  {
    icon: HiChatBubbleLeftRight,
    title: "PetBot IA",
    description: "Votre agent IA disponible 24h/24 pour vous aider à créer, rédiger et promouvoir vos pétitions.",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
  },
  {
    icon: HiGlobeAlt,
    title: "Portée Mondiale",
    description: "Pétitions à l'échelle locale, nationale ou internationale. Rejoignez une communauté dans 150+ pays.",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
  },
];

// ─── Values ───────────────────────────────────────────────────────────────────
const values = [
  {
    emoji: "🌱",
    title: "Impact Réel",
    text: "Nous croyons que chaque signature compte. Notre technologie transforme l'engagement citoyen en changements concrets et mesurables.",
  },
  {
    emoji: "🔒",
    title: "Confiance & Sécurité",
    text: "Toutes vos données sont protégées par un chiffrement de niveau bancaire. Nous ne vendons jamais vos informations à des tiers.",
  },
  {
    emoji: "🤖",
    title: "IA au Service du Citoyen",
    text: "Notre intelligence artificielle est conçue pour amplifier votre voix, pas pour la remplacer. Vous restez maître de votre combat.",
  },
  {
    emoji: "🌍",
    title: "Accessibilité Universelle",
    text: "Apption est disponible en plusieurs langues et accessible partout dans le monde, car les droits ne connaissent pas de frontières.",
  },
];

// ─── Stats ────────────────────────────────────────────────────────────────────
const impactStats = [
  { value: "120 000+", label: "Signatures récoltées", sub: "et ça augmente chaque jour", color: "text-white" },
  { value: "850+", label: "Victoires citoyennes", sub: "décisions réellement changées", color: "text-amber-400" },
  { value: "150+", label: "Pays représentés", sub: "une communauté mondiale", color: "text-cyan-400" },
  { value: "< 5 min", label: "Pour créer une pétition", sub: "avec l'IA Copilot", color: "text-green-400" },
];

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function CommentCaMarchePage() {
  const stepsRef = useRef<HTMLDivElement>(null);

  return (
    <div className="min-h-screen bg-[#0b0b0f] flex flex-col">
      <Navbar />

      <main className="flex-1 space-y-24 overflow-hidden">

        {/* ══ HERO ══════════════════════════════════════════════════════════════ */}
        <section className="relative pt-16 pb-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center space-y-6">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-64 bg-green-500/5 rounded-full blur-[120px] pointer-events-none" />

          <span className="relative inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-[11px] font-black uppercase tracking-widest">
            <HiHeart className="text-sm" /> À propos d&apos;Apption
          </span>

          <h1 className="relative text-4xl sm:text-6xl font-extrabold text-white font-display tracking-tight leading-tight">
            La plateforme qui donne{" "}
            <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
              le pouvoir aux citoyens
            </span>
          </h1>

          <p className="relative text-neutral-300 text-lg max-w-2xl mx-auto leading-relaxed">
            Apption est née d&apos;une conviction simple : <strong className="text-white">chaque voix compte</strong>. 
            Nous avons construit une plateforme de pétitions intelligente, accessible et puissante pour que 
            n&apos;importe qui — où qu&apos;il soit dans le monde — puisse défendre une cause et faire bouger les lignes.
          </p>

          <div className="relative flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Link
              href="/launch-petition"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-gradient-to-r from-green-500 to-emerald-600 text-neutral-950 font-black text-sm rounded-2xl shadow-lg shadow-green-500/20 hover:shadow-green-500/30 transition-all uppercase tracking-wide"
            >
              <HiSparkles /> Lancer ma pétition
            </Link>
            <button
              onClick={() => stepsRef.current?.scrollIntoView({ behavior: "smooth" })}
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-neutral-900 border border-white/10 text-white font-semibold text-sm rounded-2xl hover:border-white/20 transition-all cursor-pointer"
            >
              Comment ça marche <HiArrowRight />
            </button>
          </div>
        </section>

        {/* ══ IMPACT STATS ══════════════════════════════════════════════════════ */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {impactStats.map((stat) => (
              <div
                key={stat.label}
                className="bg-neutral-900/60 border border-white/5 rounded-2xl p-6 text-center space-y-1 hover:border-white/10 transition-colors"
              >
                <div className={`text-3xl font-black font-display ${stat.color}`}>{stat.value}</div>
                <div className="text-white font-semibold text-sm">{stat.label}</div>
                <div className="text-neutral-500 text-[11px]">{stat.sub}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ══ HOW IT WORKS — TIMELINE ═══════════════════════════════════════════ */}
        <section ref={stepsRef} className="px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-[11px] font-black uppercase tracking-widest">
              🗺️ Guide d&apos;utilisation
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-display">
              De l&apos;idée à la{" "}
              <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">victoire</span>
              {" "}en 4 étapes
            </h2>
          </div>

          <div className="relative space-y-6">
            {/* Connecting line */}
            <div className="absolute left-8 top-12 bottom-12 w-px bg-gradient-to-b from-green-500/40 via-white/5 to-transparent hidden sm:block" />

            {steps.map((step) => (
              <div
                key={step.number}
                className={`relative flex gap-6 bg-neutral-900/50 border ${step.bg} rounded-3xl p-6 sm:p-8 shadow-xl ${step.glow} hover:scale-[1.01] transition-transform duration-300`}
              >
                {/* Step number circle */}
                <div className={`flex-shrink-0 w-14 h-14 rounded-2xl ${step.bg} border flex flex-col items-center justify-center`}>
                  <span className={`text-xs font-black ${step.color} uppercase tracking-wider`}>{step.number}</span>
                  <step.icon className={`text-xl ${step.color}`} />
                </div>

                <div className="space-y-1.5">
                  <h3 className="font-extrabold text-white text-lg font-display">{step.title}</h3>
                  <p className="text-neutral-400 text-sm leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ══ FEATURES GRID ═════════════════════════════════════════════════════ */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-10">
          <div className="text-center space-y-3">
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-[11px] font-black uppercase tracking-widest">
              <HiBolt /> Fonctionnalités exclusives
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-display">
              Des outils conçus pour{" "}
              <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">amplifier votre voix</span>
            </h2>
            <p className="text-neutral-400 max-w-xl mx-auto text-sm leading-relaxed">
              Apption n&apos;est pas qu&apos;une plateforme de pétitions. C&apos;est un écosystème d&apos;outils citoyens propulsé par l&apos;IA.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((feat) => (
              <div
                key={feat.title}
                className="group bg-neutral-900/50 border border-white/5 hover:border-white/10 rounded-2xl p-6 space-y-3 transition-all duration-200 hover:bg-neutral-900/80"
              >
                <div className={`w-11 h-11 rounded-xl ${feat.bg} flex items-center justify-center`}>
                  <feat.icon className={`text-xl ${feat.color}`} />
                </div>
                <h3 className="font-extrabold text-white text-base">{feat.title}</h3>
                <p className="text-neutral-400 text-sm leading-relaxed">{feat.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ══ VALUES / MISSION ══════════════════════════════════════════════════ */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-10">
          <div className="text-center space-y-3">
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-[11px] font-black uppercase tracking-widest">
              <HiHeart /> Nos valeurs
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-display">
              Ce en quoi nous{" "}
              <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">croyons</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {values.map((val) => (
              <div
                key={val.title}
                className="bg-neutral-900/40 border border-white/5 hover:border-white/10 rounded-2xl p-6 space-y-3 transition-colors"
              >
                <div className="text-3xl">{val.emoji}</div>
                <h3 className="font-extrabold text-white text-base">{val.title}</h3>
                <p className="text-neutral-400 text-sm leading-relaxed">{val.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ══ WHY APPTION — DIFFERENTIATORS ════════════════════════════════════ */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <div className="relative bg-gradient-to-br from-neutral-900 to-neutral-950 border border-white/10 rounded-3xl p-8 sm:p-12 space-y-8 overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/5 rounded-full blur-[80px] pointer-events-none" />

            <div className="text-center space-y-3">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
                Pourquoi choisir Apption ?
              </h2>
              <p className="text-neutral-400 text-sm max-w-lg mx-auto">
                Il existe des dizaines de plateformes de pétitions. Voici ce qui nous différencie.
              </p>
            </div>

            <div className="space-y-4">
              {[
                "IA intégrée qui vous aide à rédiger, cibler et partager votre pétition",
                "Carte d'Impact géolocalisée unique en son genre pour visualiser les mobilisations",
                "Modération automatique par IA pour garantir un espace sûr et respectueux",
                "PetBot IA disponible 24h/24 pour répondre à toutes vos questions",
                "Viral Studio Pro pour créer des visuels de partage professionnels en un clic",
                "Données protégées, zéro publicité, zéro revente d'informations personnelles",
              ].map((point) => (
                <div key={point} className="flex items-start gap-3">
                  <HiCheckCircle className="text-green-400 text-lg flex-shrink-0 mt-0.5" />
                  <p className="text-neutral-300 text-sm leading-relaxed">{point}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ FINAL CTA ═════════════════════════════════════════════════════════ */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto pb-14">
          <div className="relative text-center rounded-3xl border border-green-500/20 bg-gradient-to-br from-green-500/5 to-emerald-500/5 p-10 sm:p-14 space-y-5 overflow-hidden">
            <div className="absolute inset-0 bg-green-500/3 blur-[60px] pointer-events-none rounded-3xl" />
            <div className="relative text-5xl">🌱</div>
            <h2 className="relative text-2xl sm:text-3xl font-extrabold text-white font-display">
              Prêt à changer le monde ?
            </h2>
            <p className="relative text-neutral-400 text-sm max-w-md mx-auto leading-relaxed">
              Rejoignez des milliers de citoyens qui utilisent Apption pour défendre leurs causes et remporter des victoires concrètes.
            </p>
            <div className="relative flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/launch-petition"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-gradient-to-r from-green-500 to-emerald-600 text-neutral-950 font-black text-sm rounded-2xl shadow-lg shadow-green-500/20 hover:shadow-green-500/30 transition-all uppercase tracking-wide"
              >
                <HiSparkles /> Lancer ma pétition
              </Link>
              <Link
                href="/faq"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-neutral-900 border border-white/10 text-white font-semibold text-sm rounded-2xl hover:border-white/20 transition-all"
              >
                Consulter la FAQ
              </Link>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
