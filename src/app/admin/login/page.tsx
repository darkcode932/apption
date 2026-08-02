"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import ButtonClick from "../../components/ButtonClick";
import { Input } from "../../components/Input";
import AuthError from "../../components/AuthError";
import { signInUseCase, signOutUseCase } from "../../../infrastructure/ServiceLocator";
import { parseAuthError } from "../../../utils/authErrorHelper";
import { sanitizeText } from "../../../utils/sanitize";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordShow, setPasswordShow] = useState(false);
  const [error, setError] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Security: Brute-Force rate limiter state for admin portal
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutUntil, setLockoutUntil] = useState<number | null>(null);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Security Rate Limiting Check
    if (lockoutUntil && Date.now() < lockoutUntil) {
      const remainingSecs = Math.ceil((lockoutUntil - Date.now()) / 1000);
      setError({
        title: "Accès Admin Verrouillé",
        description: `Nombreux échecs de connexion. Veuillez réessayer dans ${remainingSecs} secondes.`,
      });
      return;
    }

    const cleanEmail = sanitizeText(email).toLowerCase();

    setLoading(true);

    try {
      const user = await signInUseCase.execute(cleanEmail, password);
      if (user.role === "admin" || user.role === "super_admin") {
        setFailedAttempts(0);
        setLockoutUntil(null);
        router.push("/admin/dashboard");
      } else {
        // Logged in user is not admin - sign them out immediately
        await signOutUseCase.execute();
        const newFail = failedAttempts + 1;
        setFailedAttempts(newFail);
        if (newFail >= 5) {
          setLockoutUntil(Date.now() + 60000);
        }
        setError({
          title: "Accès Refusé",
          description: "Vous n'avez pas les privilèges d'administration requis pour accéder à ce portail.",
        });
      }
    } catch (err: any) {
      console.error(err);
      const newFail = failedAttempts + 1;
      setFailedAttempts(newFail);

      if (newFail >= 5) {
        setLockoutUntil(Date.now() + 60000); // 60s lockout
        setError({
          title: "Sécurité Admin",
          description: "Trop d'échecs de connexion consécutifs. Portail admin temporairement verrouillé (60s).",
        });
      } else {
        setError(parseAuthError(err));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center bg-back2 bg-center bg-cover min-h-screen mx-auto w-full p-4 relative overflow-hidden">
      
      {/* Decorative Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-green-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="glass-card flex flex-col justify-center rounded-3xl p-8 sm:p-12 shadow-2xl w-full max-w-md border border-white/10 relative z-10">
        <div className="text-center space-y-2 mb-8">
          <Link href="/" className="text-green-450 font-extrabold text-2xl tracking-widest block font-display">
            APPTION
          </Link>
          <h2 className="text-xl font-extrabold text-white font-display">
            Portail Administration
          </h2>
          <p className="text-neutral-450 text-[10px] uppercase tracking-wider font-semibold">
            Réservé aux super-administrateurs et modérateurs
          </p>
        </div>

        {error && <AuthError error={error} />}

        <form onSubmit={handleFormSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="block mb-2 text-xs font-semibold text-neutral-350 pl-1">
              Identifiant Email Admin
            </label>
            <Input
              type="email"
              name="email"
              id="email"
              placeholder="admin@apption.io"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="password" className="block mb-2 text-xs font-semibold text-neutral-350 pl-1">
              Mot de passe
            </label>
            <Input
              type={passwordShow ? "text" : "password"}
              name="password"
              id="password"
              block
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              rightIcon={
                passwordShow ? (
                  <EyeIcon
                    className="h-5 w-5 hover:text-green-400 transition-colors cursor-pointer"
                    onClick={() => setPasswordShow(false)}
                  />
                ) : (
                  <EyeSlashIcon
                    className="h-5 w-5 hover:text-green-400 transition-colors cursor-pointer"
                    onClick={() => setPasswordShow(true)}
                  />
                )
              }
            />
          </div>

          <div className="pt-3">
            <ButtonClick
              text={loading ? "Validation..." : "Accéder au Dashboard"}
              classArrow="text-xl"
              classButton="rounded-full bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 px-4 py-3 flex w-full justify-center shadow-lg transition-all font-bold"
              type="submit"
              disabled={loading}
            />
          </div>
        </form>
      </div>
    </div>
  );
}
