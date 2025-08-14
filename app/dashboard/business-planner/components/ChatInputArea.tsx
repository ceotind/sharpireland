import React, { RefObject } from 'react';
import { MAX_MESSAGE_LENGTH } from '@/app/utils/business-planner/constants';

interface ChatInputAreaProps {
  inputMessage: string;
  setInputMessage: (message: string) => void;
  handleKeyPress: (e: React.KeyboardEvent) => void;
  handleSendMessage: () => Promise<void>;
  canSendMessage: boolean;
  isLoading: boolean;
  aiResponseLoading: boolean;
  messagesLength: number;
  handleExportConversation: () => void;
  inputRef: RefObject<HTMLTextAreaElement | null>;
}

const ChatInputArea: React.FC<ChatInputAreaProps> = React.memo(({
  inputMessage,
  setInputMessage,
  handleKeyPress,
  handleSendMessage,
  canSendMessage,
  isLoading,
  aiResponseLoading,
  messagesLength,
  handleExportConversation,
  inputRef,
}) => {
  return (
    <div id="input-area" className="border-t border-gray-200 bg-white p-6">
      <div id="input-container" className="flex items-end space-x-4">
        <div id="textarea-container" className="flex-1">
          <textarea
            ref={inputRef}
            id="message-input"
            rows={3}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={canSendMessage ? "Type your message here..." : "Upgrade to continue chatting..."}
            disabled={!canSendMessage || isLoading}
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
            disabled={!canSendMessage || isLoading}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {(isLoading || aiResponseLoading) ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {aiResponseLoading ? "AI Thinking..." : "Sending..."}
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
          
          {messagesLength > 0 && (
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
  );
});

export default ChatInputArea;