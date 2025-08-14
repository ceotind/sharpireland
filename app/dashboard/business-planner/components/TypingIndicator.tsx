import React from 'react';

const TypingIndicator: React.FC = React.memo(() => {
  return (
    <div id="typing-indicator-container" className="flex items-center space-x-2 p-2 bg-gray-100 rounded-lg shadow-md">
      <div id="avatar-animation-container" className="relative w-8 h-8">
        {/* Subtle AI avatar or icon animation */}
        <div id="avatar-circle-1" className="absolute inset-0 rounded-full bg-blue-300 opacity-75 animate-ping"></div>
        <div id="avatar-circle-2" className="absolute inset-0 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-bold">AI</div>
      </div>
      <p id="typing-message" className="text-gray-700">
        AI is typing
        <span id="dot-1" className="inline-block w-1.5 h-1.5 bg-gray-700 rounded-full ml-1 animate-bounce" style={{ animationDelay: '0s' }}></span>
        <span id="dot-2" className="inline-block w-1.5 h-1.5 bg-gray-700 rounded-full ml-0.5 animate-bounce" style={{ animationDelay: '0.2s' }}></span>
        <span id="dot-3" className="inline-block w-1.5 h-1.5 bg-gray-700 rounded-full ml-0.5 animate-bounce" style={{ animationDelay: '0.4s' }}></span>
      </p>
    </div>
  );
});

export default TypingIndicator;