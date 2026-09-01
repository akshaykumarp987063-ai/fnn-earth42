import "dotenv/config";
import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("GEMINI_API_KEY is missing");
}

const ai = new GoogleGenAI({
  apiKey,
});

async function main() {
const response = await ai.interactions.create({
  model: "gemini-3.6-flash",
  input: "Reply with exactly: FNN AI CONNECTION WORKING",
});

console.log(response.output_text);
}

main().catch((error) => {
  console.error("Gemini test failed:");
  console.error(error);
  process.exit(1);
});
