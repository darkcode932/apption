"use client";

import React from "react";
import Link from "next/link";
import { HiPlusCircle, HiOutlineChevronRight } from "react-icons/hi";

import { useAuth } from "../contexts/AuthContext";
import { useLanguage } from "../../i18n/LanguageContext";

export default function Profile() {
  const { user } = useAuth();
  const { locale } = useLanguage();

  return (
    <div className="glass-card p-8 rounded-3xl border border-white/5 shadow-2xl w-full flex flex-col justify-center items-center">
      <div className="flex flex-col justify-center items-center">
        {/* Avatar Ring */}
        <div className="w-24 h-24 rounded-full ring-4 ring-green-500/30 ring-offset-4 ring-offset-[#0b0b0f] overflow-hidden relative shadow-lg">
          <img
            className="object-cover w-full h-full"
            src={user?.email ? `https://api.dicebear.com/7.x/initials/svg?seed=${user.username || user.email}` : "https://picsum.photos/200"}
            alt="Profile image"
          />
          <span className="absolute bottom-1.5 right-1.5 inline-block w-3.5 h-3.5 bg-green-500 border-2 border-[#0b0b0f] rounded-full"></span>
        </div>

        {/* Text */}
        <div className="mt-5 text-center">
          <p className="text-xl font-extrabold text-white leading-tight font-display">
            {user ? `${user.firstname} ${user.lastname}` : (locale === "fr" ? "Utilisateur Apption" : "Apption User")}
          </p>
          <p className="text-xs text-neutral-450 mt-1 font-light">
            @{user?.username || (locale === "fr" ? "invité" : "guest")}
          </p>
        </div>
      </div>
      
      {/* Create Button Link */}
      <Link href="/launch-petition" className="w-full">
        <div className="flex items-center justify-center space-x-3 px-4 py-3.5 mt-8 border border-green-500/30 hover:border-green-400 bg-green-500/10 hover:bg-green-500 text-green-400 hover:text-neutral-950 font-bold rounded-2xl cursor-pointer transition-all duration-300 active:scale-[0.98] text-sm shadow-md hover:shadow-green-500/20 shadow-neutral-950/20">
          <HiPlusCircle className="text-xl flex-shrink-0" />
          <span>{locale === "fr" ? "Nouvelle Pétition" : "New Petition"}</span>
          <HiOutlineChevronRight className="flex-shrink-0" />

        </div>
      </Link>
    </div>
  );
}

