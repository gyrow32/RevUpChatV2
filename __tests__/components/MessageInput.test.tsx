import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import MessageInput from '@/app/chat/components/MessageInput';

describe('MessageInput Component', () => {
  const mockOnSendMessage = vi.fn();

  beforeEach(() => {
    mockOnSendMessage.mockClear();
  });

  it('renders input field with placeholder', () => {
    const placeholder = 'Type your message...';
    render(
      <MessageInput 
        onSendMessage={mockOnSendMessage} 
        placeholder={placeholder}
      />
    );
    
    expect(screen.getByPlaceholderText(placeholder)).toBeInTheDocument();
  });

  it('sends message when Enter is pressed', () => {
    render(<MessageInput onSendMessage={mockOnSendMessage} />);
    
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'Test message' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    
    expect(mockOnSendMessage).toHaveBeenCalledWith('Test message');
  });

  it('does not send message when Shift+Enter is pressed', () => {
    render(<MessageInput onSendMessage={mockOnSendMessage} />);
    
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'Test message' } });
    fireEvent.keyDown(input, { key: 'Enter', shiftKey: true });
    
    expect(mockOnSendMessage).not.toHaveBeenCalled();
  });

  it('sends message when send button is clicked', () => {
    render(<MessageInput onSendMessage={mockOnSendMessage} />);
    
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'Test message' } });
    
    const sendButton = screen.getByRole('button');
    fireEvent.click(sendButton);
    
    expect(mockOnSendMessage).toHaveBeenCalledWith('Test message');
  });

  it('clears input after sending message', () => {
    render(<MessageInput onSendMessage={mockOnSendMessage} />);
    
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'Test message' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    
    expect(input).toHaveValue('');
  });

  it('does not send empty messages', () => {
    render(<MessageInput onSendMessage={mockOnSendMessage} />);
    
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: '   ' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    
    expect(mockOnSendMessage).not.toHaveBeenCalled();
  });

  it('shows character count when near limit', () => {
    render(<MessageInput onSendMessage={mockOnSendMessage} />);
    
    const input = screen.getByRole('textbox');
    const longMessage = 'a'.repeat(801); // 80% of 1000 character limit
    fireEvent.change(input, { target: { value: longMessage } });
    
    expect(screen.getByText('801/1000')).toBeInTheDocument();
  });

  it('disables input when loading', () => {
    render(<MessageInput onSendMessage={mockOnSendMessage} isLoading={true} />);
    
    const input = screen.getByRole('textbox');
    expect(input).toBeDisabled();
    
    const sendButton = screen.getByRole('button');
    expect(sendButton).toBeDisabled();
  });

  it('disables input when disabled prop is true', () => {
    render(<MessageInput onSendMessage={mockOnSendMessage} disabled={true} />);
    
    const input = screen.getByRole('textbox');
    expect(input).toBeDisabled();
    
    const sendButton = screen.getByRole('button');
    expect(sendButton).toBeDisabled();
  });

  it('applies custom className', () => {
    const customClass = 'custom-test-class';
    const { container } = render(
      <MessageInput 
        onSendMessage={mockOnSendMessage} 
        className={customClass}
      />
    );
    
    expect(container.firstChild).toHaveClass(customClass);
  });
}); 