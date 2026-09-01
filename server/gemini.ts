import { GoogleGenAI } from "@google/genai";

let aiInstance: GoogleGenAI | null = null;

export function getGeminiAI(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!aiInstance) {
    aiInstance = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiInstance;
}

export async function callGeminiJSON<T>(
  prompt: string,
  systemInstruction?: string,
  modelName: string = "gemini-3.7-flash"
): Promise<T | null> {
  const ai = getGeminiAI();
  if (!ai) {
    return null;
  }

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        systemInstruction: systemInstruction || "You are an expert AI college placement intelligence engine. Always output pure valid JSON.",
        responseMimeType: "application/json",
        temperature: 0.2,
      },
    });

    const text = response.text?.trim();
    if (!text) return null;

    // Clean any backticks if present
    const cleaned = text.replace(/^```json/i, '').replace(/^```/i, '').replace(/```$/, '').trim();
    return JSON.parse(cleaned) as T;
  } catch (error) {
    console.error("Gemini API call error:", error);
    return null;
  }
}
