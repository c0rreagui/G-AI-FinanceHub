import React from 'react';
import { ChatMessage, ChatRole } from '../types';
import { TypingIndicator } from './ui/TypingIndicator';

interface ChatMessageDisplayProps {
  message: ChatMessage;
}

export const ChatMessageDisplay: React.FC<ChatMessageDisplayProps> = ({ message }) => {
  const isUser = message.role === ChatRole.USER;
  
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} items-end gap-3`}>
      {!isUser && (
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex-shrink-0 self-start shadow-lg"></div>
      )}
      <div
        className={`max-w-xl rounded-2xl p-4 shadow-lg text-base ${
          isUser
            ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-br-none'
            : 'bg-black/20 backdrop-blur-lg border border-white/10 text-gray-200 rounded-bl-none'
        }`}
      >
        {message.imageUrl && <img src={message.imageUrl} alt="Envio do usuário" className="rounded-lg mb-2 max-w-xs" />}
        
        {message.isTyping && !message.text ? (
          <TypingIndicator />
        ) : (
          <div className="prose prose-invert prose-sm text-white" dangerouslySetInnerHTML={{ __html: message.text.replace(/\n/g, '<br />') }} />
        )}
        
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
