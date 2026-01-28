import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const getAIResponse = async (userMessage: string, context?: string): Promise<string> => {
  if (!apiKey) {
    return "API Key is missing. Please check your configuration.";
  }

  try {
    const systemInstruction = `You are CodeSprintAI, an expert coding mentor. 
    Your goal is to help users learn algorithms and data structures. 
    Keep answers concise, encouraging, and technically accurate. 
    If the user asks for a solution, guide them with hints first before giving code.
    Context: ${context || 'General coding dashboard'}`;

    const model = 'gemini-3-flash-preview';
    
    const response = await ai.models.generateContent({
      model: model,
      contents: userMessage,
      config: {
        systemInstruction: systemInstruction,
      }
    });

    return response.text || "I couldn't generate a response at this time.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Sorry, I'm having trouble connecting to the AI server right now.";
  }
};

export const getDailyMotivation = async (userName: string): Promise<string> => {
   if (!apiKey) return "Keep pushing your limits!";
   
   try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Give a short, punchy, 1-sentence motivation for a coder named ${userName} who is learning Data Structures.`,
    });
    return response.text || "Code, Sleep, Repeat!";
   } catch (e) {
     return "Consistency is key to mastery.";
   }
}