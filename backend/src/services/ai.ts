import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_STUDIO_API_KEY || "");

export async function generateScript(idea: string, language: string, duration: number) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `
You are a professional video script writer.
Generate a video script for this idea: "${idea}"

Requirements:
- Language: ${language === 'ar' ? 'Arabic' : 'English'}
- Target Duration: ${duration} seconds
- Return ONLY valid JSON (no markdown, no code fences)
- JSON structure:
{
  "title": "Catchy Title",
  "hook": "Strong opening hook",
  "scenes": [
    {
      "timestamp": "0:00",
      "visual_description": "Description of what should appear on screen",
      "narration": "Exact voiceover text",
      "onscreen_text": "Brief overlay text"
    }
  ],
  "conclusion": "Closing thought or CTA"
}

Keep narration at ~130-150 words per minute to match the duration.
Return ONLY the JSON object, nothing else.`;

  console.log("Calling Gemini 2.5 Flash...");
  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  console.log("Gemini raw response length:", text.length);

  // Clean up response - strip markdown fences if present
  const cleaned = text.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();
  const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    console.error("Could not extract JSON from:", text.substring(0, 200));
    throw new Error("AI did not return valid JSON");
  }

  return JSON.parse(jsonMatch[0]);
}
