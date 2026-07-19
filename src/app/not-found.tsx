"use client";

import React from "react";
import Link from "next/link";
import { HiHome } from "react-icons/hi";
import ButtonClick from "./components/ButtonClick";

export default function NotFound() {
  return (
    <div className="flex flex-col justify-center text-white mx-auto min-h-screen items-center w-full bg-[#0b0b0f] relative overflow-hidden p-4">
      
      {/* Decorative Gradient Glows */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-green-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-red-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="glass-card p-10 sm:p-16 rounded-3xl text-center max-w-lg w-full flex flex-col items-center space-y-6 shadow-2xl relative z-10 border border-white/10 select-none">
        
        {/* Large 404 visual */}
        <h1 className="font-extrabold text-8xl tracking-widest bg-clip-text text-transparent bg-gradient-to-r from-red-500 via-white to-green-500">
          404
        </h1>

        <div className="space-y-2">
          <h2 className="text-xl sm:text-2xl font-extrabold font-display text-white">
            Page introuvable
          </h2>
          <p className="text-sm text-neutral-450 font-light leading-relaxed">
            Désolé, la page que vous recherchez n&apos;existe pas ou a été déplacée.
          </p>
        </div>

        <Link href="/home" className="pt-2">
          <ButtonClick
            text="Retourner à l'accueil"
            classArrow="text-xl"
            classButton="rounded-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-neutral-950 px-8 py-3.5 text-sm font-extrabold shadow-lg shadow-green-950/20"
          />
        </Link>
      </div>
    </div>
  );
}
