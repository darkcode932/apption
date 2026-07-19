import React from "react";
import Link from "next/link";

interface PetItemProps {
  text: string;
  link: string;
  id?: string;
}

export default function PetItem({ text, link, id }: PetItemProps) {
  const href = id ? `/petitions/${id}` : "#";
  return (
    <Link
      href={href}
      className="group flex flex-col space-y-4 items-center justify-center glass-card glass-card-hover p-4 rounded-2xl w-full max-w-[320px]"
    >
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
