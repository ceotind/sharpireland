'use client';

import React, { useState, useRef, useEffect } from 'react';
import { BusinessPlannerSession, BusinessPlannerUsage, BusinessPlannerConversation } from '@/app/types/business-planner';
import { MAX_MESSAGE_LENGTH } from '@/app/utils/business-planner/constants';

interface ChatInterfaceProps {
  session?: BusinessPlannerSession;
  usage: BusinessPlannerUsage;
  initialMessages?: BusinessPlannerConversation[];
  onMessageSent: (message: string) => void;
  onSessionCreated: (session: BusinessPlannerSession) => void;
  isLoading?: boolean;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  tokens_used?: number;
}

/**
 * ChatInterface Component
 * Real-time chat interface for business planning conversations
 * - Message list with markdown rendering
 * - Input area with character counter
 * - Auto-scroll to latest message
 * - Loading states and error handling
 */
const ChatInterface: React.FC<ChatInterfaceProps> = ({
  session,
  usage,
  initialMessages = [],
  onMessageSent,
  onSessionCreated,
  isLoading = false
}) => {
  const [messages, setMessages] = useState<Message[]>(() => 
    initialMessages.map(msg => ({
      id: msg.id,
      role: msg.role,
      content: msg.content,
      timestamp: msg.created_at,
      tokens_used: msg.tokens_used
    }))
  );
  const [inputMessage, setInputMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Focus input on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const canSendMessage = () => {
    if (!inputMessage.trim()) return false;
    if (isSending || isLoading) return false;
    
    // Check usage limits
    const freeRemaining = Math.max(0, 10 - usage.free_conversations_used);
    const paidRemaining = usage.subscription_status === 'paid' 
      ? Math.max(0, 50 - usage.paid_conversations_used) 
      : 0;
    
    return freeRemaining > 0 || paidRemaining > 0;
  };

  const handleSendMessage = async () => {
    if (!canSendMessage()) return;

    const messageContent = inputMessage.trim();
    setInputMessage('');
    setIsSending(true);
    setError(null);

    // Add user message immediately
    const userMessage: Message = {
      id: `temp-${Date.now()}`,
      role: 'user',
      content: messageContent,
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, userMessage]);

    try {
      const response = await fetch('/api/business-planner/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: messageContent,
          session_id: session?.id,
          context: session?.context
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to send message');
      }

      const data = await response.json();
      
      // Add AI response
      const aiMessage: Message = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: data.message,
        timestamp: new Date().toISOString(),
        tokens_used: data.tokens_used
      };

      setMessages(prev => [...prev, aiMessage]);
      onMessageSent(messageContent);

      // If this was the first message and a new session was created
      if (data.session_id && !session) {
        // Redirect to include session ID in URL
        window.location.href = `/dashboard/business-planner/chat?session=${data.session_id}`;
      }

    } catch (error) {
      console.error('Error sending message:', error);
      setError(error instanceof Error ? error.message : 'Failed to send message');
      
      // Remove the user message on error
      setMessages(prev => prev.slice(0, -1));
      setInputMessage(messageContent); // Restore the message
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleExportConversation = () => {
    const conversationText = messages
      .map(msg => `${msg.role.toUpperCase()}: ${msg.content}`)
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

  const formatMessage = (content: string) => {
    // Simple markdown-like formatting
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br>');
  };

  const renderMessage = (message: Message) => (
    <div
      key={message.id}
      id={`message-${message.id}`}
      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} mb-4`}
    >
      <div
        className={`max-w-3xl px-4 py-3 rounded-lg ${
          message.role === 'user'
            ? 'bg-blue-600 text-white'
            : 'bg-gray-100 text-gray-900 border border-gray-200'
        }`}
      >
        <div
          className="text-sm leading-relaxed"
          dangerouslySetInnerHTML={{ __html: formatMessage(message.content) }}
        />
        <div
          className={`text-xs mt-2 ${
            message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
          }`}
        >
          {new Date(message.timestamp).toLocaleTimeString()}
          {message.tokens_used && (
            <span className="ml-2">• {message.tokens_used} tokens</span>
          )}
        </div>
      </div>
    </div>
  );

  const renderUsageWarning = () => {
    const freeRemaining = Math.max(0, 10 - usage.free_conversations_used);
    const paidRemaining = usage.subscription_status === 'paid' 
      ? Math.max(0, 50 - usage.paid_conversations_used) 
      : 0;
    
    if (freeRemaining === 0 && paidRemaining === 0) {
      return (
        <div id="usage-limit-warning" className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-red-400 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <div>
              <h3 className="text-sm font-medium text-red-800">Conversation limit reached</h3>
              <p className="text-sm text-red-700 mt-1">
                You've used all your available conversations. Upgrade to continue planning.
              </p>
              <a
                href="/dashboard/billing"
                className="inline-flex items-center mt-2 px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors"
              >
                Upgrade Now
              </a>
            </div>
          </div>
        </div>
      );
    }

    if (freeRemaining <= 2 && usage.subscription_status === 'free') {
      return (
        <div id="usage-warning" className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-yellow-400 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <div>
              <h3 className="text-sm font-medium text-yellow-800">Running low on conversations</h3>
              <p className="text-sm text-yellow-700 mt-1">
                You have {freeRemaining} free conversations remaining. Consider upgrading for unlimited access.
              </p>
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div id="chat-interface-container" className="flex flex-col h-full bg-gray-50">
      {/* Messages Area */}
      <div id="messages-area" className="flex-1 overflow-y-auto p-6">
        {messages.length === 0 ? (
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
        ) : (
          <div id="messages-list">
            {messages.map(renderMessage)}
            {isSending && (
              <div id="typing-indicator" className="flex justify-start mb-4">
                <div className="bg-gray-100 border border-gray-200 rounded-lg px-4 py-3">
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div id="input-area" className="border-t border-gray-200 bg-white p-6">
        {renderUsageWarning()}
        
        {error && (
          <div id="error-message" className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <div id="input-container" className="flex items-end space-x-4">
          <div id="textarea-container" className="flex-1">
            <textarea
              ref={inputRef}
              id="message-input"
              rows={3}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={canSendMessage() ? "Type your message here..." : "Upgrade to continue chatting..."}
              disabled={!canSendMessage() || isSending}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed resize-none"
              maxLength={MAX_MESSAGE_LENGTH}
            />
            <div id="input-counter" className="flex justify-between mt-1 text-xs text-gray-500">
              <span>{inputMessage.length} / {MAX_MESSAGE_LENGTH} characters</span>
              <span>Press Enter to send, Shift+Enter for new line</span>
            </div>
          </div>
          
          <div id="send-button-container" className="flex flex-col space-y-2">
            <button
              id="send-button"
              onClick={handleSendMessage}
              disabled={!canSendMessage() || isSending}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSending ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  Send
                </>
              )}
            </button>
            
            {messages.length > 0 && (
              <button
                id="export-button"
                onClick={handleExportConversation}
                className="inline-flex items-center px-3 py-1 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Export
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;