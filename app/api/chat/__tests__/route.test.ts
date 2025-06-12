import { NextRequest } from 'next/server';
import { POST } from '../route';

// Mock the webhook parser
const mockParseWebhookResponse = jest.fn();
jest.mock('@/lib/webhook/parser', () => ({
  parseWebhookResponse: mockParseWebhookResponse
}));

describe('/api/chat', () => {
  beforeEach(() => {
    jest.clearAllMocks();
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
}); 