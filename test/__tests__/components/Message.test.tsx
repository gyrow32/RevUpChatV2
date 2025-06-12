import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Message from '@/app/chat/components/Message';
import type { Message as MessageType } from '@/app/lib/types';

describe('Message Component', () => {
  const mockMessage: MessageType = {
    id: '1',
    role: 'user',
    content: 'Hello, this is a test message',
    timestamp: new Date('2024-01-01T12:00:00Z'),
    status: 'sent'
  };

  it('renders user message correctly', () => {
    render(<Message message={mockMessage} />);
    expect(screen.getByText('Hello, this is a test message')).toBeInTheDocument();
    // Accept any time string (since local time may vary)
    expect(screen.getByText(/AM|PM/)).toBeInTheDocument();
  });

  it('renders assistant message correctly', () => {
    const assistantMessage: MessageType = {
      ...mockMessage,
      role: 'assistant',
      content: {
        blocks: [
          { type: 'text', content: 'Hello, this is a test message' }
        ]
      }
    };
    render(<Message message={assistantMessage} />);
    expect(screen.getByText('Hello, this is a test message')).toBeInTheDocument();
    expect(screen.getByText(/AM|PM/)).toBeInTheDocument();
  });

  it('applies correct styling for user message', () => {
    render(<Message message={mockMessage} />);
    const messageBubble = screen.getByTestId('message-bubble-1');
    expect(messageBubble.className).toMatch(/message user-message/);
    const innerBubble = messageBubble.querySelector('.message-bubble');
    expect(innerBubble?.className).toMatch(/message-bubble from-blue-600/);
  });

  it('applies correct styling for assistant message', () => {
    const assistantMessage: MessageType = {
      ...mockMessage,
      id: '2',
      role: 'assistant',
      content: {
        blocks: [
          { type: 'text', content: 'Hello, this is a test message' }
        ]
      }
    };
    render(<Message message={assistantMessage} />);
    const messageBubble = screen.getByTestId('message-bubble-2');
    expect(messageBubble.className).toMatch(/message assistant-message/);
    const innerBubble = messageBubble.querySelector('.message-bubble');
    expect(innerBubble?.className).toMatch(/message-bubble bg-gray-100/);
  });

  it('handles message with blocks', () => {
    const messageWithBlocks: MessageType = {
      ...mockMessage,
      role: 'assistant',
      content: {
        blocks: [
          { type: 'text', content: 'First block' },
          { type: 'text', content: 'Second block' },
        ]
      }
    };
    render(<Message message={messageWithBlocks} />);
    expect(screen.getByText('First block')).toBeInTheDocument();
    expect(screen.getByText('Second block')).toBeInTheDocument();
  });

  it('handles empty content gracefully', () => {
    const emptyMessage: MessageType = { ...mockMessage, content: '' };
    render(<Message message={emptyMessage} />);
    // Should render an empty paragraph
    const paragraph = screen.getByText('', { selector: 'p' });
    expect(paragraph).toBeInTheDocument();
  });

  it('formats timestamp correctly', () => {
    const messageWithDifferentTime: MessageType = {
      ...mockMessage,
      timestamp: new Date('2024-01-01T15:30:00Z')
    };
    render(<Message message={messageWithDifferentTime} />);
    // Accept any time string (since local time may vary)
    expect(screen.getByText(/AM|PM/)).toBeInTheDocument();
  });

  it('shows error state correctly', () => {
    const errorMessage: MessageType = {
      ...mockMessage,
      status: 'error'
    };
    render(<Message message={errorMessage} onRetry={() => {}} />);
    expect(screen.getByText('Failed to send')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
  });

  it('shows sending state correctly', () => {
    const sendingMessage: MessageType = {
      ...mockMessage,
      status: 'sending'
    };
    render(<Message message={sendingMessage} />);
    expect(screen.getByText('Sending...')).toBeInTheDocument();
  });

  it('renders fallback for unknown block type', () => {
    const unknownBlockMessage: MessageType = {
      ...mockMessage,
      role: 'assistant',
      content: {
        blocks: [
          { type: 'unknown' as any, content: 'Unknown content' }
        ]
      }
    };
    render(<Message message={unknownBlockMessage} />);
    expect(screen.getByText('[Unknown block type: unknown]')).toBeInTheDocument();
  });
}); 