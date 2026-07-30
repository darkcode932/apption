"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  HiUser,
  HiCheckCircle,
  HiShare,
  HiArrowLeft,
  HiExclamationCircle,
  HiChatBubbleLeftRight,
  HiSparkles,
  HiCheckBadge,
  HiTrophy,
  HiEnvelope,
  HiMapPin,
  HiFire,
  HiPaperAirplane,
  HiLink,
} from "react-icons/hi2";
import { FaTwitter, FaFacebook, FaWhatsapp } from "react-icons/fa";
import { useAuth } from "../../../contexts/AuthContext";
import {
  signPetitionUseCase,
  petitionRepository,
  addCommentUseCase,
  addTimelineEventUseCase,
  declareVictoryUseCase,
} from "../../../../infrastructure/ServiceLocator";
import { Petition } from "../../../../domain/entities/Petition";
import { Comment } from "../../../../domain/entities/Comment";
import { TimelineEvent } from "../../../../domain/entities/TimelineEvent";
import { Signature } from "../../../../domain/entities/Signature";
import ButtonClick from "../../../components/ButtonClick";
import { useLanguage, useT } from "../../../../i18n/LanguageContext";

export default function PetitionDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const t = useT();
  const { locale } = useLanguage();
  
  const id = params.id as string;

  const [petition, setPetition] = useState<Petition | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [signing, setSigning] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [signError, setSignError] = useState<string | null>(null);
  const [viewIncremented, setViewIncremented] = useState(false);
  
  // Tab State
  const [activeLeftTab, setActiveLeftTab] = useState<"cause" | "discussion" | "timeline" | "signatures">(
    "cause"
  );
  const [signatures, setSignatures] = useState<Signature[]>([]);
  const [showSignModal, setShowSignModal] = useState(false);
  const [signReason, setSignReason] = useState("");

  // Comment states
  const [commentText, setCommentText] = useState("");
  const [commenting, setCommenting] = useState(false);
  const [commentError, setCommentError] = useState<string | null>(null);

  // Timeline Event Form states
  const [eventTitle, setEventTitle] = useState("");
  const [eventDesc, setEventDesc] = useState("");
  const [eventType, setEventType] = useState<"milestone" | "official_response">("milestone");
  const [eventPosting, setEventPosting] = useState(false);
  const [eventError, setEventError] = useState<string | null>(null);
  
  // Victory state
  const [declaringVictory, setDeclaringVictory] = useState(false);

  // Real-time listener for petition updates
  useEffect(() => {
    if (!id) return;

    const unsubscribe = petitionRepository.onPetitionSnapshot(id, (data) => {
      if (data) {
        setPetition(data);
      } else {
        setError("Pétition introuvable.");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [id]);

  // Real-time listener for comments
  useEffect(() => {
    if (!id) return;

    const unsubscribe = petitionRepository.onCommentsSnapshot(id, (data) => {
      setComments(data);
    });

    return () => unsubscribe();
  }, [id]);

  // Real-time listener for timeline events
  useEffect(() => {
    if (!id) return;

    const unsubscribe = petitionRepository.onTimelineSnapshot(id, (data) => {
      setTimelineEvents(data);
    });

    return () => unsubscribe();
  }, [id]);

  // Real-time listener for signatures
  useEffect(() => {
    if (!id) return;

    const unsubscribe = petitionRepository.onSignaturesSnapshot(id, (data) => {
      setSignatures(data);
    });

    return () => unsubscribe();
  }, [id]);

  // Increment views once per mount
  useEffect(() => {
    if (id && !viewIncremented) {
      petitionRepository.incrementViews(id).catch(console.error);
      setViewIncremented(true);
    }
  }, [id, viewIncremented]);

  const hasSigned = user && petition?.signatureUserIds?.includes(user.id);
  const isOwner = user && petition && user.id === petition.createdBy;
  const isVictory = petition?.status === "victory";

  const nextGoal = Math.max(100, Math.ceil((petition?.signaturesCount || 1) / 100) * 100);
  const progressPercent = Math.min(100, Math.round(((petition?.signaturesCount || 1) / nextGoal) * 100));

  const handleSignConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      router.push("/login");
      return;
    }
    if (!petition) return;

    setSigning(true);
    setSignError(null);

    try {
      await signPetitionUseCase.execute(
        petition.id,
        user.id,
        user.firstname ? `${user.firstname} ${user.lastname}` : user.username || user.email,
        signReason,
        user.city,
        user.country
      );
      setShowSignModal(false);
      setSignReason("");
    } catch (err: any) {
      setSignError(err.message || "Erreur lors de la signature.");
    } finally {
      setSigning(false);
    }
  };

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      petitionRepository.incrementShares(id).catch(console.error);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSocialShare = (platform: "twitter" | "facebook" | "whatsapp" | "email") => {
    if (typeof window === "undefined" || !petition) return;
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(`Soutenez la pétition : "${petition.title}" sur Apption !`);

    let shareUrl = "";
    if (platform === "twitter") shareUrl = `https://twitter.com/intent/tweet?text=${title}&url=${url}`;
    if (platform === "facebook") shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
    if (platform === "whatsapp") shareUrl = `https://api.whatsapp.com/send?text=${title}%20${url}`;
    if (platform === "email") shareUrl = `mailto:?subject=${title}&body=${url}`;

    if (shareUrl) {
      window.open(shareUrl, "_blank", "noopener,noreferrer");
      petitionRepository.incrementShares(id).catch(console.error);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      router.push("/login");
      return;
    }
    if (!commentText.trim()) return;

    setCommenting(true);
    setCommentError(null);

    try {
      await addCommentUseCase.execute(
        id,
        user.id,
        user.firstname ? `${user.firstname} ${user.lastname}` : user.username || user.email,
        commentText
      );
      setCommentText("");
    } catch (err: any) {
      setCommentError(err.message || "Erreur lors de l'envoi du commentaire.");
    } finally {
      setCommenting(false);
    }
  };

  const handleAddTimelineEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!eventTitle.trim() || !eventDesc.trim()) return;

    setEventPosting(true);
    setEventError(null);

    try {
      await addTimelineEventUseCase.execute(id, {
        petitionId: id,
        authorId: user.id,
        authorName: user.firstname ? `${user.firstname} ${user.lastname}` : user.username || user.email,
        title: eventTitle,
        description: eventDesc,
        type: eventType,
        isOfficialResponse: eventType === "official_response",
      });
      setEventTitle("");
      setEventDesc("");
    } catch (err: any) {
      setEventError(err.message || "Erreur lors de l'ajout de l'actualité.");
    } finally {
      setEventPosting(false);
    }
  };

  const handleDeclareVictory = async () => {
    if (!confirm("Félicitations ! Voulez-vous vraiment déclarer cette pétition comme VICTOIRE ?")) return;

    setDeclaringVictory(true);
    try {
      await declareVictoryUseCase.execute(id);
    } catch (err: any) {
      alert(err.message || "Erreur lors de la déclaration de victoire.");
    } finally {
      setDeclaringVictory(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 w-full flex items-center justify-center min-h-[60vh]">
        <div className="animate-pulse flex flex-col items-center space-y-4">
          <div className="w-12 h-12 rounded-full border-4 border-green-500 border-t-transparent animate-spin" />
          <p className="text-xs text-neutral-400 font-mono">Chargement de la pétition...</p>
        </div>
      </div>
    );
  }

  if (error || !petition) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 w-full flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
        <HiExclamationCircle className="text-5xl text-red-500" />
        <h2 className="text-xl font-extrabold text-white">{error || "Pétition introuvable"}</h2>
        <ButtonClick text="Retour aux pétitions" onClick={() => router.push("/petitions")} />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8 relative overflow-hidden">
      
      {/* Back button */}
      <button
        onClick={() => router.back()}
        className="inline-flex items-center space-x-2 text-xs font-semibold text-neutral-400 hover:text-white transition-colors cursor-pointer"
      >
        <HiArrowLeft className="text-sm" />
        <span>Retour</span>
      </button>

      {/* Dribbble-Grade Hero Header */}
      <div className="relative glass-card p-6 sm:p-10 rounded-3xl border border-white/10 overflow-hidden shadow-2xl space-y-6">
        
        {/* Background Ambient Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-green-500/10 rounded-full blur-[120px] pointer-events-none" />

        {/* Tags Bar */}
        <div className="flex flex-wrap items-center gap-3 relative z-10">
          <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
            isVictory
              ? "bg-amber-500 text-neutral-950 shadow-lg shadow-amber-500/20"
              : "bg-green-500 text-neutral-950 shadow-lg shadow-green-500/20"
          }`}>
            {isVictory ? "🏆 Victoire Remportée !" : "🔥 Mobilisation Active"}
          </span>

          <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-neutral-300">
            🏷️ {petition.category}
          </span>

          <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-neutral-300">
            🌍 Échelle : {petition.scale}
          </span>

          {petition.city && (
            <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-bold text-cyan-400 flex items-center space-x-1">
              <HiMapPin className="text-xs" />
              <span>{petition.city}, {petition.country}</span>
            </span>
          )}
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white font-display tracking-tight leading-tight relative z-10">
          {petition.title}
        </h1>

        {/* Creator Profile Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/5 relative z-10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-green-500 to-emerald-600 flex items-center justify-center font-bold text-white shadow-md">
              {petition.creatorName ? petition.creatorName.charAt(0).toUpperCase() : "A"}
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-sm font-bold text-white">{petition.creatorName || "Auteur anonyme"}</span>
                <HiCheckBadge className="text-green-400 text-base" />
              </div>
              <span className="text-xs text-neutral-400 font-light">Initiateur de la cause sur Apption</span>
            </div>
          </div>

          <div className="flex items-center space-x-4 text-xs text-neutral-400 font-mono">
            <span>👁️ {petition.views || 0} vues</span>
            <span>📢 {petition.shares || 0} partages</span>
          </div>
        </div>

      </div>

      {/* Main Grid: Left Content (2 cols) & Right Action Card (1 col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Column: Image, Tabs & Content */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Main Hero Media Container */}
          <div className="glass-card rounded-3xl overflow-hidden border border-white/10 h-[340px] sm:h-[420px] relative shadow-2xl">
            <img
              src={petition.imageUrl || "/assets/images/libération.jpg"}
              alt={petition.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent opacity-60" />
          </div>

          {/* Navigation Tabs Bar */}
          <div className="flex items-center space-x-2 border-b border-white/10 pb-3 overflow-x-auto scrollbar-hidden">
            {[
              { id: "cause", label: "📖 La Cause", count: null },
              { id: "timeline", label: "📢 Journal de Bord", count: timelineEvents.length },
              { id: "discussion", label: "💬 Commentaires", count: comments.length },
              { id: "signatures", label: "✍️ Signataires", count: signatures.length },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveLeftTab(tab.id as any)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap ${
                  activeLeftTab === tab.id
                    ? "bg-green-500 text-neutral-950 shadow-lg shadow-green-500/20"
                    : "text-neutral-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {tab.label} {tab.count !== null && `(${tab.count})`}
              </button>
            ))}
          </div>

          {/* TAB 1: LA CAUSE */}
          {activeLeftTab === "cause" && (
            <div className="glass-card p-6 sm:p-8 rounded-3xl border border-white/5 space-y-6 animate-fadeIn">
              <h3 className="text-lg font-extrabold text-white font-display flex items-center space-x-2">
                <span>Description & Objectifs</span>
              </h3>
              <div className="text-sm text-neutral-300 font-light leading-relaxed whitespace-pre-wrap">
                {petition.description}
              </div>
            </div>
          )}

          {/* TAB 2: JOURNAL DE BORD (TIMELINE) */}
          {activeLeftTab === "timeline" && (
            <div className="space-y-6 animate-fadeIn">
              {isOwner && (
                <form onSubmit={handleAddTimelineEvent} className="glass-card p-6 rounded-3xl border border-green-500/20 space-y-4">
                  <h4 className="text-sm font-bold text-white">Publier une actualité pour vos signataires</h4>
                  <input
                    type="text"
                    value={eventTitle}
                    onChange={(e) => setEventTitle(e.target.value)}
                    placeholder="Titre de la mise à jour..."
                    className="w-full bg-neutral-950 border border-white/10 rounded-xl p-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-green-500"
                  />
                  <textarea
                    value={eventDesc}
                    onChange={(e) => setEventDesc(e.target.value)}
                    rows={3}
                    placeholder="Contenu du communiqué..."
                    className="w-full bg-neutral-950 border border-white/10 rounded-xl p-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-green-500"
                  />
                  <button
                    type="submit"
                    disabled={eventPosting}
                    className="px-5 py-2.5 rounded-xl bg-green-500 text-neutral-950 font-extrabold text-xs hover:bg-green-400 cursor-pointer"
                  >
                    {eventPosting ? "Publication..." : "Publier l'actualité"}
                  </button>
                </form>
              )}

              {timelineEvents.length === 0 ? (
                <div className="glass-card p-8 rounded-3xl text-center text-neutral-500 text-xs">
                  Aucune actualité publiée pour le moment.
                </div>
              ) : (
                timelineEvents.map((evt) => (
                  <div key={evt.id} className="glass-card p-6 rounded-3xl border border-white/5 space-y-2">
                    <div className="flex items-center justify-between text-xs text-neutral-400">
                      <span className="font-bold text-green-400">📢 Mise à jour officielle</span>
                      <span className="font-mono">{new Date(evt.createdAt).toLocaleDateString("fr-FR")}</span>
                    </div>
                    <h4 className="text-sm font-bold text-white">{evt.title}</h4>
                    <p className="text-xs text-neutral-300 font-light leading-relaxed whitespace-pre-wrap">{evt.description}</p>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 3: DISCUSSION & COMMENTAIRES */}
          {activeLeftTab === "discussion" && (
            <div className="space-y-6 animate-fadeIn">
              <form onSubmit={handleAddComment} className="glass-card p-6 rounded-3xl border border-white/5 space-y-4">
                <h4 className="text-sm font-bold text-white">Participer au débat citoyen</h4>
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  rows={3}
                  placeholder="Pourquoi cette cause vous touche-t-elle ?"
                  className="w-full bg-neutral-950 border border-white/10 rounded-2xl p-3.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-green-500"
                />
                <button
                  type="submit"
                  disabled={commenting || !commentText.trim()}
                  className="px-5 py-2.5 rounded-xl bg-green-500 text-neutral-950 font-extrabold text-xs hover:bg-green-400 disabled:opacity-40 cursor-pointer"
                >
                  {commenting ? "Vérification IA..." : "Publier mon commentaire"}
                </button>
              </form>

              {comments.length === 0 ? (
                <div className="glass-card p-8 rounded-3xl text-center text-neutral-500 text-xs">
                  Soyez le premier à commenter cette pétition !
                </div>
              ) : (
                comments.map((comment) => (
                  <div key={comment.id} className="glass-card p-5 rounded-2xl border border-white/5 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">{comment.userName}</span>
                      <span className="text-[10px] text-neutral-500 font-mono">{new Date(comment.createdAt).toLocaleDateString("fr-FR")}</span>
                    </div>
                    <p className="text-xs text-neutral-300 font-light leading-relaxed">{comment.text}</p>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 4: SIGNATAIRES */}
          {activeLeftTab === "signatures" && (
            <div className="glass-card p-6 rounded-3xl border border-white/5 space-y-4 animate-fadeIn">
              <h4 className="text-sm font-bold text-white">Derniers signataires engager ({signatures.length})</h4>
              <div className="space-y-3 max-h-96 overflow-y-auto pr-2 scrollbar-hidden">
                {signatures.map((sig) => (
                  <div key={sig.id} className="bg-neutral-950/60 p-3.5 rounded-2xl border border-white/5 flex items-center justify-between text-xs">
                    <div className="space-y-0.5">
                      <span className="font-bold text-white">{sig.userName}</span>
                      {sig.reason && <p className="text-[11px] text-neutral-400 italic">« {sig.reason} »</p>}
                    </div>
                    <span className="text-[10px] text-neutral-500 font-mono">{new Date(sig.signedAt).toLocaleDateString("fr-FR")}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Right Column: Sticky Action Mobilization Sidebar */}
        <div className="lg:col-span-1 space-y-6 sticky top-24">
          
          {/* Progress & Signature Gauge Card */}
          <div className="glass-card p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl space-y-6 relative overflow-hidden">
            
            {/* Signature Counter Header */}
            <div className="space-y-2 text-center">
              <div className="text-4xl font-extrabold text-white font-display">
                {petition.signaturesCount || 1}
              </div>
              <p className="text-xs text-neutral-400 font-medium">
                signatures récoltées sur l&apos;objectif de <strong className="text-white">{nextGoal}</strong>
              </p>

              {/* Progress Bar */}
              <div className="w-full h-3 bg-neutral-950 rounded-full overflow-hidden border border-white/10 p-0.5 mt-2">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    isVictory
                      ? "bg-gradient-to-r from-amber-500 to-yellow-400"
                      : "bg-gradient-to-r from-green-500 to-emerald-400"
                  }`}
                  style={{ width: `${Math.max(5, progressPercent)}%` }}
                />
              </div>
              <span className="text-[11px] font-mono text-green-400 font-bold block">{progressPercent}% de l&apos;objectif atteint</span>
            </div>

            {/* Signature Button */}
            {hasSigned ? (
              <div className="w-full py-3.5 px-4 rounded-2xl bg-green-500/10 border border-green-500/30 text-green-400 text-xs font-extrabold text-center flex items-center justify-center space-x-2">
                <HiCheckCircle className="text-lg" />
                <span>Vous avez signé cette pétition !</span>
              </div>
            ) : (
              <button
                onClick={() => {
                  if (!user) {
                    router.push("/login");
                  } else {
                    setShowSignModal(true);
                  }
                }}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-neutral-950 font-black text-sm uppercase tracking-wider shadow-lg shadow-green-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
              >
                ✍️ Signer cette pétition
              </button>
            )}

            {/* Owner Action: Declare Victory */}
            {isOwner && !isVictory && (
              <button
                onClick={handleDeclareVictory}
                disabled={declaringVictory}
                className="w-full py-3 px-4 rounded-2xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-400 font-extrabold text-xs transition-all cursor-pointer flex items-center justify-center space-x-2"
              >
                <HiTrophy className="text-base" />
                <span>{declaringVictory ? "Déclaration..." : "🏆 Déclarer la Victoire !"}</span>
              </button>
            )}

            {/* Share & Viral Growth Kit */}
            <div className="pt-4 border-t border-white/5 space-y-3">
              <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block">Partager la cause</span>
              
              {/* Copyable Link Bar */}
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  readOnly
                  value={typeof window !== "undefined" ? window.location.href : ""}
                  className="flex-1 bg-neutral-950 border border-white/10 rounded-xl px-3 py-2 text-[11px] text-neutral-400 font-mono focus:outline-none"
                />
                <button
                  onClick={handleCopyLink}
                  className="px-3 py-2 rounded-xl bg-neutral-900 hover:bg-white/10 border border-white/10 text-white text-xs font-bold transition-all cursor-pointer"
                >
                  {copied ? "Copié !" : "Copier"}
                </button>
              </div>

              {/* Social Quick Share Buttons */}
              <div className="flex items-center justify-between gap-2 pt-1">
                <button
                  onClick={() => handleSocialShare("twitter")}
                  className="flex-1 py-2 rounded-xl bg-neutral-950 hover:bg-white/5 border border-white/5 text-neutral-300 hover:text-cyan-400 flex items-center justify-center transition-all cursor-pointer"
                  title="Partager sur X / Twitter"
                >
                  <FaTwitter className="text-sm" />
                </button>
                <button
                  onClick={() => handleSocialShare("facebook")}
                  className="flex-1 py-2 rounded-xl bg-neutral-950 hover:bg-white/5 border border-white/5 text-neutral-300 hover:text-blue-400 flex items-center justify-center transition-all cursor-pointer"
                  title="Partager sur Facebook"
                >
                  <FaFacebook className="text-sm" />
                </button>
                <button
                  onClick={() => handleSocialShare("whatsapp")}
                  className="flex-1 py-2 rounded-xl bg-neutral-950 hover:bg-white/5 border border-white/5 text-neutral-300 hover:text-green-400 flex items-center justify-center transition-all cursor-pointer"
                  title="Partager sur WhatsApp"
                >
                  <FaWhatsapp className="text-sm" />
                </button>
                <button
                  onClick={() => handleSocialShare("email")}
                  className="flex-1 py-2 rounded-xl bg-neutral-950 hover:bg-white/5 border border-white/5 text-neutral-300 hover:text-amber-400 flex items-center justify-center transition-all cursor-pointer"
                  title="Envoyer par Email"
                >
                  <HiEnvelope className="text-sm" />
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Signature Modal */}
      {showSignModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-md animate-fadeIn">
          <div className="glass-card p-6 sm:p-8 rounded-3xl max-w-md w-full border border-white/10 space-y-6">
            <h3 className="text-lg font-extrabold text-white">Signer la pétition</h3>
            <form onSubmit={handleSignConfirm} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-neutral-400 block mb-1">
                  Pourquoi signez-vous ? (Optionnel)
                </label>
                <textarea
                  value={signReason}
                  onChange={(e) => setSignReason(e.target.value)}
                  rows={3}
                  placeholder="Partagez le motif de votre engagement..."
                  className="w-full bg-neutral-950 border border-white/10 rounded-xl p-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-green-500"
                />
              </div>

              {signError && <p className="text-xs text-red-400">{signError}</p>}

              <div className="flex items-center space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSignModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-neutral-900 border border-white/10 text-neutral-400 text-xs font-bold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={signing}
                  className="flex-1 py-2.5 rounded-xl bg-green-500 text-neutral-950 text-xs font-extrabold"
                >
                  {signing ? "Signature..." : "Confirmer ma signature"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
