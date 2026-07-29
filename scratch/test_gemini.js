const { GoogleGenerativeAI } = require("@google/generative-ai");

const apiKey = process.env.GEMINI_API_KEY || "";
console.log("Using API Key:", apiKey.substring(0, 10) + "...");

async function run() {
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent("Hello!");
    console.log("Response text:", result.response.text());
  } catch (error) {
    console.error("Gemini Test Error:", error);
  }
}

run();
