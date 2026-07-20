"use client";

import React, { Fragment, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useAuth } from "../contexts/AuthContext";
import { signOutUseCase, petitionRepository } from "../../infrastructure/ServiceLocator";
import { Notification } from "../../domain/entities/Notification";
import { useLanguage, useT } from "../../i18n/LanguageContext";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Navbar() {

  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { locale, setLocale } = useLanguage();
  const t = useT();

  const links = [
    { name: t("navbar.dashboard"), href: "/dashboard" },
    { name: t("navbar.launch"), href: "/launch-petition" },
    { name: t("navbar.browse"), href: "/petitions" },
    { name: t("navbar.my_petitions"), href: "/my-petitions" },
  ];


  useEffect(() => {
    if (!user) return;

    // Real-time listener for user alerts
    const unsubscribe = petitionRepository.onNotificationsSnapshot(user.id, (data) => {
      setNotifications(data);
    });

    return () => unsubscribe();
  }, [user]);

  const handleSignOut = async () => {
    try {
      await signOutUseCase.execute();
      router.push("/login");
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  const handleNotificationClick = async (notif: Notification) => {
    try {
      await petitionRepository.markNotificationRead(notif.id);
      if (notif.petitionId) {
        router.push(`/petitions/${notif.petitionId}`);
      }
    } catch (err) {
      console.error("Failed to read notification:", err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      const unread = notifications.filter((n) => !n.read);
      await Promise.all(unread.map((n) => petitionRepository.markNotificationRead(n.id)));
    } catch (err) {
      console.error("Failed to mark all as read:", err);
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <Disclosure as="nav" className="sticky top-0 z-50 bg-[#0b0b0f]/80 backdrop-blur-md border-b border-white/5 shadow-lg transition-all duration-300">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 justify-between items-center">
              
              {/* Logo and Desktop Links */}
              <div className="flex items-center space-x-10">
                <Link href="/home" className="flex-shrink-0 flex items-center">
                  <span className="font-extrabold text-2xl bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent tracking-widest hover:opacity-90 transition-opacity">
                    APPTION
                  </span>
                </Link>
                
                <div className="hidden lg:flex space-x-6">
                  {links.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                      <Link
                        key={link.name}
                        href={link.href}
                        className={classNames(
                          isActive
                            ? "border-green-500 text-green-400 font-semibold"
                            : "border-transparent text-neutral-400 hover:text-white hover:border-neutral-800",
                          "inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium h-16 transition-all duration-200"
                        )}
                      >
                        {link.name}
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Search Bar */}
              <div className="flex-1 max-w-xs mx-4 hidden sm:block">
                <label htmlFor="search" className="sr-only">
                  Search
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <MagnifyingGlassIcon className="h-4 w-4 text-neutral-500" aria-hidden="true" />
                  </div>
                  <input
                    id="search"
                    name="search"
                    className="block w-full rounded-full border border-neutral-800 bg-neutral-900/50 py-1.5 pl-9 pr-3 text-xs text-white placeholder-neutral-500 focus:border-green-500/70 focus:bg-neutral-900 focus:outline-none focus:ring-1 focus:ring-green-500/20 transition-all"
                    placeholder={t("navbar.search_placeholder")}
                    type="search"
                  />
                </div>
              </div>


              {/* Notifications and Profile */}
              <div className="hidden lg:flex items-center space-x-4">
                
                {/* Language Switcher */}
                <button
                  onClick={() => setLocale(locale === "fr" ? "en" : "fr")}
                  className="px-2.5 py-1.5 rounded-full text-xs font-bold bg-neutral-900/50 border border-neutral-850 hover:border-green-500/50 text-neutral-400 hover:text-white transition-all cursor-pointer flex items-center space-x-1"
                >
                  <span>{locale === "fr" ? "🇫🇷 FR" : "🇬🇧 EN"}</span>
                </button>

                {/* Notifications dropdown */}
                <Menu as="div" className="relative">
                  <div>
                    <Menu.Button className="relative rounded-full p-1.5 text-neutral-450 hover:text-white hover:bg-neutral-900/60 border border-transparent hover:border-white/5 focus:outline-none transition-all">
                      <span className="sr-only">{t("navbar.notifications")}</span>
                      <BellIcon className="h-5 w-5" aria-hidden="true" />
                      {unreadCount > 0 && (
                        <span className="absolute top-0 right-0 h-4.5 w-4.5 rounded-full bg-red-650 text-[8px] font-extrabold flex items-center justify-center text-white border-2 border-[#0b0b0f] translate-x-1 -translate-y-1">
                          {unreadCount}
                        </span>
                      )}
                    </Menu.Button>
                  </div>

                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 z-20 mt-2 w-80 origin-top-right rounded-2xl bg-neutral-900/95 border border-white/5 py-1.5 shadow-2xl backdrop-blur-md focus:outline-none">
                      <div className="px-4 py-2.5 border-b border-white/5 flex items-center justify-between">
                        <p className="text-xs font-bold text-white uppercase tracking-wider font-display">{t("navbar.notifications")}</p>
                        {unreadCount > 0 && (
                          <button
                            onClick={handleMarkAllRead}
                            className="text-[9px] font-bold text-green-455 hover:text-green-400 transition-colors uppercase tracking-wider cursor-pointer bg-transparent border-0"
                          >
                            {t("navbar.mark_all_read")}
                          </button>
                        )}
                      </div>

                      <div className="max-h-72 overflow-y-auto divide-y divide-white/5 scrollbar-hidden">
                        {notifications.map((notif) => (
                          <Menu.Item key={notif.id}>
                            {({ active }) => (
                              <button
                                onClick={() => handleNotificationClick(notif)}
                                className={classNames(
                                  active ? "bg-white/[0.02]" : "",
                                  "w-full text-left px-4 py-3 flex items-start space-x-2.5 transition-all relative border-0 cursor-pointer bg-transparent",
                                  !notif.read ? "bg-green-500/[0.01]" : ""
                                )}
                              >
                                {!notif.read && (
                                  <span className="absolute left-2.5 top-4.5 h-1.5 w-1.5 rounded-full bg-green-500" />
                                )}
                                <div className="pl-1.5 min-w-0 space-y-0.5">
                                  <p className="text-xs font-bold text-white leading-tight font-display">{notif.title}</p>
                                  <p className="text-[10px] text-neutral-400 font-light leading-snug">{notif.message}</p>
                                  <p className="text-[8px] text-neutral-500 font-light pt-0.5">
                                    {new Date(notif.createdAt).toLocaleDateString("fr-FR", {
                                      day: "2-digit",
                                      month: "short",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })}
                                  </p>
                                </div>
                              </button>
                            )}
                          </Menu.Item>
                        ))}
                        {notifications.length === 0 && (
                          <div className="py-8 text-center text-xs text-neutral-500 italic">
                            {t("navbar.no_notifications")}
                          </div>
                        )}
                      </div>

                    </Menu.Items>
                  </Transition>
                </Menu>

                {/* Profile dropdown */}
                <Menu as="div" className="relative ml-3">
                  <div>
                    <Menu.Button className="flex rounded-full bg-neutral-900 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/30">
                      <span className="sr-only">{t("navbar.user_menu")}</span>
                      <img
                        className="h-8 w-8 rounded-full border border-white/10"
                        src={user?.email ? `https://api.dicebear.com/7.x/initials/svg?seed=${user.username || user.email}` : "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"}
                        alt="Profile avatar"
                      />
                    </Menu.Button>
                  </div>

                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 z-20 mt-2 w-48 origin-top-right rounded-2xl bg-neutral-900/95 border border-white/5 py-1.5 shadow-2xl backdrop-blur-md focus:outline-none">
                      <div className="px-4 py-2.5 border-b border-white/5">
                        <p className="text-sm font-semibold text-white truncate">{user?.username || (locale === "fr" ? "Invité" : "Guest")}</p>
                        <p className="text-[10px] text-neutral-455 truncate">{user?.email || ""}</p>
                      </div>
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            href="/profile"
                            className={classNames(
                              active ? "bg-neutral-800/60 text-white" : "text-neutral-350",
                              "block px-4 py-2 text-xs transition-colors font-medium"
                            )}
                          >
                            {t("navbar.profile")}
                          </Link>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={handleSignOut}
                            className={classNames(
                              active ? "bg-neutral-800/60 text-red-400" : "text-neutral-350",
                              "block w-full text-left px-4 py-2 text-xs transition-colors font-semibold border-0 cursor-pointer bg-transparent"
                            )}
                          >
                            {t("navbar.logout")}
                          </button>
                        )}
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>


              {/* Mobile menu button */}
              <div className="flex items-center lg:hidden">
                <Disclosure.Button className="inline-flex items-center justify-center rounded-xl p-2 text-neutral-400 hover:bg-neutral-900 hover:text-white focus:outline-none transition-all">
                  <span className="sr-only">{t("navbar.main_menu")}</span>
                  {open ? (
                    <XMarkIcon className="block h-5 w-5" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-5 w-5" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>

            </div>
          </div>

          {/* Mobile Panel */}
          <Disclosure.Panel className="lg:hidden bg-neutral-950/95 border-b border-white/5 px-4 py-3 space-y-1">
            {links.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Disclosure.Button
                  key={link.name}
                  as={Link}
                  href={link.href}
                  className={classNames(
                    isActive
                      ? "bg-neutral-900 text-green-400 font-semibold"
                      : "text-neutral-400 hover:bg-neutral-900/60 hover:text-white",
                    "block px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
                  )}
                >
                  {link.name}
                </Disclosure.Button>
              );
            })}
            
            {/* Mobile Language Switcher */}
            <div className="px-3 py-2.5 border-t border-white/5 mt-2 flex justify-between items-center">
              <span className="text-xs text-neutral-400 font-medium">{locale === "fr" ? "Langue" : "Language"}</span>
              <button
                onClick={() => setLocale(locale === "fr" ? "en" : "fr")}
                className="px-2.5 py-1 rounded-full text-xs font-bold bg-neutral-900 border border-neutral-800 text-neutral-350 hover:text-white transition-all cursor-pointer"
              >
                <span>{locale === "fr" ? "🇫🇷 FR" : "🇬🇧 EN"}</span>
              </button>
            </div>

            <div className="border-t border-white/5 pt-4 pb-3 mt-4">
              <div className="flex items-center px-3">
                <div className="flex-shrink-0">
                  <img
                    className="h-9 w-9 rounded-full border border-white/10"
                    src={user?.email ? `https://api.dicebear.com/7.x/initials/svg?seed=${user.username || user.email}` : "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"}
                    alt=""
                  />
                </div>
                <div className="ml-3">
                  <div className="text-sm font-medium text-white">{user?.username || (locale === "fr" ? "Invité" : "Guest")}</div>
                  <div className="text-xs font-medium text-neutral-455">{user?.email || ""}</div>
                </div>
              </div>
              <div className="mt-3 space-y-1">
                <Disclosure.Button
                  as={Link}
                  href="/profile"
                  className="block px-3 py-2 rounded-xl text-sm font-medium text-neutral-400 hover:bg-neutral-900 hover:text-white"
                >
                  {t("navbar.profile")}
                </Disclosure.Button>
                <Disclosure.Button
                  as="button"
                  onClick={handleSignOut}
                  className="block w-full text-left px-3 py-2 rounded-xl text-sm font-medium text-red-400 hover:bg-neutral-900 border-0 bg-transparent"
                >
                  {t("navbar.logout")}
                </Disclosure.Button>
              </div>
            </div>

          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
