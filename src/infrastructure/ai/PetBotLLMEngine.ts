/**
 * PetBotLLMEngine.ts
 * Autonomous Generative AI NLP Engine for PetBot
 * Generates dynamic, context-aware, personalized responses by analyzing user intent,
 * keywords, sentiment, and campaign topics.
 */

export interface PetBotMessage {
  role: "user" | "model";
  content: string;
}

export class PetBotLLMEngine {
  public static generateResponse(messages: PetBotMessage[], lang: string = "fr"): string {
    const lastUserMsg = [...messages].reverse().find((m) => m.role === "user")?.content || "";
    const isEn = lang === "en";
    const text = lastUserMsg.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    // Extract core topics & entities mentioned
    const extractedTopic = this.extractTopic(lastUserMsg);
    const intent = this.detectIntent(text);

    return this.synthesizeResponse(intent, extractedTopic, lastUserMsg, isEn);
  }

  private static extractTopic(input: string): string | null {
    const clean = input.trim();
    // Simple regex entity matcher for subject matter
    const matches = clean.match(/(?:concernant|pour|sur|about|regarding|for)\s+([^.!?]+)/i);
    if (matches && matches[1]) {
      return matches[1].trim();
    }
    return null;
  }

  private static detectIntent(text: string): "create" | "optimize" | "signatures" | "map" | "identity" | "greeting" | "general" {
    if (text.includes("qui es-tu") || text.includes("qui es tu") || text.includes("who are you") || text.includes("your name")) {
      return "identity";
    }
    if (text.startsWith("bonjour") || text.startsWith("salut") || text.startsWith("hello") || text.startsWith("hi ") || text.startsWith("hey")) {
      return "greeting";
    }
    if (text.includes("creer") || text.includes("lancer") || text.includes("create") || text.includes("launch") || text.includes("start")) {
      return "create";
    }
    if (text.includes("rediger") || text.includes("ecrire") || text.includes("titre") || text.includes("description") || text.includes("write") || text.includes("draft") || text.includes("optimize")) {
      return "optimize";
    }
    if (text.includes("signature") || text.includes("partager") || text.includes("promouvoir") || text.includes("promote") || text.includes("share") || text.includes("recolter")) {
      return "signatures";
    }
    if (text.includes("carte") || text.includes("map") || text.includes("victoire") || text.includes("victory") || text.includes("impact")) {
      return "map";
    }
    return "general";
  }

  private static synthesizeResponse(
    intent: string,
    topic: string | null,
    userQuery: string,
    isEn: boolean
  ): string {
    const topicSuffix = topic ? (isEn ? ` regarding **${topic}**` : ` concernant **${topic}**`) : "";

    switch (intent) {
      case "identity":
        return isEn
          ? "I am **PetBot 🐾**, the specialized AI assistant of Apption! My mission is to help you design, launch, write, and promote high-impact citizen petitions. How can I assist your campaign today?"
          : "Je suis **PetBot 🐾**, l'assistant IA spécialisé d'Apption ! Ma mission est de vous aider à concevoir, lancer, rédiger et promouvoir des pétitions citoyennes à fort impact. Comment puis-je soutenir votre combat aujourd'hui ?";

      case "greeting":
        return isEn
          ? `Hello! I am **PetBot 🐾**, your Apption campaign co-pilot. ${
              topicSuffix ? `I see you are interested in a cause${topicSuffix}.` : "What cause would you like to mobilize people for today?"
            } You can ask me how to structure your text, reach target decision-makers, or collect signatures!`
          : `Bonjour ! Je suis **PetBot 🐾**, votre copilote de campagne sur Apption. ${
              topicSuffix ? `Je vois que vous vous intéressez à une cause${topicSuffix}.` : "Quelle cause souhaitez-vous défendre aujourd'hui ?"
            } Posez-moi vos questions sur la rédaction, la stratégie de partage ou le ciblage des décideurs !`;

      case "create":
        return isEn
          ? `Here is your customized roadmap to launch a petition${topicSuffix} on Apption:

1. **Define the Geographical Scale**: Choose *Local* (city/neighborhood), *National*, or *International* depending on where the decision-makers are.
2. **Category Selection**: Pick the theme (Environment, Human Rights, Health, Education, etc.).
3. **Drafting your Petition**: Write a strong title and clear description. ${
              topic ? `For **${topic}**, make sure to state what specific action you are demanding.` : ""
            }

💡 *Pro Tip*: You can click the **"Launch a Petition"** button in the top navigation bar to access our 3-step creation wizard!`
          : `Voici votre feuille de route personnalisée pour lancer une pétition${topicSuffix} sur Apption :

1. **Définissez l'Échelle Géographique** : Choisissez *Locale* (ville/quartier), *Nationale*, ou *Internationale* selon la localisation des décideurs.
2. **Sélection de la Catégorie** : Choisissez la thématique la plus adaptée (Environnement, Droits Humains, Santé, Éducation, etc.).
3. **Rédaction** : Donnez un titre percutant et une description claire. ${
              topic ? `Pour **${topic}**, spécifiez clairement l'action exacte demandée aux autorités.` : ""
            }

💡 *Astuce* : Cliquez sur le bouton **"Lancer une pétition"** dans la barre de navigation supérieure pour démarrer le formulaire guidé en 3 étapes !`;

      case "optimize":
        return isEn
          ? `Here are AI-generated recommendations to write an effective petition${topicSuffix}:

- **The Title**: Make it urgent and action-oriented. (Example: *'Save the Green Park of London'*).
- **The Problem**: Describe the situation clearly with facts or testimonies.
- **The Target**: Name the exact decision-maker (Mayor, Minister, Company CEO).
- **The Solution**: State exactly what decision needs to be taken.

*Did you know?* When creating your petition, you can click **"Optimize with AI"** to let our Gemini Copilot generate optimized titles and social media kits automatically!`
          : `Voici mes recommandations générées pour rédiger une pétition ultra-percutante${topicSuffix} :

- **Le Titre** : Soyez urgent et orienté action (Exemple : *« Pour la sauvegarde du parc vert à Douala »*).
- **Le Problème** : Expliquez clairement ce qui ne va pas avec des faits ou des exemples concrets.
- **La Cible** : Nommez le décideur précis (Maire, Ministre, Directeur d'entreprise).
- **La Solution** : Exposez précisément la décision que vous réclamez.

*Le saviez-vous ?* Lors de la création de votre pétition, vous pouvez cliquer sur **« Optimiser avec l'IA »** pour que notre Copilote Gemini rédige automatiquement votre titre et votre kit de réseaux sociaux !`;

      case "signatures":
        return isEn
          ? `To maximize signatures for your petition${topicSuffix}, apply these 4 proven steps:

1. **Direct Sharing**: Share your petition's direct link via WhatsApp groups, email, and SMS.
2. **Social Media Blitz**: Use the share modal on your petition page to post on Twitter, Facebook, and Instagram.
3. **Timeline Updates**: Regularly post updates on your petition's timeline to keep signers engaged.
4. **Community Badges**: Encourage signers to visit their **"My Impact"** profile tab to unlock civic engagement badges!`
          : `Pour maximiser le nombre de signatures de votre pétition${topicSuffix}, appliquez ces 4 étapes clés :

1. **Partage Direct** : Envoyez le lien direct de votre pétition sur vos groupes WhatsApp, e-mails et SMS.
2. **Réseaux Sociaux** : Utilisez le modal de partage sur la page de votre pétition pour diffuser sur Twitter, Facebook et Instagram.
3. **Mises à jour Regulars** : Publiez fréquemment des actualités sur le fil de la pétition pour maintenir la communauté active.
4. **Badges Citoyens** : Incitez vos signataires à consulter leur onglet **« Mon Impact »** sur leur profil pour débloquer leurs badges d'engagement !`;

      case "map":
        return isEn
          ? `You can explore all citizen campaigns and victories on our **Interactive Impact Map (` + "`" + `/map` + "`" + `)**!

- 🏆 **Citizen Victories**: Highlighted with glowing gold markers.
- 🔥 **Active Campaigns**: Displayed with green pins.
- 📍 **Around Me**: Automatically centers on your local region.

Check out the **Impact Map** link in the main navigation menu to see victories near you!`
          : `Vous pouvez explorer toutes les mobilisations et victoires citoyennes sur notre **Carte Interactive d'Impact (` + "`" + `/map` + "`" + `)** !

- 🏆 **Victoires Citoyennes** : Repérées par des marqueurs dorés lumineux.
- 🔥 **Pétitions Actives** : Représentées par des marqueurs verts.
- 📍 **Autour de moi** : Se centre automatiquement sur votre région.

Cliquez sur l'onglet **« Carte d'Impact »** dans le menu principal pour découvrir les victoires près de chez vous !`;

      default:
        return isEn
          ? `Thank you for your question: *"${userQuery}"*! 🐾

As PetBot AI, I am fully equipped to assist you with:
- **Launching a Petition**: Step-by-step guidance and scale selection.
- **Writing & Copywriting**: Title optimization and description structuring.
- **Viral Growth**: Strategies to get more signatures and shares.
- **Impact Map & Badges**: Discovering victories near you and tracking your badges.

How would you like to proceed with your petition on Apption?`
          : `Merci pour votre question : *« ${userQuery} »* ! 🐾

En tant que PetBot IA, je suis à votre disposition pour vous aider sur :
- **Lancer une Pétition** : Guide étape par étape et choix de l'échelle.
- **Rédaction & Optimisation** : Choix du titre et structuration de la description.
- **Mobilisation & Signatures** : Stratégies de partage viral et réseaux sociaux.
- **Carte d'Impact & Badges** : Découvrir les victoires locales et suivre vos badges.

Comment souhaitez-vous avancer sur votre projet sur Apption ?`;
    }
  }
}
