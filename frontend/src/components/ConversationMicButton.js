import React, { useState, useEffect } from 'react';

const ConversationMicButton = ({ isListening, onToggleListening }) => {
  const [animationScale, setAnimationScale] = useState(1);

  useEffect(() => {
    let interval;
    if (isListening) {
      interval = setInterval(() => {
        setAnimationScale(prevScale => (prevScale === 1 ? 1.1 : 1));
      }, 500);
    } else {
      setAnimationScale(1);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isListening]);

  return (
    <button
      onClick={onToggleListening}
      className={`relative w-48 h-48 rounded-full flex items-center justify-center transition-all duration-300 ease-in-out ${
        isListening ? 'bg-orange-500' : 'bg-orange-500 dark:bg-[#556272]'
      } shadow-xl hover:shadow-2xl`}
      style={{ transform: `scale(${animationScale})` }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={`w-24 h-24 text-white transition-colors duration-300 ${isListening ? 'animate-pulse' : ''}`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
      </svg>
      {isListening && (
        <div className="absolute inset-0 rounded-full bg-orange-500 opacity-50 animate-ping"></div>
      )}
    </button>
  );
};

export default ConversationMicButton;