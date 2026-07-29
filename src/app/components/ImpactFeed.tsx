"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  HiSparkles,
  HiTrophy,
  HiCheckBadge,
  HiShieldCheck,
  HiLockClosed,
  HiMegaphone,
  HiArrowRight,
  HiCheckCircle,
  HiHeart,
} from "react-icons/hi2";
import { Petition } from "../../domain/entities/Petition";
import { TimelineEvent } from "../../domain/entities/TimelineEvent";
import { petitionRepository } from "../../infrastructure/ServiceLocator";
import { useT } from "../../i18n/LanguageContext";

interface ImpactFeedProps {
  signedPetitions: Petition[];
  createdPetitions: Petition[];
}

interface FeedItem {
  event: TimelineEvent;
  petitionTitle: string;
  petitionId: string;
}

export default function ImpactFeed({ signedPetitions, createdPetitions }: ImpactFeedProps) {
  const t = useT();
  const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
  const [loadingFeed, setLoadingFeed] = useState(true);

  // Compute Badge Unlock Conditions
  const isEngaged = signedPetitions.length >= 1;
  const isPillar = signedPetitions.length >= 5;
  const isAmbassador = createdPetitions.length >= 1;
  const victoriesCount = signedPetitions.filter((p) => p.status === "victory").length;
  const isVictorious = victoriesCount > 0;

  const badges = [
    {
      id: "engaged",
      title: t("impact.badge_engaged"),
      desc: t("impact.badge_engaged_desc"),
      icon: HiHeart,
      unlocked: isEngaged,
      color: "from-blue-500/20 to-cyan-500/10 text-cyan-400 border-cyan-500/30",
    },
    {
      id: "pillar",
      title: t("impact.badge_pillar"),
      desc: t("impact.badge_pillar_desc"),
      icon: HiCheckBadge,
      unlocked: isPillar,
      color: "from-purple-500/20 to-indigo-500/10 text-purple-400 border-purple-500/30",
    },
    {
      id: "ambassador",
      title: t("impact.badge_ambassador"),
      desc: t("impact.badge_ambassador_desc"),
      icon: HiMegaphone,
      unlocked: isAmbassador,
      color: "from-emerald-500/20 to-green-500/10 text-green-400 border-green-500/30",
    },
    {
      id: "victorious",
      title: t("impact.badge_victorious"),
      desc: t("impact.badge_victorious_desc"),
      icon: HiTrophy,
      unlocked: isVictorious,
      color: "from-amber-500/20 to-yellow-500/10 text-amber-400 border-amber-500/30",
    },
  ];

  // Subscribe/Fetch timeline events for all signed petitions
  useEffect(() => {
    let isMounted = true;
    setLoadingFeed(true);

    if (signedPetitions.length === 0) {
      setFeedItems([]);
      setLoadingFeed(false);
      return;
    }

    const unsubscribers: (() => void)[] = [];
    const aggregated: Record<string, FeedItem[]> = {};

    signedPetitions.forEach((pet) => {
      const unsub = petitionRepository.onTimelineSnapshot(pet.id, (events) => {
        if (!isMounted) return;
        aggregated[pet.id] = events.map((e) => ({
          event: e,
          petitionTitle: pet.title,
          petitionId: pet.id,
        }));

        // Flatten & sort by date descending
        const allItems = Object.values(aggregated)
          .flat()
          .sort((a, b) => new Date(b.event.createdAt).getTime() - new Date(a.event.createdAt).getTime());

        setFeedItems(allItems);
        setLoadingFeed(false);
      });

      unsubscribers.push(unsub);
    });

    return () => {
      isMounted = false;
      unsubscribers.forEach((u) => u());
    };
  }, [signedPetitions]);

  return (
    <div className="space-y-10">
      
      {/* Stats Header Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card p-5 rounded-2xl border border-white/5 flex items-center space-x-4">
          <div className="h-12 w-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 font-extrabold text-xl">
            {signedPetitions.length}
          </div>
          <div>
            <p className="text-xs text-neutral-400 font-medium">{t("impact.stats_signed")}</p>
            <p className="text-lg font-bold text-white font-display">{signedPetitions.length}</p>
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-white/5 flex items-center space-x-4">
          <div className="h-12 w-12 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-400 font-extrabold text-xl">
            {createdPetitions.length}
          </div>
          <div>
            <p className="text-xs text-neutral-400 font-medium">{t("impact.stats_created")}</p>
            <p className="text-lg font-bold text-white font-display">{createdPetitions.length}</p>
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-white/5 flex items-center space-x-4">
          <div className="h-12 w-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 font-extrabold text-xl">
            {victoriesCount}
          </div>
          <div>
            <p className="text-xs text-neutral-400 font-medium">{t("impact.stats_victories")}</p>
            <p className="text-lg font-bold text-white font-display">{victoriesCount}</p>
          </div>
        </div>
      </div>

      {/* Badges Section */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2.5">
          <HiSparkles className="text-green-400 text-xl" />
          <h3 className="text-lg font-extrabold text-white font-display">
            {t("impact.badges_title")}
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {badges.map((badge) => {
            const Icon = badge.icon;
            return (
              <div
                key={badge.id}
                className={`glass-card p-5 rounded-2xl border bg-gradient-to-br transition-all relative overflow-hidden ${
                  badge.unlocked
                    ? `${badge.color} shadow-lg`
                    : "from-neutral-900/40 to-neutral-950/40 text-neutral-500 border-white/5 opacity-70"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className={`p-3 rounded-xl ${badge.unlocked ? "bg-white/10" : "bg-neutral-800/50"}`}>
                    <Icon className="text-2xl" />
                  </div>

                  <span className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full border ${
                    badge.unlocked 
                      ? "bg-white/10 text-white border-white/20" 
                      : "bg-neutral-800/50 text-neutral-500 border-transparent"
                  }`}>
                    {badge.unlocked ? (
                      <span className="flex items-center space-x-1">
                        <HiCheckCircle className="text-xs text-green-400" />
                        <span>{t("impact.unlocked")}</span>
                      </span>
                    ) : (
                      <span className="flex items-center space-x-1">
                        <HiLockClosed className="text-xs" />
                        <span>{t("impact.locked")}</span>
                      </span>
                    )}
                  </span>
                </div>

                <div className="mt-4 space-y-1">
                  <h4 className="text-sm font-bold text-white font-display">{badge.title}</h4>
                  <p className="text-[11px] text-neutral-400 font-light leading-snug">{badge.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Timeline News Feed Section */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center space-x-2.5">
          <HiMegaphone className="text-green-400 text-xl" />
          <h3 className="text-lg font-extrabold text-white font-display">
            {t("impact.feed_title")}
          </h3>
        </div>

        {loadingFeed ? (
          <div className="space-y-3 py-4">
            <div className="animate-pulse bg-neutral-900/60 border border-white/5 rounded-2xl h-24 w-full" />
            <div className="animate-pulse bg-neutral-900/60 border border-white/5 rounded-2xl h-24 w-full" />
          </div>
        ) : feedItems.length === 0 ? (
          <div className="glass-card rounded-2xl p-8 text-center border border-white/5 space-y-3 max-w-xl mx-auto">
            <HiShieldCheck className="text-3xl text-neutral-500 mx-auto" />
            <p className="text-xs text-neutral-400 font-light">{t("impact.empty_feed")}</p>
            <Link
              href="/petitions"
              className="inline-flex items-center space-x-2 text-xs font-bold text-green-400 hover:text-green-300 transition-colors pt-2"
            >
              <span>{t("impact.sign_more")}</span>
              <HiArrowRight />
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {feedItems.map((item) => (
              <div
                key={item.event.id}
                className="glass-card p-6 rounded-2xl border border-white/5 hover:border-white/10 transition-all space-y-3 relative overflow-hidden"
              >
                {/* Event Type Accent */}
                <div className={`absolute top-0 left-0 bottom-0 w-1 ${
                  item.event.isOfficialResponse ? "bg-blue-500" : "bg-green-500"
                }`} />

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-semibold text-neutral-400">{t("impact.view_petition")} :</span>
                    <Link
                      href={`/petitions/${item.petitionId}`}
                      className="text-xs font-bold text-green-400 hover:underline truncate max-w-md"
                    >
                      {item.petitionTitle}
                    </Link>
                  </div>

                  <span className="text-[10px] text-neutral-500 font-mono">
                    {new Date(item.event.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center space-x-2">
                    {item.event.isOfficialResponse && (
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase">
                        Officiel
                      </span>
                    )}
                    <h4 className="text-sm font-bold text-white font-display">{item.event.title}</h4>
                  </div>

                  <p className="text-xs text-neutral-300 font-light leading-relaxed">
                    {item.event.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 text-[11px] text-neutral-400">
                  <span className="font-semibold text-neutral-400">Par {item.event.authorName}</span>
                  <Link
                    href={`/petitions/${item.petitionId}`}
                    className="inline-flex items-center space-x-1 text-green-400 font-bold hover:underline"
                  >
                    <span>Voir la pétition</span>
                    <HiArrowRight className="text-xs" />
                  </Link>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
