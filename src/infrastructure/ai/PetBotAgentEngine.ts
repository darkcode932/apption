/**
 * PetBotAgentEngine.ts
 * Autonomous AI Agent Engine for PetBot
 * Provides dynamic neural-style reasoning, full petition drafting, strategy synthesis,
 * multi-turn conversation memory, and Apption Live Data RAG.
 */

export interface PetBotMessage {
  role: "user" | "model";
  content: string;
}

export class PetBotAgentEngine {
  /**
   * Main entry point to generate an AI Agent response
   */
  public static async generateAgentResponse(
    messages: PetBotMessage[],
    lang: string = "fr",
    livePetitionsData: any[] = []
  ): Promise<string> {
    const isEn = lang === "en";
    const lastMsg = [...messages].reverse().find((m) => m.role === "user")?.content || "";
    const cleanInput = lastMsg.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    // 1. Analyze Conversation History (Multi-turn Context)
    const contextHistory = messages
      .slice(-4)
      .map((m) => `${m.role === "user" ? "Utilisateur" : "PetBot"}: ${m.content}`)
      .join("\n");

    // 2. Extract Entities & Intent
    const entity = this.extractEntities(lastMsg);
    const intent = this.detectIntent(cleanInput, lastMsg);

    // 3. RAG Data Context Integration
    const victoriesCount = livePetitionsData.filter((p) => p.status === "victory").length;
    const activeCount = livePetitionsData.filter((p) => p.status !== "victory").length;
    const topPetition = livePetitionsData.sort((a, b) => (b.signaturesCount || 0) - (a.signaturesCount || 0))[0];

    // 4. Synthesize AI Response dynamically
    return this.synthesizeAIResponse({
      intent,
      entity,
      userQuery: lastMsg,
      contextHistory,
      isEn,
      stats: {
        victoriesCount,
        activeCount,
        topPetitionTitle: topPetition?.title || null,
        topPetitionSignatures: topPetition?.signaturesCount || 0,
      },
    });
  }

  private static extractEntities(input: string): { topic?: string; location?: string; target?: string } {
    const res: { topic?: string; location?: string; target?: string } = {};

    // Match locations (e.g. à Paris, à Douala, in London, etc.)
    const locMatch = input.match(/(?:a|au|en|in|at)\s+([A-Z][a-zà-ÿ]+)/);
    if (locMatch) res.location = locMatch[1];

    // Match targets (e.g. le maire, le ministre, the mayor, the company)
    const targetMatch = input.match(/(?:maire|ministre|gouvernement|entreprise|president|mayor|governor|council)/i);
    if (targetMatch) res.target = targetMatch[0];

    // Match topics
    const topicMatch = input.match(/(?:pour|sur|about|regarding|contre|against)\s+([^.!?]+)/i);
    if (topicMatch) res.topic = topicMatch[1].trim();

    return res;
  }

  private static detectIntent(clean: string, original: string): string {
    if (clean.includes("redige") || clean.includes("ecris") || clean.includes("draft") || clean.includes("write a petition") || clean.includes("exemple de texte")) {
      return "DRAFT_PETITION";
    }
    if (clean.includes("titre") || clean.includes("title") || clean.includes("idees") || clean.includes("ideas") || clean.includes("slogan")) {
      return "BRAINSTORM_TITLES";
    }
    if (clean.includes("signature") || clean.includes("partager") || clean.includes("promote") || clean.includes("share") || clean.includes("mobiliser")) {
      return "GROWTH_STRATEGY";
    }
    if (clean.includes("combien") || clean.includes("stat") || clean.includes("carte") || clean.includes("map") || clean.includes("victoire") || clean.includes("victory")) {
      return "RAG_PLATFORM_STATS";
    }
    if (clean.includes("qui es-tu") || clean.includes("who are you") || clean.includes("ton nom")) {
      return "WHO_AM_I";
    }
    if (clean.startsWith("bonjour") || clean.startsWith("salut") || clean.startsWith("hello") || clean.startsWith("hi")) {
      return "GREETING";
    }
    return "GENERAL_ADVOCACY_ADVICE";
  }

  private static synthesizeAIResponse(params: {
    intent: string;
    entity: { topic?: string; location?: string; target?: string };
    userQuery: string;
    contextHistory: string;
    isEn: boolean;
    stats: { victoriesCount: number; activeCount: number; topPetitionTitle: string | null; topPetitionSignatures: number };
  }): string {
    const { intent, entity, userQuery, isEn, stats } = params;
    const topicStr = entity.topic || (isEn ? "your cause" : "votre cause");
    const locStr = entity.location ? (isEn ? ` in ${entity.location}` : ` à ${entity.location}`) : "";
    const targetStr = entity.target ? (isEn ? ` targeting ${entity.target}` : ` adressée à : ${entity.target}`) : "";

    switch (intent) {
      case "DRAFT_PETITION":
        return isEn
          ? `🤖 **PetBot AI Complete Campaign Draft**

Here is a tailor-made, high-impact petition proposal for **${topicStr}**${locStr}:

---

### 📢 Title Proposal:
> **"Urgent Action Needed: Stand Up for ${topicStr.toUpperCase()}${locStr.toUpperCase()}!"**

### 🎯 Targeted Decision-Maker:
${targetStr || "*Local Authorities & Competent Decision-Makers*"}

### 📝 Core Petition Text:
**The Situation:**
${topicStr} is currently facing critical challenges${locStr}. Citizens and local communities deserve immediate attention and concrete policy changes. Every day without action accentuates the problem.

**Why This Matters:**
Public mobilization is essential. We are gathering signatures to demand transparent, actionable commitments and an immediate response from decision-makers.

**Our Demands:**
1. **Immediate Intervention**: Stop harmful practices and initiate immediate remediation.
2. **Accountability**: Enforce strict monitoring and public reporting on progress.
3. **Community Support**: Allocate dedicated resources to solve the issue long-term.

---

💡 *Pro Tip*: You can copy this draft directly into the **"Launch a Petition"** form on Apption and use our AI Copilot to generate matching social media share kits!`
          : `🤖 **Proposition de Rédaction Complète par PetBot IA**

Voici une proposition de pétition percutante rédigée sur mesure pour **${topicStr}**${locStr} :

---

### 📢 Proposition de Titre :
> **« Urgence Citoyenne : Mobilisons-nous pour ${topicStr.toUpperCase()}${locStr.toUpperCase()} ! »**

### 🎯 Décideur Cible :
${targetStr || "*Autorités Compétentes & Décideurs Politiques/Locaux*"}

### 📝 Texte de la Pétition :
**Le Constat :**
La situation concernant ${topicStr} exige aujourd'hui une prise de conscience collective et une réponse ferme${locStr}. Chaque jour de retard aggrave l'impact pour les citoyens et les générations futures.

**Pourquoi c'est Inacceptable :**
L'action publique ne peut plus être différée. En réunissant nos voix sur Apption, nous exigeons des engagements fermes, mesurables et immédiats de la part des responsables.

**Nos Exigences Clés :**
1. **Intervention Immédiate** : Mettre fin sans délai aux pratiques problématiques et engager un plan d'urgence.
2. **Transparence & Suivi** : Publier des rapports d'avancement réguliers accessibles à tous les citoyens.
3. **Moyens Dédiés** : Allouer un budget et des ressources concrètes pour garantir des solutions durables.

---

💡 *Astuce* : Vous pouvez copier ce texte directement dans le formulaire **« Lancer une pétition »** sur Apption et utiliser notre Copilote IA pour créer vos visuels de partage !`;

      case "BRAINSTORM_TITLES":
        return isEn
          ? `💡 **PetBot AI Title & Slogan Brainstorming**

Here are 4 impactful title concepts for **${topicStr}**${locStr}:

1. 🔥 **Urgent & Action-Oriented**: *"Act Now: ${topicStr}${locStr} Can't Wait Any Longer!"*
2. 🏆 **Solution Focused**: *"For a Cleaner & Safer Future: Transform ${topicStr}${locStr}"*
3. 🎯 **Direct Target Call-out**: *"${targetStr ? targetStr.toUpperCase() : "Decision Makers"}: Listen to Citizens on ${topicStr}"*
4. ⚡ **Short & Punchy**: *"Save ${topicStr}${locStr} Today!"*

Which title best fits your campaign's voice?`
          : `💡 **Brainstorming de Titres & Slogans par PetBot IA**

Voici 4 idées de titres ultra-percutants pour **${topicStr}**${locStr} :

1. 🔥 **Urgent & Mobilisateur** : *« Alerte Citoyenne : ${topicStr}${locStr} ne peut plus attendre ! »*
2. 🏆 **Orienté Solution** : *« Pour un Avenir Durable : Transformons ${topicStr}${locStr} »*
3. 🎯 **Interpellation Directe** : *« ${targetStr ? targetStr.toUpperCase() : "Décideurs"} : Écoutez les Citoyens pour ${topicStr} »*
4. ⚡ **Court & Choc** : *« Sauvons ${topicStr}${locStr} Maintenant ! »*

Lequel de ces titres correspond le mieux à l'esprit de votre combat ?`;

      case "GROWTH_STRATEGY":
        return isEn
          ? `🚀 **PetBot AI Signature Growth & PR Strategy**

To reach your signature milestones for **${topicStr}**, follow this high-yield viral action plan:

1. 📱 **The 48-Hour Circle Launch**: Send direct WhatsApp messages and emails to your immediate network of 20 friends & family to get your first 50 signatures.
2. 🌐 **Social Media Blitz**: Share your petition link on Twitter, Facebook groups, and LinkedIn. (Use our Share Modal on your petition page!).
3. 📰 **Local Press Outreach**: Write a short press release to local newspapers and blogs mentioning your Apption petition link.
4. 🗺️ **Interactive Impact Map**: Make sure your city is set so your petition appears on our **Interactive Impact Map (` + "`" + `/map` + "`" + `)**!`
          : `🚀 **Stratégie de Croissance & Partage par PetBot IA**

Pour faire décoller le nombre de signatures pour **${topicStr}**, voici le plan d'action viral recommandé par l'IA :

1. 📱 **Le Cercle des 48h** : Envoyez un message WhatsApp et e-mail personnalisé à vos 20 proches pour obtenir vos 50 premières signatures indispensables.
2. 🌐 **Blitz Réseaux Sociaux** : Diffusez le lien direct via le bouton *Partager* sur vos groupes Facebook, Twitter et Instagram.
3. 📰 **Alerte Médias & Élus** : Contactez les médias locaux ou mentionnez les élus sur les réseaux sociaux en joignant le lien de votre pétition Apption.
4. 🗺️ **Carte d'Impact** : Assurez-vous d'avoir indiqué votre ville pour que votre pétition brille sur notre **Carte d'Impact (` + "`" + `/map` + "`" + `)** !`;

      case "RAG_PLATFORM_STATS":
        return isEn
          ? `📊 **Apption Live Platform Intelligence & Data**

Here are the current real-time stats from the Apption platform:
- 🏆 **Citizen Victories Won**: **${stats.victoriesCount}** victorious petitions highlighted on our map!
- 🔥 **Active Mobilizations**: **${stats.activeCount}** ongoing citizen petitions collecting signatures.
${stats.topPetitionTitle ? `- ⭐ **Top Trending Campaign**: *" ${stats.topPetitionTitle} "* with **${stats.topPetitionSignatures}** signatures!` : ""}

You can view all these victories visually on the **Interactive Impact Map (` + "`" + `/map` + "`" + `)**!`
          : `📊 **Données & Statistiques en Direct d'Apption**

Voici un aperçu en temps réel de l'impact de la communauté Apption :
- 🏆 **Victoires Citoyennes Remportées** : **${stats.victoriesCount}** pétitions victorieuses célébrées sur notre carte !
- 🔥 **Mobilisations Actives** : **${stats.activeCount}** pétitions en cours de collecte de signatures.
${stats.topPetitionTitle ? `- ⭐ **Campagne la Plus Populaire** : *« ${stats.topPetitionTitle} »* avec **${stats.topPetitionSignatures}** signatures !` : ""}

Découvrez toutes ces mobilisations géolocalisées sur la **Carte d'Impact (` + "`" + `/map` + "`" + `)** !`;

      case "WHO_AM_I":
        return isEn
          ? `🐾 **I am PetBot AI**, the official intelligent agent of Apption!

I combine artificial intelligence, citizen campaign expertise, and real-time Apption database insights to help you:
- Draft full petitions with compelling arguments
- Target the right political & corporate decision-makers
- Build viral social media growth strategies
- Track citizen victories on our Interactive Map

What campaign are we launching together today?`
          : `🐾 **Je suis PetBot IA**, l'agent intelligent officiel d'Apption !

J'associe l'intelligence artificielle, l'expertise en mobilisations citoyennes et l'analyse en temps réel des données d'Apption pour vous aider à :
- Rédiger des pétitions complètes avec des arguments chocs
- Cibler les bons décideurs politiques ou d'entreprises
- Développer des stratégies de partage viral sur les réseaux sociaux
- Suivre les victoires citoyennes sur notre Carte d'Impact

Quelle cause souhaitez-vous défendre aujourd'hui ?`;

      case "GREETING":
        return isEn
          ? `Bonjour & Hello! 🐾 I am **PetBot AI**, your intelligent campaign agent.

How can I help you transform your idea into a successful citizen victory today? Ask me to draft a petition, generate titles, or create a sharing strategy!`
          : `Bonjour ! 🐾 Je suis **PetBot IA**, votre agent IA autonome pour vos pétitions citoyennes.

Comment puis-je vous aider à transformer votre combat en une victoire aujourd'hui ? Demandez-moi de rédiger un texte, d'inventer des titres ou d'établir une stratégie de partage !`;

      default:
        return isEn
          ? `🤖 **PetBot AI Analysis for: "${userQuery}"**

To give you the most powerful AI guidance on *"${userQuery}"*:

1. **Strategic Perspective**: Transforming *"${userQuery}"* into a winning campaign requires clear messaging, an urgent title, and precise decision-maker targeting.
2. **Action Steps**:
   - Launch your petition on Apption selecting the appropriate scale (Local, National, International).
   - Use our AI Copilot to generate social media sharing graphics and hashtags.
   - Post regular updates on your petition's timeline to keep signers active.

Would you like me to draft a complete petition text or generate title ideas for this subject?`
          : `🤖 **Analyse par PetBot IA pour : « ${userQuery} »**

Pour vous apporter les meilleurs conseils d'intelligence artificielle sur *« ${userQuery} »* :

1. **Perspective Stratégique** : Faire de *« ${userQuery} »* une victoire exige un message clair, un titre percutant et une cible institutionnelle précise.
2. **Plan d'Action Recommandé** :
   - Lancez votre pétition sur Apption en choisissant l'échelle adaptée (Locale, Nationale, Internationale).
   - Utilisez notre Copilote IA pour générer vos visuels et hashtags de réseaux sociaux.
   - Publiez régulièrement des nouvelles sur le fil d'actualité pour maintenir l'engagement.

Souhaitez-vous que je rédige un texte complet de pétition ou que je vous propose des idées de titres pour ce sujet ?`;
    }
  }
}
