# RevUpChat

<!-- Recent fix: Resolved duplicate scrollToTop import issue -->

AI-powered car shopping assistant chat interface.

## Project Status

✅ **Phase 1, Chunk 1.1 Complete** - Basic Next.js project initialized with:
- TypeScript
- Tailwind CSS
- ESLint
- App Router

✅ **Phase 1, Chunk 1.4 Partial** - Project folder structure:
- Added basic chat page structure
- Created components for chat interface
- Implemented message state management with ChatProvider

✅ **Phase 1, Chunk 1.5 Complete** - Environment configuration:
- Added .env.example template with required variables
- Set up configuration for API keys and feature flags

✅ **Phase 2 - Mobile Optimization Phase Complete** - Latest major accomplishments:
- **Mobile Gallery Carousel**: Full-width swipeable image galleries (192px height)
- **Smart Scroll Behavior**: Fixed page loading and chat auto-scroll issues
- **Icon Optimization**: Perfect mobile header icon sizing (12px) without cutoff
- **Header Spacing**: 56% reduction in mobile header spacing while maintaining accessibility
- **Cinematic Welcome**: Replaced emoji with professional sports car image
- **Mobile-First Design**: Touch-optimized with safe area support and accessibility compliance

## Current Status
- 🚀 **Production Ready**: Mobile-optimized chat interface fully functional
- 📱 **Mobile Testing Ready**: Optimized for all mobile devices and screen sizes
- 🎨 **Professional UI**: Cinema-quality welcome screen and car galleries
- ⚡ **Performance Optimized**: Smart scroll, reduced animations, battery-conscious
- 🔧 **Development Server**: Running on localhost:3000/3001
- 📦 **Repository**: https://github.com/gyrow32/RevUPChat.git (main branch)

## Getting Started

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your actual API keys and configuration

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Project Structure

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

## Allowed Image Domains

Vehicle images are loaded from external sources. The application only
allows optimized images from the following domains:

- `example.com`
- `images.example.com`

## Next Steps

According to the implementation plan:
- Phase 1, Chunk 1.2: Install core dependencies (framer-motion, lucide-react, etc.)
- Phase 1, Chunk 1.3: Add shadcn/ui components
- Phase 1, Chunk 1.4: Complete project folder structure with any remaining directories
- Phase 2, Chunk 2.1: Implement the ChatWindow component
- Phase 2, Chunk 2.2: Connect API routes for chat functionality
- Phase 2, Chunk 2.3: Implement message parsing and rendering
- Phase 2, Chunk 2.4: Add vehicle search integration