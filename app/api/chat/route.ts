import { NextResponse } from 'next/server';



import type { WebhookRequest } from '@/app/lib/types';



import { debugLog } from '@/app/lib/utils/debug';







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







    debugLog('Sending to webhook:', {



      sessionId: body.sessionId, 



      messageLength: body.message.length,



      webhook: WEBHOOK_URL.substring(0, 50) + '...'



    });







    // Call webhook with longer timeout (AI responses can take 60+ seconds)



    const controller = new AbortController();



    const timeoutId = setTimeout(() => controller.abort(), 90000); // 90s timeout







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



        debugLog(`Webhook error: ${response.status} - ${response.statusText}`);



        



        // Provide more specific error messages



        if (response.status === 504 || response.status === 502) {



          throw new Error('The AI service is temporarily unavailable. Please try again in a moment.');



        } else if (response.status === 429) {



          throw new Error('Too many requests. Please wait a moment before trying again.');



        } else {



          throw new Error(`AI service error (${response.status}). Please try again.`);



        }



      }







      const data = await response.json();



      debugLog('Webhook response received:', {



        hasOutput: !!data.output,



        outputLength: data.output?.length || 0



      });



      



      return NextResponse.json(data);



      



    } catch (fetchError: unknown) {



      clearTimeout(timeoutId);



      



      if (fetchError instanceof Error && fetchError.name === 'AbortError') {



        debugLog('Webhook timeout after 90 seconds');



        return NextResponse.json(



          { 



            error: 'The AI is taking longer than usual to respond. This might be due to high demand or complex processing. Please try again or rephrase your question.',



            retryable: true 



          },



          { status: 504 }



        );



      }



      



      debugLog('Webhook fetch error:', fetchError);



      throw fetchError;



    }



    



  } catch (error) {



    debugLog('Chat API error:', error);



    



    return NextResponse.json(



      { 



        error: error instanceof Error ? error.message : 'Failed to process message',



        details: process.env.NODE_ENV === 'development' ? String(error) : undefined,



        retryable: true



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