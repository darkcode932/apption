"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  HiUsers,
  HiDocumentText,
  HiChartBar,
  HiArrowLeftOnRectangle,
  HiBars3,
  HiXMark,
  HiArrowUpRight,
} from "react-icons/hi2";
import { useAuth } from "../contexts/AuthContext";
import { signOutUseCase } from "../../infrastructure/ServiceLocator";
import AdminGuard from "./AdminGuard";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Skip Sidebar rendering for login screen
  const isLoginPage = pathname === "/admin/login";

  if (isLoginPage) {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    try {
      await signOutUseCase.execute();
      router.push("/admin/login");
    } catch (e) {
      console.error("Logout failed:", e);
    }
  };

  const navLinks = [
    { href: "/admin/dashboard", name: "Tableau de Bord", icon: HiChartBar },
    { href: "/admin/users", name: "Utilisateurs & Rôles", icon: HiUsers },
    { href: "/admin/petitions", name: "Modération Pétitions", icon: HiDocumentText },
  ];

  return (
    <AdminGuard>
      <div className="min-h-screen bg-[#0b0b0f] flex text-white font-sans">
        
        {/* Decorative Background Blur */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-green-500/5 rounded-full blur-[160px] pointer-events-none" />

        {/* Desktop Sidebar */}
        <aside className="hidden md:flex flex-col w-64 bg-neutral-950/80 border-r border-white/5 backdrop-blur-md p-6 fixed top-0 bottom-0 left-0 justify-between z-30">
          <div className="space-y-8">
            <div className="flex items-center space-x-2 pt-2">
              <span className="h-6 w-1.5 bg-green-500 rounded-full" />
              <Link href="/" className="font-extrabold text-xl tracking-widest font-display text-white">
                APPTION
              </Link>
              <span className="px-2 py-0.5 bg-red-650 text-[8px] font-extrabold uppercase rounded-md tracking-wider">
                Admin
              </span>
            </div>

            <nav className="space-y-1.5">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
                      isActive
                        ? "bg-green-500 text-neutral-950 font-bold"
                        : "text-neutral-400 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <Icon className="text-lg flex-shrink-0" />
                    <span>{link.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="space-y-3.5 border-t border-white/5 pt-6">
            <div className="flex items-center space-x-3 px-4">
              <div className="h-8 w-8 rounded-full bg-neutral-900 flex items-center justify-center text-xs text-green-400 font-extrabold border border-white/5 uppercase">
                {user?.username?.charAt(0) || "A"}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold truncate text-white leading-none">
                  {user?.firstname} {user?.lastname}
                </p>
                <p className="text-[9px] text-neutral-500 font-semibold uppercase mt-1">
                  {user?.role === "super_admin" ? "Super Admin" : "Administrateur"}
                </p>
              </div>
            </div>

            <Link
              href="/home"
              className="flex items-center space-x-3 px-4 py-2.5 rounded-xl text-xs text-neutral-400 hover:text-white hover:bg-white/5 transition-all font-medium"
            >
              <HiArrowUpRight className="text-sm" />
              <span>Retour à l&apos;application</span>
            </Link>

            <button
              onClick={handleLogout}
              className="flex items-center space-x-3 px-4 py-2.5 rounded-xl text-xs text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all font-bold w-full text-left cursor-pointer"
            >
              <HiArrowLeftOnRectangle className="text-sm" />
              <span>Se déconnecter</span>
            </button>
          </div>
        </aside>

        {/* Mobile Header Bar */}
        <div className="md:hidden flex items-center justify-between w-full h-16 bg-neutral-950/80 border-b border-white/5 backdrop-blur-md px-4 fixed top-0 left-0 right-0 z-30">
          <div className="flex items-center space-x-2">
            <span className="h-5 w-1 bg-green-500 rounded-full" />
            <Link href="/" className="font-extrabold tracking-widest text-white text-lg font-display">
              APPTION
            </Link>
            <span className="px-1.5 py-0.5 bg-red-650 text-[7px] font-extrabold uppercase rounded-md tracking-wider">
              Admin
            </span>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-neutral-400 hover:text-white p-1 rounded-lg border border-transparent hover:border-white/5 transition-all"
          >
            {mobileMenuOpen ? <HiXMark className="text-2xl" /> : <HiBars3 className="text-2xl" />}
          </button>
        </div>

        {/* Mobile Sidebar overlay */}
        {mobileMenuOpen && (
          <aside className="md:hidden fixed inset-0 top-16 bg-[#0b0b0f] z-20 p-6 flex flex-col justify-between border-t border-white/5">
            <nav className="space-y-2.5">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all ${
                      isActive
                        ? "bg-green-500 text-neutral-950 font-bold"
                        : "text-neutral-400 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <Icon className="text-lg flex-shrink-0" />
                    <span>{link.name}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="space-y-4 border-t border-white/5 pt-6">
              <div className="flex items-center space-x-3 px-4">
                <div className="h-8 w-8 rounded-full bg-neutral-900 flex items-center justify-center text-xs text-green-400 font-extrabold border border-white/5 uppercase">
                  {user?.username?.charAt(0) || "A"}
                </div>
                <div>
                  <p className="text-xs font-bold text-white leading-none">
                    {user?.firstname} {user?.lastname}
                  </p>
                  <p className="text-[8px] text-neutral-500 font-bold uppercase mt-1">
                    {user?.role === "super_admin" ? "Super Admin" : "Administrateur"}
                  </p>
                </div>
              </div>

              <Link
                href="/home"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center space-x-3 px-4 py-2.5 rounded-xl text-xs text-neutral-400 hover:text-white hover:bg-white/5 transition-all font-medium"
              >
                <HiArrowUpRight className="text-sm" />
                <span>Retour à l&apos;application</span>
              </Link>

              <button
                onClick={handleLogout}
                className="flex items-center space-x-3 px-4 py-2.5 rounded-xl text-xs text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all font-bold w-full text-left cursor-pointer"
              >
                <HiArrowLeftOnRectangle className="text-sm" />
                <span>Se déconnecter</span>
              </button>
            </div>
          </aside>
        )}

        {/* Content Wrapper */}
        <main className="flex-1 md:pl-64 pt-16 md:pt-0 min-h-screen relative z-10 w-full">
          <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 md:py-12">
            {children}
          </div>
        </main>

      </div>
    </AdminGuard>
  );
}
