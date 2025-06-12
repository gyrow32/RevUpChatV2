import React, { useState } from 'react';

interface MessageInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
  isLoading?: boolean;
  className?: string;
}

export default function MessageInput({ onSend, disabled = false, placeholder = 'Type your message...', isLoading = false, className = '' }: MessageInputProps) {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSend(message);
      setMessage(''); // Clear input after sending
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} data-testid="message-input-form" className={className}>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled || isLoading}
        placeholder={placeholder}
        data-testid="message-input-field"
      />
      <button type="submit" disabled={disabled || isLoading || !message.trim()} data-testid="message-send-button">
        Send
      </button>
      {message.length > 800 && (
        <div data-testid="character-count">
          {message.length}/1000
        </div>
      )}
    </form>
  );
} 