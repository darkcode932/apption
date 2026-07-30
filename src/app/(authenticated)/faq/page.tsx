"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  HiChevronDown,
  HiMagnifyingGlass,
  HiSparkles,
  HiChatBubbleLeftRight,
  HiXMark,
} from "react-icons/hi2";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

// ─── Types ────────────────────────────────────────────────────────────────────
interface FAQItem {
  id: number;
  category: string;
  emoji: string;
  question: string;
  answer: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const faqData: FAQItem[] = [
  // 🚀 Démarrer
  {
    id: 1,
    category: "Démarrer",
    emoji: "🚀",
    question: "Qu'est-ce qu'Apption ?",
    answer:
      "Apption est une plateforme citoyenne de pétitions en ligne qui permet à chaque individu de créer, signer et partager des causes qui lui tiennent à cœur. Notre mission : transformer les indignations citoyennes en victoires concrètes grâce à la mobilisation collective, la technologie et l'intelligence artificielle.",
  },
  {
    id: 2,
    category: "Démarrer",
    emoji: "🚀",
    question: "Apption est-il gratuit ?",
    answer:
      "Oui, Apption est entièrement gratuit pour les citoyens. Vous pouvez créer une pétition, signer des causes et utiliser les outils de base sans aucun frais. Des fonctionnalités avancées (comme le Viral Studio Pro et les analyses approfondies) pourront être proposées dans des formules premium à l'avenir.",
  },
  {
    id: 3,
    category: "Démarrer",
    emoji: "🚀",
    question: "Dois-je créer un compte pour signer une pétition ?",
    answer:
      "Oui, un compte est requis pour signer une pétition sur Apption. Cela garantit l'authenticité des signatures et évite les abus. La création de compte est rapide (moins de 2 minutes) et sécurisée via notre système d'authentification Firebase.",
  },
  {
    id: 4,
    category: "Démarrer",
    emoji: "🚀",
    question: "Dans quels pays puis-je utiliser Apption ?",
    answer:
      "Apption est accessible dans le monde entier. Vous pouvez créer ou signer des pétitions à l'échelle locale (votre ville), nationale (votre pays) ou internationale. Notre Carte d'Impact interactive visualise les pétitions géolocalisées dans plus de 150 pays.",
  },
  {
    id: 5,
    category: "Démarrer",
    emoji: "🚀",
    question: "Comment puis-je contacter le support Apption ?",
    answer:
      "Vous pouvez contacter notre équipe via PetBot IA (accessible en bas à droite de chaque page), qui peut répondre à la plupart de vos questions en temps réel. Pour les demandes spécifiques ou signalement d'abus, un formulaire de contact sera disponible dans votre espace profil.",
  },

  // ✍️ Créer une pétition
  {
    id: 6,
    category: "Créer",
    emoji: "✍️",
    question: "Comment créer une pétition sur Apption ?",
    answer:
      "Créer une pétition prend moins de 5 minutes. Cliquez sur « Lancer une pétition » dans la navigation, remplissez le formulaire (titre, description, décideur cible, catégorie, ville ou pays, image), puis publiez. Notre IA Copilot peut vous aider à rédiger un texte percutant et générer une image adaptée à votre cause.",
  },
  {
    id: 7,
    category: "Créer",
    emoji: "✍️",
    question: "Quels types de pétitions peut-on créer ?",
    answer:
      "Vous pouvez créer des pétitions sur tous les sujets légaux : environnement, droits civiques, éducation, santé, urbanisme, droits des animaux, transparence politique, etc. Les pétitions incitant à la violence, à la haine ou à des actes illégaux seront supprimées par nos équipes et notre IA de modération.",
  },
  {
    id: 8,
    category: "Créer",
    emoji: "✍️",
    question: "Qu'est-ce que l'IA Copilot et comment l'utiliser ?",
    answer:
      "L'IA Copilot est un assistant intégré au formulaire de création de pétition. Il analyse votre sujet et génère automatiquement un titre percutant, une description structurée avec arguments et appels à l'action, et peut même suggérer le bon décideur à cibler. Activez-le en cliquant sur l'icône étincelle dans le formulaire.",
  },
  {
    id: 9,
    category: "Créer",
    emoji: "✍️",
    question: "Puis-je modifier ma pétition après publication ?",
    answer:
      "Oui, vous pouvez modifier le titre, la description et l'image de votre pétition depuis votre espace « Mes Pétitions ». Notez que modifier substantiellement une pétition déjà signée peut réduire la confiance des signataires. Les modifications importantes sont enregistrées dans un historique visible.",
  },
  {
    id: 10,
    category: "Créer",
    emoji: "✍️",
    question: "Comment ajouter une mise à jour à ma pétition ?",
    answer:
      "Depuis votre espace « Mes Pétitions », sélectionnez votre pétition et cliquez sur « Ajouter une mise à jour ». Les mises à jour sont visibles publiquement et maintiennent l'engagement de vos signataires. C'est essentiel pour montrer la progression de votre combat.",
  },

  // 🖊️ Signer & Partager
  {
    id: 11,
    category: "Signer & Partager",
    emoji: "🖊️",
    question: "Ma signature est-elle vraiment comptabilisée ?",
    answer:
      "Absolument. Chaque signature est enregistrée en temps réel dans notre base de données Firebase sécurisée. Votre identité est vérifiée via votre compte Apption. Le compteur de signatures sur la pétition se met à jour instantanément.",
  },
  {
    id: 12,
    category: "Signer & Partager",
    emoji: "🖊️",
    question: "Puis-je signer plusieurs fois la même pétition ?",
    answer:
      "Non. Notre système détecte automatiquement les signatures en double. Chaque utilisateur ne peut signer une même pétition qu'une seule fois. Cette règle garantit l'intégrité et la crédibilité des résultats auprès des décideurs.",
  },
  {
    id: 13,
    category: "Signer & Partager",
    emoji: "🖊️",
    question: "Comment partager une pétition efficacement ?",
    answer:
      "Utilisez le bouton « Partager » sur la page de chaque pétition pour accéder à notre Share Modal. Il génère des visuels optimisés pour WhatsApp, Twitter/X, Instagram, Facebook et email. Notre PetBot IA peut également vous créer une stratégie de partage personnalisée avec des hashtags viraux.",
  },
  {
    id: 14,
    category: "Signer & Partager",
    emoji: "🖊️",
    question: "Qu'est-ce que le Viral Studio Pro ?",
    answer:
      "Le Viral Studio Pro est notre outil exclusif de création de visuels pour pétitions. Il génère automatiquement des images de partage aux formats Instagram (carré), Twitter/X (bandeau) et WhatsApp (portrait) en intégrant le titre, le nombre de signatures et un appel à l'action percutant. Accessible depuis la page de votre pétition.",
  },
  {
    id: 15,
    category: "Signer & Partager",
    emoji: "🖊️",
    question: "Puis-je retirer ma signature ?",
    answer:
      "Oui, vous pouvez retirer votre signature depuis votre profil, dans la section « Pétitions signées ». Votre nom sera retiré de la liste des signataires et le compteur sera mis à jour. Notez que certaines pétitions peuvent avoir déjà été soumises à des décideurs incluant votre signature.",
  },

  // 🏆 Impact & Victoires
  {
    id: 16,
    category: "Impact & Victoires",
    emoji: "🏆",
    question: "Combien de signatures faut-il pour qu'une pétition soit efficace ?",
    answer:
      "Il n'existe pas de chiffre magique universel. L'efficacité dépend du contexte : une pétition locale peut changer les choses avec 500 signatures, tandis qu'une pétition nationale peut nécessiter 100 000 signatures. Ce qui compte davantage : la qualité des signataires (sont-ils directement concernés ?), la crédibilité des arguments, et la visibilité médiatique.",
  },
  {
    id: 17,
    category: "Impact & Victoires",
    emoji: "🏆",
    question: "Qu'est-ce qu'une « Victoire » sur Apption ?",
    answer:
      "Une pétition est marquée comme « Victoire » lorsque le décideur ciblé a répondu positivement aux demandes des signataires : décision officielle, changement de loi, annulation d'un projet, etc. Le créateur de la pétition ou notre équipe de modération peut valider ce statut. Les victoires apparaissent sur notre Carte d'Impact.",
  },
  {
    id: 18,
    category: "Impact & Victoires",
    emoji: "🏆",
    question: "Puis-je voir les pétitions de ma ville sur la carte ?",
    answer:
      "Oui ! Notre Carte d'Impact interactive (/map) affiche toutes les pétitions géolocalisées. Vous pouvez filtrer par statut (active, victoire), par échelle (locale, nationale, internationale) et cliquer sur chaque pétition pour la lire ou la signer directement depuis la carte.",
  },
  {
    id: 19,
    category: "Impact & Victoires",
    emoji: "🏆",
    question: "Comment ma pétition peut-elle être mise « À la une » ?",
    answer:
      "Les pétitions « À la une » sont sélectionnées par notre équipe éditoriale selon des critères d'urgence, d'impact social, de croissance rapide des signatures et de pertinence géographique. Pour maximiser vos chances, votre pétition doit avoir une image de qualité, un titre percutant, une description complète et une croissance active.",
  },
  {
    id: 20,
    category: "Impact & Victoires",
    emoji: "🏆",
    question: "Comment les décideurs reçoivent-ils les pétitions ?",
    answer:
      "Lorsqu'une pétition atteint un palier significatif (ou sur demande du créateur), notre plateforme génère un document PDF officiel avec toutes les signatures, les commentaires et les données. Ce document peut être remis physiquement, envoyé par email ou via les canaux officiels aux mairies, ministères ou organisations ciblées.",
  },

  // 🤖 IA & Innovation
  {
    id: 21,
    category: "IA & Innovation",
    emoji: "🤖",
    question: "Comment fonctionne la modération par IA ?",
    answer:
      "Notre IA sémantique analyse en temps réel chaque commentaire et pétition publiée pour détecter les discours haineux, les contenus violents ou discriminatoires. Elle calcule un score de toxicité et peut automatiquement masquer les contenus à risque, qui sont ensuite examinés par notre équipe humaine dans l'interface d'administration.",
  },
  {
    id: 22,
    category: "IA & Innovation",
    emoji: "🤖",
    question: "Mes données sont-elles utilisées pour entraîner l'IA ?",
    answer:
      "Non. Vos données personnelles (nom, email, localisation) ne sont jamais utilisées pour entraîner nos modèles d'IA. Seuls les contenus publics des pétitions (textes, catégories) peuvent contribuer à améliorer nos algorithmes de recommandation, dans le respect du RGPD et de votre consentement explicite.",
  },
  {
    id: 23,
    category: "IA & Innovation",
    emoji: "🤖",
    question: "PetBot peut-il rédiger une pétition complète pour moi ?",
    answer:
      "Oui ! PetBot IA est capable de générer un texte de pétition complet : titre percutant, corps argumenté (constat, enjeux, demandes), et stratégie de partage virale. Il suffit de lui décrire votre cause en quelques mots. Le texte généré vous appartient entièrement et peut être copié directement dans votre formulaire.",
  },
  {
    id: 24,
    category: "IA & Innovation",
    emoji: "🤖",
    question: "Comment la géolocalisation fonctionne-t-elle sur Apption ?",
    answer:
      "Lors de votre inscription, vous indiquez votre ville et pays. Ces informations permettent à notre algorithme de vous afficher en priorité les pétitions proches de chez vous, et d'afficher votre pétition aux personnes de votre région. Vous pouvez choisir entre le flux « Autour de moi » et le flux « Mondial » sur la page d'accueil.",
  },
  {
    id: 25,
    category: "IA & Innovation",
    emoji: "🤖",
    question: "Apption utilise-t-il le chiffrement pour protéger mes données ?",
    answer:
      "Oui. Toutes vos données sont stockées de manière sécurisée via Firebase (Google Cloud). Les mots de passe sont hashés, les connexions utilisent HTTPS/TLS, et l'authentification est protégée par les standards OAuth2. Nous ne revendons jamais vos données à des tiers et n'affichons aucune publicité ciblée.",
  },
];

const categories = ["Toutes", "Démarrer", "Créer", "Signer & Partager", "Impact & Victoires", "IA & Innovation"];

const categoryEmoji: Record<string, string> = {
  Toutes: "💡",
  Démarrer: "🚀",
  Créer: "✍️",
  "Signer & Partager": "🖊️",
  "Impact & Victoires": "🏆",
  "IA & Innovation": "🤖",
};

// ─── Accordion Item ────────────────────────────────────────────────────────────
function AccordionItem({ item, isOpen, onToggle }: { item: FAQItem; isOpen: boolean; onToggle: () => void }) {
  return (
    <div
      className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
        isOpen ? "border-green-500/30 bg-neutral-900/80" : "border-white/5 bg-neutral-900/40 hover:border-white/10"
      }`}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-6 py-4 text-left gap-4 cursor-pointer"
      >
        <div className="flex items-center gap-3 flex-1">
          <span className="text-base flex-shrink-0">{item.emoji}</span>
          <span className={`text-sm font-semibold leading-snug transition-colors ${isOpen ? "text-green-400" : "text-white"}`}>
            {item.question}
          </span>
        </div>
        <HiChevronDown
          className={`text-neutral-400 flex-shrink-0 text-lg transition-transform duration-300 ${isOpen ? "rotate-180 text-green-400" : ""}`}
        />
      </button>

      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}`}
      >
        <div className="px-6 pb-5 border-t border-white/5 pt-4">
          <p className="text-neutral-400 text-sm leading-relaxed">{item.answer}</p>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function FAQPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("Toutes");
  const [openId, setOpenId] = useState<number | null>(1);

  const filtered = useMemo(() => {
    return faqData.filter((item) => {
      const matchCat = activeCategory === "Toutes" || item.category === activeCategory;
      const matchSearch =
        search.trim() === "" ||
        item.question.toLowerCase().includes(search.toLowerCase()) ||
        item.answer.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [search, activeCategory]);

  return (
    <div className="min-h-screen bg-[#0b0b0f] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-14 space-y-10">

        {/* ── Hero Header ── */}
        <div className="text-center space-y-4 relative">
          <div className="absolute inset-0 -top-10 bg-green-500/5 rounded-full blur-[100px] pointer-events-none" />
          <span className="relative inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-[11px] font-black uppercase tracking-widest">
            <HiSparkles className="text-sm" /> Centre d&apos;aide
          </span>
          <h1 className="relative text-4xl sm:text-5xl font-extrabold text-white font-display tracking-tight">
            Questions{" "}
            <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
              Fréquentes
            </span>
          </h1>
          <p className="relative text-neutral-400 text-base max-w-xl mx-auto leading-relaxed">
            25 réponses aux questions les plus posées sur Apption. Vous ne trouvez pas ce que vous cherchez ?{" "}
            <span className="text-green-400 font-semibold">PetBot IA</span> répond en temps réel.
          </p>
        </div>

        {/* ── Search Bar ── */}
        <div className="relative">
          <HiMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 text-lg" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher une question…"
            className="w-full bg-neutral-900 border border-white/10 focus:border-green-500/40 focus:outline-none rounded-2xl pl-11 pr-11 py-3.5 text-sm text-white placeholder-neutral-500 transition-all"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white transition-colors cursor-pointer"
            >
              <HiXMark className="text-lg" />
            </button>
          )}
        </div>

        {/* ── Category Filters ── */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all border cursor-pointer ${
                activeCategory === cat
                  ? "bg-green-500 text-neutral-950 border-green-500 shadow-md shadow-green-500/20"
                  : "bg-neutral-900/50 text-neutral-400 border-white/5 hover:border-white/10 hover:text-white"
              }`}
            >
              <span>{categoryEmoji[cat]}</span>
              <span>{cat}</span>
            </button>
          ))}
        </div>

        {/* ── Results count ── */}
        <div className="flex items-center justify-between">
          <p className="text-neutral-500 text-xs font-mono">
            {filtered.length} question{filtered.length > 1 ? "s" : ""}
            {search && ` pour "${search}"`}
          </p>
          {filtered.length > 0 && (
            <button
              onClick={() => setOpenId(null)}
              className="text-neutral-500 hover:text-neutral-300 text-xs transition-colors cursor-pointer"
            >
              Tout réduire
            </button>
          )}
        </div>

        {/* ── Accordion List ── */}
        {filtered.length > 0 ? (
          <div className="space-y-3">
            {filtered.map((item) => (
              <AccordionItem
                key={item.id}
                item={item}
                isOpen={openId === item.id}
                onToggle={() => setOpenId(openId === item.id ? null : item.id)}
              />
            ))}
          </div>
        ) : (
          /* No results → PetBot CTA */
          <div className="text-center py-14 space-y-5 bg-neutral-900/40 rounded-3xl border border-white/5 px-8">
            <div className="text-5xl">🐾</div>
            <div>
              <p className="text-white font-bold text-lg">Aucun résultat pour &quot;{search}&quot;</p>
              <p className="text-neutral-400 text-sm mt-1">
                PetBot IA connaît la réponse ! Demandez-lui directement.
              </p>
            </div>
            <button
              onClick={() => {
                const fab = document.querySelector("[aria-label='PetBot']") as HTMLButtonElement;
                if (fab) fab.click();
              }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-neutral-950 font-bold text-sm rounded-2xl shadow-lg shadow-green-500/20 hover:shadow-green-500/30 transition-all cursor-pointer"
            >
              <HiChatBubbleLeftRight className="text-lg" />
              Poser la question à PetBot
            </button>
          </div>
        )}

        {/* ── Bottom CTA ── */}
        <div className="relative rounded-3xl border border-green-500/20 bg-gradient-to-br from-green-500/5 to-emerald-500/5 p-8 text-center space-y-4 overflow-hidden">
          <div className="absolute inset-0 bg-green-500/3 rounded-3xl blur-[60px] pointer-events-none" />
          <HiChatBubbleLeftRight className="relative text-4xl text-green-400 mx-auto" />
          <h2 className="relative text-xl font-extrabold text-white">
            Vous n&apos;avez pas trouvé votre réponse ?
          </h2>
          <p className="relative text-neutral-400 text-sm max-w-md mx-auto">
            Notre PetBot IA répond en temps réel à toutes vos questions sur Apption, la création de pétitions et les stratégies de mobilisation.
          </p>
          <div className="relative flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/home"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-neutral-950 font-bold text-sm rounded-2xl transition-all"
            >
              <HiSparkles /> Retour à l&apos;accueil
            </Link>
            <Link
              href="/launch-petition"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-neutral-900 hover:bg-neutral-800 border border-white/10 text-white font-semibold text-sm rounded-2xl transition-all"
            >
              ✍️ Lancer une pétition
            </Link>
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}
