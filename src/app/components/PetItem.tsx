import React from "react";
import Link from "next/link";
import { HiTrophy } from "react-icons/hi2";

interface PetItemProps {
  text: string;
  link: string;
  id?: string;
  status?: string;
}

export default function PetItem({ text, link, id, status }: PetItemProps) {
  const href = id ? `/petitions/${id}` : "#";
  const isVictory = status === "victory";

  return (
    <Link
      href={href}
      className="group flex flex-col space-y-4 items-center justify-center glass-card glass-card-hover p-4 rounded-2xl w-full max-w-[320px] relative"
    >
      {/* Victory Ribbon Badge */}
      {isVictory && (
        <div className="absolute top-2.5 right-2.5 z-10 flex items-center space-x-1 py-1 px-2.5 bg-yellow-500 text-neutral-950 font-bold text-[9px] uppercase tracking-wider rounded-full shadow-lg shadow-yellow-500/10">
          <HiTrophy className="text-[10px]" />
          <span>Victoire</span>
        </div>
      )}

      <div className="w-full h-[180px] rounded-xl overflow-hidden border border-white/5">
        <img
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          alt={text}
          src={link}
        />
      </div>
      <p className="text-sm font-semibold text-neutral-200 text-center line-clamp-2 min-h-[40px] px-1 group-hover:text-white transition-colors">
        {text}
      </p>
    </Link>
  );
}
