import React, { Suspense, lazy, RefObject, Profiler } from 'react';
import { ChatMessage } from '@/app/types/business-planner';
import TypingIndicator from './TypingIndicator';
import ChatMessageDisplay from './ChatMessageDisplay';
import { performanceLogger } from '@/app/utils/performanceLogger';

const WelcomeMessage = lazy(() => import('./WelcomeMessage'));

interface ChatMessagesListProps {
  messages: ChatMessage[];
  isTyping: boolean;
  messagesEndRef: RefObject<HTMLDivElement | null>;
}



const ChatMessagesList: React.FC<ChatMessagesListProps> = React.memo(({ messages, isTyping, messagesEndRef }) => {
  const onRender = (
    id: string, // the "id" prop of the Profiler tree that has just committed
    phase: "mount" | "update" | "nested-update", // "mount" if the tree just mounted, "update" if it re-rendered
    actualDuration: number, // time spent rendering this commit (including its children)
    baseDuration: number, // estimated time to render the entire subtree without memoization
    startTime: number, // when React began rendering the current update
    commitTime: number // when React committed this commit
  ) => {
    performanceLogger({
      name: `component:${id}:render`,
      value: actualDuration,
      unit: 'ms',
      tags: { phase, baseDuration: baseDuration.toString(), startTime: startTime.toString(), commitTime: commitTime.toString() },
      details: {}, // No interactions to log in this version
    });
  };

  

  const renderMessage = (message: ChatMessage) => {
    return (
      <Profiler id="ChatMessageDisplay" onRender={onRender} key={message.id}>
        <ChatMessageDisplay message={message} />
      </Profiler>
    );
  };

  return (
    <Profiler id="ChatMessagesList" onRender={onRender}>
      <div id="messages-area" className="flex-1 overflow-y-auto p-6">
        {messages.length === 0 ? (
          <Suspense fallback={
            <div id="welcome-message-loading" className="text-center py-12 text-gray-500">
              Loading welcome message...
            </div>
          }>
            <WelcomeMessage />
          </Suspense>
        ) : (
          <div id="messages-list">
            {messages.map(renderMessage)}
            {isTyping && (
              <div id="ai-typing-indicator" className="flex justify-start mb-4">
                <TypingIndicator />
              </div>
            )}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
    </Profiler>
  );
});

ChatMessagesList.displayName = 'ChatMessagesList';

export default ChatMessagesList;