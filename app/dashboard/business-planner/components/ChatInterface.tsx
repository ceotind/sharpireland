'use client';

import React, { useState, useRef, useEffect, Suspense, lazy } from 'react';
import { BusinessPlannerSession, BusinessPlannerUsage, ChatMessage, MessageStatus, BusinessPlannerSessionContext } from '@/app/types/business-planner';
import { MAX_MESSAGE_LENGTH, FREE_CONVERSATIONS_LIMIT, PAID_CONVERSATIONS_COUNT } from '@/app/utils/business-planner/constants';
import { useChat } from '@/app/context/ChatContext';
import TypingIndicator from './TypingIndicator'; // Import the new component
import ChatMessageDisplay from './ChatMessageDisplay'; // Import the new component
import { DashboardSectionErrorBoundary } from '@/app/components/dashboard/DashboardErrorBoundary';
import ChatMessagesList from './ChatMessagesList'; // Import the new component
import ChatInputArea from './ChatInputArea'; // Import the new component
import ChatErrorDisplay from './ChatErrorDisplay'; // Import the new component

const WelcomeMessage = lazy(() => import('./WelcomeMessage'));
const UsageWarning = lazy(() => import('./UsageWarning'));

interface ChatInterfaceProps {
  usage: BusinessPlannerUsage;
  session?: BusinessPlannerSession; // Re-introduce session prop for context
}

/**
 * ChatInterface Component
 * Real-time chat interface for business planning conversations
 * - Message list with markdown rendering
 * - Input area with character counter
 * - Auto-scroll to latest message
 * - Loading states and error handling
 */
const ChatInterface: React.FC<ChatInterfaceProps> = ({ usage, session: propSession }) => {
  const {
    messages,
    currentSession, // This session is from context
    loading,
    error,
    aiResponseLoading, // New: AI response loading state
    aiResponseError, // New: AI response error state
    isTyping, // New: AI typing state
    estimatedWaitTime, // New: Estimated wait time for AI response
    sendMessage,
    createSession,
    selectSession,
    deleteSession,
    clearChat,
    retrySendMessage,
    retryCreateSession, // New: Function to retry session creation
    updateSessionTitle,
    cancelAiResponse, // New: Function to cancel AI response
    sessionCreationStatus, // New: Session creation status
    sessionCreationRetryInfo, // New: Session creation retry info
  } = useChat();

  const [showTimeoutWarning, setShowTimeoutWarning] = useState(false);
  const [timeoutTimer, setTimeoutTimer] = useState<NodeJS.Timeout | null>(null);
  const [initialMessageForSession, setInitialMessageForSession] = useState<string | null>(null);
  const [initialContextForSession, setInitialContextForSession] = useState<BusinessPlannerSessionContext | null>(null);

  // Effect to manage timeout warning
  useEffect(() => {
    if (aiResponseLoading.isLoading && estimatedWaitTime) {
      // Clear any existing timer
      if (timeoutTimer) {
        clearTimeout(timeoutTimer);
      }
      // Set a new timer to show warning after estimatedWaitTime
      const timer = setTimeout(() => {
        setShowTimeoutWarning(true);
      }, estimatedWaitTime * 1000); // Convert seconds to milliseconds
      setTimeoutTimer(timer);
    } else {
      // If AI is not loading, hide warning and clear timer
      setShowTimeoutWarning(false);
      if (timeoutTimer) {
        clearTimeout(timeoutTimer);
        setTimeoutTimer(null);
      }
    }
    // Cleanup on unmount or dependency change
    return () => {
      if (timeoutTimer) {
        clearTimeout(timeoutTimer);
      }
    };
  }, [aiResponseLoading.isLoading, estimatedWaitTime]);


  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom when new messages arrive or loading state changes
  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Focus input on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Check if user can send a message (input validation + usage limits + loading state)
  const canSendMessage = (): boolean => {
    const freeRemaining = Math.max(0, FREE_CONVERSATIONS_LIMIT - usage.free_conversations_used);
    const hasUsage = freeRemaining > 0 || (usage.subscription_status === 'paid' && usage.paid_conversations_used < PAID_CONVERSATIONS_COUNT);

    if (!inputMessage.trim()) return false;
    if (loading.isLoading || aiResponseLoading.isLoading || (sessionCreationStatus as string) === 'IN_PROGRESS') return false; // Use context's loading state and AI loading state
    
    return hasUsage;
  };

  const handleSendMessage = async (): Promise<void> => {
    if (!canSendMessage()) return;

    const messageContent = inputMessage.trim();
    setInputMessage('');
    
    try {
      if (!currentSession) {
        // If no current session, create a new one with initial context
        // For now, using a dummy context. In a real app, this would come from onboarding.
        const dummyContext: BusinessPlannerSessionContext = {
          business_type: "General Business",
          target_market: "General Audience",
          challenge: "General Planning",
          created_at: new Date().toISOString(),
        };
        setInitialMessageForSession(messageContent);
        setInitialContextForSession(dummyContext);
        await createSession(dummyContext, messageContent);
      } else {
        // If a session exists, send the message to it
        await sendMessage(messageContent, currentSession.id);
      }
    } catch (err) {
      console.error('Error sending message or creating session:', err);
      setInputMessage(messageContent); // Restore the message if sending failed
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent): void => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleExportConversation = (): void => {
    const conversationText = messages
      .map((msg: ChatMessage) => `${msg.role.toUpperCase()}: ${msg.content}`)
      .join('\n\n');
    
    const blob = new Blob([conversationText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `business-planning-conversation-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };


  return (
    <DashboardSectionErrorBoundary sectionName="Chat Interface">
      <div id="chat-interface-container" className="flex flex-col h-full bg-gray-50">
        <ChatMessagesList messages={messages} isTyping={isTyping} messagesEndRef={messagesEndRef} />

        <ChatInputArea
          inputMessage={inputMessage}
          setInputMessage={setInputMessage}
          handleKeyPress={handleKeyPress}
          handleSendMessage={handleSendMessage}
          canSendMessage={canSendMessage()}
          isLoading={loading.isLoading}
          aiResponseLoading={aiResponseLoading.isLoading}
          messagesLength={messages.length}
          handleExportConversation={handleExportConversation}
          inputRef={inputRef}
        />

        <ChatErrorDisplay
          sessionCreationStatus={sessionCreationStatus}
          sessionCreationRetryInfo={sessionCreationRetryInfo}
          error={error}
          aiResponseError={aiResponseError}
          showTimeoutWarning={showTimeoutWarning}
          estimatedWaitTime={estimatedWaitTime || 0}
          retryCreateSession={retryCreateSession}
          retrySendMessage={retrySendMessage}
          messages={messages}
          cancelAiResponse={cancelAiResponse}
          isLoading={loading.isLoading}
          aiResponseLoading={aiResponseLoading.isLoading}
        />
      </div>
    </DashboardSectionErrorBoundary>
  );
};
 
export default ChatInterface;