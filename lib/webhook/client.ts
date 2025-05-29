import type { ParsedResponse } from '@/types';
import { parseWebhookResponse } from './parser';
import { debugLog } from '@/lib/utils';

export interface ChatRequest {
  message: string;
  sessionId: string;
}

export interface ChatResponse {
  success: boolean;
  data?: ParsedResponse;
  error?: string;
}

export class WebhookClient {
  private baseUrl: string;
  
  constructor(baseUrl: string = '') {
    this.baseUrl = baseUrl;
  }
  
  async sendMessage(request: ChatRequest): Promise<ChatResponse> {
    try {
      debugLog('Sending message:', {
        messageLength: request.message.length, 
        sessionId: request.sessionId 
      });
      
      const response = await fetch(`${this.baseUrl}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: request.message,
          sessionId: request.sessionId,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        debugLog('API error:', data);
        return {
          success: false,
          error: data.error || `HTTP ${response.status}: ${response.statusText}`,
        };
      }
      
      // Parse the webhook response
      const parsed = parseWebhookResponse(data);
      
      debugLog('Parsed response:', {
        blockCount: parsed.blocks.length,
        blockTypes: parsed.blocks.map(b => b.type)
      });
      
      return {
        success: true,
        data: parsed,
      };
      
    } catch (error) {
      debugLog('Webhook client error:', error);
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error occurred',
      };
    }
  }
}

// Default client instance
export const webhookClient = new WebhookClient();