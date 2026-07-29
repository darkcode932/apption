import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { PetBotLLMEngine, PetBotMessage } from "../../../infrastructure/ai/PetBotLLMEngine";

export async function POST(request: Request) {
  let lang = "fr";
  let messages: PetBotMessage[] = [];

  try {
    const body = await request.json();
    messages = body.messages || [];
    lang = body.lang || "fr";

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "Messages array is required." },
        { status: 400 }
      );
    }

    const lastMessage = messages[messages.length - 1]?.content || "";
    const isEn = lang === "en";

    // 1. ALWAYS TRY GEMINI LLM MODEL FIRST IF API KEY IS CONFIGURED
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      try {
        const systemInstruction = isEn
          ? `You are PetBot 🐾, the official AI assistant of Apption, the global platform for citizen petition campaigns.
Your main goals are:
1. Help users understand how Apption works (how to sign, launch, and share petitions).
2. Guide users in writing and optimizing their own petitions.
3. Suggest clear strategies to increase signatures and reach targets.
4. Explain features like the Interactive Impact Map (/map), AI Copilot, Semantic Moderation, and Civic Impact Badges.

Apption features:
- "Dashboard": tracks stats (views, shares, signatures count).
- "Launch a petition": 3 steps: 1) Scale (City, National, International), 2) Category (Politics, Education, Sports, Art, Health, Human Rights, Environment, Others), 3) Title, Description, Image.
- "Impact Map": interactive GIS map (/map) showing Citizen Victories 🏆 and Active Petitions 🔥.
- "My Impact": profile tab showing unlocked badges (Engaged Citizen, Cause Pillar, Ambassador of Change, Vector of Victory).
- "Admin Dashboard": moderates petitions, users, and AI flagged items.

Keep your tone engaging, friendly, clear, and mobilizing. Answer in English. Avoid technical jargon. Proactively offer tailored petition tips. Use markdown formatting (bolding, lists).`
          : `Tu es PetBot 🐾, l'assistant IA officiel d'Apption, la plateforme mondiale de pétitions citoyennes.
Tes objectifs principaux :
1. Aider les utilisateurs à comprendre comment fonctionne Apption (comment signer, lancer, et partager une pétition).
2. Guider les utilisateurs pour rédiger et optimiser leurs propres pétitions.
3. Suggérer des stratégies claires pour récolter plus de signatures et atteindre les cibles.
4. Expliquer les fonctionnalités comme la Carte Interactive d'Impact (/map), le Copilote IA, la Modération Sémantique et les Badges Citoyens.

Fonctionnalités d'Apption :
- "Tableau de Bord" : suit les statistiques (vues, partages, nombre de signatures).
- "Lancer une pétition" : 3 étapes : 1) Échelle (Ville, National, International), 2) Catégorie (Politique, Éducation, Sport, Art, Santé, Droits de l'homme, Environnement, Autres), 3) Titre, Description, Image.
- "Carte d'Impact" : carte GIS interactive (/map) montrant les Victoires Citoyennes 🏆 et les pétitions actives 🔥.
- "Mon Impact" : onglet du profil affichant les badges débloqués (Citoyen Engagé, Pilier de la Cause, Ambassadeur du Changement, Vecteur de Victoire).
- "Tableau de Bord Admin" : modère les pétitions, les utilisateurs et les éléments signalés par l'IA.

Garde un ton engageant, amical, clair et mobilisateur. Réponds toujours en français. Évite le jargon technique. Propose activement des conseils sur mesure pour optimiser la pétition de l'utilisateur. Utilise le formatage markdown (gras, listes à puces).`;

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
          model: "gemini-1.5-flash",
          systemInstruction: systemInstruction,
        });

        const history = messages.slice(0, messages.length - 1).map((msg) => ({
          role: msg.role === "user" ? "user" : "model",
          parts: [{ text: msg.content }],
        }));

        const chat = model.startChat({
          history: history,
        });

        const result = await chat.sendMessage(lastMessage);
        const responseText = result.response.text();

        if (responseText && responseText.trim()) {
          return NextResponse.json({ response: responseText });
        }
      } catch (geminiError) {
        console.warn("Gemini API call failed, delegating to PetBotLLMEngine:", geminiError);
      }
    }

    // 2. FALLBACK TO PETBOT GENERATIVE AI ENGINE (Local NLP Synthesis)
    const generatedResponse = PetBotLLMEngine.generateResponse(messages, lang);
    return NextResponse.json({ response: generatedResponse });

  } catch (error: any) {
    console.error("PetBot API route error:", error);
    const generatedResponse = PetBotLLMEngine.generateResponse(messages, lang);
    return NextResponse.json({ response: generatedResponse });
  }
}
