// scratch/list_gemini_models.mjs
// Load .env
import fs from "fs";
const envContent = fs.readFileSync(".env", "utf8");
const match = envContent.match(/GEMINI_API_KEY="([^"]+)"/);
const apiKey = match ? match[1] : null;

if (!apiKey) {
  console.error("Clé GEMINI_API_KEY introuvable dans le fichier .env");
  process.exit(1);
}

async function listModels() {
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
  console.log(`Requête vers ${url.replace(apiKey, "HIDDEN_KEY")}...`);
  
  try {
    const res = await fetch(url);
    const data = await res.json();
    console.log("Statut:", res.status);
    if (data.models) {
      const filtered = data.models.filter(m => 
        m.supportedGenerationMethods.includes("generateContent") && 
        (m.name.includes("flash") || m.name.includes("pro") || m.name.includes("gemini"))
      ).map(m => m.name);
      console.log("Modèles compatibles:", filtered);
    } else {
      console.log("Données reçues:", data);
    }
  } catch (err) {
    console.error("Erreur:", err);
  }
}

listModels();
