// Versão de Diagnóstico (Nível 7)
import { GoogleGenAI, LiveSession, LiveServerMessage, Modality, GenerateContentResponse } from "@google/genai";
import { ChatMessage, ChatRole } from '../types';
import { logger } from "./loggingService";

export const getChatResponseStream = async ( 
  apiKey: string, 
  history: ChatMessage[], 
  prompt: string, 
  image: { inlineData: { data: string; mimeType: string } } | null, 
  useSearch: boolean, 
  useMaps: boolean, 
  location: { latitude: number; longitude: number } | null 
) => { 
  const ai = new GoogleGenAI({ apiKey });

  logger.debug("--- INICIANDO DIAGNÓSTICO (GEMINI SERVICE) ---", {
    historyCount: history.length,
    hasImage: !!image,
    useSearch,
    useMaps,
    location
  });

  // 1. Logando o histórico recebido do AIHub.tsx 
  logger.debug("[Diagnóstico] Histórico recebido:", { history });

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
  
  // 2. Logando o histórico mapeado e filtrado 
  logger.debug("[Diagnóstico] Histórico Mapeado e Filtrado:", { mappedHistory });

  const newPromptParts = []; 
  if (image) { 
    newPromptParts.push(image); 
  } 
  if (prompt && prompt.trim()) { 
    newPromptParts.push({ text: prompt }); 
  }

  // 3. Logando o prompt final 
  logger.debug("[Diagnóstico] Prompt enviado:", { newPromptParts });

  if (newPromptParts.length === 0) { 
    logger.warn("[Diagnóstico] Nenhum prompt. Enviando resposta padrão.", { component: "geminiService" });
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

  logger.info("[Diagnóstico] ENVIANDO REQUISIÇÃO PARA A API GEMINI...", { component: "geminiService" });

  try { 
    const result = await chat.sendMessageStream(newPromptParts); 
    logger.info("[Diagnóstico] Resposta recebida da API.", { component: "geminiService" });
    return result; 
  } catch (error) { 
    logger.error("--- ERRO CAPTURADO PELO DIAGNÓSTICO (GEMINI SERVICE) ---", {
        component: "geminiService",
        function: "getChatResponseStream",
        error
    });
    throw error; 
  } 
};


export const connectToLive = (apiKey: string, callbacks: { 
    onopen: () => void; 
    onmessage: (message: LiveServerMessage) => void; 
    onerror: (e: ErrorEvent) => void; 
    onclose: (e: CloseEvent) => void; 
}): Promise<LiveSession> => { 
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
