"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
  useEffect,
} from "react";
import {
  ChatMessage,
  ChatSession,
  ChatContextType,
  ChatContextState,
  BusinessPlannerSessionContext,
  MessageStatus, // Import MessageStatus
  SessionError, // Import SessionError
  SessionErrorType, // Import SessionErrorType
  SessionCreationStatus, // Import for validation
} from "../types/business-planner";
// Extend ChatContextState locally to ensure properties are recognized

// Constants for AI response handling
const AI_RESPONSE_TIMEOUT = 30000; // 30 seconds
const MAX_RETRIES = 3; // Maximum number of retries for timed-out requests

// Helper for logging errors
const logError = (context: string, error: any, details?: any) => {
  console.error(`[ChatContext Error] ${context}:`, error, details);
  
  // Send error to logging endpoint
  if (typeof window !== 'undefined' && typeof fetch !== 'undefined') {
    const errorData = {
      message: error?.message || String(error),
      stack: error?.stack,
      context: context,
      details: details,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent
    };

    fetch('/api/log-error', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(errorData),
    }).catch(err => {
      console.error('Failed to log error to service:', err);
    });
  }
};

// Helper for validating API responses

// Initial state for the chat context
const initialChatContextState: ChatContextState = {
  currentSession: null,
  messages: [],
  sessions: [],
  loading: { isLoading: false },
  error: { hasError: false, error: null },
  aiResponseLoading: { isLoading: false },
  aiResponseError: { hasError: false, error: null },
  isTyping: false,
  sessionsLoaded: false,
  messagesLoaded: false,
  estimatedWaitTime: AI_RESPONSE_TIMEOUT / 1000,
  sessionCreationStatus: SessionCreationStatus.IDLE,
  sessionCreationRetryInfo: { retryCount: 0, maxRetries: MAX_RETRIES },
};

interface ChatProviderProps {
  children: ReactNode;
  initialMessages?: ChatMessage[];
  initialSession?: ChatSession;
}
const ChatContext = createContext<ChatContextType | undefined>(undefined);

// Update ChatProvider state to use LocalChatContextState
export const ChatProvider: React.FC<ChatProviderProps> = ({
  children,
  initialMessages,
  initialSession,
}) => {
  const [state, setState] = useState<ChatContextState>({
    ...initialChatContextState,
    messages: initialMessages || [],
    currentSession: initialSession || null,
    messagesLoaded: initialMessages ? initialMessages.length > 0 : false,
    sessionsLoaded: initialSession ? true : false, // Assuming if initialSession is provided, sessions are loaded
  });



  // Simulate API calls
  const fetchSessions = useCallback(async (): Promise<void> => {
    setState((prevState) => ({
      ...prevState,
      loading: { isLoading: true, message: "Loading sessions..." },
    }));
    try {
      // Replace with actual API call
      const response = await new Promise<{ data: ChatSession[] }>((resolve) =>
        setTimeout(() => {
          resolve({
            data: [
              {
                id: "session-1",
                user_id: "user-1",
                title: "My First Plan",
                context: {
                  business_type: "SaaS",
                  target_market: "Small Businesses",
                  challenge: "Customer Acquisition",
                  created_at: new Date().toISOString(),
                },
                status: "active",
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              },
              {
                id: "session-2",
                user_id: "user-1",
                title: "Marketing Strategy",
                context: {
                  business_type: "E-commerce",
                  target_market: "Gen Z",
                  challenge: "Brand Awareness",
                  created_at: new Date().toISOString(),
                },
                status: "completed",
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              },
            ],
          });
        }, 500)
      );
      setState((prevState) => ({
        ...prevState,
        sessions: response.data,
        sessionsLoaded: true,
        loading: { isLoading: false },
      }));
    } catch (err) {
      setState((prevState) => ({
        ...prevState,
        error: { hasError: true, error: err as Error, message: "Failed to load sessions." },
        loading: { isLoading: false },
      }));
    }
  }, []);

  const fetchMessages = useCallback(async (sessionId: string): Promise<void> => {
    setState((prevState) => ({
      ...prevState,
      loading: { isLoading: true, message: "Loading messages..." },
    }));
    try {
      // Replace with actual API call
      const response = await new Promise<{ data: ChatMessage[] }>((resolve) =>
        setTimeout(() => {
          resolve({
            data: [
              {
                id: "msg-1",
                session_id: sessionId,
                user_id: "user-1",
                role: "user",
                content: "Hi there!",
                tokens_used: 5,
                created_at: new Date().toISOString(),
                status: MessageStatus.COMPLETED, // Add status
              },
              {
                id: "msg-2",
                session_id: sessionId,
                user_id: "user-1",
                role: "assistant",
                content: "Hello! How can I help you today?",
                tokens_used: 10,
                created_at: new Date().toISOString(),
                status: MessageStatus.COMPLETED, // Add status
              },
            ],
          });
        }, 500)
      );
      setState((prevState) => ({
        ...prevState,
        messages: response.data,
        messagesLoaded: true,
        loading: { isLoading: false },
      }));
    } catch (err) {
      setState((prevState) => ({
        ...prevState,
        error: { hasError: true, error: err as Error, message: "Failed to load messages." },
        loading: { isLoading: false },
      }));
    }
  }, []);

  const sendMessage = useCallback(
    async (message: string, sessionId?: string, retryCount: number = 0, attemptNumber: number = 1): Promise<void> => {
      performance.mark('sendMessage:start'); // Mark start of sendMessage

      const tempId = `temp-${Date.now()}`;
      const newMessage: ChatMessage = {
        id: tempId,
        temp_id: tempId,
        session_id: sessionId || state.currentSession?.id || "", // Will be updated after API call
        user_id: "user-1", // Replace with actual user ID
        role: "user",
        content: message,
        tokens_used: 0,
        created_at: new Date().toISOString(),
        isOptimistic: true,
        retryCount: retryCount,
        maxRetries: MAX_RETRIES, // Set maxRetries for the message
        attemptNumber: attemptNumber, // Set current attempt number
        status: MessageStatus.PENDING, // Set initial status to PENDING
      };

      setState((prevState) => ({
        ...prevState,
        messages: [...prevState.messages, newMessage],
        loading: { isLoading: true, message: "Sending message..." },
        error: { hasError: false, error: null },
        aiResponseLoading: { isLoading: true, message: "AI is thinking..." }, // Start AI loading
        aiResponseError: { hasError: false, error: null }, // Clear previous AI errors
        isTyping: true, // AI starts typing
        estimatedWaitTime: AI_RESPONSE_TIMEOUT / 1000, // Reset estimated wait time
      }));

      let currentRetry = retryCount;
      let success = false;
      let lastError: Error | null = null;

      // Prepare for streaming AI response
      let assistantMessage: ChatMessage = {
        id: `ai-${Date.now()}`, // Temporary ID for streaming
        session_id: sessionId || state.currentSession?.id || "",
        user_id: "assistant", // AI's user ID
        role: "assistant",
        content: "", // Content will be streamed
        tokens_used: 0,
        created_at: new Date().toISOString(),
        isOptimistic: true, // Mark as optimistic until fully received
        status: MessageStatus.STREAMING, // Set initial status to STREAMING
      };

      // Add a placeholder for the assistant's message
      setState((prevState) => ({
        ...prevState,
        messages: [...prevState.messages, assistantMessage],
      }));

      while (currentRetry <= MAX_RETRIES && !success) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), AI_RESPONSE_TIMEOUT);

        try {
          performance.mark('sendMessage:api:start'); // Mark start of API call
          const response = await fetch("/api/business-planner/chat", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              sessionId: sessionId || state.currentSession?.id,
              message: message,
              // Include previous messages for context if needed by the API
              // messages: state.messages.map(msg => ({ role: msg.role, content: msg.content })),
            }),
            signal: controller.signal,
          });
          performance.mark('sendMessage:api:end'); // Mark end of API call
          performance.measure('sendMessage:api', 'sendMessage:api:start', 'sendMessage:api:end'); // Measure API duration


          clearTimeout(timeoutId);

          if (!response.ok) {
            const errorData = await response.json();
            logError('sendMessage API Error', errorData);
            throw new Error(errorData.message || "Failed to get AI response.");
          }

          // Validate the response before processing the stream
          // For streaming, we might only get headers first, so validate after full response is received or on first chunk
          // For now, we'll assume the stream itself will provide valid data.
          // A more robust solution might involve a pre-flight check or a specific header.

          const reader = response.body?.getReader();
          if (!reader) {
            logError('sendMessage Stream Error', 'Failed to get readable stream from AI response.');
            throw new Error("Failed to get readable stream from AI response.");
          }

          const decoder = new TextDecoder();
          let done = false;
          let streamedContent = ""; // Declare streamedContent here

          // Update the user message to be non-optimistic, with real ID, and COMPLETED status
          setState((prevState) => ({
            ...prevState,
            messages: prevState.messages.map((msg) =>
              msg.temp_id === newMessage.temp_id
                ? { ...msg, id: `user-${Date.now()}`, isOptimistic: false, status: MessageStatus.COMPLETED, attemptNumber: attemptNumber }
                : msg
            ),
          }));

          while (!done) {
            const { value, done: readerDone } = await reader.read();
            done = readerDone;
            const chunk = decoder.decode(value, { stream: true });
            streamedContent += chunk;

            // Update the assistant's message content incrementally
            setState((prevState) => ({
              ...prevState,
              messages: prevState.messages.map((msg) =>
                msg.id === assistantMessage.id
                  ? { ...msg, content: streamedContent, status: MessageStatus.STREAMING } // Ensure status is STREAMING
                  : msg
              ),
            }));
          }

          // Final update for the assistant message: set status to COMPLETED
          setState((prevState) => ({
            ...prevState,
            messages: prevState.messages.map((msg) =>
              msg.id === assistantMessage.id
                ? { ...msg, isOptimistic: false, content: streamedContent, created_at: new Date().toISOString(), status: MessageStatus.COMPLETED }
                : msg
            ),
            loading: { isLoading: false },
            aiResponseLoading: { isLoading: false },
            isTyping: false,
            aiResponseError: { hasError: false, error: null },
            estimatedWaitTime: AI_RESPONSE_TIMEOUT / 1000,
          }));

          success = true;
        } catch (err: any) {
          clearTimeout(timeoutId);
          lastError = err;
          logError('sendMessage Catch Error', err);

          const isTimeout = err.name === "AbortError" || err.message.includes("timed out");
          const errorMessage = isTimeout
            ? `AI response timed out. Retrying... (Attempt ${currentRetry + 1}/${MAX_RETRIES + 1})`
            : `Failed to send message: ${err.message}`;

          setState((prevState) => ({
            ...prevState,
            loading: { isLoading: false },
            aiResponseLoading: { isLoading: false },
            aiResponseError: { hasError: true, error: err, message: errorMessage, isTimeout: isTimeout },
            isTyping: false,
            messages: prevState.messages.map((msg) => {
              if (msg.temp_id === newMessage.temp_id) {
                return { ...msg, error: true, retryCount: currentRetry, attemptNumber: currentRetry + 1, status: MessageStatus.FAILED }; // Mark user message as FAILED
              } else if (msg.id === assistantMessage.id) {
                return { ...msg, error: true, status: MessageStatus.FAILED, content: assistantMessage.content }; // Preserve partial content, mark AI message as FAILED
              }
              return msg;
            }),
            estimatedWaitTime: isTimeout ? AI_RESPONSE_TIMEOUT / 1000 : (prevState.estimatedWaitTime !== undefined ? prevState.estimatedWaitTime : AI_RESPONSE_TIMEOUT / 1000),
          }));

          if (isTimeout && currentRetry < MAX_RETRIES) {
            currentRetry++;
            await new Promise((resolve) => setTimeout(resolve, 2000));
          } else {
            break;
          }
        }
      }

      if (!success && lastError) {
        setState((prevState) => ({
          ...prevState,
          error: { hasError: true, error: lastError, message: "Failed to send message after multiple retries." },
          aiResponseError: { hasError: true, error: lastError, message: lastError.message, isTimeout: lastError.name === "AbortError" || lastError.message.includes("timed out") },
          messages: prevState.messages.map((msg) => {
            if (msg.temp_id === newMessage.temp_id) {
              return { ...msg, error: true, retryCount: currentRetry, attemptNumber: currentRetry + 1, status: MessageStatus.FAILED }; // Mark user message as FAILED
            } else if (msg.id === assistantMessage.id) {
              return { ...msg, error: true, status: MessageStatus.FAILED, content: assistantMessage.content }; // Preserve partial content, mark AI message as FAILED
            }
            return msg;
          }),
          estimatedWaitTime: AI_RESPONSE_TIMEOUT / 1000,
        }));
      }
      performance.mark('sendMessage:end'); // Mark end of sendMessage
      performance.measure('sendMessage', 'sendMessage:start', 'sendMessage:end'); // Measure total sendMessage duration
    },
    [state.currentSession?.id]
  );

  const validateSessionContext = useCallback((context: BusinessPlannerSessionContext): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    if (!context.business_type || context.business_type.trim() === "") {
      errors.push("Business type is required.");
    }
    if (!context.target_market || context.target_market.trim() === "") {
      errors.push("Target market is required.");
    }
    if (!context.challenge || context.challenge.trim() === "") {
      errors.push("Business challenge is required.");
    }
    return { isValid: errors.length === 0, errors };
  }, []);

  const createSession = useCallback(
    async (context: BusinessPlannerSessionContext, message: string, retryCount: number = 0): Promise<void> => {
      performance.mark('createSession:start'); // Mark start of createSession
      setState((prevState: ChatContextState) => ({
        ...prevState,
        loading: { isLoading: true, message: "Creating new session..." },
        error: { hasError: false, error: null },
        sessionCreationStatus: SessionCreationStatus.IN_PROGRESS,
        sessionCreationRetryInfo: { ...prevState.sessionCreationRetryInfo, retryCount: retryCount, lastError: undefined as SessionError | undefined },
      }) as ChatContextState);

      const validation = validateSessionContext(context);
      if (!validation.isValid) {
        const validationError: SessionError = {
          code: "VALIDATION_ERROR",
          message: `Validation failed: ${validation.errors.join(", ")}`,
          timestamp: new Date().toISOString(),
          type: SessionErrorType.UNKNOWN,
          isTransient: false,
        };
        setState((prevState: ChatContextState) => ({
          ...prevState,
          error: { hasError: true, error: validationError, message: validationError.message },
          loading: { isLoading: false },
          sessionCreationStatus: SessionCreationStatus.FAILED,
          sessionCreationRetryInfo: { ...prevState.sessionCreationRetryInfo, lastError: validationError },
        }) as ChatContextState);
        return;
      }

      let currentRetry = retryCount;
      let success = false;
      let lastError: SessionError | null = null;

      while (currentRetry <= MAX_RETRIES && !success) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), AI_RESPONSE_TIMEOUT);

        try {
          performance.mark('createSession:api:start'); // Mark start of API call
          const response = await fetch("/api/business-planner/sessions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              title: "New Business Plan",
              context: context,
            }),
            signal: controller.signal,
          });
          performance.mark('createSession:api:end'); // Mark end of API call
          performance.measure('createSession:api', 'createSession:api:start', 'createSession:api:end'); // Measure API duration

          clearTimeout(timeoutId);

          if (!response.ok) {
            const errorData = await response.json();
            logError('createSession API Error', errorData);
            let sessionError: SessionError;

            if (response.status === 429) {
              sessionError = {
                code: "RATE_LIMIT_EXCEEDED",
                message: errorData.message || "Too many requests. Please try again later.",
                timestamp: new Date().toISOString(),
                type: SessionErrorType.USAGE_LIMIT_EXCEEDED,
                isTransient: true,
              };
            } else if (response.status >= 500) {
              sessionError = {
                code: "SERVER_ERROR",
                message: errorData.message || "Server error. Please try again.",
                timestamp: new Date().toISOString(),
                type: SessionErrorType.API_ERROR,
                isTransient: true,
              };
            } else {
              sessionError = {
                code: errorData.code || "UNKNOWN_ERROR",
                message: errorData.message || "Failed to create session.",
                timestamp: new Date().toISOString(),
                type: SessionErrorType.API_ERROR,
                isTransient: false,
                originalError: errorData,
              };
            }
            throw sessionError;
          }

          const { session: newSession }: { session: ChatSession } = await response.json();

          setState((prevState: ChatContextState) => ({
            ...prevState,
            currentSession: newSession,
            sessions: [...prevState.sessions, newSession],
            messages: [],
            messagesLoaded: false,
            loading: { isLoading: false },
            sessionCreationStatus: SessionCreationStatus.SUCCESS,
            sessionCreationRetryInfo: { ...prevState.sessionCreationRetryInfo, retryCount: 0, lastError: undefined as SessionError | undefined },
          }) as ChatContextState);

          await sendMessage(message, newSession.id);
          success = true;
        } catch (err: any) {
          clearTimeout(timeoutId);
          logError('createSession Catch Error', err);
          let sessionError: SessionError;

          if (err.name === "AbortError") {
            sessionError = {
              code: "TIMEOUT",
              message: "Session creation timed out.",
              timestamp: new Date().toISOString(),
              type: SessionErrorType.TIMEOUT,
              isTransient: true,
              originalError: err,
            };
          } else if (err instanceof TypeError && err.message === "Failed to fetch") {
            sessionError = {
              code: "NETWORK_ERROR",
              message: "Network error. Please check your internet connection.",
              timestamp: new Date().toISOString(),
              type: SessionErrorType.NETWORK_ERROR,
              isTransient: true,
              originalError: err,
            };
          } else if (err.type) { // Custom SessionError
            sessionError = err;
          } else {
            sessionError = {
              code: "UNKNOWN_ERROR",
              message: err.message || "An unknown error occurred during session creation.",
              timestamp: new Date().toISOString(),
              type: SessionErrorType.UNKNOWN,
              isTransient: false,
              originalError: err,
            };
          }

          lastError = sessionError;

          setState((prevState: ChatContextState) => ({
            ...prevState,
            error: { hasError: true, error: sessionError, message: sessionError.message },
            loading: { isLoading: false },
            sessionCreationStatus: SessionCreationStatus.FAILED,
            sessionCreationRetryInfo: { ...prevState.sessionCreationRetryInfo, lastError: sessionError, lastAttemptTimestamp: new Date().toISOString() },
          }) as ChatContextState);

          if (sessionError.isTransient && currentRetry < MAX_RETRIES) {
            currentRetry++;
            setState((prevState: ChatContextState) => ({
              ...prevState,
              sessionCreationStatus: SessionCreationStatus.RETRIED,
              sessionCreationRetryInfo: { ...prevState.sessionCreationRetryInfo, retryCount: currentRetry },
            }) as ChatContextState);
            await new Promise((resolve) => setTimeout(resolve, 2000 * (currentRetry + 1))); // Exponential backoff
          } else {
            break;
          }
        }
      }

      if (!success && lastError) {
        setState((prevState: ChatContextState) => ({
          ...prevState,
          sessionCreationStatus: SessionCreationStatus.FAILED,
          sessionCreationRetryInfo: { ...prevState.sessionCreationRetryInfo, lastError: lastError },
          error: { hasError: true, error: lastError, message: lastError.message },
        }) as ChatContextState);
      }
      performance.mark('createSession:end'); // Mark end of createSession
      performance.measure('createSession', 'createSession:start', 'createSession:end'); // Measure total createSession duration
    },
    [sendMessage, validateSessionContext]
  );

  const selectSession = useCallback(
    async (sessionId: string): Promise<void> => {
      const sessionToSelect = state.sessions.find((s) => s.id === sessionId);
      if (sessionToSelect) {
        setState((prevState) => ({
          ...prevState,
          currentSession: sessionToSelect,
          messages: [], // Clear messages when switching sessions
          messagesLoaded: false,
        }));
        await fetchMessages(sessionId);
      }
    },
    [state.sessions, fetchMessages]
  );

  const deleteSession = useCallback(async (sessionId: string): Promise<void> => {
    setState((prevState) => ({
      ...prevState,
      loading: { isLoading: true, message: "Deleting session..." },
      error: { hasError: false, error: null },
    }));
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      setState((prevState) => ({
        ...prevState,
        sessions: prevState.sessions.filter((s) => s.id !== sessionId),
        currentSession: prevState.currentSession?.id === sessionId ? null : prevState.currentSession,
        messages: prevState.currentSession?.id === sessionId ? [] : prevState.messages,
        loading: { isLoading: false },
      }));
    } catch (err) {
      setState((prevState) => ({
        ...prevState,
        error: { hasError: true, error: err as Error, message: "Failed to delete session." },
        loading: { isLoading: false },
      }));
    }
  }, []);

  const clearChat = useCallback((): void => {
    setState((prevState) => ({
      ...prevState,
      currentSession: null,
      messages: [],
      messagesLoaded: false,
    }));
  }, []);

  const retryCreateSession = useCallback(async (): Promise<void> => {
    const lastError = state.sessionCreationRetryInfo.lastError;
    const currentRetryCount = state.sessionCreationRetryInfo.retryCount;

    if (lastError && lastError.isTransient && currentRetryCount < MAX_RETRIES) {
      // Re-attempt session creation with incremented retry count
      await createSession(lastError.originalError?.context, "", currentRetryCount + 1);
    } else {
      // If not transient or max retries reached, just set status to failed
      setState((prevState: ChatContextState) => ({
        ...prevState,
        sessionCreationStatus: SessionCreationStatus.FAILED,
        error: { hasError: true, error: lastError, message: lastError?.message || "Max retries reached for session creation." },
      }) as ChatContextState);
    }
  }, [state.sessionCreationRetryInfo, createSession]);

  const retrySendMessage = useCallback(
    async (tempId: string): Promise<void> => {
      const messageToRetry = state.messages.find((msg) => msg.temp_id === tempId);
      if (messageToRetry) {
        // Update the status of the message to PENDING before retrying
        setState((prevState) => ({
          ...prevState,
          messages: prevState.messages.map((msg) =>
            msg.temp_id === tempId ? { ...msg, status: MessageStatus.PENDING, error: false } : msg
          ),
          aiResponseError: { hasError: false, error: null }, // Clear AI error
        }));
        // Resend the message with incremented retry count and attempt number
        await sendMessage(
          messageToRetry.content,
          messageToRetry.session_id,
          (messageToRetry.retryCount || 0) + 1,
          (messageToRetry.attemptNumber || 1) + 1
        );
      }
    },
    [state.messages, sendMessage]
  );

  const updateSessionTitle = useCallback(async (sessionId: string, newTitle: string): Promise<void> => {
    setState((prevState) => ({
      ...prevState,
      loading: { isLoading: true, message: "Updating session title..." },
      error: { hasError: false, error: null },
    }));
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      setState((prevState) => ({
        ...prevState,
        sessions: prevState.sessions.map((s) =>
          s.id === sessionId ? { ...s, title: newTitle } : s
        ),
        currentSession:
          prevState.currentSession?.id === sessionId
            ? { ...prevState.currentSession, title: newTitle }
            : prevState.currentSession,
        loading: { isLoading: false },
      }));
    } catch (err) {
      setState((prevState) => ({
        ...prevState,
        error: { hasError: true, error: err as Error, message: "Failed to update session title." },
        loading: { isLoading: false },
      }));
    }
  }, []);

  useEffect(() => {
    if (!state.sessionsLoaded) {
      fetchSessions();
    }
  }, [state.sessionsLoaded, fetchSessions]);

  useEffect(() => {
    if (state.currentSession && !state.messagesLoaded) {
      fetchMessages(state.currentSession.id);
    }
  }, [state.currentSession, state.messagesLoaded, fetchMessages]);

  const cancelAiResponse = useCallback(() => {
    // This function would ideally send a signal to the backend to abort the AI generation.
    // For now, it just updates the UI state.
    setState((prevState) => ({
      ...prevState,
      aiResponseLoading: { isLoading: false },
      aiResponseError: { hasError: true, error: new Error("AI response cancelled."), message: "AI response cancelled.", isTimeout: false },
      isTyping: false, // AI stops typing when cancelled
      estimatedWaitTime: AI_RESPONSE_TIMEOUT / 1000, // Reset estimated wait time
    }));
  }, []);

  const contextValue: ChatContextType = {
    ...state,
    sendMessage,
    createSession,
    selectSession,
    deleteSession,
    clearChat,
    retrySendMessage,
    retryCreateSession, // Add retryCreateSession to context
    updateSessionTitle,
    cancelAiResponse, // Add cancel function to context
  };

  return <ChatContext.Provider value={contextValue}>{children}</ChatContext.Provider>;
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};