import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(request: Request) {
  try {
    const { title, description, scale, category } = await request.json();

    if (!title || !description) {
      return NextResponse.json(
        { error: "Le titre et la description sont obligatoires." },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        {
          error:
            "La clé API Gemini n'est pas configurée sur le serveur. Veuillez configurer GEMINI_API_KEY dans votre fichier .env.",
        },
        { status: 500 }
      );
    }

    // Initialize Google Gen AI
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-3.1-flash-lite",
      generationConfig: { responseMimeType: "application/json" },
    });

    const prompt = `Tu es un copilote expert en communication et militantisme citoyen. Ton rôle est de perfectionner un projet de pétition pour maximiser son taux de signature et son impact public.

Analyse la pétition suivante :
- Catégorie : ${category || "Non spécifiée"}
- Échelle géographique : ${scale || "Non spécifiée"}
- Titre proposé : "${title}"
- Description proposée : "${description}"

Génère une réponse JSON stricte qui respecte exactement la structure suivante :
{
  "optimizedTitle": "Un titre de pétition accrocheur, percutant et persuasif, d'environ 10 à 15 mots maximum.",
  "optimizedDescription": "Une description structurée et convaincante de la pétition. Utilise un ton engageant, des paragraphes clairs et des puces pour lister les arguments principaux et l'appel à l'action.",
  "suggestedTargets": [
    "Cible spécifique 1 (ex: Le Directeur Général de Camwater)",
    "Cible spécifique 2 (ex: Le Ministre de l'Eau et de l'Énergie)"
  ],
  "socialKit": {
    "twitter": "Un tweet d'impact avec hashtags pertinents pour partager la pétition (sans lien URL, juste le texte).",
    "facebook": "Un post de partage Facebook engageant racontant l'histoire en quelques phrases (sans lien URL).",
    "whatsapp": "Un message court, direct et mobilisateur pour WhatsApp (sans lien URL)."
  }
}`;

    const result = await model.generateContent(prompt);
    const textResponse = result.response.text();
    
    // Parse response to ensure validity
    let cleanedText = textResponse.trim();
    if (cleanedText.startsWith("```json")) {
      cleanedText = cleanedText.substring(7);
    } else if (cleanedText.startsWith("```")) {
      cleanedText = cleanedText.substring(3);
    }
    if (cleanedText.endsWith("```")) {
      cleanedText = cleanedText.substring(0, cleanedText.length - 3);
    }
    cleanedText = cleanedText.trim();

    const parsedData = JSON.parse(cleanedText);

    return NextResponse.json(parsedData);
  } catch (error: any) {
    console.error("AI Copilot API Error:", error);
    return NextResponse.json(
      { error: error?.message || "Une erreur est survenue lors de la génération avec l'IA." },
      { status: 500 }
    );
  }
}
