import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import MessageList from '@/app/chat/components/MessageList';
import type { Message } from '@/app/lib/types';

describe('MessageList Component', () => {
  const mockMessages: Message[] = [
    {
      id: '1',
      role: 'user',
      content: 'Hello',
      timestamp: new Date('2024-01-01T12:00:00Z'),
      status: 'sent'
    },
    {
      id: '2',
      role: 'assistant',
      content: {
        blocks: [
          { type: 'text', content: 'Hi there!' }
        ]
      },
      timestamp: new Date('2024-01-01T12:00:01Z'),
      status: 'sent'
    }
  ];

  const mockOnRetry = vi.fn();
  const mockOnQuestionClick = vi.fn();
  const scrollIntoViewMock = vi.fn();

  beforeEach(() => {
    mockOnRetry.mockClear();
    mockOnQuestionClick.mockClear();
    scrollIntoViewMock.mockClear();
    window.HTMLElement.prototype.scrollIntoView = scrollIntoViewMock;
  });

  it('renders list of messages', () => {
    render(
      <MessageList 
        messages={mockMessages}
        onRetry={mockOnRetry}
        onQuestionClick={mockOnQuestionClick}
      />
    );
    
    expect(screen.getByText('Hello')).toBeInTheDocument();
    expect(screen.getByText('Hi there!')).toBeInTheDocument();
  });

  it('renders empty state when no messages', () => {
    render(
      <MessageList 
        messages={[]}
        onRetry={mockOnRetry}
        onQuestionClick={mockOnQuestionClick}
      />
    );
    
    // The empty state shows a welcome message
    expect(screen.getByText('Welcome to RevUpChat')).toBeInTheDocument();
    expect(screen.getByText(/Ask me anything about vehicles/)).toBeInTheDocument();
  });

  it('shows thinking indicator when loading', () => {
    render(
      <MessageList 
        messages={mockMessages}
        isLoading={true}
        onRetry={mockOnRetry}
        onQuestionClick={mockOnQuestionClick}
      />
    );
    
    expect(screen.getByText('Analyzing your request...')).toBeInTheDocument();
  });

  it('handles retry callback', () => {
    const errorMessage: Message = {
      id: '3',
      role: 'user',
      content: 'Failed message',
      timestamp: new Date(),
      status: 'error'
    };
    
    render(
      <MessageList 
        messages={[...mockMessages, errorMessage]}
        onRetry={mockOnRetry}
        onQuestionClick={mockOnQuestionClick}
      />
    );
    
    const retryButton = screen.getByRole('button', { name: /retry/i });
    fireEvent.click(retryButton);
    
    expect(mockOnRetry).toHaveBeenCalledWith('3');
  });

  it('handles question click callback', () => {
    const messageWithQuestion: Message = {
      id: '4',
      role: 'assistant',
      content: {
        blocks: [
          {
            type: 'questions',
            content: ['Question 1', 'Question 2']
          }
        ]
      },
      timestamp: new Date(),
      status: 'sent'
    };
    
    render(
      <MessageList 
        messages={[...mockMessages, messageWithQuestion]}
        onRetry={mockOnRetry}
        onQuestionClick={mockOnQuestionClick}
      />
    );
    
    const questionButton = screen.getByText('Question 1');
    fireEvent.click(questionButton);
    
    expect(mockOnQuestionClick).toHaveBeenCalledWith('Question 1');
  });

  it('applies custom className', () => {
    const customClass = 'custom-test-class';
    const { container } = render(
      <MessageList 
        messages={mockMessages}
        onRetry={mockOnRetry}
        onQuestionClick={mockOnQuestionClick}
        className={customClass}
      />
    );
    
    expect(container.firstChild).toHaveClass(customClass);
  });

  it('scrolls to bottom when new messages are added', async () => {
    const { rerender } = render(
      <MessageList 
        messages={mockMessages}
        onRetry={mockOnRetry}
        onQuestionClick={mockOnQuestionClick}
      />
    );
    
    const newMessage: Message = {
      id: '5',
      role: 'user',
      content: 'New message',
      timestamp: new Date(),
      status: 'sent'
    };
    
    // Force a re-render with new message
    rerender(
      <MessageList 
        messages={[...mockMessages, newMessage]}
        onRetry={mockOnRetry}
        onQuestionClick={mockOnQuestionClick}
      />
    );
    
    // Wait for the effect to run
    await waitFor(() => {
      expect(scrollIntoViewMock).toHaveBeenCalledWith({ behavior: 'smooth' });
    });
  });
}); 