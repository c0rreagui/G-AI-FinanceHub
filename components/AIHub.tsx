import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ChatMessage, ChatRole, TransactionType } from '../types';
import { ChatMessageDisplay } from './ChatMessageDisplay';
import { LoadingSpinner } from './LoadingSpinner';
import { MicIcon, PaperclipIcon, SendIcon, SearchIcon, MapPinIcon, HomeIcon } from './Icons';
import { getChatResponseStream, connectToLive, encode, decode, decodeAudioData } from '../services/geminiService';
import { useGeolocation } from '../hooks/useGeolocation';
import { LiveServerMessage, LiveSession, Blob as GenAiBlob } from '@google/ai/generativelanguage';
import { PageHeader } from './layout/PageHeader';
import { LiveStatusIndicator } from './ui/LiveStatusIndicator';
import { useDialog } from '../hooks/useDialog';
import { GenerateContentResponse } from '@google/genai';
import { useAuth } from '../hooks/useAuth';
import { ErrorModal } from './ui/ErrorModal';
import { motion, AnimatePresence } from 'framer-motion';
import { logger } from '../services/loggingService';

// --- Funções Auxiliares para o AIHub ---

/**
 * Processa a resposta em streaming da API Gemini, atualizando a mensagem do modelo em tempo real.
 */
const processStreamedResponse = async (
  stream: AsyncGenerator<GenerateContentResponse>,
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>
) => {
  let fullResponse = "";
  let groundingData: any[] = [];
  setMessages(prev => [...prev, { role: ChatRole.MODEL, text: "", isTyping: true }]);

  for await (const chunk of stream) {
    const chunkText = chunk.text ?? '';
    fullResponse += chunkText;
    
    if (chunk.candidates?.[0]?.groundingMetadata?.groundingChunks) {
      groundingData = chunk.candidates[0].groundingMetadata.groundingChunks;
    }

    setMessages(prev => {
      const newMessages = [...prev];
      const lastMessage = newMessages[newMessages.length - 1];
      if (lastMessage?.role === ChatRole.MODEL) {
        lastMessage.text = fullResponse;
        lastMessage.grounding = groundingData;
      }
      return newMessages;
    });
  }
  return { fullResponse, groundingData };
};

/**
 * Lida com as chamadas de função retornadas pela API Gemini.
 */
const handleFunctionCall = (
  response: GenerateContentResponse,
  openDialog: (type: any, props?: any) => void,
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>
) => {
  const part = response.candidates[0]?.content.parts.find((p: any) => p.functionCall);
  const call = part?.functionCall;

  if (call && call.name === 'handleNewTransaction') {
    const args = call.args;
    const prefillData = {
      description: args.description || '',
      amount: Math.abs(args.amount || 0),
      type: (args.amount < 0) ? TransactionType.DESPESA : TransactionType.RECEITA,
    };

    openDialog('add-transaction', { prefill: prefillData });

    setMessages(prev => [
      ...prev,
      {
        role: ChatRole.MODEL,
        text: `Claro! Abri o formulário para você. Por favor, revise os detalhes e clique em "Salvar".`,
      },
    ]);
  }
};

/**
 * Processa as mensagens recebidas da sessão de chat de voz (Live API).
 */
const processLiveMessage = async (
    message: LiveServerMessage,
    setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>,
    outputAudioContextRef: React.MutableRefObject<AudioContext | null>,
    nextAudioStartTimeRef: React.MutableRefObject<number>,
    audioSourcesRef: React.MutableRefObject<Set<AudioBufferSourceNode>>
) => {
    const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
    if (base64Audio && outputAudioContextRef.current) {
        const ctx = outputAudioContextRef.current;
        nextAudioStartTimeRef.current = Math.max(nextAudioStartTimeRef.current, ctx.currentTime);
        const audioBuffer = await decodeAudioData(decode(base64Audio), ctx, 24000, 1);
        const sourceNode = ctx.createBufferSource();
        sourceNode.buffer = audioBuffer;
        sourceNode.connect(ctx.destination);
        sourceNode.addEventListener('ended', () => audioSourcesRef.current.delete(sourceNode));
        sourceNode.start(nextAudioStartTimeRef.current);
        nextAudioStartTimeRef.current += audioBuffer.duration;
        audioSourcesRef.current.add(sourceNode);
    }

    if (message.serverContent?.interrupted) {
        for (const source of audioSourcesRef.current.values()) {
            source.stop();
        }
        audioSourcesRef.current.clear();
        nextAudioStartTimeRef.current = 0;
    }

    setMessages(prev => {
        let newMessages = [...prev];
        const inputTx = message.serverContent?.inputTranscription?.text;
        const outputTx = message.serverContent?.outputTranscription?.text;

        if (inputTx) {
            const last = newMessages[newMessages.length - 1];
            if (last?.role === ChatRole.USER && last.isTyping) {
                last.text += inputTx;
            } else {
                newMessages.push({ role: ChatRole.USER, text: inputTx, isTyping: true });
            }
        }

        if (outputTx) {
            const last = newMessages[newMessages.length - 1];
            if (last?.role === ChatRole.MODEL && last.isTyping) {
                last.text += outputTx;
            } else {
                if (last?.role === ChatRole.USER && last.isTyping) last.isTyping = false;
                newMessages.push({ role: ChatRole.MODEL, text: outputTx, isTyping: true });
            }
        }

        if (message.serverContent?.turnComplete) {
            newMessages = newMessages.map(m => ({ ...m, isTyping: false }));
        }
        return newMessages;
    });
};


// --- Componente Principal do AIHub ---

export const AIHub: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: ChatRole.MODEL, text: "Olá! Sou o assistente de IA do FinanceHub. Como posso ajudar com suas finanças hoje? Você pode me fazer perguntas, enviar um comprovante ou iniciar um bate-papo por voz." }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [image, setImage] = useState<{ url: string; data: string; mimeType: string } | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [liveStatus, setLiveStatus] = useState<'idle' | 'connecting' | 'connected' | 'error' | 'closing'>('idle');
  const [apiError, setApiError] = useState<string | null>(null);
  
  const [useSearch, setUseSearch] = useState(false);
  const [useMaps, setUseMaps] = useState(false);
  
  const { location, error: geoError } = useGeolocation();
  const { openDialog } = useDialog();
  const { apiKey } = useAuth();

  const sessionPromise = useRef<Promise<LiveSession> | null>(null);
  const inputAudioContext = useRef<AudioContext | null>(null);
  const outputAudioContext = useRef<AudioContext | null>(null);
  const mediaStream = useRef<MediaStream | null>(null);
  const scriptProcessor = useRef<ScriptProcessorNode | null>(null);
  const nextAudioStartTime = useRef(0);
  const audioSources = useRef<Set<AudioBufferSourceNode>>(new Set());

  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64String = (event.target?.result as string).split(',')[1];
        setImage({ url: URL.createObjectURL(file), data: base64String, mimeType: file.type });
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleSend = async () => {
    if (!apiKey) {
        setApiError("Por favor, configure sua chave de API do Gemini nas Configurações para conversar com a IA.");
        return;
    }
    if (!input.trim() && !image) return;
    setIsLoading(true);

    const imagePayload = image ? { inlineData: { data: image.data, mimeType: image.mimeType } } : null;
    const chatHistory: ChatMessage[] = messages.filter(m => !m.isTyping && (m.text || m.imageData));
    
    const userMessage: ChatMessage = { role: ChatRole.USER, text: input };
    if (image) {
      userMessage.imageUrl = image.url;
      userMessage.imageData = imagePayload?.inlineData;
    }
    
    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setImage(null);
    
    try {
      const result = await getChatResponseStream(apiKey, chatHistory, currentInput, imagePayload, useSearch, useMaps, location);
      const { fullResponse, groundingData } = await processStreamedResponse(result.stream, setMessages);
      
      setMessages(prev => {
          const newMessages = [...prev];
          const lastMessage = newMessages[newMessages.length - 1];
          if (lastMessage?.role === ChatRole.MODEL && lastMessage.isTyping) {
              if (fullResponse.trim()) {
                  lastMessage.text = fullResponse;
                  lastMessage.grounding = groundingData;
                  lastMessage.isTyping = false;
              } else {
                  return newMessages.slice(0, -1);
              }
          }
          return newMessages;
      });

      const finalResponse = await result.response;
      handleFunctionCall(finalResponse, openDialog, setMessages);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Ocorreu um erro desconhecido ao se comunicar com a IA.";
      logger.error('Erro na comunicação com a API Gemini', { 
        component: 'AIHub',
        error: error 
      });
      setApiError(errorMessage);
      setMessages(prev => prev.filter(m => !m.isTyping));
    } finally {
      setIsLoading(false);
    }
  };

  const cleanupLiveSession = useCallback(() => {
    if (mediaStream.current) {
      mediaStream.current.getTracks().forEach(track => track.stop());
      mediaStream.current = null;
    }
    if (scriptProcessor.current) {
      scriptProcessor.current.disconnect();
      scriptProcessor.current = null;
    }
    if (inputAudioContext.current?.state !== 'closed') inputAudioContext.current?.close();
    if (outputAudioContext.current?.state !== 'closed') outputAudioContext.current?.close();

    sessionPromise.current = null;
    audioSources.current.clear();
    nextAudioStartTime.current = 0;
    setLiveStatus('idle');
    setIsRecording(false);
  }, []);

  const setupLiveSession = useCallback(async () => {
    if (!apiKey) {
      setApiError("Por favor, configure sua chave de API do Gemini nas Configurações para usar o chat de voz.");
      setIsRecording(false);
      return;
    }
    setLiveStatus('connecting');
    inputAudioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
    outputAudioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    nextAudioStartTime.current = 0;

    sessionPromise.current = connectToLive(apiKey, {
      onopen: async () => {
        setLiveStatus('connected');
        setMessages(prev => [...prev, { role: ChatRole.MODEL, text: "Chat de voz iniciado. Estou ouvindo..." }]);
        
        mediaStream.current = await navigator.mediaDevices.getUserMedia({ audio: true });
        const source = inputAudioContext.current!.createMediaStreamSource(mediaStream.current);
        scriptProcessor.current = inputAudioContext.current!.createScriptProcessor(4096, 1, 1);

        scriptProcessor.current.onaudioprocess = (audioProcessingEvent) => {
          const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
          const pcmBlob: GenAiBlob = {
            data: encode(new Uint8Array(new Int16Array(inputData.map(f => f * 32768)).buffer)),
            mimeType: 'audio/pcm;rate=16000',
          };
          sessionPromise.current?.then(session => session.sendRealtimeInput({ media: pcmBlob }));
        };
        source.connect(scriptProcessor.current);
        scriptProcessor.current.connect(inputAudioContext.current!.destination);
      },
      onmessage: (msg) => processLiveMessage(msg, setMessages, outputAudioContext, nextAudioStartTime, audioSources),
      onerror: (e: ErrorEvent) => {
        logger.error("Erro na sessão Live API (onerror)", {
            component: "AIHub",
            errorEvent: e,
        });
        setLiveStatus('error');
        setApiError(`Erro na conexão de voz: ${e.message}`);
      },
      onclose: (e) => {
        logger.info("Sessão Live API fechada", { 
            component: "AIHub",
            closeEvent: e 
        });
        if (liveStatus === 'closing') {
           setMessages(prev => [...prev, { role: ChatRole.MODEL, text: "Chat de voz encerrado." }]);
        }
        cleanupLiveSession();
      },
    });

    sessionPromise.current.catch(error => {
        const errorMessage = error instanceof Error ? error.message : "Erro ao iniciar o chat de voz.";
        logger.error("Erro na configuração da sessão Live API (catch)", {
            component: "AIHub",
            error,
        });
        setLiveStatus('error');
        setApiError(errorMessage);
        cleanupLiveSession();
    });
  }, [liveStatus, cleanupLiveSession, apiKey]);

  const toggleRecording = useCallback(async () => {
    if (isRecording) {
      setLiveStatus('closing');
      try {
        const session = await sessionPromise.current;
        session?.close();
      } catch (e) {
        logger.error("Erro ao fechar a sessão Live API", {
            component: "AIHub",
            error: e
        });
        cleanupLiveSession();
      }
    } else {
      setIsRecording(true);
      await setupLiveSession();
    }
  }, [isRecording, setupLiveSession, cleanupLiveSession]);
  
  return (
    <>
      <PageHeader icon={HomeIcon} title="Assistente IA" breadcrumbs={['FinanceHub', 'Início']} />
      <div className="bg-black/20 border border-white/10 backdrop-blur-xl rounded-2xl shadow-2xl shadow-black/20 flex flex-col flex-grow mt-0 overflow-hidden h-full">
        <div className="flex-1 p-6 overflow-y-auto space-y-6">
          <AnimatePresence>
            {messages.map((msg, index) => (
              <motion.div
                key={index}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <ChatMessageDisplay message={msg} />
              </motion.div>
            ))}
          </AnimatePresence>
          {isLoading && !messages.find(m => m.isTyping) && <div className="flex justify-center"><LoadingSpinner /></div>}
          <div ref={endOfMessagesRef} />
        </div>
        <div className="p-4 border-t border-white/10 bg-black/20">
          <AnimatePresence>
            {image && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-2 flex items-center"
              >
                <img src={image.url} alt="upload preview" className="w-16 h-16 object-cover rounded-md" />
                <button onClick={() => setImage(null)} className="ml-2 text-gray-400 hover:text-white">&times;</button>
              </motion.div>
            )}
          </AnimatePresence>
          
          <LiveStatusIndicator status={isRecording ? liveStatus : 'idle'} />

          <div className="flex items-center bg-black/30 rounded-xl p-2 focus-within:ring-2 focus-within:ring-indigo-500 transition-shadow duration-300">
            <label htmlFor="file-upload" className="cursor-pointer p-2 rounded-full hover:bg-white/10 transition-colors">
              <PaperclipIcon className="text-gray-400" />
            </label>
            <input id="file-upload" type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
            
            <button 
              onClick={toggleRecording} 
              className={`p-2 rounded-full hover:bg-white/10 transition-colors ${isRecording ? 'text-red-500 animate-pulse' : 'text-gray-400'}`}
            >
              <MicIcon />
            </button>
            
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSend()}
              placeholder={
                isRecording
                  ? (
                      {
                        connecting: 'Conectando...',
                        connected: 'Ouvindo... (Chat de voz ativo)',
                        closing: 'Encerrando...',
                        error: 'Erro de conexão',
                      }[liveStatus] || 'Ouvindo...'
                    )
                  : 'Converse com o assistente IA...'
              }
              disabled={isLoading || isRecording}
              className="flex-1 bg-transparent px-4 py-2 text-white placeholder-gray-500 focus:outline-none disabled:opacity-50"
            />
            <motion.button 
              onClick={handleSend} 
              disabled={isLoading || isRecording || (!input.trim() && !image)} 
              className="p-2 w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white transition-colors disabled:bg-gray-600 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <SendIcon />
            </motion.button>
          </div>
          <div className="flex items-center justify-end space-x-4 mt-2 px-2">
              <button onClick={() => setUseSearch(!useSearch)} className={`flex items-center space-x-1 text-xs transition-colors ${useSearch ? 'text-indigo-400 font-semibold' : 'text-gray-400 hover:text-white'}`}>
                  <SearchIcon className="w-4 h-4" />
                  <span>Busca na Web</span>
              </button>
              <button onClick={() => setUseMaps(!useMaps)} className={`flex items-center space-x-1 text-xs transition-colors ${useMaps ? 'text-indigo-400 font-semibold' : 'text-gray-400 hover:text-white'}`}>
                  <MapPinIcon className="w-4 h-4" />
                  <span>Usar Mapas</span>
              </button>
          </div>
          {useMaps && geoError && <p className="text-xs text-red-400 text-right mt-1 px-2">{geoError}</p>}
        </div>
      </div>
      <ErrorModal 
        isOpen={!!apiError} 
        error={apiError} 
        onClose={() => setApiError(null)} 
      />
    </>
  );
};
