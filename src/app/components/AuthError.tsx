import React from "react";
import { HiExclamationTriangle, HiXMark } from "react-icons/hi2";

export interface AuthErrorProps {
  error: string | { title?: string; description?: string } | null;
  onClose?: () => void;
}

export default function AuthError({ error, onClose }: AuthErrorProps) {
  if (!error) return null;

  let title = "Erreur de connexion";
  let description = "";

  if (typeof error === "string") {
    description = error;
  } else {
    title = error.title || "Erreur de connexion";
    description = error.description || "";
  }

  return (
    <div className="group relative flex items-start justify-between rounded-2xl border border-rose-500/30 bg-rose-950/40 p-4 shadow-xl backdrop-blur-md transition-all duration-300 animate-fadeIn w-full overflow-hidden">
      {/* Ambient Red Glow */}
      <div className="absolute -left-10 -top-10 h-24 w-24 rounded-full bg-rose-500/10 blur-2xl pointer-events-none" />

      <div className="flex items-start space-x-3 relative z-10 pr-2">
        <div className="flex-shrink-0 mt-0.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-400 shadow-md shadow-rose-500/10">
            <HiExclamationTriangle className="h-4 w-4" />
          </div>
        </div>

        <div className="space-y-0.5">
          <h4 className="text-xs font-bold text-white font-display tracking-wide">
            {title}
          </h4>
          <p className="text-[11px] font-light text-rose-200/90 leading-relaxed">
            {description}
          </p>
        </div>
      </div>

      {onClose && (
        <button
          onClick={onClose}
          type="button"
          className="relative z-10 flex-shrink-0 text-rose-300/60 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
          aria-label="Fermer"
        >
          <HiXMark className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
