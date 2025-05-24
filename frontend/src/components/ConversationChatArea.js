import React from 'react';

const ConversationChatArea = ({ userSpeech, aiResponse }) => {
  return (
    <div className="flex flex-col space-y-4 overflow-hidden text-white p-4 bg-opacity-10 rounded-xl h-32">
      <div className="flex items-start space-x-2">
        <span className="font-semibold text-orange-400">🧑 Usuario:</span>
        <span>{userSpeech || '...'}</span>
      </div>
      <div className="flex items-start space-x-2">
        <span className="font-semibold text-blue-400">🤖 IA:</span>
        <span>{aiResponse || '...'}</span>
      </div>
    </div>
  );
};

export default ConversationChatArea;
