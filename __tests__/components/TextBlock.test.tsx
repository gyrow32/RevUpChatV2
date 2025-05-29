import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import TextBlock from '@/app/chat/components/blocks/TextBlock';

describe('TextBlock Component', () => {
  it('renders text content correctly', () => {
    const testContent = 'Hello, this is a test message!';
    render(<TextBlock content={testContent} />);
    
    expect(screen.getByText(testContent)).toBeInTheDocument();
  });

  it('applies user styling when isUser is true', () => {
    const testContent = 'User message';
    render(<TextBlock content={testContent} isUser={true} />);
    
    const paragraph = screen.getByText(testContent);
    expect(paragraph).toHaveClass('text-white');
  });

  it('applies assistant styling when isUser is false', () => {
    const testContent = 'Assistant message';
    render(<TextBlock content={testContent} isUser={false} />);
    
    const paragraph = screen.getByText(testContent);
    expect(paragraph).toHaveClass('text-gray-100');
  });

  it('applies custom className', () => {
    const testContent = 'Test message';
    const customClass = 'my-custom-class';
    const { container } = render(
      <TextBlock content={testContent} className={customClass} />
    );
    
    expect(container.firstChild).toHaveClass(customClass);
  });

  it('handles empty content', () => {
    render(<TextBlock content="" />);
    
    // Should render paragraph element even with empty content
    const paragraph = screen.getByRole('paragraph');
    expect(paragraph).toBeInTheDocument();
    expect(paragraph).toHaveTextContent('');
  });

  it('preserves whitespace and line breaks', () => {
    const multilineContent = 'Line 1\nLine 2\n\nLine 4';
    render(<TextBlock content={multilineContent} />);
    
    // Test that the paragraph has the whitespace preservation class
    const paragraph = screen.getByRole('paragraph');
    expect(paragraph).toHaveClass('whitespace-pre-wrap');
    
    // Test that the content is actually preserved in the paragraph
    expect(paragraph.textContent).toBe(multilineContent);
  });
}); 