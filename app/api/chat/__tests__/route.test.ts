import { describe, it, expect, beforeEach, vi } from 'vitest';
import { POST } from '../route';
import { NextResponse } from 'next/server';

// Mock the environment variable
process.env.WEBHOOK_URL = 'https://test-webhook-url.com';

describe('Chat API Route', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should handle valid message request', async () => {
    const mockResponse = {
      output: '```json\n{\n  "type": "text",\n  "message": "Message received"\n}\n```'
    };

    vi.mocked(global.fetch).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse)
    } as any);

    const request = new Request('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: 'Hello',
        sessionId: 'test-session'
      })
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual(mockResponse);
    expect(global.fetch).toHaveBeenCalledWith(
      'https://test-webhook-url.com',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
          'User-Agent': 'RevUpChat/1.0'
        }),
        body: JSON.stringify({
          sessionId: 'test-session',
          action: 'sendMessage',
          chatInput: 'Hello'
        })
      })
    );
  });

  it('should handle missing message', async () => {
    const request = new Request('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        sessionId: 'test-session'
      })
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Message is required and must be a string');
  });

  it('should handle missing sessionId', async () => {
    const request = new Request('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: 'Hello'
      })
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Session ID is required and must be a string');
  });

  it('should handle webhook timeout', async () => {
    vi.mocked(global.fetch).mockImplementation(() => {
      return new Promise((_, reject) => {
        setTimeout(() => {
          reject(new Error('AbortError'));
        }, 100);
      });
    });

    const request = new Request('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: 'Hello',
        sessionId: 'test-session'
      })
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(504);
    expect(data.error).toBe('Request timeout - the AI is taking longer than usual. Please try again.');
  });

  it('should handle webhook error responses', async () => {
    vi.mocked(global.fetch).mockResolvedValue({
      ok: false,
      status: 429,
      statusText: 'Too Many Requests'
    } as any);

    const request = new Request('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: 'Hello',
        sessionId: 'test-session'
      })
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(429);
    expect(data.error).toBe('Too many requests. Please wait a moment before trying again.');
  });

  it('should handle webhook gateway errors', async () => {
    vi.mocked(global.fetch).mockResolvedValue({
      ok: false,
      status: 502,
      statusText: 'Bad Gateway'
    } as any);

    const request = new Request('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: 'Hello',
        sessionId: 'test-session'
      })
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(502);
    expect(data.error).toBe('The AI service is temporarily unavailable. Please try again in a moment.');
  });
}); 