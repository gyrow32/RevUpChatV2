# Project Structure

```
revup-chat/
├── app/
│   ├── chat/
│   │   ├── components/
│   │   │   ├── blocks/           # Content block components
│   │   │   │   ├── TextBlock.tsx
│   │   │   │   ├── VehicleBlock.tsx
│   │   │   │   ├── VehicleCard.tsx
│   │   │   │   ├── TableBlock.tsx
│   │   │   │   ├── SurveyBlock.tsx
│   │   │   │   └── QuestionBlock.tsx
│   │   │   ├── ChatWindow.tsx
│   │   │   ├── Message.tsx
│   │   │   ├── MessageList.tsx
│   │   │   └── MessageInput.tsx
│   │   └── page.tsx              # Chat page
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Home page
│   └── globals.css               # Global styles
├── components/
│   └── providers/
│       └── ChatProvider.tsx      # Chat state management
├── hooks/
│   └── useChat.ts                # Chat functionality hook
├── lib/
│   └── utils/                    # Utility functions
│       ├── formatters.ts
│       ├── index.ts
│       └── session.ts
├── public/                       # Static assets
├── types/
│   └── index.ts                  # TypeScript type definitions
├── package.json                  # Dependencies
├── tsconfig.json                 # TypeScript config
├── tailwind.config.ts           # Tailwind config
├── next.config.js               # Next.js config
└── .eslintrc.json               # ESLint config
``` 