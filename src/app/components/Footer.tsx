"use client";

import React from "react";
import Link from "next/link";
import { FaFacebook, FaInstagram, FaXTwitter, FaLinkedin } from "react-icons/fa6";
import { useLanguage, useT } from "../../i18n/LanguageContext";

const socialLinks = [
  { name: "Instagram", href: "#", icon: FaInstagram },
  { name: "X / Twitter", href: "#", icon: FaXTwitter },
  { name: "Facebook", href: "#", icon: FaFacebook },
  { name: "LinkedIn", href: "#", icon: FaLinkedin },
];

export default function Footer() {
  const t = useT();
  const { locale } = useLanguage();
  const isFr = locale === "fr";

  const platformLinks = [
    { label: isFr ? "Accueil" : "Home", href: "/home" },
    { label: isFr ? "Toutes les pétitions" : "All Petitions", href: "/petitions" },
    { label: isFr ? "Carte d'impact" : "Impact Map", href: "/map" },
    { label: isFr ? "Lancer une pétition" : "Start a Petition", href: "/launch-petition" },
    { label: isFr ? "Tableau de bord" : "Dashboard", href: "/dashboard" },
  ];

  const communityLinks = [
    { label: isFr ? "Nos Victoires" : "Our Victories", href: "/petitions" },
    { label: isFr ? "Pétitions Populaires" : "Popular Petitions", href: "/petitions" },
    { label: isFr ? "Causes Locales" : "Local Causes", href: "/map" },
    { label: isFr ? "Comment ça marche" : "How It Works", href: "/comment-ca-marche" },
    { label: "FAQ", href: "/faq" },
  ];

  const stats = [
    { value: "120 000+", label: isFr ? "Signatures récoltées" : "Signatures gathered", color: "text-white" },
    { value: "850+", label: isFr ? "Victoires citoyennes" : "Citizen victories", color: "text-amber-400" },
    { value: "150+", label: isFr ? "Pays représentés" : "Countries represented", color: "text-cyan-400" },
  ];

  const legalLinks = [
    { label: isFr ? "Confidentialité" : "Privacy", href: "#" },
    { label: isFr ? "CGU" : "Terms", href: "#" },
    { label: "Cookies", href: "#" },
  ];

  return (
    <footer className="relative bg-[#0b0b0f] border-t border-white/5 mt-auto overflow-hidden">
      {/* Ambient top glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-32 bg-green-500/5 rounded-full blur-[80px] pointer-events-none" />

      {/* Main content */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-14 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">

          {/* ── Column 1: Brand ── */}
          <div className="space-y-5 sm:col-span-2 lg:col-span-1">
            <Link href="/home" className="inline-block">
              <span className="font-extrabold text-2xl bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent tracking-widest">
                APPTION
              </span>
            </Link>

            <p className="text-neutral-400 text-sm font-light leading-relaxed italic max-w-[220px]">
              {t("footer.tagline")}
            </p>

            {/* Live status */}
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-lg shadow-green-500/50" />
              <span className="text-[11px] text-neutral-500 font-semibold uppercase tracking-widest">
                {isFr ? "Plateforme active" : "Platform active"}
              </span>
            </div>

            {/* Social icons */}
            <div className="flex items-center space-x-4 pt-1">
              {socialLinks.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  aria-label={item.name}
                  className="text-neutral-500 hover:text-green-400 transition-all duration-200 hover:scale-110"
                >
                  <item.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* ── Column 2: Plateforme ── */}
          <div className="space-y-4">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-green-400">
              {isFr ? "Plateforme" : "Platform"}
            </span>
            <ul className="space-y-2.5">
              {platformLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="group flex items-center space-x-2 text-neutral-400 hover:text-white text-sm transition-colors duration-200"
                  >
                    <span className="w-1 h-1 rounded-full bg-neutral-700 group-hover:bg-green-500 transition-colors duration-200 flex-shrink-0" />
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Column 3: Communauté ── */}
          <div className="space-y-4">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-green-400">
              {isFr ? "Communauté" : "Community"}
            </span>
            <ul className="space-y-2.5">
              {communityLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="group flex items-center space-x-2 text-neutral-400 hover:text-white text-sm transition-colors duration-200"
                  >
                    <span className="w-1 h-1 rounded-full bg-neutral-700 group-hover:bg-green-500 transition-colors duration-200 flex-shrink-0" />
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Column 4: Impact Stats ── */}
          <div className="space-y-4">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-green-400">
              {isFr ? "Notre Impact" : "Our Impact"}
            </span>
            <div className="space-y-2.5">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="flex items-center space-x-3 bg-neutral-900/50 border border-white/5 rounded-xl px-4 py-3 hover:border-white/10 transition-colors duration-200"
                >
                  <span className={`text-xl font-black font-display ${stat.color} leading-none`}>
                    {stat.value}
                  </span>
                  <span className="text-neutral-500 text-xs leading-tight">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* ── Bottom legal bar ── */}
      <div className="relative z-10 border-t border-white/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[11px] text-neutral-600">
            &copy; {new Date().getFullYear()} APPTION. {t("footer.rights")}
          </p>

          <div className="flex items-center space-x-1">
            {legalLinks.map((link, i) => (
              <React.Fragment key={link.label}>
                <a
                  href={link.href}
                  className="text-[11px] text-neutral-600 hover:text-neutral-400 transition-colors px-2 py-0.5"
                >
                  {link.label}
                </a>
                {i < legalLinks.length - 1 && (
                  <span className="text-neutral-700 text-[10px]">·</span>
                )}
              </React.Fragment>
            ))}
          </div>

          <p className="text-[11px] text-neutral-600">
            {isFr ? "Fait avec ❤️ pour le changement citoyen" : "Made with ❤️ for civic change"}
          </p>
        </div>
      </div>
    </footer>
  );
}
