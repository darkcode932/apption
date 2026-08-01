import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

function generateLocalCopilotKit(title: string, description: string, scale: string, category: string, isEn: boolean) {
  const cleanTitle = title.trim();
  const scaleStr = scale ? ` (${scale})` : "";

  return {
    optimizedTitle: isEn
      ? `Urgent Action: ${cleanTitle}${scaleStr}`
      : `Action Urgente : ${cleanTitle}${scaleStr}`,
    optimizedDescription: isEn
      ? `The Problem:\n${description}\n\nWhy We Need Action:\nCitizens and local communities deserve immediate attention and concrete changes.\n\nOur Demands:\n1. Immediate intervention by responsible authorities.\n2. Transparent progress reports.\n3. Dedicated budget and resources.`
      : `Le Constat :\n${description}\n\nPourquoi l'Action est Indispensable :\nLes citoyens et les communautés méritent une attention immédiate et des changements concrets.\n\nNos Exigences :\n1. Intervention immédiate des autorités responsables.\n2. Rapports de suivi transparents.\n3. Allocation de moyens et ressources dédiés.`,
    suggestedTargets: isEn
      ? ["Competent Municipal/National Authorities", "Relevant Department Directors"]
      : ["Autorités Municipales/Nationales Compétentes", "Direction des Services Concernés"],
    socialKit: {
      twitter: isEn
        ? `I just supported: "${cleanTitle}". Join the movement on Apption! #CitizenImpact #ActNow`
        : `Je viens de soutenir : « ${cleanTitle} ». Rejoignez la mobilisation sur Apption ! #ImpactCitoyen #AgirEnsemble`,
      facebook: isEn
        ? `Mobilization Alert! Discover and sign the petition: "${cleanTitle}". Together, let's make our voices heard!`
        : `Alerte Mobilisation ! Découvrez et signez la pétition : « ${cleanTitle} ». Ensemble, faisons entendre notre voix !`,
      whatsapp: isEn
        ? `Hello! I need your support for this petition: "${cleanTitle}". Please sign and share!`
        : `Bonjour ! J'ai besoin de votre soutien pour cette pétition : « ${cleanTitle} ». Merci de signer et de partager !`,
    },
  };
}

export async function POST(request: Request) {
  try {
    const { title, description, scale, category, lang } = await request.json();
    const isEn = lang === "en";

    if (!title || !description) {
      const errorMsg = isEn
        ? "Title and description are required."
        : "Le titre et la description sont obligatoires.";
      return NextResponse.json({ error: errorMsg }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;

    // Fast local copilot generator if API key is invalid format (starts with AIzaSy)
    if (!apiKey || !apiKey.startsWith("AIzaSy")) {
      const localKit = generateLocalCopilotKit(title, description, scale, category, isEn);
      return NextResponse.json(localKit);
    }

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        generationConfig: { responseMimeType: "application/json" },
      });

      const prompt = isEn
        ? `Optimize this petition project in plain text without any markdown asterisks (no **bold**):
Category: ${category || "General"}
Scale: ${scale || "National"}
Proposed Title: "${title}"
Proposed Description: "${description}"

Output JSON:
{
  "optimizedTitle": "string",
  "optimizedDescription": "string",
  "suggestedTargets": ["string"],
  "socialKit": { "twitter": "string", "facebook": "string", "whatsapp": "string" }
}`
        : `Optimise ce projet de pétition en texte brut sans aucun astérisque markdown (pas de **gras**) :
Catégorie: ${category || "Général"}
Échelle: ${scale || "National"}
Titre proposé: "${title}"
Description proposée: "${description}"

Format JSON attendu:
{
  "optimizedTitle": "string",
  "optimizedDescription": "string",
  "suggestedTargets": ["string"],
  "socialKit": { "twitter": "string", "facebook": "string", "whatsapp": "string" }
}`;

      const result = await model.generateContent(prompt);
      const responseText = result.response.text().trim();
      const parsed = JSON.parse(responseText);

      // Clean leftover markdown asterisks if any
      if (parsed.optimizedTitle) parsed.optimizedTitle = parsed.optimizedTitle.replace(/\*\*(.+?)\*\*/g, "$1").replace(/\*/g, "");
      if (parsed.optimizedDescription) parsed.optimizedDescription = parsed.optimizedDescription.replace(/\*\*(.+?)\*\*/g, "$1").replace(/\*/g, "");

      return NextResponse.json(parsed);
    } catch (geminiError) {
      console.warn("Gemini Copilot API call fallback to local kit generator:", geminiError);
      const localKit = generateLocalCopilotKit(title, description, scale, category, isEn);
      return NextResponse.json(localKit);
    }

  } catch (error: any) {
    console.error("AI Copilot API route error:", error);
    return NextResponse.json({
      optimizedTitle: "Pétition Citoyenne pour le Changement",
      optimizedDescription: "Veuillez préciser la description de votre cause.",
      suggestedTargets: ["Décideurs Compétents"],
      socialKit: { twitter: "", facebook: "", whatsapp: "" }
    });
  }
}
