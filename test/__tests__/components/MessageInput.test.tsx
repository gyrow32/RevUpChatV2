import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import MessageInput from '@/app/chat/components/MessageInput';
import { parseWebhookResponse } from '@/app/lib/webhook/parser';

describe('MessageInput Component', () => {
  const mockOnSend = vi.fn();

  beforeEach(() => {
    mockOnSend.mockClear();
  });

  it('renders input field with placeholder', () => {
    const placeholder = 'Type your message...';
    render(
      <MessageInput 
        onSend={mockOnSend} 
        placeholder={placeholder}
      />
    );
    
    expect(screen.getByPlaceholderText(placeholder)).toBeInTheDocument();
  });

  it('sends message when Enter is pressed', () => {
    render(<MessageInput onSend={mockOnSend} />);
    
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'Test message' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    
    expect(mockOnSend).toHaveBeenCalledWith('Test message');
  });

  it('does not send message when Shift+Enter is pressed', () => {
    render(<MessageInput onSend={mockOnSend} />);
    
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'Test message' } });
    fireEvent.keyDown(input, { key: 'Enter', shiftKey: true });
    
    expect(mockOnSend).not.toHaveBeenCalled();
  });

  it('sends message when send button is clicked', () => {
    render(<MessageInput onSend={mockOnSend} />);
    
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'Test message' } });
    
    const sendButton = screen.getByRole('button');
    fireEvent.click(sendButton);
    
    expect(mockOnSend).toHaveBeenCalledWith('Test message');
  });

  it('clears input after sending message', () => {
    render(<MessageInput onSend={mockOnSend} />);
    
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'Test message' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    
    expect(input).toHaveValue('');
  });

  it('does not send empty messages', () => {
    render(<MessageInput onSend={mockOnSend} />);
    
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: '   ' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    
    expect(mockOnSend).not.toHaveBeenCalled();
  });

  it('shows character count when near limit', () => {
    render(<MessageInput onSend={mockOnSend} />);
    
    const input = screen.getByRole('textbox');
    const longMessage = 'a'.repeat(801); // 80% of 1000 character limit
    fireEvent.change(input, { target: { value: longMessage } });
    
    expect(screen.getByText('801/1000')).toBeInTheDocument();
  });

  it('disables input when loading', () => {
    render(<MessageInput onSend={mockOnSend} isLoading={true} />);
    
    const input = screen.getByRole('textbox');
    expect(input).toBeDisabled();
    
    const sendButton = screen.getByRole('button');
    expect(sendButton).toBeDisabled();
  });

  it('disables input when disabled prop is true', () => {
    render(<MessageInput onSend={mockOnSend} disabled={true} />);
    
    const input = screen.getByRole('textbox');
    expect(input).toBeDisabled();
    
    const sendButton = screen.getByRole('button');
    expect(sendButton).toBeDisabled();
  });

  it('applies custom className', () => {
    const customClass = 'custom-test-class';
    const { container } = render(
      <MessageInput 
        onSend={mockOnSend} 
        className={customClass}
      />
    );
    
    expect(container.firstChild).toHaveClass(customClass);
  });

  it('should handle questions type response', () => {
    const mockResponse = {
      output: '```json\n{"type": "questions", "questions": ["What is your budget?", "What type of vehicle?"]}\n```'
    };

    const result = parseWebhookResponse(mockResponse);
    expect(result).toEqual({
      blocks: [
        {
          type: 'text',
          content: '```json\n{"type": "questions", "questions": ["What is your budget?", "What type of vehicle?"]}\n```'
        }
      ]
    });
  });
}); 