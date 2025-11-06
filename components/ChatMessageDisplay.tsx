import React from 'react';
import { ChatMessage, ChatRole } from '../types';
import { LoadingSpinner } from './LoadingSpinner';

interface ChatMessageDisplayProps {
  message: ChatMessage;
}

export const ChatMessageDisplay: React.FC<ChatMessageDisplayProps> = ({ message }) => {
  const isUser = message.role === ChatRole.USER;
  
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} items-end gap-3`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex-shrink-0 self-start"></div>
      )}
      <div
        className={`max-w-xl rounded-2xl p-4 shadow-lg ${
          isUser
            ? 'bg-indigo-500 text-white rounded-br-none'
            : 'bg-white/10 backdrop-blur-lg border border-white/10 text-gray-200 rounded-bl-none'
        }`}
      >
        {message.imageUrl && <img src={message.imageUrl} alt="Envio do usuário" className="rounded-lg mb-2 max-w-xs" />}
        {message.isTyping && !message.text ? <div className="inline-block"><LoadingSpinner/></div> : message.text}
        {message.isTyping && message.text && <div className="inline-block w-1 h-4 bg-white animate-pulse ml-1"></div>}
        
        {message.grounding && message.grounding.length > 0 && (
          <div className="mt-4 pt-3 border-t border-white/20">
            <h4 className="text-xs font-semibold text-gray-300 mb-2">Fontes:</h4>
            <ul className="space-y-1">
              {message.grounding.map((chunk, index) => {
                const source = chunk.web || chunk.maps;
                if (!source) return null;
                return (
                   <li key={index} className="text-xs">
                     <a 
                       href={source.uri} 
                       target="_blank" 
                       rel="noopener noreferrer" 
                       className="text-indigo-300 hover:underline break-all"
                     >
                       {index+1}. {source.title}
                     </a>
                   </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};