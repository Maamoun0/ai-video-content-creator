import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_STUDIO_API_KEY || "");

export async function generateScript(idea: string, language: string, duration: number) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

  const prompt = `
    You are a professional video script writer and content creator.
    Generate a highly engaging video script based on this idea: "${idea}"
    
    Requirements:
    - Language: ${language === 'ar' ? 'Arabic' : 'English'}
    - Target Duration: ${duration} seconds
    - Format: JSON
    - Structure: 
      {
        "title": "Catchy Title",
        "hook": "Strong opening hook",
        "scenes": [
          {
            "timestamp": "0:00",
            "visual_description": "Detailed visual description for image generation",
            "narration": "The exact words to be spoken by the voiceover",
            "onscreen_text": "Brief text overlay"
          }
        ],
        "conclusion": "Final CTA or closing thought"
      }
    
    Make sure the narration matches the duration closely (about 130-150 words per minute).
    Provide ONLY the raw JSON.
  `;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  
  // Extract JSON from potential markdown blocks or raw text
  const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
  const jsonMatch = cleanText.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    console.error("Raw AI Text:", text);
    throw new Error("Failed to parse AI response as JSON");
  }
  
  return JSON.parse(jsonMatch[0]);
}
