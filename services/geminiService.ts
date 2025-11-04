
import { GoogleGenAI, Modality } from "@google/genai";
import { ChatMessage, Role } from "../types";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const fileToGenerativePart = (base64: string) => {
  const mimeType = base64.substring(5, base64.indexOf(';'));
  const data = base64.substring(base64.indexOf(',') + 1);
  return {
    inlineData: {
      data,
      mimeType,
    },
  };
};

export const generateStyledImage = async (base64Image: string, style: string): Promise<string> => {
  const imagePart = fileToGenerativePart(base64Image);
  const textPart = { text: `Reimagine this room in a ${style} interior design style. The new image should be a photorealistic rendering.` };

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: { parts: [imagePart, textPart] },
    config: {
      responseModalities: [Modality.IMAGE],
    },
  });

  const firstPart = response.candidates?.[0]?.content?.parts[0];
  if (firstPart?.inlineData) {
    const { data, mimeType } = firstPart.inlineData;
    return `data:${mimeType};base64,${data}`;
  }
  
  throw new Error("Could not find image data in response.");
};

export const refineImage = async (base64Image: string, prompt: string): Promise<string> => {
  const imagePart = fileToGenerativePart(base64Image);
  const textPart = { text: prompt };
  
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: { parts: [imagePart, textPart] },
    config: {
      responseModalities: [Modality.IMAGE],
    },
  });

  const firstPart = response.candidates?.[0]?.content?.parts[0];
  if (firstPart?.inlineData) {
    const { data, mimeType } = firstPart.inlineData;
    return `data:${mimeType};base64,${data}`;
  }
  
  throw new Error("Could not find image data in response.");
};


export const getChatResponse = async (history: ChatMessage[], newMessage: string, style: string): Promise<string> => {
  const systemInstruction = `You are an expert interior design assistant. The user has just redesigned their room in a ${style} style. Be helpful, concise, and inspiring. If the user asks for products or shoppable links, create realistic-sounding product names and provide placeholder links in markdown format, for example: [Blue Velvet Armchair](https://example.com/shop/blue-velvet-armchair). Do not mention that the links are placeholders.`;

  const chat = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction,
    },
  });
  
  // Replay history if needed. For this simple case, we can just send the new message.
  // A more complex implementation could replay the full conversation for better context.
  const response = await chat.sendMessage({ message: newMessage });
  
  return response.text;
};
   