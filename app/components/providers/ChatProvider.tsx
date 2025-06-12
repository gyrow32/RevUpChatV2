'use client';



import { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';

import type { Message, ChatState } from '@/app/lib/types';

import { generateSessionId, getStoredSessionId, storeSessionId } from '@/app/lib/utils/session';

import { debugLog } from '@/app/lib/utils/debug';



type ChatAction =

  | { type: 'ADD_MESSAGE'; payload: Message }

  | { type: 'UPDATE_MESSAGE'; payload: { id: string; updates: Partial<Message> } }

  | { type: 'SET_LOADING'; payload: boolean }

  | { type: 'SET_ERROR'; payload: string | null }

  | { type: 'CLEAR_CHAT' }

  | { type: 'SET_SESSION_ID'; payload: string }

  | { type: 'LOAD_MESSAGES'; payload: Message[] };



const initialState: ChatState = {

  messages: [],

  sessionId: generateSessionId(),

  isLoading: false,

  error: null,

};



function chatReducer(state: ChatState, action: ChatAction): ChatState {

  switch (action.type) {

    case 'ADD_MESSAGE':

      return { 

        ...state, 

        messages: [...state.messages, action.payload],

        error: null 

      };

      

    case 'UPDATE_MESSAGE':

      return {

        ...state,

        messages: state.messages.map(msg =>

          msg.id === action.payload.id 

            ? { ...msg, ...action.payload.updates }

            : msg

        )

      };

      

    case 'SET_LOADING':

      return { ...state, isLoading: action.payload };

      

    case 'SET_ERROR':

      return { ...state, error: action.payload };

      

    case 'CLEAR_CHAT':

      return { 

        ...state, 

        messages: [], 

        sessionId: generateSessionId(),

        error: null 

      };

      

    case 'SET_SESSION_ID':

      return { ...state, sessionId: action.payload };

      

    case 'LOAD_MESSAGES':

      return { ...state, messages: action.payload };

      

    default:

      return state;

  }

}



const ChatContext = createContext<{

  state: ChatState;

  dispatch: React.Dispatch<ChatAction>;

} | null>(null);



interface ChatProviderProps {

  children: ReactNode;

}



export function ChatProvider({ children }: ChatProviderProps) {

  const [state, dispatch] = useReducer(chatReducer, initialState);

  

  // Load saved session and messages on mount (once only)

  useEffect(() => {

    const savedSessionId = getStoredSessionId();

    if (savedSessionId) {

      dispatch({ type: 'SET_SESSION_ID', payload: savedSessionId });

      

      // Load messages for this session

      const savedMessages = localStorage.getItem(`revup_messages_${savedSessionId}`);

      if (savedMessages) {

        try {

          const parsed = JSON.parse(savedMessages);

          // Convert timestamp strings back to Date objects

          const messagesWithDates = parsed.map((msg: Omit<Message, 'timestamp'> & { timestamp: string }) => ({

            ...msg,

            timestamp: new Date(msg.timestamp)

          }));

          dispatch({ type: 'LOAD_MESSAGES', payload: messagesWithDates });

          debugLog('Loaded saved messages:', messagesWithDates.length);

        } catch (error) {

          debugLog('Failed to load saved messages:', error);

          localStorage.removeItem(`revup_messages_${savedSessionId}`);

        }

      }

    } else {

      // Save new session ID

      storeSessionId(state.sessionId);

    }

  }, [dispatch, state.sessionId]);

  

  // Save messages when they change (debounced)

  useEffect(() => {

    if (state.messages.length > 0) {

      const timeoutId = setTimeout(() => {

        localStorage.setItem(

          `revup_messages_${state.sessionId}`,

          JSON.stringify(state.messages)

        );

      }, 1000); // 1 second debounce

      

      return () => clearTimeout(timeoutId);

    }

  }, [state.messages, state.sessionId]);

  

  // Save session ID when it changes

  useEffect(() => {

    storeSessionId(state.sessionId);

  }, [state.sessionId]);

  

  return (

    <ChatContext.Provider value={{ state, dispatch }}>

      {children}

    </ChatContext.Provider>

  );

}



export function useChatContext() {

  const context = useContext(ChatContext);

  if (!context) {

    throw new Error('useChatContext must be used within a ChatProvider');

  }

  return context;

}