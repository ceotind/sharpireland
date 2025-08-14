import React from 'react';

const WelcomeMessage: React.FC = () => {
  return (
    <div id="welcome-message" className="text-center py-12">
      <div id="welcome-icon" className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
        <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        Welcome to your Business Planning Session
      </h3>
      <p className="text-gray-600 max-w-md mx-auto">
        I'm here to help you develop your business strategy. Ask me anything about your business plan, 
        marketing strategies, financial planning, or any other business-related questions.
      </p>
      <div id="suggested-questions" className="mt-6 space-y-2">
        <p className="text-sm font-medium text-gray-700">Try asking:</p>
        <div className="space-y-1 text-sm text-gray-600">
          <p>• "Help me create a marketing strategy for my business"</p>
          <p>• "What should I include in my business plan?"</p>
          <p>• "How do I price my products or services?"</p>
        </div>
      </div>
    </div>
  );
};

export default WelcomeMessage;