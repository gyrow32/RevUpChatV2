'use client';













import { useCallback } from 'react';






import { useChatContext } from '@/app/components/providers/ChatProvider';






import { webhookClient } from '@/app/lib/webhook/client';






import { generateSessionId, storeSessionId } from '@/app/lib/utils/session';






import type { Message } from '@/app/lib/types';






import { debugLog } from '@/app/lib/utils';













export function useChat() {






  const { state, dispatch } = useChatContext();






  






  const sendMessage = useCallback(async (content: string) => {






    if (!content.trim()) {






      debugLog('Attempted to send empty message');






      return;






    }






    






    debugLog('Sending message:', { length: content.length, sessionId: state.sessionId });






    






    // Create message ID






    const messageId = 'msg-' + Math.random().toString(36).substring(2, 15);






    






    // Create user message






    const userMessage: Message = {






      id: messageId,






      role: 'user',






      content: content.trim(),






      timestamp: new Date(),






      status: 'sending'






    };






    






    // Add user message and set loading state






    dispatch({ type: 'ADD_MESSAGE', payload: userMessage });






    dispatch({ type: 'SET_LOADING', payload: true });






    dispatch({ type: 'SET_ERROR', payload: null });






    






    try {






      // Send to webhook






      const response = await webhookClient.sendMessage({






        message: content.trim(),






        sessionId: state.sessionId






      });






      






      // Update user message status






      dispatch({ 






        type: 'UPDATE_MESSAGE', 






        payload: { 






          id: userMessage.id, 






          updates: { status: 'sent' } 






        }






      });






      






      if (response.success && response.data) {






        // Add AI response






        const aiMessage: Message = {






          id: 'ai-' + Math.random().toString(36).substring(2, 15),






          role: 'assistant',






          content: response.data,






          timestamp: new Date(),






          status: 'sent'






        };






        






        dispatch({ type: 'ADD_MESSAGE', payload: aiMessage });






        debugLog('AI response added:', {






          blocks: response.data.blocks.length,






          types: response.data.blocks.map(b => b.type)






        });






      } else {






        // Handle API error






        const errorMessage = response.error || 'Failed to get response from AI assistant';






        






        // Check if this is a retryable error






        const isTimeout = errorMessage.includes('timeout') || errorMessage.includes('taking longer than usual');






        const isRetryable = errorMessage.includes('retryable') || isTimeout;






        






        // Provide helpful error message






        let displayMessage = errorMessage;






        if (isTimeout) {






          displayMessage = '⏱️ The AI is processing your request but it\'s taking longer than usual. You can try again or wait a moment.';






        }






        






        dispatch({ type: 'SET_ERROR', payload: displayMessage });






        






        // Update user message to error state






        dispatch({ 






          type: 'UPDATE_MESSAGE', 






          payload: { 






            id: userMessage.id, 






            updates: { status: 'error' } 






          }






        });






        






        debugLog('Webhook error:', errorMessage, { isTimeout, isRetryable });






      }






      






    } catch (error) {






      debugLog('Send message error:', error);






      






      // Update user message to error state






      dispatch({ 






        type: 'UPDATE_MESSAGE', 






        payload: { 






          id: userMessage.id, 






          updates: { status: 'error' } 






        }






      });






      






      // Provide user-friendly error messages






      let errorMessage = 'Unknown error occurred';






      if (error instanceof Error) {






        if (error.message.includes('fetch')) {






          errorMessage = '🌐 Network connection error. Please check your internet connection and try again.';






        } else if (error.message.includes('timeout')) {






          errorMessage = '⏱️ Request timed out. The AI might be under heavy load. Please try again in a moment.';






        } else {






          errorMessage = error.message;






        }






      }






      






      dispatch({ 






        type: 'SET_ERROR', 






        payload: errorMessage






      });






    } finally {






      dispatch({ type: 'SET_LOADING', payload: false });






    }






  }, [state.sessionId, dispatch]);






  






  const retryMessage = useCallback(async (messageId: string) => {






    const message = state.messages.find(m => m.id === messageId);






    if (message?.role === 'user' && message.status === 'error') {






      debugLog('Retrying message:', messageId);






      await sendMessage(message.content as string);






    }






  }, [state.messages, sendMessage]);






  






  const clearChat = useCallback(() => {






    debugLog('Clearing chat session:', state.sessionId);






    // Clear saved messages






    localStorage.removeItem(`revup_messages_${state.sessionId}`);






    dispatch({ type: 'CLEAR_CHAT' });






  }, [state.sessionId, dispatch]);






  






  const dismissError = useCallback(() => {






    dispatch({ type: 'SET_ERROR', payload: null });






  }, [dispatch]);






  






  const startNewSession = useCallback(() => {






    const newSessionId = generateSessionId();






    debugLog('Starting new session:', newSessionId);






    






    // Clear old messages






    localStorage.removeItem(`revup_messages_${state.sessionId}`);






    






    // Set new session






    dispatch({ type: 'SET_SESSION_ID', payload: newSessionId });






    dispatch({ type: 'LOAD_MESSAGES', payload: [] });






    dispatch({ type: 'SET_ERROR', payload: null });






    






    storeSessionId(newSessionId);






  }, [state.sessionId, dispatch]);






  






  return {






    // State






    messages: state.messages,






    sessionId: state.sessionId,






    isLoading: state.isLoading,






    error: state.error,






    






    // Actions






    sendMessage,






    retryMessage,






    clearChat,






    dismissError,






    startNewSession,






  };






}