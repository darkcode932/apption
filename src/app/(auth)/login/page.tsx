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
import { useT } from "../../../i18n/LanguageContext";
import {
  signInUseCase,
  signInWithGoogleUseCase,
  signInWithFacebookUseCase,
} from "../../../infrastructure/ServiceLocator";

export default function LoginPage() {
  const router = useRouter();
  const t = useT();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordShow, setPasswordShow] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<string | null>(null);

  const handleSetPasswordShow = () => {
    setPasswordShow(!passwordShow);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await signInUseCase.execute(email, password);
      router.push("/home");
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Identifiants invalides ou erreur de connexion.");
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
    <div className="flex items-center justify-center bg-back2 bg-center bg-cover min-h-screen mx-auto w-full p-4 relative overflow-hidden">
      
      {/* Decorative Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-green-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="glass-card flex flex-col md:flex-row justify-between rounded-3xl overflow-hidden shadow-2xl w-full max-w-4xl min-h-[550px] border border-white/10 relative z-10">
        
        {/* Form Section */}
        <div className="flex flex-col justify-center py-12 px-6 sm:px-12 md:w-3/5">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <h2 className="text-center text-3xl font-extrabold tracking-tight text-white">
              {t("auth.login_title")}
            </h2>
            <p className="text-center text-xs text-neutral-455 mt-1.5 font-light">
              {t("auth.login_subtitle")}
            </p>
          </div>

          <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md space-y-6">
            {error && <AuthError error={error} />}

            {/* Social Login Buttons */}
            <div className="flex flex-col space-y-3">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isDisabled}
                className="flex items-center justify-center space-x-3 w-full py-3 px-4 rounded-2xl border border-white/10 bg-neutral-950/30 hover:bg-neutral-900/50 text-white text-sm font-semibold transition-all duration-200 hover:border-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FcGoogle className="text-xl flex-shrink-0" />
                <span>{socialLoading === "google" ? t("auth.signing_in") : t("auth.google_sign_in")}</span>
              </button>

              <button
                type="button"
                onClick={handleFacebookSignIn}
                disabled={isDisabled}
                className="flex items-center justify-center space-x-3 w-full py-3 px-4 rounded-2xl border border-white/10 bg-neutral-950/30 hover:bg-neutral-900/50 text-white text-sm font-semibold transition-all duration-200 hover:border-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaFacebook className="text-xl text-blue-500 flex-shrink-0" />
                <span>{socialLoading === "facebook" ? t("auth.signing_in") : t("auth.facebook_sign_in")}</span>
              </button>
            </div>

            {/* Divider */}
            <div className="flex items-center space-x-3">
              <div className="flex-1 h-px bg-white/5" />
              <span className="text-[10px] text-neutral-500 font-semibold uppercase tracking-wider">{t("common.or")}</span>
              <div className="flex-1 h-px bg-white/5" />
            </div>

            <form className="space-y-5" onSubmit={handleFormSubmit}>
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-xs font-semibold text-neutral-350 pl-1"
                >
                  {t("common.email")}
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
                <label
                  htmlFor="password"
                  className="block text-xs mb-2 font-semibold text-neutral-350 pl-1"
                >
                  {t("common.password")}
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
                        onClick={handleSetPasswordShow}
                      />
                    ) : (
                      <EyeSlashIcon
                        className="h-5 w-5 hover:text-green-400 transition-colors"
                        onClick={handleSetPasswordShow}
                      />
                    )
                  }
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 rounded border-neutral-800 bg-neutral-950 text-green-500 focus:ring-green-500/20"
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-2 block text-xs text-neutral-300"
                  >
                    {t("auth.remember_me")}
                  </label>
                </div>

                <div className="text-xs font-medium">
                  <Link
                    href="/forgot-password"
                    className="text-red-400 hover:text-green-400 transition-colors"
                  >
                    {t("auth.forgot_password")}
                  </Link>
                </div>
              </div>

              <div className="pt-2">
                <ButtonClick
                  text={loading ? t("auth.signing_in") : t("auth.sign_in")}
                  classArrow="text-xl"
                  classButton="rounded-full bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 px-4 py-3 flex w-full justify-center shadow-lg transition-all"
                  type="submit"
                  disabled={isDisabled}
                />
              </div>
            </form>
          </div>
        </div>

        {/* Info Column (Right side) */}
        <div className="hidden md:flex flex-col justify-center items-center bg-back4 bg-cover bg-center text-white px-8 py-12 w-2/5 text-center relative border-l border-white/5">
          <div className="absolute inset-0 bg-green-950/80 mix-blend-multiply" />
          
          <div className="relative z-10 flex flex-col items-center space-y-6">
            <p className="text-green-400 font-extrabold text-3xl tracking-widest">
              APPTION
            </p>
            <h3 className="font-extrabold text-2xl">{t("auth.new_here")}</h3>
            <p className="font-light text-xs text-neutral-200 leading-relaxed">
              {t("auth.register_subtitle")}
            </p>
            <Link href="/register" className="pt-4">
              <ButtonClick
                text={t("auth.register_title")}
                classArrow="text-xl"
                classButton="rounded-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-neutral-950 px-8 py-3.5 shadow-lg transition-all"
              />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

