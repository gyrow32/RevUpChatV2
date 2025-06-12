// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Mock fetch globally
global.fetch = jest.fn();

// Mock environment variables
process.env.WEBHOOK_URL = 'https://test-webhook-url.com';

// Reset all mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
}); 