import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ChatMessage, ChatRole } from '../types';
import { ChatMessageDisplay } from './ChatMessageDisplay';
import { LoadingSpinner } from './LoadingSpinner';
import { MicIcon, PaperclipIcon, SendIcon, SearchIcon, MapPinIcon, HomeIcon } from './Icons';
import { getChatResponseStream, connectToLive, encode, decode, decodeAudioData } from '../services/geminiService';
import { useGeolocation } from '../hooks/useGeolocation';
import { LiveServerMessage, LiveSession, Blob as GenAiBlob } from '@google/genai';
import { PageHeader } from './layout/PageHeader';

export const AIHub: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: ChatRole.MODEL, text: "Olá! Sou o assistente de IA do FinanceHub. Como posso ajudar com suas finanças hoje? Você pode me fazer perguntas, enviar um comprovante ou iniciar um bate-papo por voz." }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [image, setImage] = useState<{ url: string; data: string; mimeType: string } | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  
  const [useSearch, setUseSearch] = useState(false);
  const [useMaps, setUseMaps] = useState(false);
  
  const { location, error: geoError } = useGeolocation();

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
    if (!input.trim() && !image) return;
    setIsLoading(true);

    const userMessage: ChatMessage = { role: ChatRole.USER, text: input };
    if (image) {
      userMessage.imageUrl = image.url;
    }
    setMessages(prev => [...prev, userMessage]);
    
    const chatHistory = messages.filter(m => !m.isTyping);
    const imagePayload = image ? { inlineData: { data: image.data, mimeType: image.mimeType } } : null;

    setInput('');
    setImage(null);
    
    try {
      const stream = await getChatResponseStream(chatHistory, input, imagePayload, useSearch, useMaps, location);
      let fullResponse = "";
      let groundingData: any[] = [];
      
      setMessages(prev => [...prev, { role: ChatRole.MODEL, text: "", isTyping: true }]);

      for await (const chunk of stream) {
        const chunkText = chunk.text;
        fullResponse += chunkText;
        if(chunk.candidates?.[0]?.groundingMetadata?.groundingChunks) {
          groundingData = chunk.candidates[0].groundingMetadata.groundingChunks;
        }
        setMessages(prev => {
          const newMessages = [...prev];
          const lastMessage = newMessages[newMessages.length - 1];
          if(lastMessage && lastMessage.role === ChatRole.MODEL) {
            lastMessage.text = fullResponse;
            lastMessage.grounding = groundingData;
          }
          return newMessages;
        });
      }
      
      setMessages(prev => {
          const newMessages = [...prev];
          const lastMessage = newMessages[newMessages.length - 1];
          if(lastMessage && lastMessage.role === ChatRole.MODEL) {
            lastMessage.isTyping = false;
          }
          return newMessages;
        });

    } catch (error) {
      console.error("Error generating content:", error);
      setMessages(prev => [...prev, { role: ChatRole.MODEL, text: "Desculpe, encontrei um erro. Por favor, tente novamente." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleRecording = useCallback(async () => {
    if (isRecording) {
      setIsRecording(false);
      // Clean up resources
      if (mediaStream.current) {
        mediaStream.current.getTracks().forEach(track => track.stop());
        mediaStream.current = null;
      }
      if (scriptProcessor.current) {
        scriptProcessor.current.disconnect();
        scriptProcessor.current = null;
      }
      if (inputAudioContext.current && inputAudioContext.current.state !== 'closed') {
        await inputAudioContext.current.close();
      }
      if (outputAudioContext.current && outputAudioContext.current.state !== 'closed') {
        await outputAudioContext.current.close();
      }
      if (sessionPromise.current) {
        const session = await sessionPromise.current;
        session.close();
        sessionPromise.current = null;
      }
      return;
    }

    setIsRecording(true);
    setMessages(prev => [...prev, { role: ChatRole.MODEL, text: "Chat de voz iniciado. Estou ouvindo..." }]);

    // Setup audio contexts
    inputAudioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
    outputAudioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    nextAudioStartTime.current = 0;
    
    sessionPromise.current = connectToLive({
      onopen: async () => {
        mediaStream.current = await navigator.mediaDevices.getUserMedia({ audio: true });
        const source = inputAudioContext.current!.createMediaStreamSource(mediaStream.current);
        scriptProcessor.current = inputAudioContext.current!.createScriptProcessor(4096, 1, 1);
        
        scriptProcessor.current.onaudioprocess = (audioProcessingEvent) => {
          const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
          const l = inputData.length;
          const int16 = new Int16Array(l);
          for (let i = 0; i < l; i++) {
            int16[i] = inputData[i] * 32768;
          }
          const pcmBlob: GenAiBlob = {
              data: encode(new Uint8Array(int16.buffer)),
              mimeType: 'audio/pcm;rate=16000',
          };
          if (sessionPromise.current) {
            sessionPromise.current.then((session) => {
              session.sendRealtimeInput({ media: pcmBlob });
            });
          }
        };
        source.connect(scriptProcessor.current);
        scriptProcessor.current.connect(inputAudioContext.current!.destination);
      },
      onmessage: async (message: LiveServerMessage) => {
        const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
        if (base64Audio) {
            const ctx = outputAudioContext.current!;
            nextAudioStartTime.current = Math.max(nextAudioStartTime.current, ctx.currentTime);
            const audioBuffer = await decodeAudioData(decode(base64Audio), ctx, 24000, 1);
            const sourceNode = ctx.createBufferSource();
            sourceNode.buffer = audioBuffer;
            sourceNode.connect(ctx.destination);
            sourceNode.addEventListener('ended', () => audioSources.current.delete(sourceNode));
            sourceNode.start(nextAudioStartTime.current);
            nextAudioStartTime.current += audioBuffer.duration;
            audioSources.current.add(sourceNode);
        }

        if (message.serverContent?.interrupted) {
            for (const source of audioSources.current.values()) {
                source.stop();
            }
            audioSources.current.clear();
            nextAudioStartTime.current = 0;
        }
        
        const inputTranscription = message.serverContent?.inputTranscription?.text;
        const outputTranscription = message.serverContent?.outputTranscription?.text;
        
        if (inputTranscription) {
            setMessages(prev => {
                const last = prev[prev.length - 1];
                if (last?.role === ChatRole.USER && last.isTyping) {
                    const newMessages = [...prev];
                    newMessages[newMessages.length - 1].text += inputTranscription;
                    return newMessages;
                }
                return [...prev, { role: ChatRole.USER, text: inputTranscription, isTyping: true }];
            });
        }
        
        if(outputTranscription){
             setMessages(prev => {
                const last = prev[prev.length - 1];
                if (last?.role === ChatRole.MODEL && last.isTyping) {
                    const newMessages = [...prev];
                    newMessages[newMessages.length - 1].text += outputTranscription;
                    return newMessages;
                }
                const lastUserMsg = prev[prev.length - 1];
                if(lastUserMsg?.role === ChatRole.USER && lastUserMsg.isTyping) {
                  const newMessages = [...prev];
                  newMessages[newMessages.length-1].isTyping = false;
                  return [...newMessages, { role: ChatRole.MODEL, text: outputTranscription, isTyping: true }];
                }
                return [...prev, { role: ChatRole.MODEL, text: outputTranscription, isTyping: true }];
            });
        }

        if(message.serverContent?.turnComplete) {
           setMessages(prev => prev.map(m => ({...m, isTyping: false})));
        }
      },
      onerror: (e: ErrorEvent) => {
        console.error("Live session error:", e);
        setMessages(prev => [...prev, { role: ChatRole.MODEL, text: "Erro no chat de voz. Por favor, tente novamente." }]);
        setIsRecording(false);
      },
      onclose: (e: CloseEvent) => {
        console.log("Live session closed.");
        setMessages(prev => [...prev, { role: ChatRole.MODEL, text: "Chat de voz encerrado." }]);
        setIsRecording(false);
      },
    });

  }, [isRecording]);
  
  return (
    <>
      <PageHeader icon={HomeIcon} title="Início" breadcrumbs={['Início']} />
      <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl shadow-2xl shadow-black/20 flex flex-col flex-grow mt-4 h-[calc(100%-80px)]">
        <div className="flex-1 p-6 overflow-y-auto space-y-6">
          {messages.map((msg, index) => (
            <ChatMessageDisplay key={index} message={msg} />
          ))}
          {isLoading && !messages[messages.length-1]?.isTyping && <div className="flex justify-center"><LoadingSpinner /></div>}
          <div ref={endOfMessagesRef} />
        </div>
        <div className="p-4 border-t border-white/10">
          {image && (
            <div className="mb-2 flex items-center">
              <img src={image.url} alt="upload preview" className="w-16 h-16 object-cover rounded-md" />
              <button onClick={() => setImage(null)} className="ml-2 text-gray-400 hover:text-white">&times;</button>
            </div>
          )}
          <div className="flex items-center bg-black/20 rounded-xl p-2">
            <label htmlFor="file-upload" className="cursor-pointer p-2 rounded-full hover:bg-white/10 transition-colors">
              <PaperclipIcon />
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
              placeholder={isRecording ? "Ouvindo..." : "Converse com o assistente IA..."}
              disabled={isLoading || isRecording}
              className="flex-1 bg-transparent px-4 py-2 text-white placeholder-gray-500 focus:outline-none disabled:opacity-50"
            />
            <button onClick={handleSend} disabled={isLoading || isRecording} className="p-2 rounded-full bg-indigo-500 hover:bg-indigo-600 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed">
              <SendIcon />
            </button>
          </div>
          <div className="flex items-center justify-end space-x-4 mt-2 px-2">
              <button onClick={() => setUseSearch(!useSearch)} className={`flex items-center space-x-1 text-xs transition-colors ${useSearch ? 'text-indigo-400' : 'text-gray-400 hover:text-white'}`}>
                  <SearchIcon className="w-4 h-4" />
                  <span>Busca na Web</span>
              </button>
              <button onClick={() => setUseMaps(!useMaps)} className={`flex items-center space-x-1 text-xs transition-colors ${useMaps ? 'text-indigo-400' : 'text-gray-400 hover:text-white'}`}>
                  <MapPinIcon className="w-4 h-4" />
                  <span>Usar Mapas</span>
              </button>
          </div>
          {useMaps && geoError && <p className="text-xs text-red-400 text-right mt-1 px-2">{geoError}</p>}
        </div>
      </div>
    </>
  );
};
