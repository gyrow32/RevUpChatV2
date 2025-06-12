import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock fetch globally
global.fetch = vi.fn();

// Mock environment variables
process.env.WEBHOOK_URL = 'https://test-webhook-url.com';

// Mock scrollIntoView for MessageList tests
Element.prototype.scrollIntoView = vi.fn();

// Reset all mocks before each test
beforeEach(() => {
  vi.clearAllMocks();
}); 