import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(request: Request) {
  try {
    const { text, type } = await request.json();

    if (!text || typeof text !== "string") {
      return NextResponse.json({ clean: true, reason: null, explanation: "No text provided." });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      // In offline environments or if API key is not configured, we do a basic keyword scan as fallback
      const toxicKeywords = ["insulte", "connard", "salope", "pd", "pute", "nique", "merde", "sales", "bâtard", "batard"];
      const isToxic = toxicKeywords.some(word => text.toLowerCase().includes(word));
      return NextResponse.json({
        clean: !isToxic,
        reason: isToxic ? "hate_speech" : null,
        explanation: isToxic ? "Contenu identifié comme offensant par le filtre local de mots-clés." : "Validé par le filtre local.",
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
      },
      systemInstruction: `You are an AI civic moderation API for Apption, a petition website. Your task is to analyze the provided text (which could be a comment, a timeline update, or a signature reason) and determine if it should be flagged as inappropriate.

You must output a JSON object matching this structure:
{
  "clean": boolean,
  "reason": "spam" | "hate_speech" | "harassment" | "commercial" | "off_topic" | null,
  "explanation": "string explaining why it is flagged or clean"
}

Flagging guidelines:
- "clean": True if the text is constructive, supportive, standard debate, petition content, or simple user feedback.
- "hate_speech": True if the text contains hate speech, racism, homophobia, xenophobia, calls to violence, or slurs.
- "harassment": True if it insults, demeans, or attacks a specific individual or user.
- "spam": True if it is gibberish (e.g., "sdfgsdfg"), repetitive nonsense, or random characters.
- "commercial": True if it is advertising products, services, link spamming, crypto coins, or SEO link-building.
- "off_topic": True if it is completely irrelevant to civic petitions, campaigns, or social debates.`
    });

    const prompt = `Classify this text (Type: ${type || "content"}): "${text}"`;
    const result = await model.generateContent(prompt);
    const responseText = result.response.text().trim();

    const parsed = JSON.parse(responseText);

    return NextResponse.json({
      clean: typeof parsed.clean === "boolean" ? parsed.clean : true,
      reason: parsed.reason || null,
      explanation: parsed.explanation || "Analyzed by Gemini.",
    });

  } catch (error: any) {
    console.error("Semantic Moderation API error:", error);
    // Graceful fallback to clean if Gemini fails (prevent blocking user actions)
    return NextResponse.json({
      clean: true,
      reason: null,
      explanation: "Fallback approved due to connection issue.",
    });
  }
}
