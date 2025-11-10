// Versão de Diagnóstico (Nível 7)
import { 
    GoogleGenAI, 
    LiveSession, 
    LiveServerMessage, 
    Modality, 
    GenerateContentResponse, 
    FunctionDeclaration, 
    Type, 
    Part, 
    Content 
} from "@google/genai";
import { logger } from "./loggingService";
import { ChatMessage } from '../types';

// FIX: Added encode/decode helpers for audio processing as per guidelines.
export function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

export async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

// Function declaration for Gemini function calling
const handleNewTransactionFunctionDeclaration: FunctionDeclaration = {
  name: 'handleNewTransaction',
  description: 'Cria uma nova transação de receita ou despesa.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      description: {
        type: Type.STRING,
        description: 'A descrição da transação. Ex: "Café na padaria"',
      },
      amount: {
        type: Type.NUMBER,
        description: 'O valor da transação. Use um número negativo para despesas (ex: -25.50) e positivo para receitas (ex: 1200.00).',
      },
    },
    required: ['description', 'amount'],
  },
};

// FIX: Implemented getChatResponseStream to handle text, image, and tool-based chat interactions.
export const getChatResponseStream = (
  apiKey: string,
  chatHistory: ChatMessage[],
  prompt: string,
  imagePart: Part | null,
  useSearch: boolean,
  useMaps: boolean,
  location: { latitude: number; longitude: number } | null
) => {
  const ai = new GoogleGenAI({ apiKey });
  
  const tools: any[] = [{ functionDeclarations: [handleNewTransactionFunctionDeclaration] }];
  const toolConfig: any = {};

  if (useSearch) {
    tools.push({ googleSearch: {} });
  }
  if (useMaps) {
    tools.push({ googleMaps: {} });
    if (location) {
      toolConfig.retrievalConfig = { latLng: location };
    }
  }
  
  const history: Content[] = chatHistory.map(msg => {
    const parts: Part[] = [];
    if (msg.text) {
        parts.push({ text: msg.text });
    }
    if (msg.imageData) {
        parts.push({ inlineData: msg.imageData });
    }
    return {
        role: msg.role,
        parts
    };
  });

  const userParts: Part[] = [];
  if (imagePart) {
      userParts.push(imagePart);
  }
  if (prompt) {
      userParts.push({ text: prompt });
  }
  
  const contents: Content[] = [...history, { role: 'user', parts: userParts }];

  return ai.models.generateContentStream({
    model: 'gemini-2.5-flash',
    contents,
    config: {
        tools,
    },
    toolConfig
  });
};


// FIX: Implemented connectToLive to handle real-time voice chat sessions.
export const connectToLive = (apiKey: string, callbacks: any): Promise<LiveSession> => {
    const ai = new GoogleGenAI({ apiKey });
    const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        callbacks: callbacks,
        config: {
            responseModalities: [Modality.AUDIO],
            inputAudioTranscription: {},
            outputAudioTranscription: {},
            speechConfig: {
                voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } },
            },
            systemInstruction: 'Você é um assistente amigável e prestativo do FinanceHub.',
        },
    });
    return sessionPromise;
};