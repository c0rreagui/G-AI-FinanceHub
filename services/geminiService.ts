import { GoogleGenAI, LiveSession, LiveServerMessage, Modality, GenerateContentResponse } from "@google/genai";
import { ChatMessage, ChatRole } from '../types';

export const getChatResponseStream = async (
  apiKey: string, // A chave agora é um parâmetro
  history: ChatMessage[],
  prompt: string,
  image: { inlineData: { data: string; mimeType: string } } | null,
  useSearch: boolean,
  useMaps: boolean,
  location: { latitude: number; longitude: number } | null
) => {
  // O cliente da IA é inicializado a cada chamada com a chave fornecida.
  const ai = new GoogleGenAI({ apiKey });

  // Mapeia o histórico do chat para o formato da API
  const mappedHistory = history.map(msg => {
    const parts: ({ text: string } | { inlineData: { data: string; mimeType: string } })[] = [];
    
    if (msg.imageData) {
      parts.push({ inlineData: msg.imageData });
    }
    if (msg.text && msg.text.trim()) {
      parts.push({ text: msg.text.trim() });
    }
    
    return {
      role: msg.role === ChatRole.USER ? 'user' : 'model',
      parts,
    };
  }).filter(msg => msg.parts.length > 0) as { role: 'user' | 'model', parts: any[] }[];

  const newPromptParts = [];
  if (image) {
    newPromptParts.push(image);
  }
  if (prompt && prompt.trim()) {
    newPromptParts.push({ text: prompt });
  }

  if (newPromptParts.length === 0) {
    const emptyStream = (async function* () {
        const response: GenerateContentResponse = { text: "Por favor, digite uma mensagem ou envie uma imagem.", candidates: [], functionCalls: [] };
        yield response;
    })();
    return { stream: emptyStream, response: Promise.resolve({ text: "", candidates: [], functionCalls: [] }) };
  }

  const config: any = {};
  const tools: any[] = [];

  if (useSearch || useMaps) {
    if (useSearch) tools.push({ googleSearch: {} });
    if (useMaps) tools.push({ googleMaps: {} });
  } else {
    tools.push({
      functionDeclarations: [
        {
          name: 'handleNewTransaction',
          description: 'Inicia o processo de adicionar uma nova transação (despesa ou receita).',
          parameters: {
            type: 'OBJECT',
            properties: {
              description: { type: 'STRING', description: 'A descrição da transação. Ex: "Almoço", "Salário"' },
              amount: { type: 'NUMBER', description: 'O valor da transação. Despesas são negativas (ex: -50). Receitas são positivas (ex: 1000).' },
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
        latLng: { latitude: location.latitude, longitude: location.longitude }
      }
    }
  }

  const chat = ai.chats.create({
    model: 'gemini-2.5-flash',
    history: mappedHistory,
    config,
  });

  const result = await chat.sendMessageStream(newPromptParts);
  
  return result;
};

export const connectToLive = (apiKey: string, callbacks: { // A chave agora é um parâmetro
    onopen: () => void;
    onmessage: (message: LiveServerMessage) => void;
    onerror: (e: ErrorEvent) => void;
    onclose: (e: CloseEvent) => void;
}): Promise<LiveSession> => {
  // O cliente da IA é inicializado a cada chamada com a chave fornecida.
  const ai = new GoogleGenAI({ apiKey });
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

// --- Funções Auxiliares de Áudio (sem alteração) ---

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