import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { PetBotAgentEngine, PetBotMessage } from "../../../infrastructure/ai/PetBotAgentEngine";
import { petitionRepository } from "../../../infrastructure/ServiceLocator";

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

    // Fetch Live Petitions Data for RAG Context
    let livePetitionsData: any[] = [];
    try {
      livePetitionsData = await petitionRepository.getAllPetitions();
    } catch (dbErr) {
      console.warn("RAG Live petitions fetch fallback:", dbErr);
    }

    // 1. TRY GEMINI API IF VALID GEMINI KEY FORMAT (AIzaSy...)
    const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (apiKey && apiKey.startsWith("AIzaSy")) {
      try {
        const victoriesCount = livePetitionsData.filter((p) => p.status === "victory").length;
        const systemInstruction = isEn
          ? `You are PetBot AI 🐾, the autonomous campaign intelligence agent of Apption.
Your mission is to think, reason, draft complete petition copy, suggest viral growth strategies, and provide expert guidance on citizen activism.
Live Platform Knowledge: Apption has ${livePetitionsData.length} total petitions and ${victoriesCount} citizen victories on the Interactive Impact Map (/map).
Format responses with clean Markdown, bold headers, bullet points, and actionable steps.`
          : `Tu es PetBot IA 🐾, l'agent d'intelligence citoyenne autonome d'Apption.
Ta mission est de réfléchir, de raisonner, de rédiger des pétitions complètes, de proposer des stratégies de croissance virale et de fournir une expertise de haut niveau en mobilisation citoyenne.
Données en direct : Apption compte ${livePetitionsData.length} pétitions et ${victoriesCount} victoires citoyennes géolocalisées sur la Carte d'Impact (/map).
Formate tes réponses avec un markdown propre, des titres en gras, des listes à puces et des étapes concrètes.`;

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
          model: "gemini-1.5-flash",
          systemInstruction: systemInstruction,
        });

        const history = messages.slice(0, messages.length - 1).map((msg) => ({
          role: msg.role === "user" ? "user" : "model",
          parts: [{ text: msg.content }],
        }));

        const chat = model.startChat({ history });
        const result = await chat.sendMessage(lastMessage);
        const responseText = result.response.text();

        if (responseText && responseText.trim()) {
          return NextResponse.json({ response: responseText });
        }
      } catch (geminiErr) {
        console.warn("Gemini call failed, switching to PetBotAgentEngine:", geminiErr);
      }
    }

    // 2. PETBOT AUTONOMOUS AI AGENT ENGINE (Neural Reasoning + Live RAG)
    const agentResponse = await PetBotAgentEngine.generateAgentResponse(
      messages,
      lang,
      livePetitionsData
    );

    return NextResponse.json({ response: agentResponse });

  } catch (error: any) {
    console.error("PetBot API route error:", error);
    const agentResponse = await PetBotAgentEngine.generateAgentResponse(
      messages,
      lang,
      []
    );
    return NextResponse.json({ response: agentResponse });
  }
}
