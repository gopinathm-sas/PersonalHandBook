import { GoogleGenAI, Type } from "@google/genai";
import { HealthData } from "../types";

// Lazy-initialized AI client to prevent crashes during script loading
let aiInstance: GoogleGenAI | null = null;

const getAI = () => {
  if (!aiInstance) {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      console.warn("Gemini API Key is missing. AI features will be disabled.");
      return null;
    }
    aiInstance = new GoogleGenAI({ apiKey });
  }
  return aiInstance;
};

export const processInviteImage = async (base64Image: string) => {
  const ai = getAI();
  if (!ai) return null;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: base64Image,
            },
          },
          {
            text: "Extract meeting details from this image. Provide the title, date, and time in a structured format. If no specific year is mentioned, assume 2024. Return only valid JSON.",
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            dateTime: { type: Type.STRING, description: "ISO 8601 format date and time" },
            location: { type: Type.STRING },
          },
          required: ["title", "dateTime"]
        }
      },
    });
    return JSON.parse(response.text || '{}');
  } catch (e) {
    console.error("Failed to parse Gemini response", e);
    return null;
  }
};

export const processReceiptImage = async (base64Image: string) => {
  const ai = getAI();
  if (!ai) return null;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: base64Image,
            },
          },
          {
            text: "Analyze this receipt. Extract the merchant name, total amount spent, and categorize it into: Food, Shopping, Travel, or Home. Return only valid JSON.",
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            merchant: { type: Type.STRING },
            amount: { type: Type.NUMBER },
            category: { type: Type.STRING, enum: ["Food", "Shopping", "Travel", "Home"] },
          },
          required: ["merchant", "amount", "category"]
        }
      },
    });
    return JSON.parse(response.text || '{}');
  } catch (e) {
    console.error("Failed to parse receipt", e);
    return null;
  }
};

export const analyzeHealthData = async (data: HealthData) => {
  const ai = getAI();
  if (!ai) return null;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analyze this user's health data for today:
        Steps: ${data.steps}
        Calories: ${data.calories}
        Heart Rate: ${data.heartRate} BPM
        Sleep: ${data.sleepHours} hours
        Activity: ${data.activityMinutes} mins
        
        Provide a concise summary, identify 1-2 trends, and give 2 specific actionable recommendations for exercise timing or sleep quality.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            trends: { type: Type.ARRAY, items: { type: Type.STRING } },
            recommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: ["summary", "trends", "recommendations"]
        }
      }
    });
    return JSON.parse(response.text || '{}');
  } catch (e) {
    console.error("Failed to parse health analysis", e);
    return null;
  }
};