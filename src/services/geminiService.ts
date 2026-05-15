import { GoogleGenAI, Type } from "@google/genai";
import { Sentiment } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export async function analyzeSentiment(text: string): Promise<Sentiment> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyze the sentiment of the following text and return a single word either "positive", "neutral", or "negative":\n\n"${text}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            sentiment: {
              type: Type.STRING,
              enum: ["positive", "neutral", "negative"],
            },
          },
          required: ["sentiment"],
        },
      },
    });

    const result = JSON.parse(response.text || "{}");
    return result.sentiment as Sentiment;
  } catch (error) {
    console.error("Sentiment analysis failed:", error);
    // Fallback to basic keyword matching if API fails
    const lower = text.toLowerCase();
    const pos = ['good', 'great', 'best', 'love', 'fantastic', 'excellent', 'happy'];
    const neg = ['bad', 'worst', 'hate', 'terrible', 'slow', 'poor', 'awful'];
    
    if (pos.some(w => lower.includes(w))) return 'positive';
    if (neg.some(w => lower.includes(w))) return 'negative';
    return 'neutral';
  }
}
