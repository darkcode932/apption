"use client";

import React, { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PetBotWidget from "../components/PetBotWidget";

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Public browsing routes allowed for guests without login redirect
  const isPublicRoute =
    pathname.startsWith("/petitions") || pathname === "/map";

  useEffect(() => {
    if (!loading && !user && !isPublicRoute) {
      router.push("/login");
    }
  }, [user, loading, router, isPublicRoute]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-900 text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-400"></div>
        <p className="mt-4 text-neutral-400 text-sm">Chargement de votre session...</p>
      </div>
    );
  }

  if (!user && !isPublicRoute) {
    return null; // Prevents flashing content while redirecting
  }

  return (
    <>
      <Navbar />
      <main className="flex-grow flex flex-col bg-neutral-900">{children}</main>
      <Footer />
      <PetBotWidget />
    </>
  );
}

