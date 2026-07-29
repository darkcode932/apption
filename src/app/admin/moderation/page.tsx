"use client";

import React, { useEffect, useState } from "react";
import { HiShieldCheck, HiCheck, HiTrash, HiSparkles, HiChatBubbleLeftRight, HiDocumentText, HiUser } from "react-icons/hi2";
import { petitionRepository } from "../../../infrastructure/ServiceLocator";
import { useT, useLanguage } from "../../../i18n/LanguageContext";

type FlaggedItem = {
  id: string;
  type: "comment" | "timeline" | "signature";
  petitionId: string;
  itemId: string;
  authorName: string;
  text: string;
  flagReason: string;
  explanation: string;
  createdAt: any;
};

export default function AdminModerationPage() {
  const t = useT();
  const { locale } = useLanguage();
  const [activeTab, setActiveTab] = useState<"comments" | "timeline" | "signatures">("comments");
  const [flaggedComments, setFlaggedComments] = useState<FlaggedItem[]>([]);
  const [flaggedEvents, setFlaggedEvents] = useState<FlaggedItem[]>([]);
  const [flaggedSignatures, setFlaggedSignatures] = useState<FlaggedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [actioningId, setActioningId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    fetchFlaggedItems();
  }, []);

  const fetchFlaggedItems = async () => {
    setLoading(true);
    try {
      const [comments, events, signatures] = await Promise.all([
        petitionRepository.getFlaggedComments(),
        petitionRepository.getFlaggedTimelineEvents(),
        petitionRepository.getFlaggedSignatures(),
      ]);
      setFlaggedComments(comments);
      setFlaggedEvents(events);
      setFlaggedSignatures(signatures);
    } catch (e) {
      console.error("Failed to load flagged items:", e);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleApprove = async (item: FlaggedItem) => {
    setActioningId(item.id);
    try {
      if (item.type === "comment") {
        await petitionRepository.approveComment(item.petitionId, item.itemId);
        setFlaggedComments((prev) => prev.filter((i) => i.id !== item.id));
      } else if (item.type === "timeline") {
        await petitionRepository.approveTimelineEvent(item.petitionId, item.itemId);
        setFlaggedEvents((prev) => prev.filter((i) => i.id !== item.id));
      } else if (item.type === "signature") {
        await petitionRepository.approveSignature(item.petitionId, item.itemId);
        setFlaggedSignatures((prev) => prev.filter((i) => i.id !== item.id));
      }
      showToast(t("moderation.toast_approved"));
    } catch (e) {
      console.error("Failed to approve item:", e);
      showToast("Erreur lors de l'approbation.", "error");
    } finally {
      setActioningId(null);
    }
  };

  const handleReject = async (item: FlaggedItem) => {
    setActioningId(item.id);
    try {
      if (item.type === "comment") {
        await petitionRepository.rejectComment(item.petitionId, item.itemId);
        setFlaggedComments((prev) => prev.filter((i) => i.id !== item.id));
      } else if (item.type === "timeline") {
        await petitionRepository.rejectTimelineEvent(item.petitionId, item.itemId);
        setFlaggedEvents((prev) => prev.filter((i) => i.id !== item.id));
      } else if (item.type === "signature") {
        await petitionRepository.rejectSignature(item.petitionId, item.itemId);
        setFlaggedSignatures((prev) => prev.filter((i) => i.id !== item.id));
      }
      showToast(t("moderation.toast_rejected"));
    } catch (e) {
      console.error("Failed to reject item:", e);
      showToast("Erreur lors de la suppression.", "error");
    } finally {
      setActioningId(null);
    }
  };

  const getReasonLabel = (reason: string) => {
    const reasonsMap: Record<string, { fr: string; en: string }> = {
      spam: { fr: "Spam / Robot", en: "Spam / Bot" },
      hate_speech: { fr: "Discours haineux / Violence", en: "Hate Speech / Violence" },
      harassment: { fr: "Harcèlement / Insultes", en: "Harassment / Insults" },
      commercial: { fr: "Publicité / Promotion", en: "Advertising / Commercial" },
      off_topic: { fr: "Hors-sujet", en: "Off-topic" },
      inappropriate: { fr: "Contenu inapproprié", en: "Inappropriate Content" },
    };
    const key = reason.toLowerCase();
    const mapped = reasonsMap[key] || { fr: reason, en: reason };
    return locale === "fr" ? mapped.fr : mapped.en;
  };

  const getReasonColor = (reason: string) => {
    switch (reason.toLowerCase()) {
      case "hate_speech":
      case "harassment":
        return "bg-red-500/10 text-red-400 border-red-500/20";
      case "spam":
      case "commercial":
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      default:
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";
    }
  };

  const currentList =
    activeTab === "comments"
      ? flaggedComments
      : activeTab === "timeline"
      ? flaggedEvents
      : flaggedSignatures;

  return (
    <div className="space-y-8 relative">
      
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-2xl border text-xs font-bold shadow-2xl flex items-center space-x-2 animate-slideIn ${
          toast.type === "success" 
            ? "bg-green-500/10 border-green-500/20 text-green-400"
            : "bg-red-500/10 border-red-500/20 text-red-400"
        }`}>
          <span>{toast.message}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <div className="flex items-center space-x-2.5 text-green-400">
            <HiShieldCheck className="text-3xl" />
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white font-display uppercase">
              {t("moderation.title")}
            </h1>
          </div>
          <p className="text-xs md:text-sm text-neutral-400 font-light mt-1.5 leading-relaxed">
            {t("moderation.subtitle")}
          </p>
        </div>

        {/* Refresh Stats */}
        <button
          onClick={fetchFlaggedItems}
          className="self-start md:self-auto px-4 py-2 border border-white/5 hover:border-green-500/30 text-neutral-350 hover:text-white rounded-full bg-neutral-950/40 text-xs font-bold transition-all cursor-pointer"
        >
          🔄 {locale === "fr" ? "Actualiser" : "Refresh"}
        </button>
      </div>

      {/* Tabs Menu */}
      <div className="flex border-b border-white/5 p-1 bg-neutral-950/40 rounded-2xl max-w-lg">
        {[
          { id: "comments", name: t("moderation.comments"), icon: HiChatBubbleLeftRight, count: flaggedComments.length },
          { id: "timeline", name: t("moderation.timeline"), icon: HiDocumentText, count: flaggedEvents.length },
          { id: "signatures", name: t("moderation.signatures"), icon: HiUser, count: flaggedSignatures.length },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 flex items-center justify-center space-x-2 py-3.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isActive
                  ? "bg-green-500 text-neutral-950 shadow-lg"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              <Icon className="text-sm flex-shrink-0" />
              <span>{tab.name}</span>
              {tab.count > 0 && (
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold ${
                  isActive ? "bg-neutral-950 text-green-400" : "bg-red-500 text-white"
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Loading state */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500" />
          <span className="text-xs text-neutral-400 font-medium">
            {locale === "fr" ? "Chargement des éléments..." : "Loading flagged items..."}
          </span>
        </div>
      ) : currentList.length === 0 ? (
        /* Empty State */
        <div className="glass-card rounded-3xl p-12 text-center border border-white/5 max-w-2xl mx-auto space-y-4">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-green-500/10 text-green-400">
            <HiShieldCheck className="text-3xl" />
          </div>
          <h3 className="text-lg font-bold text-white">
            {t("moderation.empty")}
          </h3>
          <p className="text-xs text-neutral-400 font-light max-w-md mx-auto leading-relaxed">
            {locale === "fr" 
              ? "Toutes les signatures, commentaires et publications récentes sont jugés conformes et propres par l'intelligence artificielle."
              : "All signatures, comments, and timeline posts are evaluated clean and compliant by our artificial intelligence."}
          </p>
        </div>
      ) : (
        /* Content List */
        <div className="grid gap-6">
          {currentList.map((item) => (
            <div
              key={item.id}
              className="glass-card rounded-3xl p-6 md:p-8 border border-white/5 hover:border-white/10 transition-all flex flex-col md:flex-row md:items-start justify-between gap-6 relative overflow-hidden group"
            >
              {/* Flag Badge Accent */}
              <div className="absolute top-0 left-0 bottom-0 w-1 bg-red-500" />

              <div className="space-y-4 flex-1">
                {/* Meta */}
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center space-x-2">
                    <div className="h-7 w-7 rounded-full bg-neutral-900 flex items-center justify-center text-[10px] text-green-400 font-extrabold border border-white/5 uppercase">
                      {item.authorName.charAt(0)}
                    </div>
                    <span className="text-xs font-extrabold text-white">{item.authorName}</span>
                  </div>

                  <span className="text-neutral-600 text-xs">•</span>

                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${getReasonColor(item.flagReason)}`}>
                    {getReasonLabel(item.flagReason)}
                  </span>
                </div>

                {/* Text Content */}
                <div className="bg-neutral-950/20 p-4 rounded-2xl border border-white/5">
                  <p className="text-xs md:text-sm text-neutral-300 leading-relaxed italic">
                    &quot;{item.text}&quot;
                  </p>
                </div>

                {/* AI Diagnostic Explanation */}
                <div className="bg-green-500/5 p-4 rounded-2xl border border-green-500/10 space-y-2">
                  <div className="flex items-center space-x-1.5 text-green-400 text-xs font-bold">
                    <HiSparkles className="text-sm" />
                    <span>{t("moderation.explanation")}</span>
                  </div>
                  <p className="text-[11px] text-neutral-400 leading-relaxed font-light pl-5">
                    {item.explanation}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex md:flex-col gap-3 justify-end md:justify-start pt-2 md:pt-0">
                <button
                  onClick={() => handleApprove(item)}
                  disabled={actioningId !== null}
                  className="flex-1 md:flex-none flex items-center justify-center space-x-2 px-5 py-3 bg-green-500 text-neutral-950 hover:bg-green-600 font-bold rounded-2xl text-xs transition-all shadow-md cursor-pointer disabled:opacity-50"
                >
                  <HiCheck className="text-sm flex-shrink-0" />
                  <span>{t("moderation.approve")}</span>
                </button>

                <button
                  onClick={() => handleReject(item)}
                  disabled={actioningId !== null}
                  className="flex-1 md:flex-none flex items-center justify-center space-x-2 px-5 py-3 bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white font-bold rounded-2xl text-xs transition-all cursor-pointer disabled:opacity-50"
                >
                  <HiTrash className="text-sm flex-shrink-0" />
                  <span>{t("moderation.reject")}</span>
                </button>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}
