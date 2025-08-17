import React from 'react';
import { ChatMessage, ErrorState, SessionCreationRetryInfo, SessionCreationStatus, MessageStatus } from '@/app/types/business-planner';

interface ChatErrorDisplayProps {
  sessionCreationStatus: SessionCreationStatus;
  sessionCreationRetryInfo: SessionCreationRetryInfo;
  error: ErrorState;
  aiResponseError: ErrorState;
  showTimeoutWarning: boolean;
  estimatedWaitTime: number;
  retryCreateSession: () => Promise<void>;
  retrySendMessage: (tempId: string) => Promise<void>;
  messages: ChatMessage[];
  cancelAiResponse: () => void;
  isLoading: boolean; // Added isLoading prop
  aiResponseLoading: boolean; // Added aiResponseLoading prop
}

const ChatErrorDisplay: React.FC<ChatErrorDisplayProps> = React.memo(function ChatErrorDisplay({
  sessionCreationStatus,
  sessionCreationRetryInfo,
  error,
  aiResponseError,
  showTimeoutWarning,
  estimatedWaitTime,
  retryCreateSession,
  retrySendMessage,
  messages,
  cancelAiResponse,
  isLoading,
  aiResponseLoading,
}) {
  return (
    <>
      {(sessionCreationStatus as string) === 'FAILED' && sessionCreationRetryInfo.lastError && (
        <div id="session-creation-error-message" className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
          <p className="text-sm text-red-600">
            Session Creation Error: {sessionCreationRetryInfo.lastError.message}
          </p>
          {sessionCreationRetryInfo.lastError.isTransient &&
           sessionCreationRetryInfo.retryCount < sessionCreationRetryInfo.maxRetries && (
            <div id="retry-session-creation-container" className="mt-2">
              <button
                id="retry-session-button"
                onClick={retryCreateSession}
                className="inline-flex items-center px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading || (sessionCreationStatus as string) === 'IN_PROGRESS'}
              >
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004 12c0 2.127.67 4.1 1.86 5.733m6.27-3.407a4 4 0 01-7.023 2.233L4 20h5.582m4.418-15h.582m-15.356 2A8.001 8.001 0 0020 12c0-2.127-.67-4.1-1.86-5.733m-6.27 3.407a4 4 0 017.023-2.233L20 4h-5.582" />
                </svg>
                Retry Session Creation ({sessionCreationRetryInfo.maxRetries - sessionCreationRetryInfo.retryCount} remaining)
              </button>
            </div>
          )}
          {!sessionCreationRetryInfo.lastError.isTransient && (
            <p className="text-sm text-red-700 mt-1">
              This error is not transient. Please adjust your input or contact support.
            </p>
          )}
          {sessionCreationRetryInfo.lastError.isTransient &&
           sessionCreationRetryInfo.retryCount >= sessionCreationRetryInfo.maxRetries && (
            <p className="text-sm text-red-700 mt-1">
              Maximum retries reached for session creation. Please try a new message or contact support.
            </p>
          )}
        </div>
      )}

      {error.hasError && (sessionCreationStatus as string) !== 'FAILED' && ( // General chat error, excluding session creation errors
        <div id="general-error-message" className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
          <p className="text-sm text-red-600">{error.message}</p>
        </div>
      )}

      {aiResponseError.hasError && ( // AI response specific error
        <div id="ai-error-message" className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
          <p className="text-sm text-red-600">
            AI Response Error: {aiResponseError.message}
            {aiResponseError.isTimeout && (
              <span className="ml-2 font-semibold">
                (This request timed out. You can try again.)
              </span>
            )}
          </p>
          {aiResponseError.isTimeout && (
            <div id="retry-action-container" className="mt-2">
              {(() => {
                const lastUserMessage = messages.findLast(msg => msg.role === 'user' && msg.status === MessageStatus.FAILED);
                const canRetry = lastUserMessage && lastUserMessage.temp_id &&
                                 (lastUserMessage.attemptNumber || 1) <= (lastUserMessage.maxRetries || 0);
                const retriesRemaining = lastUserMessage && lastUserMessage.maxRetries !== undefined && lastUserMessage.attemptNumber !== undefined
                                         ? lastUserMessage.maxRetries - (lastUserMessage.attemptNumber - 1)
                                         : 0;

                return (
                  <>
                    {canRetry ? (
                      <button
                        id="retry-button"
                        onClick={() => retrySendMessage(lastUserMessage.temp_id!)}
                        className="inline-flex items-center px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={!canRetry}
                      >
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004 12c0 2.127.67 4.1 1.86 5.733m6.27-3.407a4 4 0 01-7.023 2.233L4 20h5.582m4.418-15h.582m-15.356 2A8.001 8.001 0 0020 12c0-2.127-.67-4.1-1.86-5.733m-6.27 3.407a4 4 0 017.023-2.233L20 4h-5.582" />
                        </svg>
                        Retry ({retriesRemaining} remaining)
                      </button>
                    ) : (
                      <p className="text-sm text-red-700 mt-1">
                        Maximum retries reached. Please try a new message.
                      </p>
                    )}
                  </>
                );
              })()}
            </div>
          )}
        </div>
      )}

      {showTimeoutWarning && aiResponseLoading && (
        <div id="timeout-warning" className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
          <p className="text-sm text-yellow-800">
            AI response is taking longer than expected (estimated {estimatedWaitTime} seconds).
            We're still working on it!
          </p>
          <button
            id="cancel-ai-button"
            onClick={cancelAiResponse}
            className="inline-flex items-center mt-2 px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors"
          >
            Cancel AI Response
          </button>
        </div>
      )}
    </>
  );
});

export default ChatErrorDisplay;