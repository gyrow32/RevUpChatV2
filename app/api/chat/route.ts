import { NextResponse } from 'next/server';
import type { WebhookRequest } from '@/types';

const WEBHOOK_URL = process.env.WEBHOOK_URL || 'https://revupinventory.app.n8n.cloud/webhook/e1f37ad8-7461-49b3-8a6c-479ec4013958/chat';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate request body
    if (!body.message || typeof body.message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required and must be a string' },
        { status: 400 }
      );
    }
    
    if (!body.sessionId || typeof body.sessionId !== 'string') {
      return NextResponse.json(
        { error: 'Session ID is required and must be a string' },
        { status: 400 }
      );
    }

    // Format request for webhook
    const webhookPayload: WebhookRequest = {
      sessionId: body.sessionId,
      action: 'sendMessage',
      chatInput: body.message.trim()
    };

    console.log('Sending to webhook:', { 
      sessionId: body.sessionId, 
      messageLength: body.message.length,
      webhook: WEBHOOK_URL.substring(0, 50) + '...'
    });

    // Call webhook with timeout (responses take 3-6 seconds)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout

    try {
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'User-Agent': 'RevUpChat/1.0'
        },
        body: JSON.stringify(webhookPayload),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        console.error('Webhook error:', response.status, response.statusText);
        throw new Error(`Webhook returned ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Webhook response received:', { 
        hasOutput: !!data.output,
        outputLength: data.output?.length || 0
      });
      
      return NextResponse.json(data);
      
    } catch (fetchError: any) {
      clearTimeout(timeoutId);
      
      if (fetchError.name === 'AbortError') {
        console.error('Webhook timeout');
        return NextResponse.json(
          { error: 'Request timeout - the AI is taking longer than usual. Please try again.' },
          { status: 504 }
        );
      }
      
      console.error('Webhook fetch error:', fetchError);
      throw fetchError;
    }
    
  } catch (error) {
    console.error('Chat API error:', error);
    
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to process message',
        details: process.env.NODE_ENV === 'development' ? String(error) : undefined
      },
      { status: 500 }
    );
  }
}

// Handle preflight requests for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}