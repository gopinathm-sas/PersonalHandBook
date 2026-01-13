import { GoogleGenAI, Type } from "@google/genai";
import { HealthData } from "../types";

// The API key must be obtained exclusively from the environment variable process.env.API_KEY.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const processInviteImage = async (base64Image: string) => {
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

  try {
    return JSON.parse(response.text || '{}');
  } catch (e) {
    console.error("Failed to parse Gemini response", e);
    return null;
  }
};

export const processReceiptImage = async (base64Image: string) => {
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

  try {
    return JSON.parse(response.text || '{}');
  } catch (e) {
    console.error("Failed to parse receipt", e);
    return null;
  }
};

export const analyzeExpenseSMS = async (smsText: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Extract expense details from this SMS/text: "${smsText}". 
    Categorize it into one of: Food, Shopping, Travel, or Home. 
    Return only valid JSON.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING, description: "The merchant or service name" },
          amount: { type: Type.NUMBER, description: "The numerical value spent" },
          category: { type: Type.STRING, enum: ["Food", "Shopping", "Travel", "Home"] },
        },
        required: ["title", "amount", "category"]
      }
    }
  });

  try {
    return JSON.parse(response.text || '{}');
  } catch (e) {
    console.error("Failed to parse expense SMS", e);
    return null;
  }
};

export const analyzeHealthData = async (data: HealthData) => {
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

  try {
    return JSON.parse(response.text || '{}');
  } catch (e) {
    console.error("Failed to parse health analysis", e);
    return null;
  }
};