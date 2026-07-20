// scratch/test_all_available_models.mjs
import fs from "fs";

// Load .env
const envContent = fs.readFileSync(".env", "utf8");
const match = envContent.match(/GEMINI_API_KEY="([^"]+)"/);
const apiKey = match ? match[1] : null;

if (!apiKey) {
  console.error("Clé GEMINI_API_KEY introuvable dans le fichier .env");
  process.exit(1);
}

const candidateModels = [
  "gemini-2.5-flash-lite",
  "gemini-2.0-flash-lite",
  "gemini-3.1-flash-lite",
  "gemini-flash-latest",
  "gemini-2.0-flash",
  "gemini-3.5-flash",
  "gemini-2.5-flash"
];

async function checkModel(modelName) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
  const payload = {
    contents: [{ parts: [{ text: "Hello, reply with one word." }] }]
  };

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (res.ok) {
      console.log(`✓ Model ${modelName} works! Response:`, data.candidates?.[0]?.content?.parts?.[0]?.text?.trim());
      return true;
    } else {
      console.log(`✗ Model ${modelName} failed (${res.status}):`, data.error?.message || JSON.stringify(data));
      return false;
    }
  } catch (err) {
    console.log(`✗ Model ${modelName} request error:`, err.message);
    return false;
  }
}

async function run() {
  console.log("Checking candidate Gemini models...");
  for (const model of candidateModels) {
    const success = await checkModel(model);
    if (success) {
      console.log(`\n>>> RECOMMENDED WORKING MODEL: ${model} <<<`);
      break;
    }
    // Sleep a bit to avoid hitting rate limits
    await new Promise(r => setTimeout(r, 1000));
  }
}

run();
