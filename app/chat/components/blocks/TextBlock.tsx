import { cn } from '@/lib/utils';

interface TextBlockProps {
  content: string;
  isUser?: boolean;
  className?: string;
}

export default function TextBlock({ 
  content, 
  isUser = false, 
  className = '' 
}: TextBlockProps) {
  // Format text with line breaks and basic markdown-style formatting
  const formatText = (text: string) => {
    return text
      .replace(/\n/g, '<br>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>');
  };

  return (
    <div className={cn(
      "text-sm leading-relaxed",
      isUser 
        ? "text-white" 
        : "text-gray-900 dark:text-gray-100",
      className
    )}>
      <div 
        dangerouslySetInnerHTML={{ 
          __html: formatText(content) 
        }} 
      />
    </div>
  );
}