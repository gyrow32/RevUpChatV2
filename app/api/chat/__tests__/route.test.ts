import { NextRequest } from 'next/server';
import { POST } from '../route';
import { Message } from '@/app/lib/types';

// Mock the webhook parser
const mockParseWebhookResponse = jest.fn();
jest.mock('@/lib/webhook/parser', () => ({
  parseWebhookResponse: mockParseWebhookResponse
}));

describe('/api/chat', () => {
  let mockRequest: NextRequest;
  let mockJson: jest.Mock;
  let mockHeaders: jest.Mock;
  let mockResponse: { json: jest.Mock; headers: jest.Mock };

  beforeEach(() => {
    jest.clearAllMocks();
    mockJson = jest.fn();
    mockHeaders = jest.fn();
    mockResponse = {
      json: mockJson,
      headers: mockHeaders
    };
    mockRequest = new NextRequest('http://localhost:3000/api/chat', {
      method: 'POST',
      body: JSON.stringify({
        messages: [],
        sessionId: 'test-session'
      })
    });
  });

  it('should handle POST request with valid message', async () => {
    const mockResponse: unknown = {
      blocks: [
        {
          type: 'text',
          content: 'Hello, how can I help you?'
        }
      ]
    };

    mockParseWebhookResponse.mockResolvedValue(mockResponse);

    const request = new NextRequest('http://localhost:3000/api/chat', {
      method: 'POST',
      body: JSON.stringify({
        message: 'Hello',
        sessionId: 'test-session'
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveProperty('content');
    expect(mockParseWebhookResponse).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Hello',
        sessionId: 'test-session'
      })
    );
  });

  it('should handle POST request with missing message', async () => {
    const request = new NextRequest('http://localhost:3000/api/chat', {
      method: 'POST',
      body: JSON.stringify({
        sessionId: 'test-session'
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const response = await POST(request);

    expect(response.status).toBe(400);
  });

  it('should handle POST request with missing sessionId', async () => {
    const request = new NextRequest('http://localhost:3000/api/chat', {
      method: 'POST',
      body: JSON.stringify({
        message: 'Hello'
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const response = await POST(request);

    expect(response.status).toBe(400);
  });

  it('should handle invalid JSON in request body', async () => {
    const request = new NextRequest('http://localhost:3000/api/chat', {
      method: 'POST',
      body: 'invalid json',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const response = await POST(request);

    expect(response.status).toBe(400);
  });

  it('should handle webhook parser errors', async () => {
    mockParseWebhookResponse.mockRejectedValue(new Error('Webhook error'));

    const request = new NextRequest('http://localhost:3000/api/chat', {
      method: 'POST',
      body: JSON.stringify({
        message: 'Hello',
        sessionId: 'test-session'
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const response = await POST(request);

    expect(response.status).toBe(500);
  });

  it('should handle webhook parser returning null', async () => {
    mockParseWebhookResponse.mockResolvedValue(null);

    const request = new NextRequest('http://localhost:3000/api/chat', {
      method: 'POST',
      body: JSON.stringify({
        message: 'Hello',
        sessionId: 'test-session'
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveProperty('content');
  });

  it('should handle empty response from webhook parser', async () => {
    const mockResponse: unknown = {
      blocks: []
    };

    mockParseWebhookResponse.mockResolvedValue(mockResponse);

    const request = new NextRequest('http://localhost:3000/api/chat', {
      method: 'POST',
      body: JSON.stringify({
        message: 'Hello',
        sessionId: 'test-session'
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveProperty('content');
  });

  it('should handle errors gracefully', async () => {
    const errorMessage = 'Test error';
    const mockError = new Error(errorMessage);
    
    // Mock the chat function to throw an error
    jest.spyOn(global, 'fetch').mockRejectedValueOnce(mockError);

    await POST(mockRequest);

    expect(mockJson).toHaveBeenCalledWith({
      error: 'Failed to process chat request',
      details: errorMessage
    });
  });
}); 