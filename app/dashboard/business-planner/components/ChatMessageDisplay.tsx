import React from 'react';
import { ChatMessage, MessageStatus } from '@/app/types/business-planner';
import ErrorBoundary from '@/app/components/ErrorBoundary'; // Import ErrorBoundary

interface ChatMessageDisplayProps {
  message: ChatMessage;
}

const formatMessage = (content: string) => {
  // Simple markdown-like formatting
  return content
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br>');
};

const ChatMessageDisplay: React.FC<ChatMessageDisplayProps> = React.memo(({ message }) => {
  const isUser = message.role === 'user';
  const isPending = message.status === MessageStatus.PENDING;
  const isStreaming = message.status === MessageStatus.STREAMING;
  const isFailed = message.status === MessageStatus.FAILED;

  const messageClasses = `max-w-3xl px-4 py-3 rounded-lg ${
    isUser
      ? 'bg-blue-600 text-white'
      : 'bg-gray-100 text-gray-900 border border-gray-200'
  } ${isPending || isStreaming ? 'opacity-70' : ''} ${isFailed ? 'bg-red-100 border border-red-400' : ''}`;

  return (
    <div
      key={message.id}
      id={`message-${message.id}`}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
    >
      {!isUser && (
        <div id="message-avatar" className="flex-shrink-0 mr-3">
          <ErrorBoundary fallback={<img src="/images/avatars/default-ai-avatar.png" alt="AI Avatar Fallback" className="w-8 h-8 rounded-full" />}>
            <img
              src="/images/avatars/ai-avatar.png" // Placeholder for AI avatar
              alt="AI Avatar"
              width="32" // Added for CLS
              height="32" // Added for CLS
              className="w-8 h-8 rounded-full"
              onError={(e) => {
                e.currentTarget.src = '/images/avatars/default-ai-avatar.png'; // Fallback image
                e.currentTarget.onerror = null; // Prevent infinite loop
              }}
            />
          </ErrorBoundary>
        </div>
      )}
      <div className={messageClasses}>
        <div
          id="message-content"
          className="text-sm leading-relaxed"
          dangerouslySetInnerHTML={{ __html: formatMessage(message.content) }}
        />
        <div
          className={`text-xs mt-2 ${
            isUser ? 'text-blue-100' : 'text-gray-500'
          }`}
        >
          {new Date(message.created_at).toLocaleTimeString()}
          {isPending && (
            <span className="ml-2 text-gray-400 font-semibold">
              (Sending...)
            </span>
          )}
          {isStreaming && (
            <span className="ml-2 text-gray-500 font-semibold">
              (Streaming...)
            </span>
          )}
          {isFailed && (
            <span className="ml-2 text-red-500 font-semibold">
              (Failed
              {message.attemptNumber !== undefined && message.maxRetries !== undefined && (
                ` - Attempt ${message.attemptNumber} of ${message.maxRetries + 1}`
              )}
              )
            </span>
          )}
        </div>
      </div>
      {isUser && (
        <div id="message-avatar" className="flex-shrink-0 ml-3">
          <ErrorBoundary fallback={<img src="/images/avatars/default-user-avatar.png" alt="User Avatar Fallback" className="w-8 h-8 rounded-full" />}>
            <img
              src="/images/avatars/user-avatar.png" // Placeholder for User avatar
              alt="User Avatar"
              width="32" // Added for CLS
              height="32" // Added for CLS
              className="w-8 h-8 rounded-full"
              onError={(e) => {
                e.currentTarget.src = '/images/avatars/default-user-avatar.png'; // Fallback image
                e.currentTarget.onerror = null; // Prevent infinite loop
              }}
            />
          </ErrorBoundary>
        </div>
      )}
    </div>
  );
});

export default ChatMessageDisplay;