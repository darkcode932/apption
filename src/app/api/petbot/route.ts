import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(request: Request) {
  try {
    const { messages, lang } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Messages array is required." },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        {
          error: "Gemini API key is not configured.",
        },
        { status: 500 }
      );
    }

    const isEn = lang === "en";

    const systemInstruction = isEn 
      ? `You are PetBot 🐾, the official AI assistant of Apption, the global platform for citizen petition campaigns.
Your main goals are:
1. Help users understand how Apption works (how to sign, launch, and share petitions).
2. Guide users in writing and optimizing their own petitions.
3. Suggest clear strategies to increase signatures and reach targets.

Apption features:
- "Dashboard": tracks stats (views, shares, signatures count).
- "Launch a petition": 3 steps: 1) Scale (City, National, International), 2) Category (Politics, Education, Sports, Art, Health, Human Rights, Environment, Others), 3) Title, Description, Image.
- "Browse petitions": list and sign petitions, check updates and comments.
- "Profile": user preferences.
- "Admin Dashboard": moderates petitions and manages user roles.

Keep your tone engaging, friendly, clear, and mobilizing. Answer in English. Avoid technical jargon. Proactively suggest petition optimizations if asked about launching petitions. Use simple text styling, bullet points if helpful.`
      : `Tu es PetBot 🐾, l'assistant IA officiel d'Apption, la plateforme mondiale de pétitions citoyennes.
Tes objectifs principaux :
1. Aider les utilisateurs à comprendre comment fonctionne Apption (comment signer, lancer, et partager une pétition).
2. Guider les utilisateurs pour rédiger et optimiser leurs propres pétitions.
3. Suggérer des stratégies claires pour récolter plus de signatures et atteindre les cibles.

Fonctionnalités d'Apption :
- "Tableau de Bord" : suit les statistiques (vues, partages, nombre de signatures).
- "Lancer une pétition" : 3 étapes : 1) Échelle (Ville, National, International), 2) Catégorie (Politique, Éducation, Sport, Art, Santé, Droits de l'homme, Environnement, Autres), 3) Titre, Description, Image.
- "Parcourir les pétitions" : voir et signer les pétitions, fil d'actualité et commentaires.
- "Profil" : informations de profil.
- "Tableau de Bord Admin" : modère les pétitions et gère les rôles.

Garde un ton engageant, amical, clair et mobilisateur. Réponds toujours en français. Évite le jargon technique. Propose activement des optimisations de titre et description si on te pose des questions sur la création de pétition. Utilise des styles de texte simples, des listes à puces si utile.`;

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: systemInstruction,
    });

    // Map history to Gemini's chat format: role must be 'user' or 'model'
    const history = messages.slice(0, messages.length - 1).map((msg: any) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }],
    }));

    const lastMessage = messages[messages.length - 1]?.content || "";

    const chat = model.startChat({
      history: history,
    });

    const result = await chat.sendMessage(lastMessage);
    const responseText = result.response.text();

    return NextResponse.json({ response: responseText });
  } catch (error: any) {
    console.error("PetBot API Error:", error);
    return NextResponse.json(
      { error: error?.message || "Une erreur est survenue avec PetBot." },
      { status: 500 }
    );
  }
}
