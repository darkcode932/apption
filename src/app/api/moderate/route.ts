import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(request: Request) {
  try {
    const { text, type } = await request.json();

    if (!text || typeof text !== "string") {
      return NextResponse.json({ clean: true, reason: null, explanation: "No text provided." });
    }

    const toxicKeywords = ["insulte", "connard", "salope", "pd", "pute", "nique", "merde", "bâtard", "batard"];
    const isToxic = toxicKeywords.some(word => text.toLowerCase().includes(word));

    const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    // Only attempt Gemini call if apiKey is valid format (starts with AIzaSy)
    if (!apiKey || !apiKey.startsWith("AIzaSy")) {
      return NextResponse.json({
        clean: !isToxic,
        reason: isToxic ? "hate_speech" : null,
        explanation: isToxic
          ? "Contenu identifié comme offensant par le filtre local de mots-clés."
          : "Validé par le filtre de modération local (0 ms).",
      });
    }

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        generationConfig: {
          responseMimeType: "application/json",
        },
        systemInstruction: `You are an AI civic moderation API for Apption, a petition website. Your task is to analyze the provided text (comment, update, or signature reason) and determine if it should be flagged.
Output JSON:
{
  "clean": boolean,
  "reason": "spam" | "hate_speech" | "harassment" | "commercial" | "off_topic" | null,
  "explanation": "string"
}`,
      });

      const prompt = `Classify this text (Type: ${type || "content"}): "${text}"`;
      const result = await model.generateContent(prompt);
      const responseText = result.response.text().trim();
      const parsed = JSON.parse(responseText);

      return NextResponse.json({
        clean: typeof parsed.clean === "boolean" ? parsed.clean : true,
        reason: parsed.reason || null,
        explanation: parsed.explanation || "Analyzed by Gemini AI.",
      });
    } catch (geminiError) {
      console.warn("Gemini moderation call fallback to local keyword scan:", geminiError);
      return NextResponse.json({
        clean: !isToxic,
        reason: isToxic ? "hate_speech" : null,
        explanation: isToxic ? "Détecté par le filtre local de sécurité." : "Validé par le filtre local.",
      });
    }

  } catch (error: any) {
    console.error("Semantic Moderation API error:", error);
    return NextResponse.json({
      clean: true,
      reason: null,
      explanation: "Approved by safety fallback.",
    });
  }
}
