"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import ButtonClick from "../../components/ButtonClick";
import { Input } from "../../components/Input";
import AuthError from "../../components/AuthError";
import {
  signUpUseCase,
  signInWithGoogleUseCase,
  signInWithFacebookUseCase,
} from "../../../infrastructure/ServiceLocator";

export default function RegisterPage() {
  const router = useRouter();
  
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [passwordShow, setPasswordShow] = useState(false);
  const [cpasswordShow, setCPasswordShow] = useState(false);
  
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<string | null>(null);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    setLoading(true);
    try {
      await signUpUseCase.execute(email, password, firstname, lastname, username);
      router.push("/home");
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Une erreur est survenue lors de l'inscription.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setSocialLoading("google");
    try {
      await signInWithGoogleUseCase.execute();
      router.push("/home");
    } catch (err: any) {
      console.error(err);
      if (err?.code !== "auth/popup-closed-by-user") {
        setError(err?.message || "Erreur de connexion avec Google.");
      }
    } finally {
      setSocialLoading(null);
    }
  };

  const handleFacebookSignIn = async () => {
    setError(null);
    setSocialLoading("facebook");
    try {
      await signInWithFacebookUseCase.execute();
      router.push("/home");
    } catch (err: any) {
      console.error(err);
      if (err?.code !== "auth/popup-closed-by-user") {
        setError(err?.message || "Erreur de connexion avec Facebook.");
      }
    } finally {
      setSocialLoading(null);
    }
  };

  const isDisabled = loading || socialLoading !== null;

  return (
    <div className="flex items-center justify-center bg-back6 bg-center bg-cover min-h-screen mx-auto w-full py-12 px-4 relative overflow-hidden">
      
      {/* Decorative Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-green-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="glass-card px-6 sm:px-12 md:px-16 py-10 rounded-3xl text-white max-w-xl w-full shadow-2xl relative z-10 border border-white/10">
        <div className="flex flex-col justify-center text-center space-y-3 mb-8">
          <h1 className="font-extrabold text-3xl sm:text-4xl bg-clip-text text-transparent bg-gradient-to-r from-white to-green-450">
            Créer un compte
          </h1>
          <p className="text-neutral-400 font-light text-xs sm:text-sm leading-relaxed">
            Rejoignez notre réseau et démarrez vos actions pour influencer positivement le monde.
          </p>
        </div>

        {error && <div className="mb-5"><AuthError error={error} /></div>}

        {/* Social Login Buttons */}
        <div className="flex flex-col space-y-3 mb-6">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isDisabled}
            className="flex items-center justify-center space-x-3 w-full py-3 px-4 rounded-2xl border border-white/10 bg-neutral-950/30 hover:bg-neutral-900/50 text-white text-sm font-semibold transition-all duration-200 hover:border-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FcGoogle className="text-xl flex-shrink-0" />
            <span>{socialLoading === "google" ? "Inscription..." : "S'inscrire avec Google"}</span>
          </button>

          <button
            type="button"
            onClick={handleFacebookSignIn}
            disabled={isDisabled}
            className="flex items-center justify-center space-x-3 w-full py-3 px-4 rounded-2xl border border-white/10 bg-neutral-950/30 hover:bg-neutral-900/50 text-white text-sm font-semibold transition-all duration-200 hover:border-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaFacebook className="text-xl text-blue-500 flex-shrink-0" />
            <span>{socialLoading === "facebook" ? "Inscription..." : "S'inscrire avec Facebook"}</span>
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="flex-1 h-px bg-white/5" />
          <span className="text-[10px] text-neutral-500 font-semibold uppercase tracking-wider">ou créer un compte</span>
          <div className="flex-1 h-px bg-white/5" />
        </div>

        <form className="space-y-4" onSubmit={handleFormSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="fn" className="block mb-1.5 text-xs font-semibold text-neutral-350 pl-1">
                Prénom
              </label>
              <Input
                type="text"
                name="firstname"
                id="fn"
                placeholder="Ex: Dieudonné"
                value={firstname}
                onChange={(e) => setFirstname(e.target.value)}
                required
                disabled={isDisabled}
              />
            </div>
            <div>
              <label htmlFor="ln" className="block mb-1.5 text-xs font-semibold text-neutral-350 pl-1">
                Nom
              </label>
              <Input
                type="text"
                name="lastname"
                id="ln"
                placeholder="Ex: Mebina"
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
                required
                disabled={isDisabled}
              />
            </div>
          </div>

          <div>
            <label htmlFor="user" className="block mb-1.5 text-xs font-semibold text-neutral-350 pl-1">
              Nom d&apos;utilisateur
            </label>
            <Input
              type="text"
              name="username"
              id="user"
              placeholder="Ex: Okokbaton"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={isDisabled}
            />
          </div>

          <div>
            <label htmlFor="email" className="block mb-1.5 text-xs font-semibold text-neutral-350 pl-1">
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
              disabled={isDisabled}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-xs mb-1.5 font-semibold text-neutral-350 pl-1">
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
              disabled={isDisabled}
              rightIcon={
                passwordShow ? (
                  <EyeIcon
                    className="h-5 w-5 hover:text-green-400 transition-colors"
                    onClick={() => setPasswordShow(false)}
                  />
                ) : (
                  <EyeSlashIcon
                    className="h-5 w-5 hover:text-green-400 transition-colors"
                    onClick={() => setPasswordShow(true)}
                  />
                )
              }
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-xs mb-1.5 font-semibold text-neutral-350 pl-1">
              Confirmer le mot de passe
            </label>
            <Input
              type={cpasswordShow ? "text" : "password"}
              name="confirmPassword"
              id="confirmPassword"
              block
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={isDisabled}
              rightIcon={
                cpasswordShow ? (
                  <EyeIcon
                    className="h-5 w-5 hover:text-green-400 transition-colors"
                    onClick={() => setCPasswordShow(false)}
                  />
                ) : (
                  <EyeSlashIcon
                    className="h-5 w-5 hover:text-green-400 transition-colors"
                    onClick={() => setCPasswordShow(true)}
                  />
                )
              }
            />
          </div>

          <div className="pt-4">
            <ButtonClick
              text={loading ? "Inscription..." : "S'inscrire"}
              classArrow="text-xl"
              classButton="rounded-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-neutral-950 px-4 py-3 flex w-full justify-center shadow-lg transition-all"
              type="submit"
              disabled={isDisabled}
            />
          </div>
        </form>

        <p className="text-center mt-6 text-sm text-neutral-450">
          Vous avez déjà un compte ?{" "}
          <Link href="/login" className="text-green-450 font-bold hover:text-green-400 transition-colors hover:underline">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}
