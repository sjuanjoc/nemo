import React, { useState } from 'react';
import ConversationMicButton from './ConversationMicButton';
import ConversationChatArea from './ConversationChatArea';

const ConversationInterface = () => {
  const [isListening, setIsListening] = useState(false);
  const [userSpeech, setUserSpeech] = useState('');
  const [aiResponse, setAiResponse] = useState('');

  const handleToggleListening = async () => {
    setIsListening(true);

    try {
      const res = await fetch('/api/conversar', {
        method: 'POST'
      });

      if (!res.ok) {
        throw new Error('Error al comunicarse con la IA');
      }

      const data = await res.json();
      setUserSpeech(data.user || '');
      setAiResponse(data.ia || '');
    } catch (error) {
      console.error(error);
      setUserSpeech('Error al transcribir');
      setAiResponse('Error del sistema');
    } finally {
      setIsListening(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow overflow-hidden">
        <ConversationChatArea
          userSpeech={userSpeech}
          aiResponse={aiResponse}
        />
      </div>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="relative w-full h-full flex items-center justify-center">
          <div className="pointer-events-auto">
            <ConversationMicButton
              isListening={isListening}
              onToggleListening={handleToggleListening}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConversationInterface;
