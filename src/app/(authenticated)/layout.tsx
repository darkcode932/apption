"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
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

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-900 text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-400"></div>
        <p className="mt-4 text-neutral-400 text-sm">Chargement de votre session...</p>
      </div>
    );
  }

  if (!user) {
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

