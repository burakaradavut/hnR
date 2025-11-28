import { GoogleGenAI } from "@google/genai";
import { RoomConfig, AspectRatio, GeneratedImage } from "../types";
import { CORE_DNA_PROMPT, LENS_OPTIONS } from "../constants";

export const checkApiKey = async (): Promise<boolean> => {
  const win = window as any;
  if (win.aistudio && win.aistudio.hasSelectedApiKey) {
    return await win.aistudio.hasSelectedApiKey();
  }
  return false;
};

export const openKeySelection = async (): Promise<void> => {
  const win = window as any;
  if (win.aistudio && win.aistudio.openSelectKey) {
    await win.aistudio.openSelectKey();
  }
};

const mapAspectRatio = (ratio: AspectRatio): string => {
  switch (ratio) {
    case '1:1': return '1:1';
    case '4:5': return '3:4';
    case '9:16': return '9:16';
    case '3:2': return '4:3';
    case '2:1': return '16:9';
    case '16:9': return '16:9';
    default: return '1:1';
  }
};

const getAngleDescription = (angleVal: number): string => {
  switch (angleVal) {
    case 1.0: return "Straight Front View. Directly facing the large floor-to-ceiling windows. Symmetrical composition.";
    case 1.5: return "45° Right Angle. Showing the corner connection between the window wall and the right wall.";
    case 2.0: return "Side View (Right Wall). Facing the wall to the right of the windows.";
    case 2.5: return "Rear Corner View. Showing the corner between the right wall and the back wall.";
    case 3.0: return "Back View. Facing the back wall, looking away from the windows.";
    case 3.5: return "Left Rear Corner. Showing the corner between the back wall and the left wall.";
    case 4.0: return "Side View (Left Wall). Facing the wall to the left of the windows.";
    case 4.5: return "Front Corner View. Showing the corner between the left wall and the window wall.";
    case 5.0: return "Top Down View. Bird's eye view showing the entire floor plan and rug layout.";
    default: return "Front View.";
  }
};

export const generateRoomImage = async (
  config: RoomConfig,
  editPrompt?: string,
  sourceImage?: GeneratedImage
): Promise<{ url: string; base64Data: string; mimeType: string }> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const lensInfo = LENS_OPTIONS.find(l => l.id === config.lens);
  const lensDesc = lensInfo ? `${lensInfo.name} (${lensInfo.description})` : config.lens;
  const angleDesc = getAngleDescription(config.angle);

  // --- PROMPT CONSTRUCTION ---
  let fullPrompt = "";

  // Scenario A: User uploaded a Room Reference Image (Strict Consistency)
  if (config.roomReferenceImage) {
      fullPrompt += `STRICT REFERENCE INSTRUCTION: \n`;
      fullPrompt += `You have been provided with a specific ROOM REFERENCE IMAGE (the first image). \n`;
      fullPrompt += `You MUST keep the architecture, windows, furniture placement, wall colors, and decor EXACTLY the same as this reference image. \n`;
      fullPrompt += `DO NOT change the sofa, the tables, the plants, or the layout unless explicitly told to in "Additional Details".\n`;
      fullPrompt += `\nEXCEPTION - THE RUG:\n`;
      if (config.rugImages.length > 0) {
        fullPrompt += `REPLACE the rug in the room with the rug pattern/texture shown in the RUG REFERENCE IMAGES provided. Make the new rug fit the perspective and lighting of the room perfectly. \n`;
      } else {
        fullPrompt += `Keep the rug as is, unless asked to change it in details. \n`;
      }
      
      fullPrompt += `\nCAMERA & ATMOSPHERE:\n`;
      fullPrompt += `- Apply this Camera Style: ${lensDesc}\n`;
      fullPrompt += `- Apply this Angle Logic: ${angleDesc} (Try to match this perspective relative to the room layout)\n`;
      fullPrompt += `- Apply this Lighting: ${config.lighting.join(', ')}\n`;
  } 
  // Scenario B: No Room Reference (Generate from DNA)
  else {
      fullPrompt += `${CORE_DNA_PROMPT}\n\n`;
      fullPrompt += `SCENE SPECIFICATIONS:\n`;
      fullPrompt += `- Camera Angle: ${angleDesc}\n`;
      fullPrompt += `- Camera & Lens: ${lensDesc}\n`;
      fullPrompt += `- Lighting: ${config.lighting.join(', ')}\n`;
      
      if (config.rugImages.length > 0) {
        fullPrompt += `\nRUG INSTRUCTION: I have provided reference images of a rug. Generate the room with THIS SPECIFIC RUG on the floor. Match the pattern, colors, and texture from the rug images.\n`;
      }
  }

  // Common Parameters
  fullPrompt += `- Aspect Ratio Target: ${config.aspectRatio}\n`;
  fullPrompt += `- Rug Scale: ${config.rugScale}/10\n`;

  if (config.extraPrompt) {
    fullPrompt += `\nADDITIONAL DETAILS / CHANGES: ${config.extraPrompt}\n`;
  }

  // Edit Mode Overrides
  if (editPrompt && sourceImage) {
      fullPrompt += `\n\nEDIT INSTRUCTIONS: ${editPrompt}\n`;
      fullPrompt += `Keep the room architecture and perspective exactly the same. Apply the changes requested above.`;
  }

  // --- PART ASSEMBLY ---
  const parts: any[] = [];
  
  // 1. Reference Images need to go first for context

  // A. Room Reference (Highest Priority context if present)
  if (config.roomReferenceImage) {
      parts.push({
          inlineData: {
              mimeType: 'image/png',
              data: config.roomReferenceImage
          }
      });
  }

  // B. Rug References
  if (config.rugImages && config.rugImages.length > 0) {
      config.rugImages.forEach(base64 => {
          parts.push({
              inlineData: {
                  mimeType: 'image/png',
                  data: base64
              }
          });
      });
  }

  // C. Source Image for Editing (if in edit mode)
  if (sourceImage && sourceImage.base64Data && editPrompt) {
    parts.push({
        inlineData: {
            mimeType: sourceImage.mimeType || 'image/png',
            data: sourceImage.base64Data
        }
    });
  }

  // D. Text Prompt
  parts.push({ text: fullPrompt });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: {
        parts: parts,
      },
      config: {
        imageConfig: {
          aspectRatio: mapAspectRatio(config.aspectRatio),
          imageSize: "2K"
        }
      }
    });

    const candidates = response.candidates;
    if (!candidates || candidates.length === 0) {
      throw new Error("No candidates returned");
    }

    const outputPart = candidates[0].content.parts.find(p => p.inlineData);
    
    if (!outputPart || !outputPart.inlineData || !outputPart.inlineData.data) {
       const textPart = candidates[0].content.parts.find(p => p.text);
       if (textPart) {
         throw new Error(`Generation failed: ${textPart.text}`);
       }
       throw new Error("No image data found in response");
    }

    const base64Data = outputPart.inlineData.data;
    const mimeType = outputPart.inlineData.mimeType || 'image/png';
    const imageUrl = `data:${mimeType};base64,${base64Data}`;

    return {
        url: imageUrl,
        base64Data,
        mimeType
    };

  } catch (error: any) {
    console.error("Gemini Image Generation Error:", error);
    if (error.message?.includes("Requested entity was not found")) {
        throw new Error("API_KEY_INVALID");
    }
    throw error;
  }
};