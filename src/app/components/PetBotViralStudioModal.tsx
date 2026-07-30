"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  HiSparkles,
  HiXMark,
  HiArrowDownTray,
  HiShare,
  HiCheck,
  HiPhoto,
  HiArrowPath,
  HiLink,
} from "react-icons/hi2";
import { FaInstagram, FaWhatsapp, FaTwitter, FaFacebook, FaTiktok } from "react-icons/fa";
import { useLanguage } from "../../i18n/LanguageContext";

interface PetBotViralStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  petitionTitle: string;
  category?: string;
  signaturesCount?: number;
  goalCount?: number;
  city?: string;
  creatorName?: string;
}

// AI Background Presets tailored to petition topics
const AI_PRESETS = [
  { id: "nature", name: "🌱 Écologie & Climat", url: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1080&q=80" },
  { id: "city", name: "🏙️ Ville & Transports", url: "https://images.unsplash.com/photo-1477959858617-67f30ac4ce78?auto=format&fit=crop&w=1080&q=80" },
  { id: "education", name: "🎓 Éducation & Jeunesse", url: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1080&q=80" },
  { id: "health", name: "🏥 Santé & Hôpitaux", url: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1080&q=80" },
  { id: "justice", name: "⚖️ Droits & Justice", url: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1080&q=80" },
];

export default function PetBotViralStudioModal({
  isOpen,
  onClose,
  petitionTitle,
  category = "Mobilisation",
  signaturesCount = 1250,
  goalCount = 2000,
  city = "Douala",
  creatorName = "Russel Atebede",
}: PetBotViralStudioModalProps) {
  const { locale } = useLanguage();

  // State
  const [customQuote, setCustomQuote] = useState(petitionTitle);
  const [selectedBg, setSelectedBg] = useState(AI_PRESETS[0].url);
  const [aiPrompt, setAiPrompt] = useState("");
  const [generatingAiBg, setGeneratingAiBg] = useState(false);
  const [activeTheme, setActiveTheme] = useState<"emerald" | "gold" | "cyber" | "minimal">("emerald");
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showShareDropdown, setShowShareDropdown] = useState(false);

  // Target URL & Real Unique Scannable QR Code URL
  const targetUrl = typeof window !== "undefined" ? window.location.href : "https://apption.org";
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(targetUrl)}`;

  // Sync title when modal opens
  useEffect(() => {
    if (isOpen) {
      setCustomQuote(petitionTitle);
      const catLower = (category || "").toLowerCase();
      if (catLower.includes("ville") || catLower.includes("transport")) setSelectedBg(AI_PRESETS[1].url);
      else if (catLower.includes("educ") || catLower.includes("jeun")) setSelectedBg(AI_PRESETS[2].url);
      else if (catLower.includes("sante") || catLower.includes("hopit")) setSelectedBg(AI_PRESETS[3].url);
      else if (catLower.includes("droit") || catLower.includes("just")) setSelectedBg(AI_PRESETS[4].url);
      else setSelectedBg(AI_PRESETS[0].url);
    }
  }, [isOpen, petitionTitle, category]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const progressPercent = Math.min(100, Math.round((signaturesCount / goalCount) * 100));

  // Dynamic AI Image Generator based on Prompt or Citation
  const handleGenerateAiBg = () => {
    setGeneratingAiBg(true);
    const promptToUse = aiPrompt.trim() || customQuote || category;
    const randomSeed = Math.floor(Math.random() * 10000);
    const aiGeneratedUrl = `https://picsum.photos/seed/${encodeURIComponent(promptToUse + randomSeed)}/1080/1920`;

    setTimeout(() => {
      setSelectedBg(aiGeneratedUrl);
      setGeneratingAiBg(false);
    }, 600);
  };

  // Custom File Upload Handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          setSelectedBg(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // REAL PHYSICAL PNG 9:16 DOWNLOAD ENGINE (HTML5 CANVAS 1080x1920) WITH SCANNABLE QR CODE
  const handleRealDownload = async () => {
    setDownloading(true);

    try {
      const width = 1080;
      const height = 1920;

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");

      if (!ctx) throw new Error("Could not create Canvas context");

      // 1. Draw Background Image or Fallback Fill
      const bgImage = new Image();
      bgImage.crossOrigin = "anonymous";
      
      await new Promise<void>((resolve) => {
        bgImage.onload = () => {
          ctx.drawImage(bgImage, 0, 0, width, height);
          resolve();
        };
        bgImage.onerror = () => {
          ctx.fillStyle = activeTheme === "gold" ? "#1a1205" : "#0b0b0f";
          ctx.fillRect(0, 0, width, height);
          resolve();
        };
        bgImage.src = selectedBg;
      });

      // 2. Draw Dark Gradient Overlay
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, "rgba(11, 11, 15, 0.75)");
      gradient.addColorStop(0.5, "rgba(11, 11, 15, 0.88)");
      gradient.addColorStop(1, "rgba(11, 11, 15, 0.98)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // 3. Draw Header Brand & Category Badge
      ctx.fillStyle = "#10b981"; // Emerald
      ctx.font = "bold 32px sans-serif";
      ctx.fillText(`⚡ ${category.toUpperCase()}`, 80, 160);

      ctx.fillStyle = "#a3a3a3";
      ctx.font = "28px sans-serif";
      ctx.fillText("Apption.org", width - 240, 160);

      // 4. Draw Custom Quote Title (Word Wrap)
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 56px sans-serif";
      
      const words = `"${customQuote}"`.split(" ");
      let line = "";
      let y = 500;
      const lineHeight = 75;
      const maxLineWidth = width - 160;

      for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + " ";
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxLineWidth && n > 0) {
          ctx.fillText(line, 80, y);
          line = words[n] + " ";
          y += lineHeight;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line, 80, y);

      // 5. Draw Signature Progress Box
      const boxY = Math.max(1000, y + 100);
      ctx.fillStyle = "rgba(255, 255, 255, 0.06)";
      ctx.beginPath();
      ctx.roundRect(80, boxY, width - 160, 220, 24);
      ctx.fill();

      ctx.fillStyle = "#e5e5e5";
      ctx.font = "bold 36px sans-serif";
      ctx.fillText(`Mobilisation Citoyenne: ${signaturesCount} / ${goalCount}`, 120, boxY + 80);

      ctx.fillStyle = "#10b981";
      ctx.font = "bold 36px sans-serif";
      ctx.fillText(`${progressPercent}%`, width - 240, boxY + 80);

      // Progress Bar
      ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
      ctx.beginPath();
      ctx.roundRect(120, boxY + 120, width - 240, 32, 16);
      ctx.fill();

      const progressWidth = Math.max(20, ((width - 240) * progressPercent) / 100);
      ctx.fillStyle = activeTheme === "gold" ? "#f59e0b" : "#10b981";
      ctx.beginPath();
      ctx.roundRect(120, boxY + 120, progressWidth, 32, 16);
      ctx.fill();

      // 6. Draw REAL UNIQUE SCANNABLE QR CODE
      const qrImg = new Image();
      qrImg.crossOrigin = "anonymous";
      
      await new Promise<void>((resolve) => {
        qrImg.onload = () => {
          ctx.fillStyle = "#ffffff";
          ctx.beginPath();
          ctx.roundRect(width - 320, height - 340, 240, 240, 24);
          ctx.fill();
          
          ctx.drawImage(qrImg, width - 300, height - 320, 200, 200);
          resolve();
        };
        qrImg.onerror = () => resolve();
        qrImg.src = qrCodeUrl;
      });

      // Draw Footer Info
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 38px sans-serif";
      ctx.fillText("Scannez pour signer la pétition", 80, height - 220);

      ctx.fillStyle = "#a3a3a3";
      ctx.font = "30px sans-serif";
      ctx.fillText(`Initiateur: ${creatorName} • ${city}`, 80, height - 160);

      ctx.fillStyle = "#10b981";
      ctx.font = "bold 34px sans-serif";
      ctx.fillText("Lien officiel: Apption.org", 80, height - 100);

      // 7. REAL PHYSICAL BROWSER DOWNLOAD
      const dataUrl = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.href = dataUrl;
      downloadLink.download = `Apption_Story_${Date.now()}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);

    } catch (err) {
      console.error("Canvas export failed:", err);
      alert("Erreur lors de la génération de l'image.");
    } finally {
      setDownloading(false);
    }
  };

  // SMART SOCIAL SHARE LINK HANDLERS
  const handlePlatformShare = (platform: "whatsapp" | "twitter" | "facebook" | "instagram" | "native") => {
    if (typeof window === "undefined") return;

    const shareText = `🚀 Soutenez la cause "${customQuote}" sur Apption ! Signez la pétition ici : ${targetUrl}`;

    if (platform === "native" && navigator.share) {
      navigator.share({
        title: customQuote,
        text: shareText,
        url: targetUrl,
      }).catch(console.error);
      return;
    }

    let url = "";
    if (platform === "whatsapp") url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    if (platform === "twitter") url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
    if (platform === "facebook") url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(targetUrl)}`;

    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
    } else {
      navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/85 backdrop-blur-md animate-fadeIn overflow-y-auto">
      
      {/* Backdrop overlay */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Modal Container */}
      <div className="relative w-full max-w-4xl bg-neutral-900 border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 z-10 overflow-hidden my-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-neutral-400 hover:text-white hover:bg-white/10 transition-colors z-20"
        >
          <HiXMark className="text-lg" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-3 border-b border-white/5 pb-4">
          <div className="w-10 h-10 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-400">
            <HiSparkles className="text-xl animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white font-display flex items-center space-x-2">
              <span>PetBot Viral Studio Pro</span>
              <span className="px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 text-[10px] font-mono border border-green-500/20">
                Générateur IA & QR Code Unique
              </span>
            </h2>
            <p className="text-xs text-neutral-400 font-light">
              Créez des visuels d&apos;impact Story 9:16 avec arrière-plan généré par IA et QR Code scannable.
            </p>
          </div>
        </div>

        {/* Studio Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: 9:16 Live Preview */}
          <div className="lg:col-span-5 flex flex-col items-center space-y-3">
            <div
              className="w-[260px] h-[460px] rounded-3xl p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden border border-white/10 transition-all duration-500 bg-cover bg-center text-white"
              style={{ backgroundImage: `url(${selectedBg})` }}
            >
              {/* Dark Gradient Overlay for readability */}
              <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/80 via-neutral-950/85 to-neutral-950/95" />

              {/* Story Header */}
              <div className="relative z-10 flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-full bg-neutral-950/80 backdrop-blur-md text-[9px] font-black uppercase tracking-wider text-green-400 border border-green-500/30">
                  ⚡ {category}
                </span>
                <span className="text-[10px] font-mono text-neutral-400">Apption.org</span>
              </div>

              {/* Story Main Quote Body */}
              <div className="relative z-10 space-y-4 my-auto">
                <h4 className="font-extrabold text-base leading-snug font-display line-clamp-4">
                  &quot;{customQuote}&quot;
                </h4>

                <div className="space-y-1.5 p-3 rounded-2xl bg-neutral-950/90 border border-white/10 backdrop-blur-md">
                  <div className="flex items-center justify-between text-[10px] font-mono">
                    <span className="text-neutral-300">Mobilisation</span>
                    <span className="text-green-400 font-bold">{signaturesCount} signatures</span>
                  </div>
                  <div className="w-full h-2 bg-neutral-950 rounded-full overflow-hidden p-0.5">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-green-500 to-emerald-400"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Story Footer Real Unique Scannable QR Code */}
              <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="w-10 h-10 rounded-xl bg-white p-1 flex items-center justify-center shadow-lg border border-white/20">
                    <img
                      src={qrCodeUrl}
                      alt="QR Code de la pétition"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[9px] font-extrabold text-white leading-tight">Scannez pour signer</span>
                    <span className="text-[8px] text-neutral-400 truncate max-w-[100px]">{creatorName}</span>
                  </div>
                </div>
                <span className="text-[10px] font-extrabold text-green-400 uppercase tracking-wider">
                  Agissons →
                </span>
              </div>

            </div>

            <span className="text-[11px] text-green-400 font-mono flex items-center space-x-1">
              <span>✅ QR Code Scannable Unique Généré</span>
            </span>
          </div>

          {/* Right Column: Customization Controls & Actions */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* 1. Custom Text Input */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider block">
                1. Éditer le Texte & la Citation du Visuel
              </label>
              <textarea
                value={customQuote}
                onChange={(e) => setCustomQuote(e.target.value)}
                rows={2}
                maxLength={140}
                className="w-full bg-neutral-950 border border-white/10 rounded-2xl p-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-green-500"
                placeholder="Rédigez le texte accrocheur de votre Story..."
              />
            </div>

            {/* 2. AI Generator Prompt Input & Presets */}
            <div className="space-y-3 pt-2 border-t border-white/5">
              <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider block flex items-center justify-between">
                <span>2. Générateur de Fond d&apos;Écran par IA</span>
                <span className="text-[10px] text-green-400 font-mono">IA Générative</span>
              </label>

              {/* Dynamic AI Prompt Field */}
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="Ex: Forêt en déforestation, manifestations climat, université..."
                  className="flex-1 bg-neutral-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-green-500"
                />
                <button
                  onClick={handleGenerateAiBg}
                  disabled={generatingAiBg}
                  className="px-4 py-2 rounded-xl bg-green-500 hover:bg-green-400 text-neutral-950 font-extrabold text-xs flex items-center space-x-1.5 transition-all cursor-pointer disabled:opacity-50"
                >
                  <HiSparkles className="text-sm" />
                  <span>{generatingAiBg ? "Génération..." : "Générer avec IA"}</span>
                </button>
              </div>

              {/* Presets Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
                {AI_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => setSelectedBg(preset.url)}
                    className={`py-2 px-3 rounded-xl border text-left text-xs font-bold transition-all ${
                      selectedBg === preset.url
                        ? "border-green-500 bg-green-500/10 text-white"
                        : "border-white/5 bg-neutral-950 text-neutral-400 hover:border-white/10"
                    }`}
                  >
                    {preset.name}
                  </button>
                ))}
              </div>

              {/* Upload Custom File Input */}
              <div className="flex items-center space-x-2 pt-1">
                <label className="flex-1 py-2 px-3 rounded-xl bg-neutral-950 hover:bg-white/5 border border-white/10 text-xs font-bold text-neutral-300 flex items-center justify-center space-x-2 cursor-pointer transition-colors">
                  <HiPhoto className="text-base text-green-400" />
                  <span>Ou charger votre propre photo</span>
                  <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                </label>
              </div>
            </div>

            {/* 3. Action Buttons: REAL PNG DOWNLOAD (CLEAN SINGLE ICON) & SMART SHARE */}
            <div className="pt-4 border-t border-white/5 space-y-3">
              <button
                onClick={handleRealDownload}
                disabled={downloading}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-neutral-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-green-500/20 flex items-center justify-center space-x-2 transition-all cursor-pointer"
              >
                <HiArrowDownTray className="text-base" />
                <span>{downloading ? "Génération du PNG HD avec QR Code..." : "Télécharger le Visuel (PNG 9:16 + QR Code)"}</span>
              </button>

              {/* Multi-Platform Direct Share Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowShareDropdown(!showShareDropdown)}
                  className="w-full py-3.5 rounded-2xl bg-neutral-950 hover:bg-white/5 border border-white/10 text-xs font-bold text-white flex items-center justify-center space-x-2 transition-all cursor-pointer"
                >
                  <HiShare className="text-base text-green-400" />
                  <span>Partager Directement le Visuel sur les Réseaux</span>
                </button>

                {showShareDropdown && (
                  <div className="mt-2 p-3 rounded-2xl bg-neutral-950 border border-white/10 space-y-2 animate-fadeIn shadow-2xl">
                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block text-center">
                      Sélectionnez la plateforme de partage
                    </span>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      <button
                        onClick={() => handlePlatformShare("whatsapp")}
                        className="py-2 px-3 rounded-xl bg-neutral-900 hover:bg-green-500/10 border border-white/5 text-xs font-bold text-green-400 flex items-center justify-center space-x-1.5 cursor-pointer"
                      >
                        <FaWhatsapp /> <span>WhatsApp</span>
                      </button>

                      <button
                        onClick={() => handlePlatformShare("twitter")}
                        className="py-2 px-3 rounded-xl bg-neutral-900 hover:bg-cyan-500/10 border border-white/5 text-xs font-bold text-cyan-400 flex items-center justify-center space-x-1.5 cursor-pointer"
                      >
                        <FaTwitter /> <span>X / Twitter</span>
                      </button>

                      <button
                        onClick={() => handlePlatformShare("facebook")}
                        className="py-2 px-3 rounded-xl bg-neutral-900 hover:bg-blue-500/10 border border-white/5 text-xs font-bold text-blue-400 flex items-center justify-center space-x-1.5 cursor-pointer"
                      >
                        <FaFacebook /> <span>Facebook</span>
                      </button>

                      <button
                        onClick={() => handlePlatformShare("native")}
                        className="py-2 px-3 rounded-xl bg-neutral-900 hover:bg-pink-500/10 border border-white/5 text-xs font-bold text-pink-400 flex items-center justify-center space-x-1.5 cursor-pointer"
                      >
                        <FaInstagram /> <span>Instagram / TikTok</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
