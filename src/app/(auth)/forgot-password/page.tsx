"use client";

import React, { useState } from "react";
import Link from "next/link";
import { HiMail, HiArrowLeft, HiCheckCircle } from "react-icons/hi";
import ButtonClick from "../../components/ButtonClick";
import { Input } from "../../components/Input";
import AuthError from "../../components/AuthError";
import { sendPasswordResetUseCase } from "../../../infrastructure/ServiceLocator";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    setError(null);
    try {
      await sendPasswordResetUseCase.execute(email);
      setSuccess(true);
    } catch (err: any) {
      console.error(err);
      setError(
        err?.message || "Une erreur est survenue lors de l'envoi de l'email."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center bg-back2 bg-center bg-cover min-h-screen mx-auto w-full p-4 relative overflow-hidden">
      
      {/* Decorative Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-green-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="glass-card p-8 sm:p-12 rounded-3xl text-white max-w-md w-full shadow-2xl relative z-10 border border-white/10">
        
        {success ? (
          <div className="space-y-6 text-center animate-fadeIn">
            <div className="flex justify-center">
              <HiCheckCircle className="h-16 w-16 text-green-400" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-extrabold font-display">Email envoyé !</h2>
              <p className="text-sm text-neutral-400 font-light leading-relaxed">
                Un email contenant les instructions de réinitialisation de mot de passe a été envoyé à{" "}
                <span className="font-semibold text-white">{email}</span>.
              </p>
            </div>
            <Link
              href="/login"
              className="inline-flex items-center space-x-2 text-xs font-bold text-green-400 hover:text-green-300 transition-colors uppercase tracking-wider"
            >
              <HiArrowLeft />
              <span>Retour à la connexion</span>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="space-y-2 text-center">
              <h1 className="font-extrabold text-2xl sm:text-3xl font-display text-white">
                Mot de passe oublié ?
              </h1>
              <p className="text-neutral-450 font-light text-xs leading-relaxed">
                Entrez votre adresse email. Nous vous enverrons un lien pour réinitialiser votre mot de passe.
              </p>
            </div>

            {error && <AuthError error={error} />}

            <form onSubmit={handleFormSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-xs font-semibold text-neutral-350 pl-1"
                >
                  Adresse Email
                </label>
                <Input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="exemple@domaine.io"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              <div className="pt-2">
                <ButtonClick
                  text={loading ? "Envoi du lien..." : "Envoyer le lien"}
                  classArrow="text-xl"
                  classButton="rounded-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-neutral-950 px-4 py-3 flex w-full justify-center shadow-lg transition-all"
                  type="submit"
                  disabled={loading || !email.trim()}
                />
              </div>
            </form>

            <div className="text-center pt-2">
              <Link
                href="/login"
                className="inline-flex items-center space-x-2 text-xs font-semibold text-neutral-400 hover:text-white transition-colors"
              >
                <HiArrowLeft />
                <span>Retour à la connexion</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
