import { GoogleGenAI, GenerateContentResponse, LiveSession, LiveServerMessage, Modality } from "@google/genai";
import { ChatMessage, ChatRole } from '../types';

// Helper function to get the Gemini client using the key from localStorage
const getAiClient = (): GoogleGenAI => {
    const apiKey = localStorage.getItem('gemini_api_key');
    if (!apiKey) {
        throw new Error("Chave de API do Gemini não encontrada. Por favor, adicione sua chave nas Configurações.");
    }
    return new GoogleGenAI({ apiKey });
}

export const getChatResponseStream = async (
  history: ChatMessage[],
  prompt: string,
  image: { inlineData: { data: string; mimeType: string } } | null,
  useSearch: boolean,
  useMaps: boolean,
  location: { latitude: number; longitude: number } | null
) => {
  const ai = getAiClient(); // Initialize client with key from localStorage

  const contents = history.map(msg => ({
    role: msg.role === ChatRole.USER ? 'user' : 'model',
    parts: [{ text: msg.text || '' }],
  }));

  const userParts = [];
  if (image) {
    userParts.push(image);
  }
  userParts.push({ text: prompt });
  contents.push({ role: 'user', parts: userParts });

  const config: any = {};
  const tools: any[] = [];

  // As ferramentas de grounding (Search, Maps) são exclusivas e não podem ser misturadas com function calling.
  if (useSearch || useMaps) {
    if (useSearch) tools.push({ googleSearch: {} });
    if (useMaps) tools.push({ googleMaps: {} });
  } else {
    // Adiciona a ferramenta de function calling apenas se o grounding não estiver ativo.
    tools.push({
      functionDeclarations: [
        {
          name: 'handleNewTransaction',
          description: 'Inicia o processo de adicionar uma nova transação (despesa ou receita) quando o usuário solicitar explicitamente.',
          parameters: {
            type: 'OBJECT',
            properties: {
              description: {
                type: 'STRING',
                description: 'A descrição da transação. Ex: "Almoço", "Salário"',
              },
              amount: {
                type: 'NUMBER',
                description: 'O valor da transação. Despesas devem ser números negativos (ex: -50.00). Receitas devem ser números positivos (ex: 1000.00).',
              },
            },
            required: ['description', 'amount'],
          },
        },
      ],
    });
  }
  
  if (tools.length > 0) {
    config.tools = tools;
  }
  
  if (useMaps && location) {
    config.toolConfig = {
      retrievalConfig: {
        latLng: {
          latitude: location.latitude,
          longitude: location.longitude
        }
      }
    }
  }

  // FIX: Adicionado `await` para garantir que a promise (se houver) seja resolvida.
  // Em cenários com 'tools', a chamada pode se comportar de forma assíncrona.
  const result = await ai.models.generateContentStream({
    model: 'gemini-2.5-flash',
    contents,
    config,
  });
  return result;
};

// --- Live API and Audio Helper Functions ---

export const connectToLive = (callbacks: {
    onopen: () => void;
    onmessage: (message: LiveServerMessage) => void;
    onerror: (e: ErrorEvent) => void;
    onclose: (e: CloseEvent) => void;
}): Promise<LiveSession> => {
  const ai = getAiClient(); // Initialize client with key from localStorage
  return ai.live.connect({
    model: 'gemini-2.5-flash-native-audio-preview-09-2025',
    callbacks,
    config: {
      responseModalities: [Modality.AUDIO],
      inputAudioTranscription: {},
      outputAudioTranscription: {},
      speechConfig: {
        voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } },
      },
      systemInstruction: 'Você é um assistente financeiro amigável e prestativo chamado Fin.',
    },
  });
};

export function encode(bytes: Uint8Array): string {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export function decode(base64: string): Uint8Array {
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
