
import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// Feature 1: Intelligent Arabic-to-English Translation Layer
export const translateAndRefineText = async (text: string): Promise<string> => {
  if (!apiKey) return text;
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Translate the following Arabic concept into a detailed English artistic description suitable for AI image generation, preserving the mood and nuance. Input: "${text}"`,
    });
    return response.text || text;
  } catch (error) {
    console.error("Translation Error:", error);
    return text;
  }
};

// Feature 3: Magic Enhance
export const magicEnhancePrompt = async (userInput: string): Promise<string> => {
  if (!apiKey) return userInput;
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `You are an expert Prompt Engineer. Take this simple input '${userInput}' and expand it into a sophisticated prompt including keywords for lighting (e.g., volumetric, cinematic), camera angles (e.g., wide shot), and texture (e.g., 8k, unreal engine 5 render). Keep it under 50 words.`,
    });
    return response.text || userInput;
  } catch (error) {
    console.error("Magic Enhance Error:", error);
    return userInput;
  }
};

// New Tool: Prompt Doctor
export const analyzePrompt = async (prompt: string): Promise<string> => {
  if (!apiKey) return "API Key missing.";
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Act as a 'Prompt Doctor'. Analyze this image generation prompt and suggest 3 specific improvements to make it better (lighting, composition, style). Also, rate the prompt from 1 to 10. Format the output clearly. Prompt: "${prompt}"`,
    });
    return response.text || "Could not analyze.";
  } catch (error) {
    console.error("Analysis Error:", error);
    return "Error during analysis.";
  }
}

// Feature 2: Dynamic Negative Prompt System & Final Generation
export const generateVideoPrompt = async (
  basePrompt: string, // This receives the translated English text
  styleSuffix: string,
  aspectRatio: string,
  targetModel: string, // Midjourney, Stable Diffusion, DALL-E 3
  negativePrompt: string
): Promise<string> => {
  if (!apiKey) {
    return "خطأ: مفتاح API غير موجود. يرجى التأكد من الإعدادات.";
  }

  try {
    const model = 'gemini-2.5-flash';
    
    // Construct the final instruction based on the target model's quirks
    let systemInstruction = `
      You are an expert AI Video Prompt Engineer.
      Task: Create a final prompt for ${targetModel}.
      
      Input Description: ${basePrompt}
      Style Keywords: ${styleSuffix}
      Aspect Ratio: ${aspectRatio}
    `;

    // Feature 2 Logic: Handle Negative Prompts dynamically
    if (targetModel === 'DALL-E 3') {
        systemInstruction += `
        \nRequirement: DALL-E 3 does not support negative prompts directly. 
        Rewrite the prompt to explicitly mention avoiding these elements: "${negativePrompt}".
        Integrate this exclusion naturally into the description.
        `;
    } else {
        systemInstruction += `
        \nRequirement: Return the prompt text. 
        `;
    }
    
    systemInstruction += `
    \nConstraint: Keep it under 100 words. Just return the prompt text.
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: systemInstruction,
    });

    let finalPrompt = response.text?.trim() || "عذراً، لم أتمكن من توليد الوصف.";

    // Feature 2 Logic: Appending negative prompts for supporting models
    if (negativePrompt.trim()) {
        if (targetModel === 'Midjourney') {
            finalPrompt += ` --no ${negativePrompt}`;
            // Add aspect ratio for Midjourney as well since we are here
            finalPrompt += ` --ar ${aspectRatio.replace(':', ':')}`; 
        } else if (targetModel === 'Stable Diffusion') {
            finalPrompt += `\nNegative prompt: ${negativePrompt}`;
        }
    }

    return finalPrompt;

  } catch (error) {
    console.error("Gemini API Error:", error);
    return "حدث خطأ أثناء الاتصال بالذكاء الاصطناعي.";
  }
};

export const translateToArabic = async (text: string): Promise<string> => {
   if (!apiKey) return text;
   try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Translate the following text to professional Arabic:\n\n${text}`,
    });
    return response.text || text;
   } catch (e) {
     return text;
   }
}

// New Feature: Image to Prompt (Reverse Engineering)
export const imageToPrompt = async (base64Image: string, mimeType: string): Promise<string> => {
  if (!apiKey) return "خطأ: مفتاح API غير موجود.";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Image
            }
          },
          {
            text: "Act as an expert AI artist. Analyze this image in extreme detail. Then, write a professional text-to-image prompt that would recreate this exact image. Specify the art style (e.g., cinematic, oil painting, 3D render), lighting conditions, camera type/angle, textures, and main subject details. The output should be the raw prompt only."
          }
        ]
      }
    });
    return response.text || "لم يتم استخراج وصف.";
  } catch (error) {
    console.error("Image to Prompt Error:", error);
    return "حدث خطأ أثناء تحليل الصورة.";
  }
};
