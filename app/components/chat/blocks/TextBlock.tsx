import { cn } from '@/app/lib/utils';

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
  return (
    <div className={cn(
      "prose prose-sm max-w-none",
      isUser 
        ? "prose-invert text-white" 
        : "prose-gray dark:prose-invert text-gray-800 dark:text-gray-100",
      className
    )}>
      <p
        data-testid="text-block-paragraph"
        className={cn(
          "whitespace-pre-wrap leading-relaxed",
          isUser ? "text-white" : "text-gray-800 dark:text-gray-100"
        )}
      >
        {content}
      </p>
    </div>
  );
}