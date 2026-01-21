
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function refineNoteWithAI(text: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Transform the following raw notes into a beautifully structured note card format. 
      Extract a concise title, refine the main content into clear paragraphs or bullet points, and suggest 2-3 relevant tags.
      
      RAW NOTES:
      ${text}
      
      OUTPUT JSON FORMAT:
      {
        "title": "A short, engaging title",
        "content": "Refined and structured text content",
        "tags": ["tag1", "tag2"]
      }`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            content: { type: Type.STRING },
            tags: { 
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["title", "content", "tags"]
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("AI Refinement Error:", error);
    throw error;
  }
}
