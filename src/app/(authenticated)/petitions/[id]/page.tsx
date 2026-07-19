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
} from "react-icons/hi2";
import { useAuth } from "../../../contexts/AuthContext";
import {
  signPetitionUseCase,
  petitionRepository,
  addCommentUseCase,
  addTimelineEventUseCase,
  declareVictoryUseCase,
} from "../../../../infrastructure/ServiceLocator";
import { Petition } from "../../../../domain/entities/Petition";
import { Input } from "../../../components/Input";
import { Comment } from "../../../../domain/entities/Comment";
import { TimelineEvent } from "../../../../domain/entities/TimelineEvent";
import ButtonClick from "../../../components/ButtonClick";

export default function PetitionDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  
  const id = params.id as string;

  const [petition, setPetition] = useState<Petition | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [signing, setSigning] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [signError, setSignError] = useState<string | null>(null);
  const [viewIncremented, setViewIncremented] = useState(false);
  
  // Tab State
  const [activeLeftTab, setActiveLeftTab] = useState<"discussion" | "timeline">("discussion");

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

  // Increment views once when petition first loads
  useEffect(() => {
    if (petition && !viewIncremented) {
      petitionRepository.incrementViews(id).catch(console.error);
      setViewIncremented(true);
    }
  }, [petition, viewIncremented, id]);

  const handleSign = async () => {
    if (!user || !petition) return;
    setSigning(true);
    setSignError(null);
    try {
      const displayName = user.username || `${user.firstname} ${user.lastname}`;
      await signPetitionUseCase.execute(petition.id, user.id, displayName);
    } catch (err: any) {
      console.error("Signing error:", err);
      setSignError(err?.message || "Une erreur est survenue lors de la signature.");
    } finally {
      setSigning(false);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !commentText.trim()) return;

    setCommenting(true);
    setCommentError(null);
    try {
      const displayName = user.username || `${user.firstname} ${user.lastname}`;
      await addCommentUseCase.execute(id, user.id, displayName, commentText.trim());
      setCommentText("");
    } catch (err: any) {
      console.error("Comment error:", err);
      setCommentError("Une erreur est survenue lors de la publication du commentaire.");
    } finally {
      setCommenting(false);
    }
  };

  const handleAddTimelineEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !eventTitle.trim() || !eventDesc.trim() || !petition) return;

    setEventPosting(true);
    setEventError(null);

    const isCreator = user.id === petition.createdBy;
    const isVerified = !!user.isVerified;

    // Set correct event type based on user profile
    const finalType = isCreator && eventType === "milestone" 
      ? "milestone" 
      : isVerified 
      ? "official_response" 
      : "milestone";

    try {
      await addTimelineEventUseCase.execute(id, {
        petitionId: id,
        authorId: user.id,
        authorName: `${user.firstname} ${user.lastname}`,
        authorAvatarUrl: user.avatarUrl || "",
        officialTitle: user.officialTitle || "",
        isOfficialResponse: isVerified,
        title: eventTitle.trim(),
        description: eventDesc.trim(),
        type: finalType,
      });

      setEventTitle("");
      setEventDesc("");
    } catch (err: any) {
      console.error("Timeline event error:", err);
      setEventError("Une erreur est survenue lors de la publication de la mise à jour.");
    } finally {
      setEventPosting(false);
    }
  };

  const handleDeclareVictory = async () => {
    if (!user || !petition || user.id !== petition.createdBy) return;

    if (!confirm("Voulez-vous vraiment déclarer cette pétition comme remportée ?")) {
      return;
    }

    setDeclaringVictory(true);
    try {
      // 1. Declare victory in petition document
      await declareVictoryUseCase.execute(id);

      // 2. Publish automatic Victory Milestone event on timeline
      await addTimelineEventUseCase.execute(id, {
        petitionId: id,
        authorId: user.id,
        authorName: `${user.firstname} ${user.lastname}`,
        authorAvatarUrl: user.avatarUrl || "",
        officialTitle: "Créateur de la pétition",
        isOfficialResponse: false,
        title: "🏆 Victoire Citoyenne !",
        description: "Nous avons atteint notre but ! Merci infiniment à tous les signataires et supporters pour votre dévouement exceptionnel.",
        type: "victory",
      });

      setActiveLeftTab("timeline");
    } catch (err: any) {
      console.error("Victory declaration error:", err);
      alert("Erreur lors de la déclaration de victoire.");
    } finally {
      setDeclaringVictory(false);
    }
  };

  const handleShare = async () => {
    if (!petition) return;
    try {
      const shareUrl = window.location.href;
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      
      await petitionRepository.incrementShares(petition.id);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-128px)] bg-[#0b0b0f] text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-400"></div>
        <p className="mt-4 text-neutral-450 text-sm">Chargement de la pétition...</p>
      </div>
    );
  }

  if (error || !petition) {
    return (
      <div className="max-w-xl mx-auto w-full px-4 py-16 text-center flex flex-col items-center justify-center min-h-[calc(100vh-128px)]">
        <p className="text-red-400 font-bold text-xl">{error || "Pétition introuvable"}</p>
        <button
          onClick={() => router.push("/home")}
          className="mt-6 flex items-center space-x-2 text-neutral-350 hover:text-white bg-neutral-900 border border-white/5 px-6 py-2.5 rounded-full transition-all text-sm font-semibold"
        >
          <HiArrowLeft />
          <span>Retour à l&apos;accueil</span>
        </button>
      </div>
    );
  }

  const hasSigned = user ? petition.signatureUserIds.includes(user.id) : false;
  const signatureGoal = 100;
  const percent = Math.min((petition.signaturesCount / signatureGoal) * 100, 100);
  
  const isCreator = user ? user.id === petition.createdBy : false;
  const isVerifiedOfficial = user ? !!user.isVerified : false;
  const isVictory = petition.status === "victory";

  return (
    <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 flex flex-col space-y-8 relative overflow-hidden">
      
      {/* Background decorations */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-green-500/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Victory Celebration Header Banner */}
      {isVictory && (
        <div className="relative overflow-hidden rounded-3xl p-5 bg-gradient-to-r from-yellow-600/20 via-amber-500/20 to-yellow-600/20 border border-yellow-500/30 flex flex-col sm:flex-row items-center sm:justify-between gap-4 z-10 animate-pulse">
          <div className="flex items-center space-x-3.5 text-center sm:text-left">
            <div className="h-12 w-12 rounded-2xl bg-yellow-500 flex items-center justify-center text-neutral-950 text-2xl shadow-lg">
              <HiTrophy />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-lg font-display">Victoire Citoyenne !</h3>
              <p className="text-xs text-amber-200/80 font-light mt-0.5">Cette pétition a atteint son objectif et a été remportée avec succès.</p>
            </div>
          </div>
          <span className="px-4 py-1.5 bg-yellow-500 text-neutral-950 font-extrabold rounded-full text-xs uppercase tracking-wider">
            Remportée
          </span>
        </div>
      )}

      {/* Back button */}
      <button
        onClick={() => router.back()}
        className="self-start flex items-center space-x-2 text-neutral-450 hover:text-white transition-colors text-sm font-semibold"
      >
        <HiArrowLeft />
        <span>Retour</span>
      </button>

      {/* Main Container */}
      <div className="flex flex-col lg:flex-row gap-10 items-start relative z-10">
        
        {/* Left Side: Details, Discussion, & Timeline */}
        <div className="w-full lg:w-2/3 flex flex-col space-y-8">
          
          {/* Main petition body */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="self-start px-3 py-1 bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-bold rounded-full uppercase tracking-wider">
                {petition.category} • {petition.scale}
              </span>

              {isCreator && !isVictory && (
                <button
                  onClick={handleDeclareVictory}
                  disabled={declaringVictory}
                  className="flex items-center space-x-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-neutral-950 font-extrabold text-xs rounded-xl shadow-lg shadow-yellow-500/10 transition-all cursor-pointer disabled:opacity-50"
                >
                  <HiTrophy className="text-sm" />
                  <span>{declaringVictory ? "En cours..." : "Déclarer Victoire 🏆"}</span>
                </button>
              )}
            </div>

            <h1 className="font-extrabold text-3xl sm:text-4xl md:text-5xl text-white tracking-tight leading-tight font-display">
              {petition.title}
            </h1>

            <div className="rounded-3xl overflow-hidden border border-white/5 shadow-2xl bg-neutral-950/20 max-h-[450px]">
              <img
                src={petition.imageUrl || "/assets/images/libération.jpg"}
                alt="Illustration de la pétition"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Creator details */}
            <div className="flex items-center space-x-3 bg-neutral-900/50 p-4 rounded-2xl border border-white/5 shadow-md">
              <div className="h-10 w-10 rounded-full bg-green-950/30 flex items-center justify-center text-green-400 font-bold border border-green-500/20 shadow-inner">
                <HiUser className="text-xl" />
              </div>
              <div>
                <p className="font-bold text-sm text-white font-display">
                  {petition.creatorName}
                </p>
                <p className="text-[10px] text-neutral-450 font-light mt-0.5">
                  A lancé cette pétition le {petition.createdAt.toLocaleDateString("fr-FR")}
                </p>
              </div>
            </div>

            {/* Description */}
            <div className="flex flex-col space-y-4 glass-card p-6 sm:p-8 rounded-3xl border border-white/5">
              <div className="flex items-center space-x-2">
                <div className="h-5 w-1 bg-green-500 rounded-full" />
                <h3 className="font-extrabold text-lg text-white font-display">
                  Description de la pétition
                </h3>
              </div>
              <p className="text-neutral-350 font-light text-sm sm:text-base leading-relaxed whitespace-pre-wrap">
                {petition.description}
              </p>
            </div>
          </div>

          {/* Discussion & Timeline Tab Header */}
          <div className="border-b border-white/5 flex space-x-8 text-sm font-semibold pt-4">
            <button
              onClick={() => setActiveLeftTab("discussion")}
              className={`pb-4 border-b-2 transition-all duration-200 uppercase tracking-wider text-xs font-display ${
                activeLeftTab === "discussion"
                  ? "border-green-500 text-green-400 font-extrabold"
                  : "border-transparent text-neutral-500 hover:text-neutral-350"
              }`}
            >
              Discussion ({comments.length})
            </button>
            <button
              onClick={() => setActiveLeftTab("timeline")}
              className={`pb-4 border-b-2 transition-all duration-200 uppercase tracking-wider text-xs font-display ${
                activeLeftTab === "timeline"
                  ? "border-green-500 text-green-400 font-extrabold"
                  : "border-transparent text-neutral-500 hover:text-neutral-350"
              }`}
            >
              Fil de Négociation ({timelineEvents.length})
            </button>
          </div>

          {/* TAB 1: Discussion Thread */}
          {activeLeftTab === "discussion" && (
            <div className="flex flex-col space-y-6 animate-fadeIn">
              {/* Comment Form */}
              {user ? (
                <form onSubmit={handleAddComment} className="glass-card p-4 rounded-2xl border border-white/5 space-y-3">
                  {commentError && (
                    <div className="p-3 rounded-xl border border-red-500/20 bg-red-950/20 text-red-400 text-xs">
                      {commentError}
                    </div>
                  )}
                  <textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Partagez votre avis ou expliquez pourquoi vous soutenez cette cause..."
                    rows={3}
                    className="block w-full px-4 py-3 rounded-xl border border-white/5 bg-neutral-950/30 text-white placeholder-neutral-500 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/10 text-sm resize-none transition-all"
                    required
                    disabled={commenting}
                  />
                  <div className="flex justify-end">
                    <ButtonClick
                      text={commenting ? "Publication..." : "Commenter"}
                      classButton="rounded-full bg-green-500 hover:bg-green-600 px-5 py-2 text-neutral-950 text-xs font-bold"
                      classArrow="hidden"
                      type="submit"
                      disabled={commenting || !commentText.trim()}
                    />
                  </div>
                </form>
              ) : (
                <p className="text-xs text-neutral-500 italic pl-1">
                  Vous devez être connecté pour participer à la discussion.
                </p>
              )}

              {/* Comments List */}
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="glass-card p-5 rounded-2xl border border-white/5 flex items-start space-x-3.5 animate-fadeIn">
                    <div className="h-8 w-8 rounded-full bg-neutral-900/60 flex items-center justify-center text-[10px] text-green-455 border border-white/5 font-bold uppercase flex-shrink-0">
                      {comment.userName.charAt(0)}
                    </div>
                    <div className="flex-grow space-y-1.5 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-bold text-white truncate font-display">
                          {comment.userName}
                        </p>
                        <p className="text-[10px] text-neutral-500">
                          {comment.createdAt.toLocaleDateString("fr-FR", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                      <p className="text-neutral-350 text-sm font-light leading-relaxed whitespace-pre-wrap">
                        {comment.text}
                      </p>
                    </div>
                  </div>
                ))}

                {comments.length === 0 && (
                  <div className="text-center py-10 glass-card rounded-2xl border border-white/5 text-neutral-500 text-xs italic">
                    Aucun commentaire pour l&apos;instant. Soyez le premier à donner votre avis !
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: Negotiation Public Timeline */}
          {activeLeftTab === "timeline" && (
            <div className="flex flex-col space-y-8 animate-fadeIn">
              
              {/* Event Publication Form (Creator OR Verified Accounts Only) */}
              {user && (isCreator || isVerifiedOfficial) && (
                <form onSubmit={handleAddTimelineEvent} className="glass-card p-5 sm:p-6 rounded-2xl border border-white/10 space-y-4">
                  <div className="flex items-center space-x-2 text-green-400 mb-1">
                    <HiSparkles className="text-lg" />
                    <h4 className="text-sm font-extrabold text-white font-display">
                      {isVerifiedOfficial ? "Publier une réponse officielle" : "Publier un nouveau développement"}
                    </h4>
                  </div>

                  {eventError && (
                    <div className="p-3 rounded-xl border border-red-500/20 bg-red-950/20 text-red-400 text-xs">
                      {eventError}
                    </div>
                  )}

                  <div className="space-y-3">
                    <Input
                      type="text"
                      placeholder="Titre de la mise à jour (ex: Lancement des travaux, Déclaration du Maire...)"
                      value={eventTitle}
                      onChange={(e) => setEventTitle(e.target.value)}
                      required
                      disabled={eventPosting}
                    />

                    <textarea
                      value={eventDesc}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setEventDesc(e.target.value)}
                      placeholder="Expliquez en détail les récents développements, accords, ou réponses apportées..."
                      rows={3}
                      className="block w-full px-4 py-3 rounded-xl border border-white/5 bg-neutral-950/30 text-white placeholder-neutral-500 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/10 text-sm resize-none transition-all"
                      required
                      disabled={eventPosting}
                    />
                  </div>

                  <div className="flex justify-between items-center">
                    {/* Event Type selector info */}
                    <div className="text-[10px] text-neutral-450 font-bold uppercase tracking-wider">
                      Publié en tant que :{" "}
                      <span className={isVerifiedOfficial ? "text-blue-400" : "text-green-400"}>
                        {isVerifiedOfficial ? `${user.officialTitle} (Officiel)` : "Créateur de la pétition"}
                      </span>
                    </div>

                    <ButtonClick
                      text={eventPosting ? "Publication..." : "Publier"}
                      classButton="rounded-full bg-green-500 hover:bg-green-600 px-6 py-2 text-neutral-950 text-xs font-bold"
                      classArrow="hidden"
                      type="submit"
                      disabled={eventPosting || !eventTitle.trim() || !eventDesc.trim()}
                    />
                  </div>
                </form>
              )}

              {/* Vertical Timeline Tree */}
              <div className="relative pl-6 space-y-8">
                {/* Center Line */}
                <div className="absolute left-[11px] top-2 bottom-2 w-[1px] bg-white/10" />

                {timelineEvents.map((event) => {
                  const isOfficial = event.isOfficialResponse;
                  const isVictoryEvent = event.type === "victory";

                  return (
                    <div key={event.id} className="relative flex flex-col space-y-2 animate-fadeIn">
                      
                      {/* Timeline Node Point */}
                      <div className={`absolute -left-[20px] top-1.5 h-4.5 w-4.5 rounded-full border-2 flex items-center justify-center ${
                        isVictoryEvent
                          ? "bg-yellow-500 border-yellow-500 text-[10px] text-neutral-950 scale-110"
                          : isOfficial
                          ? "bg-[#0b0b0f] border-blue-500"
                          : "bg-[#0b0b0f] border-green-500"
                      }`}>
                        {isVictoryEvent ? <HiTrophy className="text-[10px]" /> : <div className={`h-1.5 w-1.5 rounded-full ${isOfficial ? "bg-blue-500" : "bg-green-500"}`} />}
                      </div>

                      {/* Header info */}
                      <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] text-neutral-500 pl-2">
                        <div className="flex items-center space-x-2 font-semibold">
                          <span className="text-neutral-400">{event.authorName}</span>
                          {isOfficial && (
                            <span className="flex items-center text-blue-400 space-x-0.5 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded-full text-[9px]">
                              <HiCheckBadge className="text-xs" />
                              <span>{event.officialTitle || "Compte Officiel"}</span>
                            </span>
                          )}
                        </div>
                        <span className="font-light">
                          Le {event.createdAt.toLocaleDateString("fr-FR", {
                            day: "2-digit",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>

                      {/* Event Card */}
                      <div className={`p-5 rounded-2xl border transition-all duration-300 ${
                        isVictoryEvent
                          ? "bg-yellow-500/5 border-yellow-500/20 hover:border-yellow-500/30"
                          : isOfficial
                          ? "bg-blue-500/5 border-blue-500/20 hover:border-blue-500/30"
                          : "glass-card border-white/5 hover:border-white/10"
                      }`}>
                        <h4 className={`text-base font-extrabold font-display leading-tight mb-2 ${
                          isVictoryEvent ? "text-yellow-400" : isOfficial ? "text-blue-400" : "text-white"
                        }`}>
                          {event.title}
                        </h4>
                        <p className="text-neutral-350 text-xs sm:text-sm font-light leading-relaxed whitespace-pre-wrap">
                          {event.description}
                        </p>
                      </div>

                    </div>
                  );
                })}

                {timelineEvents.length === 0 && (
                  <div className="text-center py-10 glass-card rounded-2xl border border-white/5 text-neutral-500 text-xs italic pl-0">
                    Aucun développement publié pour le moment. Suivez le fil pour rester informé.
                  </div>
                )}
              </div>

            </div>
          )}

        </div>

        {/* Right Side: Signatures & Sidebar */}
        <div className="w-full lg:w-1/3 flex flex-col glass-card p-6 sm:p-8 rounded-3xl shadow-2xl border border-white/5 space-y-6">
          <div className="space-y-2">
            <h3 className="text-2xl font-extrabold text-white font-display">
              Soutiens
            </h3>
            <p className="text-xs sm:text-sm text-neutral-450">
              <span className="font-extrabold text-white text-base">{petition.signaturesCount}</span> personnes ont signé. Objectif : {signatureGoal} !
            </p>
          </div>

          {/* Progress bar */}
          <div className="w-full rounded-full bg-neutral-950 border border-white/5 h-4 overflow-hidden shadow-inner p-[2px]">
            <div
              className="bg-gradient-to-r from-green-500 to-emerald-500 h-full rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
              style={{ width: `${percent}%` }}
            />
          </div>

          {/* Sign Error Message */}
          {signError && (
            <div className="flex items-center space-x-2 bg-red-950/20 border border-red-500/20 text-red-400 py-3 px-4 rounded-2xl text-xs font-medium">
              <HiExclamationCircle className="text-lg flex-shrink-0" />
              <span>{signError}</span>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col gap-3 pt-2">
            {hasSigned ? (
              <div className="flex items-center justify-center space-x-2 bg-green-950/20 border border-green-500/20 text-green-400 py-3 rounded-full text-sm font-bold shadow-md shadow-green-950/10">
                <HiCheckCircle className="text-lg" />
                <span>Vous avez soutenu cette cause</span>
              </div>
            ) : (
              <ButtonClick
                text={signing ? "Signature..." : "Soutenir cette cause"}
                classButton="rounded-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-neutral-950 font-extrabold text-sm justify-center w-full py-3.5 shadow-lg shadow-green-950/20 transition-all"
                classArrow="hidden"
                onClick={handleSign}
                disabled={signing || isVictory}
              />
            )}

            <ButtonClick
              text={copied ? "Lien copié !" : "Partager la pétition"}
              classButton="rounded-full bg-neutral-900 hover:bg-neutral-800/80 border border-white/5 px-6 py-3 text-white font-semibold text-xs justify-center w-full transition-all"
              classArrow="hidden"
              onClick={handleShare}
            />
          </div>

          {/* Signers List */}
          <div className="flex flex-col space-y-4 pt-5 border-t border-white/5">
            <h4 className="text-[10px] font-bold uppercase text-neutral-450 tracking-wider">
              Derniers signataires ({petition.signatureNames.length})
            </h4>
            <div className="flex flex-col space-y-2 max-h-48 overflow-y-auto scrollbar-hidden pr-1">
              {petition.signatureNames.slice().reverse().map((name: string, index: number) => (
                <div key={index} className="flex items-center space-x-2.5 py-2 border-b border-white/5 last:border-0">
                  <div className="h-6 w-6 rounded-full bg-neutral-900/60 flex items-center justify-center text-[10px] text-green-400 border border-white/5 font-bold uppercase">
                    {name.charAt(0)}
                  </div>
                  <p className="text-xs font-semibold text-neutral-300 truncate">
                    {name}
                  </p>
                </div>
              ))}
              {petition.signatureNames.length === 0 && (
                <p className="text-xs text-neutral-500 italic py-2">
                  Aucun signataire pour le moment.
                </p>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
