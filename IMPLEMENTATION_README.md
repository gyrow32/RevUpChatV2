# RevUpChat - AI Car Shopping Assistant
## 🚗 Modern Chat Interface for RevUp AI Agent

---

## 📋 Project Overview

**RevUpChat** is a sophisticated, modern chat application that interfaces with the RevUp AI car shopping assistant. Building on your existing HTML prototype and detailed documentation, we're creating a production-ready Next.js application with a sleek, professional UI.

### 🎯 Current State
- ✅ **Next.js 14 project** already initialized with TypeScript & Tailwind CSS
- ✅ **HTML prototype** working with sophisticated UI (reference in n8n Documentation folder)
- ✅ **Webhook integration** tested and documented
- ✅ **Response formats** fully documented (gallery, table, text, mixed content)
- ✅ **Live endpoint** ready: webhook tested working

### 🎯 Target Features  
- 🔲 Modern, sleek professional chat interface
- 🔲 Dark/light mode theming
- 🔲 Block-based message rendering (gallery, table, text, survey, questions)
- 🔲 Interactive vehicle cards with financial details
- 🔲 Session management and chat persistence
- 🔲 Mobile-first responsive design
- 🔲 Real-time typing indicators and smooth animations

---

## 🏗 Architecture Overview

### **Webhook Integration** (Already Tested)
- **Endpoint**: `https://revupinventory.app.n8n.cloud/webhook/e1f37ad8-7461-49b3-8a6c-479ec4013958/chat`
- **Request Format**: `{ sessionId: string, action: 'sendMessage', chatInput: string }`
- **Response**: JSON with `output` field containing stringified blocks or direct content

### **Response Types** (From Your Documentation)
1. **Gallery**: Grid of vehicle cards (≤12 vehicles)
2. **Table**: Detailed comparison table
3. **Text**: Simple confirmations/errors
4. **Mixed**: Markdown with embedded JSON blocks
5. **Direct Text**: Conversational responses with emojis

### **Tech Stack** (Current Setup)
- **Framework**: Next.js 14 with App Router ✅
- **Language**: TypeScript (strict mode) ✅
- **Styling**: Tailwind CSS ✅
- **Additional**: shadcn/ui, Framer Motion, Lucide React (to be added)
- **State**: React Context + useReducer (to be implemented)

### **Project Structure** (Current)
```
C:\Users\mike\Desktop\RevUpChat\
├── app\                     ✅ Next.js 14 App Router
├── node_modules\            ✅ Dependencies installed
├── public\                  ✅ Static assets
├── package.json             ✅ Next.js 14, React 18, TypeScript
├── tailwind.config.ts       ✅ Tailwind CSS configured
└── tsconfig.json            ✅ TypeScript configured
```

---

## 🚀 Claude Code Implementation Instructions

### **⚠️ CRITICAL RULES**
1. **ONE STEP AT A TIME** - Implement only the current step, wait for verification
2. **NO AUTO-COMMITS** - Always ask permission before any git operations
3. **VERIFICATION REQUIRED** - Each step must be tested and approved
4. **ERROR RECOVERY** - Fix any issues before proceeding to next step
5. **PLAN ADHERENCE** - Follow this exact structure and implementation

---

## 📦 Implementation Roadmap

### **Phase 1: Dependencies & Setup** ⏳

#### ✅ **Step 1.1: Verify Current Setup**
**Goal**: Confirm existing Next.js project is ready for development

**Actions**:
```bash
# Navigate to project directory
cd "C:\Users\mike\Desktop\RevUpChat"

# Verify project status
npm --version
node --version
npm run dev
```

**Verification Checklist**:
- [ ] Can navigate to project directory
- [ ] npm run dev starts successfully 
- [ ] Localhost:3000 shows current RevUpChat page
- [ ] No TypeScript errors in terminal
- [ ] Tailwind CSS is working

**Claude Instructions**: "Verify the existing setup is working before adding new dependencies."

---

#### ✅ **Step 1.2: Install Required Dependencies**
**Goal**: Add all packages needed for the complete chat application

**Actions**:
```bash
# Core UI and animation packages
npm install framer-motion lucide-react clsx tailwind-merge uuid
npm install @types/uuid

# Radix UI components (for shadcn/ui)
npm install @radix-ui/react-scroll-area @radix-ui/react-radio-group
npm install @radix-ui/react-label @radix-ui/react-slot
```

**Verification Checklist**:
- [ ] All packages installed without errors
- [ ] No version conflicts in package.json
- [ ] npm run dev still works
- [ ] No new TypeScript errors

**Claude Instructions**: "Install packages one group at a time. Stop if any installation fails."

---

#### ✅ **Step 1.3: Setup shadcn/ui Components**
**Goal**: Initialize shadcn/ui and install required UI components

**Actions**:
```bash
# Initialize shadcn/ui (choose defaults)
npx shadcn-ui@latest init

# Install UI components we need
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card  
npx shadcn-ui@latest add badge
npx shadcn-ui@latest add scroll-area
npx shadcn-ui@latest add radio-group
npx shadcn-ui@latest add label
npx shadcn-ui@latest add input
npx shadcn-ui@latest add textarea
```

**Verification Checklist**:
- [ ] shadcn/ui initialized successfully
- [ ] components/ui folder created
- [ ] All UI components added without errors
- [ ] Can import Button from '@/components/ui/button'
- [ ] No new TypeScript errors

**Claude Instructions**: "Initialize shadcn/ui with default settings. Install components one by one."

---

#### ✅ **Step 1.4: Environment Configuration**
**Goal**: Setup environment variables and project configuration

**Actions**: Create `.env.local`:
```env
# Webhook Configuration (from tested HTML prototype)
WEBHOOK_URL=https://revupinventory.app.n8n.cloud/webhook/e1f37ad8-7461-49b3-8a6c-479ec4013958/chat
NEXT_PUBLIC_APP_NAME=RevUpChat
NEXT_PUBLIC_API_TIMEOUT=30000

# Development
NODE_ENV=development
NEXT_PUBLIC_THEME_DEFAULT=light
```

**Update `.gitignore`** to ensure `.env.local` is ignored:
```
# Environment variables
.env.local
.env.development.local
.env.test.local
.env.production.local
```

**Verification Checklist**:
- [ ] .env.local created with correct values
- [ ] .env.local added to .gitignore (or verify it's already there)
- [ ] Environment variables accessible in app
- [ ] No sensitive data exposed to client

**Claude Instructions**: "Create environment configuration. Verify .env.local is in .gitignore."

---

#### ✅ **Step 1.5: Project Structure Creation**
**Goal**: Create the complete folder structure for the application

**Actions**: Create the following directories and files in the existing project:
```
RevUpChat/
├── app/
│   ├── chat/
│   │   ├── page.tsx                 # Main chat page
│   │   └── components/              # Chat-specific components
│   │       ├── ChatWindow.tsx
│   │       ├── MessageList.tsx
│   │       ├── Message.tsx
│   │       ├── MessageInput.tsx
│   │       └── blocks/              # Block rendering components
│   │           ├── TextBlock.tsx
│   │           ├── VehicleBlock.tsx
│   │           ├── VehicleCard.tsx
│   │           ├── SurveyBlock.tsx
│   │           └── QuestionBlock.tsx
│   ├── api/
│   │   └── chat/
│   │       └── route.ts             # API route for webhook proxy
│   └── globals.css                  # ✅ Already exists
├── components/
│   ├── ui/                          # ✅ shadcn/ui components (after Step 1.3)
│   └── providers/
│       ├── ChatProvider.tsx         # Chat state management
│       └── ThemeProvider.tsx        # Dark/light mode
├── lib/
│   ├── webhook/
│   │   ├── client.ts                # Webhook API client
│   │   ├── parser.ts                # Response parser
│   │   └── types.ts                 # TypeScript definitions
│   └── utils/
│       ├── formatters.ts            # Price, mileage formatters
│       ├── session.ts               # Session ID management
│       └── storage.ts               # LocalStorage helpers
├── hooks/
│   ├── useChat.ts                   # Main chat logic
│   ├── useWebhook.ts                # Webhook integration
│   └── useAutoScroll.ts             # Auto-scroll behavior
└── types/
    └── index.ts                     # Global type definitions
```

**Verification Checklist**:
- [ ] All folders created
- [ ] Structure matches exactly (no extra/missing folders)
- [ ] Can navigate to each directory
- [ ] Git tracks new directories

**Claude Instructions**: "Create the complete folder structure. Use placeholder .gitkeep files in empty folders if needed."

---

### **Phase 2: Type System & Webhook Integration** ⏳

#### ✅ **Step 2.1: TypeScript Type Definitions**
**Goal**: Define all TypeScript interfaces based on your working HTML prototype

**Actions**: Create `/types/index.ts`:
```typescript
// Based on tested webhook response formats from your documentation

// Webhook request/response types
export interface WebhookRequest {
  sessionId: string;
  action: 'sendMessage';
  chatInput: string;
}

export interface WebhookResponse {
  output: string; // Stringified JSON or direct text
}

// Vehicle data structure (from your HTML prototype testing)
export interface VehicleData {
  id: string;
  year: number;
  make: string;
  model: string;
  trim?: string;
  price: number;
  image?: string;
  stock?: string;
  vin?: string;
  dealer?: string;
  mileage?: number;
  odometer?: string;
  bodyStyle?: string;
  fuel?: string;
  drivetrain?: string;
  unitCost?: string;
  jdPowerClean?: string;
  "Image URLs"?: string[];
  "Vehicle Link"?: string;
  // Financial fields (from your docs)
  payment?: number;
  downPayment?: number;
  loanTermMonths?: number;
  ltv?: number;
  interestRate?: number;
  taxRate?: number;
}

// Block type definitions (from your tested responses)
export interface TextBlock {
  type: 'text';
  content: string;
}

export interface GalleryBlock {
  type: 'gallery';
  vehicles: VehicleData[];
}

export interface TableBlock {
  type: 'table';
  columns: string[];
  rows: (string | number)[][];
}

export interface HybridBlock {
  type: 'hybrid';
  content: VehicleData[];
}

export interface SurveyBlock {
  type: 'survey';
  content: string[];
}

export interface QuestionsBlock {
  type: 'questions';
  content: string[];
}

export type Block = TextBlock | GalleryBlock | TableBlock | HybridBlock | SurveyBlock | QuestionsBlock;

export interface ParsedResponse {
  blocks: Block[];
}

// Chat message types
export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string | ParsedResponse;
  timestamp: Date;
  status: 'sending' | 'sent' | 'error';
}

// Chat state
export interface ChatState {
  messages: Message[];
  sessionId: string;
  isLoading: boolean;
  error: string | null;
}
```

**Verification Checklist**:
- [ ] All types defined correctly
- [ ] No TypeScript errors
- [ ] Types match webhook response structure from your docs
- [ ] Exports working correctly
- [ ] Can import types in other files

**Claude Instructions**: "Define the complete type system based on the documented webhook responses. Test imports work."

---

#### ✅ **Step 2.2: Webhook Parser Implementation**
**Goal**: Create robust parsing logic for webhook responses (based on your HTML prototype)

**Actions**: Create `/lib/webhook/parser.ts`:
```typescript
import type { ParsedResponse, VehicleData } from '@/types';

export function parseWebhookResponse(response: { output: string }): ParsedResponse {
  try {
    console.log('Raw webhook response:', response.output);
    
    // Handle mixed content (markdown with embedded JSON) - from your HTML prototype
    const jsonMatch = response.output.match(/```json\s*({[\s\S]*?})\s*```/);
    if (jsonMatch && jsonMatch[1]) {
      try {
        const jsonPart = JSON.parse(jsonMatch[1]);
        
        // Convert to blocks format
        if (jsonPart.type === 'gallery' && Array.isArray(jsonPart.vehicles)) {
          // Process vehicles data (normalize from RevUP format)
          const normalizedVehicles = jsonPart.vehicles.map(normalizeVehicleData);
          
          const blocks = [{
            type: 'gallery' as const,
            vehicles: normalizedVehicles
          }];
          
          // Add text content if exists (outside JSON block)
          const textContent = response.output.replace(/```json\s*[\s\S]*?```/, '').trim();
          if (textContent) {
            blocks.push({
              type: 'text' as const,
              content: textContent
            });
          }
          
          return { blocks };
        }
      } catch (mixedError) {
        console.error('Error parsing mixed content:', mixedError);
        // Continue to standard parsing
      }
    }
    
    // Standard JSON parsing
    try {
      const parsed = JSON.parse(response.output);
      
      // Handle different response formats from your documentation
      if (parsed.type === 'gallery' && Array.isArray(parsed.vehicles)) {
        return {
          blocks: [{
            type: 'gallery',
            vehicles: parsed.vehicles.map(normalizeVehicleData)
          }]
        };
      }
      
      if (parsed.type === 'table' && Array.isArray(parsed.columns) && Array.isArray(parsed.rows)) {
        return {
          blocks: [{
            type: 'table',
            columns: parsed.columns,
            rows: parsed.rows
          }]
        };
      }
      
      if (parsed.type === 'text' && parsed.message) {
        return {
          blocks: [{
            type: 'text',
            content: parsed.message
          }]
        };
      }
      
      // Legacy blocks format
      if (parsed.blocks && Array.isArray(parsed.blocks)) {
        return { blocks: parsed.blocks };
      }
      
    } catch (jsonError) {
      // Handle direct text responses (common in your testing)
      return {
        blocks: [{
          type: 'text',
          content: response.output
        }]
      };
    }
    
    // Fallback for unknown format
    return {
      blocks: [{
        type: 'text',
        content: response.output
      }]
    };
    
  } catch (error) {
    console.error('Failed to parse webhook response:', error);
    throw new Error('Failed to parse AI response');
  }
}

// Normalize vehicle data from different formats (based on your RevUP docs)
function normalizeVehicleData(vehicle: any): VehicleData {
  return {
    id: vehicle.id || vehicle.vin || `vehicle-${Date.now()}`,
    year: parseInt(vehicle.year) || 0,
    make: vehicle.make || '',
    model: vehicle.model || '',
    trim: vehicle.trim || undefined,
    price: parseFloat(String(vehicle.price).replace(/[$,]/g, '')) || 0,
    image: vehicle.image || vehicle['Image URLs']?.[0] || undefined,
    stock: vehicle.stock?.replace(/^stock\s*#?\s*/i, '').trim() || undefined,
    vin: vehicle.vin || undefined,
    dealer: vehicle.dealer || undefined,
    mileage: vehicle.mileage ? parseFloat(String(vehicle.mileage).replace(/[,]/g, '')) : 
             vehicle.odometer ? parseFloat(String(vehicle.odometer).replace(/[,]/g, '')) : undefined,
    odometer: vehicle.odometer || undefined,
    bodyStyle: vehicle.bodyStyle || undefined,
    fuel: vehicle.fuel || vehicle.fuelType || undefined,
    drivetrain: vehicle.drivetrain || undefined,
    unitCost: vehicle.unitCost || undefined,
    jdPowerClean: vehicle.jdPowerClean || undefined,
    "Image URLs": vehicle["Image URLs"] || undefined,
    "Vehicle Link": vehicle["Vehicle Link"] || vehicle.vdp || undefined,
    // Financial data
    payment: vehicle.payment ? parseFloat(String(vehicle.payment).replace(/[$,]/g, '')) : undefined,
    downPayment: vehicle.downPayment ? parseFloat(String(vehicle.downPayment).replace(/[$,]/g, '')) : undefined,
    loanTermMonths: vehicle.loanTermMonths ? parseInt(vehicle.loanTermMonths) : undefined,
    ltv: vehicle.ltv ? parseFloat(vehicle.ltv) : undefined,
    interestRate: vehicle.interestRate ? parseFloat(vehicle.interestRate) : undefined,
    taxRate: vehicle.taxRate ? parseFloat(vehicle.taxRate) : undefined,
  };
}
```

**Verification Checklist**:
- [ ] Parser handles all response types from your docs
- [ ] Mixed content parsing works (JSON + markdown)
- [ ] Vehicle data normalization works
- [ ] Error handling is comprehensive
- [ ] Console logging for debugging

**Claude Instructions**: "Implement the parser based on the documented response formats. Test with console.log to verify parsing."

---

#### ✅ **Step 2.3: API Route Implementation**
**Goal**: Create Next.js API route for webhook proxy (using your tested endpoint)

**Actions**: Create `/app/api/chat/route.ts`:
```typescript
import { NextResponse } from 'next/server';
import type { WebhookRequest } from '@/types';

const WEBHOOK_URL = process.env.WEBHOOK_URL;

if (!WEBHOOK_URL) {
  throw new Error('WEBHOOK_URL environment variable is required');
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate request body
    if (!body.message || typeof body.message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required and must be a string' },
        { status: 400 }
      );
    }
    
    if (!body.sessionId || typeof body.sessionId !== 'string') {
      return NextResponse.json(
        { error: 'Session ID is required and must be a string' },
        { status: 400 }
      );
    }

    // Format request for webhook (exact format from your testing)
    const webhookPayload: WebhookRequest = {
      sessionId: body.sessionId,
      action: 'sendMessage',
      chatInput: body.message.trim()
    };

    console.log('Sending to webhook:', { 
      sessionId: body.sessionId, 
      messageLength: body.message.length,
      webhook: WEBHOOK_URL.substring(0, 50) + '...'
    });

    // Call webhook with timeout (based on your testing - responses take 3-6 seconds)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout

    try {
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'User-Agent': 'RevUpChat/1.0'
        },
        body: JSON.stringify(webhookPayload),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        console.error('Webhook error:', response.status, response.statusText);
        throw new Error(`Webhook returned ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Webhook response received:', { 
        hasOutput: !!data.output,
        outputLength: data.output?.length || 0
      });
      
      return NextResponse.json(data);
      
    } catch (fetchError: any) {
      clearTimeout(timeoutId);
      
      if (fetchError.name === 'AbortError') {
        console.error('Webhook timeout');
        return NextResponse.json(
          { error: 'Request timeout - the AI is taking longer than usual. Please try again.' },
          { status: 504 }
        );
      }
      
      console.error('Webhook fetch error:', fetchError);
      throw fetchError;
    }
    
  } catch (error) {
    console.error('Chat API error:', error);
    
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to process message',
        details: process.env.NODE_ENV === 'development' ? String(error) : undefined
      },
      { status: 500 }
    );
  }
}

// Handle preflight requests for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
```

**Verification Checklist**:
- [ ] API route responds to POST requests
- [ ] Proper request validation
- [ ] Timeout handling works (30s)
- [ ] Error responses are well-formatted
- [ ] Console logging for debugging
- [ ] Environment variable validation
- [ ] Test with curl: `curl -X POST http://localhost:3000/api/chat -H "Content-Type: application/json" -d '{"message":"test","sessionId":"test-123"}'`

**Claude Instructions**: "Implement the API route with comprehensive error handling. Test with curl before proceeding."

---

#### ✅ **Step 2.4: Webhook Client**
**Goal**: Create frontend client for API communication

**Actions**: Create `/lib/webhook/client.ts`:
```typescript
import type { ParsedResponse } from '@/types';
import { parseWebhookResponse } from './parser';

export interface ChatRequest {
  message: string;
  sessionId: string;
}

export interface ChatResponse {
  success: boolean;
  data?: ParsedResponse;
  error?: string;
}

export class WebhookClient {
  private baseUrl: string;
  
  constructor(baseUrl: string = '') {
    this.baseUrl = baseUrl;
  }
  
  async sendMessage(request: ChatRequest): Promise<ChatResponse> {
    try {
      console.log('Sending message:', { 
        messageLength: request.message.length, 
        sessionId: request.sessionId 
      });
      
      const response = await fetch(`${this.baseUrl}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: request.message,
          sessionId: request.sessionId,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        console.error('API error:', data);
        return {
          success: false,
          error: data.error || `HTTP ${response.status}: ${response.statusText}`,
        };
      }
      
      // Parse the webhook response
      const parsed = parseWebhookResponse(data);
      
      console.log('Parsed response:', { 
        blockCount: parsed.blocks.length,
        blockTypes: parsed.blocks.map(b => b.type)
      });
      
      return {
        success: true,
        data: parsed,
      };
      
    } catch (error) {
      console.error('Webhook client error:', error);
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error occurred',
      };
    }
  }
}

// Default client instance
export const webhookClient = new WebhookClient();
```

**Verification Checklist**:
- [ ] Client sends correct payload format
- [ ] Handles responses properly
- [ ] Error states captured and formatted
- [ ] TypeScript types are correct
- [ ] Console logging for debugging
- [ ] Can be imported and used

**Claude Instructions**: "Create the webhook client with proper error handling. Test the complete webhook flow."

---

### **Phase 3: Core UI Components** ⏳

#### ✅ **Step 3.1: Utility Functions**
**Goal**: Create utility functions for formatting and helpers

**Actions**: Create utility files:

**`/lib/utils/formatters.ts`**:
```typescript
// Based on your HTML prototype formatting logic

export function formatPrice(price: string | number): string {
  const num = typeof price === 'string' 
    ? parseFloat(price.replace(/[^0-9.-]+/g, ''))
    : price;
    
  if (isNaN(num)) return 'Price N/A';
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(num);
}

export function formatMileage(mileage: string | number): string {
  const num = typeof mileage === 'string' 
    ? parseInt(mileage.replace(/[^0-9]/g, ''))
    : mileage;
    
  if (isNaN(num)) return 'N/A';
  
  return `${num.toLocaleString()} miles`;
}

export function formatPayment(payment: string | number): string {
  const num = typeof payment === 'string' 
    ? parseFloat(payment.replace(/[^0-9.-]+/g, ''))
    : payment;
    
  if (isNaN(num)) return 'N/A';
  
  return `$${num.toLocaleString()}/mo`;
}

export function formatYear(year: string | number): number {
  return typeof year === 'string' ? parseInt(year) : year;
}

export function formatPercentage(value: string | number): string {
  const num = typeof value === 'string' 
    ? parseFloat(value)
    : value;
    
  if (isNaN(num)) return 'N/A';
  
  return `${num.toFixed(1)}%`;
}
```

**`/lib/utils/session.ts`**:
```typescript
import { v4 as uuidv4 } from 'uuid';

export function generateSessionId(): string {
  return uuidv4();
}

export function getStoredSessionId(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('revup_session_id');
}

export function storeSessionId(sessionId: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('revup_session_id', sessionId);
}

export function clearStoredSession(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('revup_session_id');
}
```

**Verification Checklist**:
- [ ] All utility functions work correctly
- [ ] Price formatting displays properly ($XX,XXX)
- [ ] Mileage formatting is user-friendly (XX,XXX miles)
- [ ] Session management functions work
- [ ] No runtime errors
- [ ] TypeScript types are correct

**Claude Instructions**: "Implement and test each utility function. Verify formatting with sample data."

---

#### ✅ **Step 3.2: TextBlock Component**
**Goal**: Create component for rendering text messages

**Actions**: Create `/app/chat/components/blocks/TextBlock.tsx`:
```typescript
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
```

**Verification Checklist**:
- [ ] Component renders text correctly
- [ ] User and assistant styling different
- [ ] Line breaks work properly
- [ ] Basic markdown formatting works
- [ ] Dark mode support
- [ ] No layout issues

**Claude Instructions**: "Create the TextBlock component and test it with sample text including line breaks."

---

#### ✅ **Step 3.3: VehicleCard Component** 
**Goal**: Create component for individual vehicle display (based on your HTML prototype)

**Actions**: Create `/app/chat/components/blocks/VehicleCard.tsx`:
```typescript
'use client';

import Image from 'next/image';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Car, Gauge, Fuel, Zap } from 'lucide-react';
import { formatPrice, formatMileage, formatPayment, formatPercentage } from '@/lib/utils/formatters';
import type { VehicleData } from '@/types';
import { cn } from '@/lib/utils';

interface VehicleCardProps {
  vehicle: VehicleData;
  className?: string;
}

export default function VehicleCard({ vehicle, className = '' }: VehicleCardProps) {
  const primaryImage = vehicle.image || vehicle["Image URLs"]?.[0];
  const hasImage = primaryImage && primaryImage.trim() !== '';
  
  const handleViewDetails = () => {
    const link = vehicle["Vehicle Link"];
    if (link) {
      window.open(link, '_blank', 'noopener,noreferrer');
    }
  };
  
  return (
    <Card className={cn(
      "overflow-hidden hover:shadow-lg transition-all duration-200 hover:scale-[1.02]",
      className
    )}>
      {/* Vehicle Image with Stock Badge */}
      {hasImage && (
        <div className="relative h-48 w-full bg-gray-100 dark:bg-gray-800">
          <Image
            src={primaryImage}
            alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
          {vehicle.stock && (
            <div className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 text-xs font-bold rounded">
              Stock #{vehicle.stock}
            </div>
          )}
        </div>
      )}
      
      <CardContent className="p-4">
        {/* Vehicle Title and Body Style */}
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100 line-clamp-1">
              {vehicle.year} {vehicle.make} {vehicle.model}
            </h3>
            {vehicle.trim && (
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1">
                {vehicle.trim}
              </p>
            )}
          </div>
          {vehicle.bodyStyle && (
            <Badge variant="secondary" className="ml-2 shrink-0">
              {vehicle.bodyStyle}
            </Badge>
          )}
        </div>
        
        {/* Price and Payment */}
        <div className="space-y-2 mb-3">
          <p className="font-bold text-xl text-blue-600 dark:text-blue-400">
            {formatPrice(vehicle.price)}
          </p>
          
          {/* Payment info if available */}
          {vehicle.payment && (
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <span>est. {formatPayment(vehicle.payment)}</span>
              {vehicle.downPayment !== undefined && (
                <>
                  <span>•</span>
                  <span>{vehicle.downPayment === 0 ? '$0 down' : formatPrice(vehicle.downPayment) + ' down'}</span>
                </>
              )}
            </div>
          )}
        </div>
        
        {/* Vehicle Specs */}
        <div className="space-y-2">
          {vehicle.mileage && (
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Gauge size={16} />
              <span>{formatMileage(vehicle.mileage)}</span>
            </div>
          )}
          
          {vehicle.fuel && (
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              {vehicle.fuel.toLowerCase().includes('electric') ? 
                <Zap size={16} /> : <Fuel size={16} />
              }
              <span>{vehicle.fuel}</span>
            </div>
          )}
          
          {vehicle.drivetrain && (
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Car size={16} />
              <span>{vehicle.drivetrain}</span>
            </div>
          )}
        </div>
        
        {/* Financial Details (if available) */}
        {(vehicle.loanTermMonths || vehicle.ltv || vehicle.interestRate) && (
          <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-2">
              Financial Details:
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {vehicle.loanTermMonths && (
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Term:</span>
                  <span className="font-medium ml-1">{vehicle.loanTermMonths} mo</span>
                </div>
              )}
              
              {vehicle.ltv && (
                <div>
                  <span className="text-gray-500 dark:text-gray-400">LTV:</span>
                  <span className="font-medium ml-1">{formatPercentage(vehicle.ltv)}</span>
                </div>
              )}
              
              {vehicle.interestRate && (
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Rate:</span>
                  <span className="font-medium ml-1">{formatPercentage(vehicle.interestRate)}</span>
                </div>
              )}
              
              {vehicle.taxRate && (
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Tax:</span>
                  <span className="font-medium ml-1">{formatPercentage(vehicle.taxRate)}</span>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Dealer Info */}
        {vehicle.dealer && (
          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            Dealer: {vehicle.dealer}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <Button 
          className="w-full" 
          onClick={handleViewDetails}
          disabled={!vehicle["Vehicle Link"]}
        >
          <ExternalLink size={16} className="mr-2" />
          View Full Details
        </Button>
      </CardFooter>
    </Card>
  );
}
```

**Verification Checklist**:
- [ ] Vehicle information displays correctly
- [ ] Images load properly (with error handling)
- [ ] Price and mileage formatting works
- [ ] Click handlers function correctly
- [ ] Financial details section appears when data available
- [ ] Responsive design
- [ ] Dark mode support
- [ ] Icons display properly
- [ ] Stock number badge appears

**Claude Instructions**: "Create the VehicleCard component matching the HTML prototype design. Test with sample vehicle data."

---

### **Phase 4: Advanced Block Components** ⏳

#### ✅ **Step 4.1: VehicleBlock Component (Gallery View)**
**Goal**: Create component for rendering multiple vehicle cards

**Actions**: Create `/app/chat/components/blocks/VehicleBlock.tsx`:
```typescript
import VehicleCard from './VehicleCard';
import type { VehicleData } from '@/types';
import { cn } from '@/lib/utils';

interface VehicleBlockProps {
  vehicles: VehicleData[];
  className?: string;
}

export default function VehicleBlock({ vehicles, className = '' }: VehicleBlockProps) {
  if (!vehicles || vehicles.length === 0) {
    return (
      <div className={cn(
        "text-center text-gray-500 dark:text-gray-400 py-8 px-4 bg-gray-50 dark:bg-gray-800 rounded-lg",
        className
      )}>
        <div className="text-4xl mb-2">🔍</div>
        <div className="font-medium">No vehicles found</div>
        <div className="text-sm mt-1">Try adjusting your search criteria</div>
      </div>
    );
  }
  
  return (
    <div className={cn("space-y-4", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">🚗</span>
          <h4 className="font-medium text-gray-900 dark:text-gray-100">
            Found {vehicles.length} vehicle{vehicles.length !== 1 ? 's' : ''}
          </h4>
        </div>
        
        {/* Optional: Sort/filter controls could go here */}
      </div>
      
      {/* Vehicle Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {vehicles.map((vehicle, index) => (
          <VehicleCard 
            key={vehicle.id || `vehicle-${index}`} 
            vehicle={vehicle}
          />
        ))}
      </div>
    </div>
  );
}
```

**Verification Checklist**:
- [ ] Multiple vehicles render in grid
- [ ] Grid is responsive (1 col mobile, 2 col tablet, 3 col desktop)
- [ ] Empty state displays correctly with helpful message
- [ ] Vehicle count shown with proper pluralization
- [ ] No performance issues with many vehicles
- [ ] Dark mode support

**Claude Instructions**: "Create the VehicleBlock component with responsive grid layout. Test with 0, 1, and multiple vehicles."

---

#### ✅ **Step 4.2: TableBlock Component**
**Goal**: Create component for table/comparison view

**Actions**: Create `/app/chat/components/blocks/TableBlock.tsx`:
```typescript
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatPrice } from '@/lib/utils/formatters';
import { cn } from '@/lib/utils';

interface TableBlockProps {
  columns: string[];
  rows: (string | number)[][];
  className?: string;
}

export default function TableBlock({ columns, rows, className = '' }: TableBlockProps) {
  if (!columns || !rows || rows.length === 0) {
    return (
      <div className={cn(
        "text-center text-gray-500 dark:text-gray-400 py-8 px-4 bg-gray-50 dark:bg-gray-800 rounded-lg",
        className
      )}>
        <div className="text-4xl mb-2">📊</div>
        <div className="font-medium">No comparison data available</div>
      </div>
    );
  }

  const formatCellValue = (value: string | number, columnName: string): string => {
    const colLower = columnName.toLowerCase();
    
    if (colLower.includes('price') && typeof value === 'number') {
      return formatPrice(value);
    }
    
    if (colLower.includes('mileage') && typeof value === 'number') {
      return `${value.toLocaleString()} mi`;
    }
    
    return String(value);
  };

  const getCellClassName = (columnName: string): string => {
    const colLower = columnName.toLowerCase();
    
    if (colLower.includes('price')) {
      return 'text-blue-600 dark:text-blue-400 font-semibold';
    }
    
    if (colLower === 'make' || colLower === 'model') {
      return 'font-medium text-gray-900 dark:text-gray-100';
    }
    
    if (colLower === 'vin' || colLower === 'id' || colLower.includes('stock')) {
      return 'font-mono text-gray-500 dark:text-gray-400 text-xs';
    }
    
    return 'text-gray-700 dark:text-gray-300';
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Header */}
      <div className="flex items-center gap-2">
        <span className="text-lg">📊</span>
        <h4 className="font-medium text-gray-900 dark:text-gray-100">
          Vehicle Comparison ({rows.length} vehicle{rows.length !== 1 ? 's' : ''})
        </h4>
      </div>
      
      {/* Table */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
        <ScrollArea className="w-full">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                {columns.map((column, index) => (
                  <th
                    key={index}
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap"
                  >
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {rows.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  {row.map((cell, cellIndex) => {
                    const columnName = columns[cellIndex];
                    return (
                      <td
                        key={cellIndex}
                        className={cn(
                          "px-4 py-3 text-sm whitespace-nowrap",
                          getCellClassName(columnName)
                        )}
                      >
                        {formatCellValue(cell, columnName)}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </ScrollArea>
      </div>
    </div>
  );
}
```

**Verification Checklist**:
- [ ] Table displays with proper formatting
- [ ] Price columns formatted correctly
- [ ] Responsive horizontal scrolling
- [ ] Column-specific styling applied
- [ ] Hover effects on rows
- [ ] Empty state handled
- [ ] Dark mode support

**Claude Instructions**: "Create the TableBlock component with responsive table. Test with sample comparison data."

---

#### ✅ **Step 4.3: SurveyBlock Component**
**Goal**: Create interactive survey component for ratings

**Actions**: Create `/app/chat/components/blocks/SurveyBlock.tsx`:
```typescript
'use client';

import { useState } from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SurveyBlockProps {
  questions: string[];
  onSubmit?: (ratings: Record<string, number>) => void;
  className?: string;
}

export default function SurveyBlock({ 
  questions, 
  onSubmit, 
  className = '' 
}: SurveyBlockProps) {
  const [ratings, setRatings] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const handleRatingChange = (question: string, value: string) => {
    setRatings(prev => ({
      ...prev,
      [question]: value
    }));
  };
  
  const handleSubmit = () => {
    const numericRatings = Object.entries(ratings).reduce((acc, [key, value]) => ({
      ...acc,
      [key]: parseInt(value)
    }), {});
    
    setIsSubmitted(true);
    onSubmit?.(numericRatings);
  };
  
  const allQuestionsAnswered = questions.every(q => ratings[q]);
  
  if (isSubmitted) {
    return (
      <Card className={cn(
        "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800",
        className
      )}>
        <CardContent className="p-6">
          <div className="flex items-center gap-3 text-green-700 dark:text-green-400">
            <CheckCircle className="w-6 h-6" />
            <div>
              <div className="font-semibold">Thanks for your feedback!</div>
              <div className="text-sm text-green-600 dark:text-green-300 mt-1">
                Your preferences will help us find better matches for you.
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className={cn(
      "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800",
      className
    )}>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg flex items-center gap-2">
          <Star className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          Help us find your perfect match
        </CardTitle>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Rate these factors from 1 (not important) to 5 (very important)
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {questions.map((question, index) => (
          <div key={index} className="space-y-3">
            <Label className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {question}
            </Label>
            <RadioGroup 
              value={ratings[question] || ''}
              onValueChange={(value) => handleRatingChange(question, value)}
              className="flex gap-6"
            >
              {[1, 2, 3, 4, 5].map((num) => (
                <div key={num} className="flex items-center space-x-2">
                  <RadioGroupItem 
                    value={num.toString()} 
                    id={`q${index}-${num}`}
                    className="text-blue-600 dark:text-blue-400" 
                  />
                  <Label 
                    htmlFor={`q${index}-${num}`} 
                    className="text-sm cursor-pointer hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    {num}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        ))}
        
        <Button 
          onClick={handleSubmit}
          disabled={!allQuestionsAnswered}
          className="w-full"
          size="lg"
        >
          <Star className="w-4 h-4 mr-2" />
          Submit Ratings
        </Button>
        
        {!allQuestionsAnswered && (
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
            Please rate all factors to continue
          </p>
        )}
      </CardContent>
    </Card>
  );
}
```

**Verification Checklist**:
- [ ] Radio buttons work correctly
- [ ] State management functions properly
- [ ] Submit button enables/disables correctly
- [ ] Success state displays after submission
- [ ] Responsive design
- [ ] Dark mode support
- [ ] Helpful user guidance

**Claude Instructions**: "Create the SurveyBlock component with full interactivity. Test the rating system and state changes."

---

#### ✅ **Step 4.4: QuestionBlock Component**
**Goal**: Create component for follow-up question suggestions

**Actions**: Create `/app/chat/components/blocks/QuestionBlock.tsx`:
```typescript
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageCircle, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuestionBlockProps {
  questions: string[];
  onQuestionClick?: (question: string) => void;
  className?: string;
}

export default function QuestionBlock({ 
  questions, 
  onQuestionClick, 
  className = '' 
}: QuestionBlockProps) {
  if (!questions || questions.length === 0) {
    return null;
  }
  
  return (
    <Card className={cn(
      "bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700",
      className
    )}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          Suggested questions
        </CardTitle>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Click any question to continue the conversation
        </p>
      </CardHeader>
      
      <CardContent className="space-y-2">
        {questions.map((question, index) => (
          <Button
            key={index}
            variant="ghost"
            className={cn(
              "w-full justify-between h-auto p-4 text-left",
              "hover:bg-white dark:hover:bg-gray-700 hover:shadow-sm",
              "transition-all duration-200",
              "border border-transparent hover:border-gray-200 dark:hover:border-gray-600"
            )}
            onClick={() => onQuestionClick?.(question)}
          >
            <span className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed text-left">
              {question}
            </span>
            <ChevronRight className="w-4 h-4 text-gray-400 shrink-0 ml-3" />
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}
```

**Verification Checklist**:
- [ ] Questions display as clickable buttons
- [ ] Click handlers work correctly
- [ ] Hover effects are smooth
- [ ] Button styling is consistent
- [ ] Text alignment proper
- [ ] Responsive design
- [ ] Dark mode support

**Claude Instructions**: "Create the QuestionBlock component with proper click handling. Test the button interactions and styling."

---

### **Phase 5: Chat State Management** ⏳

#### ✅ **Step 5.1: Chat Provider Context**
**Goal**: Create React context for chat state management

**Actions**: Create `/components/providers/ChatProvider.tsx`:
```typescript
'use client';

import { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { Message, ChatState, ParsedResponse } from '@/types';

type ChatAction =
  | { type: 'ADD_MESSAGE'; payload: Message }
  | { type: 'UPDATE_MESSAGE'; payload: { id: string; updates: Partial<Message> } }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'CLEAR_CHAT' }
  | { type: 'SET_SESSION_ID'; payload: string }
  | { type: 'LOAD_MESSAGES'; payload: Message[] };

const initialState: ChatState = {
  messages: [],
  sessionId: uuidv4(),
  isLoading: false,
  error: null,
};

function chatReducer(state: ChatState, action: ChatAction): ChatState {
  switch (action.type) {
    case 'ADD_MESSAGE':
      return { 
        ...state, 
        messages: [...state.messages, action.payload],
        error: null 
      };
      
    case 'UPDATE_MESSAGE':
      return {
        ...state,
        messages: state.messages.map(msg =>
          msg.id === action.payload.id 
            ? { ...msg, ...action.payload.updates }
            : msg
        )
      };
      
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
      
    case 'SET_ERROR':
      return { ...state, error: action.payload };
      
    case 'CLEAR_CHAT':
      return { 
        ...state, 
        messages: [], 
        sessionId: uuidv4(),
        error: null 
      };
      
    case 'SET_SESSION_ID':
      return { ...state, sessionId: action.payload };
      
    case 'LOAD_MESSAGES':
      return { ...state, messages: action.payload };
      
    default:
      return state;
  }
}

const ChatContext = createContext<{
  state: ChatState;
  dispatch: React.Dispatch<ChatAction>;
} | null>(null);

interface ChatProviderProps {
  children: ReactNode;
}

export function ChatProvider({ children }: ChatProviderProps) {
  const [state, dispatch] = useReducer(chatReducer, initialState);
  
  // Load saved session and messages on mount
  useEffect(() => {
    const savedSessionId = localStorage.getItem('revup_session_id');
    if (savedSessionId) {
      dispatch({ type: 'SET_SESSION_ID', payload: savedSessionId });
      
      // Load messages for this session
      const savedMessages = localStorage.getItem(`revup_messages_${savedSessionId}`);
      if (savedMessages) {
        try {
          const parsed = JSON.parse(savedMessages);
          // Convert timestamp strings back to Date objects
          const messagesWithDates = parsed.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }));
          dispatch({ type: 'LOAD_MESSAGES', payload: messagesWithDates });
          console.log('Loaded saved messages:', messagesWithDates.length);
        } catch (error) {
          console.error('Failed to load saved messages:', error);
          localStorage.removeItem(`revup_messages_${savedSessionId}`);
        }
      }
    } else {
      // Save new session ID
      localStorage.setItem('revup_session_id', state.sessionId);
      console.log('Created new session:', state.sessionId);
    }
  }, []);
  
  // Save messages when they change (debounced)
  useEffect(() => {
    if (state.messages.length > 0) {
      const timeoutId = setTimeout(() => {
        localStorage.setItem(
          `revup_messages_${state.sessionId}`,
          JSON.stringify(state.messages)
        );
      }, 1000); // 1 second debounce
      
      return () => clearTimeout(timeoutId);
    }
  }, [state.messages, state.sessionId]);
  
  // Save session ID when it changes
  useEffect(() => {
    localStorage.setItem('revup_session_id', state.sessionId);
  }, [state.sessionId]);
  
  return (
    <ChatContext.Provider value={{ state, dispatch }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChatContext() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
}
```

**Verification Checklist**:
- [ ] Context provides correct values
- [ ] Reducer handles all actions correctly
- [ ] LocalStorage persistence works
- [ ] Session management functions
- [ ] No infinite re-renders
- [ ] TypeScript types are correct
- [ ] Console logging for debugging

**Claude Instructions**: "Create the ChatProvider with full state management. Test the persistence functionality in browser."

---

#### ✅ **Step 5.2: Main useChat Hook**
**Goal**: Create main hook for chat functionality

**Actions**: Create `/hooks/useChat.ts`:
```typescript
'use client';

import { useCallback } from 'react';
import { useChatContext } from '@/components/providers/ChatProvider';
import { webhookClient } from '@/lib/webhook/client';
import { v4 as uuidv4 } from 'uuid';
import type { Message } from '@/types';

export function useChat() {
  const { state, dispatch } = useChatContext();
  
  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) {
      console.warn('Attempted to send empty message');
      return;
    }
    
    console.log('Sending message:', { length: content.length, sessionId: state.sessionId });
    
    // Create user message
    const userMessage: Message = {
      id: uuidv4(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date(),
      status: 'sending'
    };
    
    // Add user message and set loading state
    dispatch({ type: 'ADD_MESSAGE', payload: userMessage });
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });
    
    try {
      // Send to webhook
      const response = await webhookClient.sendMessage({
        message: content.trim(),
        sessionId: state.sessionId
      });
      
      // Update user message status
      dispatch({ 
        type: 'UPDATE_MESSAGE', 
        payload: { 
          id: userMessage.id, 
          updates: { status: 'sent' } 
        }
      });
      
      if (response.success && response.data) {
        // Add AI response
        const aiMessage: Message = {
          id: uuidv4(),
          role: 'assistant',
          content: response.data,
          timestamp: new Date(),
          status: 'sent'
        };
        
        dispatch({ type: 'ADD_MESSAGE', payload: aiMessage });
        console.log('AI response added:', { 
          blocks: response.data.blocks.length,
          types: response.data.blocks.map(b => b.type)
        });
      } else {
        // Handle API error
        const errorMessage = response.error || 'Failed to get response from AI assistant';
        dispatch({ type: 'SET_ERROR', payload: errorMessage });
        
        // Update user message to error state
        dispatch({ 
          type: 'UPDATE_MESSAGE', 
          payload: { 
            id: userMessage.id, 
            updates: { status: 'error' } 
          }
        });
        
        console.error('Webhook error:', errorMessage);
      }
      
    } catch (error) {
      console.error('Send message error:', error);
      
      // Update user message to error state
      dispatch({ 
        type: 'UPDATE_MESSAGE', 
        payload: { 
          id: userMessage.id, 
          updates: { status: 'error' } 
        }
      });
      
      dispatch({ 
        type: 'SET_ERROR', 
        payload: error instanceof Error ? error.message : 'Unknown error occurred' 
      });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [state.sessionId, dispatch]);
  
  const retryMessage = useCallback(async (messageId: string) => {
    const message = state.messages.find(m => m.id === messageId);
    if (message?.role === 'user' && message.status === 'error') {
      console.log('Retrying message:', messageId);
      await sendMessage(message.content as string);
    }
  }, [state.messages, sendMessage]);
  
  const clearChat = useCallback(() => {
    console.log('Clearing chat session:', state.sessionId);
    // Clear saved messages
    localStorage.removeItem(`revup_messages_${state.sessionId}`);
    dispatch({ type: 'CLEAR_CHAT' });
  }, [state.sessionId, dispatch]);
  
  const dismissError = useCallback(() => {
    dispatch({ type: 'SET_ERROR', payload: null });
  }, [dispatch]);
  
  const startNewSession = useCallback(() => {
    const newSessionId = uuidv4();
    console.log('Starting new session:', newSessionId);
    
    // Clear old messages
    localStorage.removeItem(`revup_messages_${state.sessionId}`);
    
    // Set new session
    dispatch({ type: 'SET_SESSION_ID', payload: newSessionId });
    dispatch({ type: 'LOAD_MESSAGES', payload: [] });
    dispatch({ type: 'SET_ERROR', payload: null });
    
    localStorage.setItem('revup_session_id', newSessionId);
  }, [state.sessionId, dispatch]);
  
  return {
    // State
    messages: state.messages,
    sessionId: state.sessionId,
    isLoading: state.isLoading,
    error: state.error,
    
    // Actions
    sendMessage,
    retryMessage,
    clearChat,
    dismissError,
    startNewSession,
  };
}
```

**Verification Checklist**:
- [ ] Hook returns correct interface
- [ ] Send message functionality works
- [ ] Error handling is comprehensive
- [ ] Retry functionality works
- [ ] Clear chat resets everything
- [ ] Session management works
- [ ] Console logging for debugging
- [ ] No memory leaks

**Claude Instructions**: "Create the useChat hook with all functionality. Test each method thoroughly with console logs."

---

### **Phase 6: Chat Interface Components** ⏳

#### ✅ **Step 6.1: Message Component**
**Goal**: Create component to render individual chat messages

**Actions**: Create `/app/chat/components/Message.tsx`:
```typescript
'use client';

import { motion } from 'framer-motion';
import { AlertCircle, RefreshCw, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import TextBlock from './blocks/TextBlock';
import VehicleBlock from './blocks/VehicleBlock';
import TableBlock from './blocks/TableBlock';
import SurveyBlock from './blocks/SurveyBlock';
import QuestionBlock from './blocks/QuestionBlock';
import type { Message as MessageType, ParsedResponse } from '@/types';
import { cn } from '@/lib/utils';

interface MessageProps {
  message: MessageType;
  onRetry?: (messageId: string) => void;
  onQuestionClick?: (question: string) => void;
  className?: string;
}

export default function Message({ 
  message, 
  onRetry, 
  onQuestionClick,
  className = '' 
}: MessageProps) {
  const isUser = message.role === 'user';
  const isError = message.status === 'error';
  const isSending = message.status === 'sending';
  
  const renderContent = () => {
    if (isUser) {
      // User messages are always text
      return <TextBlock content={message.content as string} isUser={true} />;
    }
    
    // Assistant messages can have blocks
    const parsedContent = message.content as ParsedResponse;
    
    if (!parsedContent.blocks || parsedContent.blocks.length === 0) {
      return <TextBlock content="No content available" isUser={false} />;
    }
    
    return (
      <div className="space-y-4">
        {parsedContent.blocks.map((block, index) => {
          switch (block.type) {
            case 'text':
              return (
                <TextBlock 
                  key={index} 
                  content={block.content as string} 
                  isUser={false} 
                />
              );
              
            case 'gallery':
              return (
                <VehicleBlock 
                  key={index} 
                  vehicles={(block as any).vehicles || []} 
                />
              );
              
            case 'hybrid':
              return (
                <VehicleBlock 
                  key={index} 
                  vehicles={block.content as any[]} 
                />
              );
              
            case 'table':
              return (
                <TableBlock 
                  key={index} 
                  columns={(block as any).columns || []}
                  rows={(block as any).rows || []}
                />
              );
              
            case 'survey':
              return (
                <SurveyBlock 
                  key={index} 
                  questions={block.content as string[]}
                  onSubmit={(ratings) => {
                    console.log('Survey ratings:', ratings);
                    // Could send ratings back to chat
                    // onQuestionClick?.(`My ratings: ${JSON.stringify(ratings)}`);
                  }}
                />
              );
              
            case 'questions':
              return (
                <QuestionBlock 
                  key={index} 
                  questions={block.content as string[]}
                  onQuestionClick={onQuestionClick}
                />
              );
              
            default:
              console.warn('Unknown block type:', block);
              return (
                <TextBlock 
                  key={index} 
                  content={`[Unknown block type: ${(block as any).type}]`} 
                  isUser={false} 
                />
              );
          }
        })}
      </div>
    );
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "flex mb-6",
        isUser ? 'justify-end' : 'justify-start',
        className
      )}
    >
      <div className={cn(
        "max-w-[85%] md:max-w-[75%] lg:max-w-[65%]",
        "shadow-sm rounded-2xl",
        isUser 
          ? "bg-blue-600 text-white rounded-br-md" 
          : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-bl-md",
        isError && "border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/20"
      )}>
        <div className="p-4">
          {renderContent()}
          
          {/* Status indicators */}
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-2">
              {isSending && (
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  >
                    <RefreshCw size={12} />
                  </motion.div>
                  <span>Sending...</span>
                </div>
              )}
              
              {isError && (
                <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                  <AlertCircle size={16} />
                  <span className="text-sm">Failed to send</span>
                </div>
              )}
            </div>
            
            {/* Retry button for errors */}
            {isError && onRetry && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onRetry(message.id)}
                className="text-red-600 border-red-300 hover:bg-red-50 dark:text-red-400 dark:border-red-600 dark:hover:bg-red-900/20"
              >
                <RefreshCw size={14} className="mr-1" />
                Retry
              </Button>
            )}
          </div>
          
          {/* Timestamp */}
          <div className={cn(
            "text-xs mt-2 flex items-center gap-1",
            isUser 
              ? "text-blue-100" 
              : "text-gray-500 dark:text-gray-400"
          )}>
            <Clock size={10} />
            <span>
              {message.timestamp.toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
```

**Verification Checklist**:
- [ ] Renders all block types correctly
- [ ] User and assistant styling distinct
- [ ] Error states display properly
- [ ] Retry functionality works
- [ ] Animations are smooth
- [ ] Responsive design
- [ ] Dark mode support
- [ ] Timestamp displays correctly

**Claude Instructions**: "Create the Message component with complete block rendering. Test with different message types and states."

---

### **Phase 7: Complete Chat Interface** ⏳

#### ✅ **Step 7.1: MessageList Component**
**Goal**: Create scrollable container for messages with auto-scroll

**Actions**: Create `/app/chat/components/MessageList.tsx`:
```typescript
'use client';

import { useEffect, useRef } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import Message from './Message';
import type { Message as MessageType } from '@/types';
import { cn } from '@/lib/utils';

interface MessageListProps {
  messages: MessageType[];
  isLoading?: boolean;
  onRetry?: (messageId: string) => void;
  onQuestionClick?: (question: string) => void;
  className?: string;
}

export default function MessageList({ 
  messages, 
  isLoading = false,
  onRetry,
  onQuestionClick,
  className = '' 
}: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages.length]);
  
  // Scroll to bottom when loading state changes
  useEffect(() => {
    if (!isLoading && bottomRef.current) {
      setTimeout(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [isLoading]);
  
  const quickActions = [
    { icon: '🔍', label: 'Browse SUVs', query: 'Show me available SUVs' },
    { icon: '💰', label: 'Budget $300/mo', query: 'What can I get for $300/month?' },
    { icon: '⚡', label: 'Electric cars', query: 'Show me electric vehicles' },
    { icon: '🔢', label: 'VIN lookup', query: 'I want to check a VIN' }
  ];
  
  return (
    <ScrollArea 
      ref={scrollAreaRef}
      className={cn("flex-1 px-4", className)}
    >
      <div className="py-4 space-y-1">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)] text-center px-4">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 rounded-full flex items-center justify-center mb-6">
              <span className="text-3xl">🚗</span>
            </div>
            
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
              Welcome to RevUpChat!
            </h3>
            
            <p className="text-gray-600 dark:text-gray-400 max-w-md mb-8 leading-relaxed">
              I'm your AI car shopping assistant. Ask me about available vehicles, 
              get personalized recommendations, or explore our inventory.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-md">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant="outline" 
                  onClick={() => onQuestionClick?.(action.query)}
                  className={cn(
                    "h-auto p-4 text-left justify-start",
                    "hover:bg-blue-50 dark:hover:bg-blue-900/20",
                    "border-gray-200 dark:border-gray-700",
                    "transition-all duration-200"
                  )}
                >
                  <span className="text-lg mr-3">{action.icon}</span>
                  <div>
                    <div className="font-medium text-sm">{action.label}</div>
                  </div>
                </Button>
              ))}
            </div>
            
            <div className="mt-8 text-xs text-gray-500 dark:text-gray-400">
              Or type your own question below
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <Message
              key={message.id}
              message={message}
              onRetry={onRetry}
              onQuestionClick={onQuestionClick}
            />
          ))
        )}
        
        {/* Loading indicator */}
        {isLoading && (
          <div className="flex justify-start mb-6">
            <div className="max-w-[85%] md:max-w-[75%] lg:max-w-[65%] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl rounded-bl-md shadow-sm">
              <div className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    AI is thinking...
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Scroll anchor */}
        <div ref={bottomRef} />
      </div>
    </ScrollArea>
  );
}
```

**Verification Checklist**:
- [ ] Scrolling works smoothly
- [ ] Auto-scroll to bottom functions
- [ ] Empty state displays correctly with quick actions
- [ ] Loading indicator appears
- [ ] Quick action buttons work
- [ ] Performance good with many messages
- [ ] Responsive design

**Claude Instructions**: "Create the MessageList component with auto-scrolling and welcome screen. Test with various message counts."

---

#### ✅ **Step 7.2: MessageInput Component**
**Goal**: Create input component for sending messages

**Actions**: Create `/app/chat/components/MessageInput.tsx`:
```typescript
'use client';

import { useState, useRef, KeyboardEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Loader2, Paperclip } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  isLoading?: boolean;
  placeholder?: string;
  className?: string;
}

export default function MessageInput({ 
  onSendMessage, 
  disabled = false, 
  isLoading = false,
  placeholder = "Ask about cars, inventory, or get recommendations...",
  className = '' 
}: MessageInputProps) {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const maxLength = 1000;
  
  const handleSend = () => {
    const trimmedMessage = message.trim();
    if (trimmedMessage && !disabled && !isLoading) {
      onSendMessage(trimmedMessage);
      setMessage('');
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };
  
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= maxLength) {
      setMessage(value);
    }
    
    // Auto-resize textarea
    const textarea = e.target;
    textarea.style.height = 'auto';
    const newHeight = Math.min(textarea.scrollHeight, 120); // Max height of ~3 lines
    textarea.style.height = `${newHeight}px`;
  };
  
  const canSend = message.trim().length > 0 && !disabled && !isLoading;
  const characterCount = message.length;
  const isNearLimit = characterCount > maxLength * 0.8;
  
  return (
    <div className={cn(
      "border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800",
      className
    )}>
      <div className="p-4">
        <div className="flex gap-3 items-end">
          <div className="flex-1 relative">
            <Textarea
              ref={textareaRef}
              value={message}
              onChange={handleTextareaChange}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              disabled={disabled || isLoading}
              className={cn(
                "min-h-[44px] max-h-[120px] resize-none",
                "border-gray-300 dark:border-gray-600",
                "focus:border-blue-500 dark:focus:border-blue-400",
                "rounded-lg pr-16",
                "transition-colors duration-200"
              )}
              style={{ 
                height: 'auto',
                overflowY: 'hidden'
              }}
            />
            
            {/* Character counter */}
            <div className={cn(
              "absolute bottom-2 right-2 text-xs",
              isNearLimit 
                ? "text-orange-500 dark:text-orange-400" 
                : "text-gray-400 dark:text-gray-500"
            )}>
              {characterCount}/{maxLength}
            </div>
          </div>
          
          {/* Send button */}
          <Button
            onClick={handleSend}
            disabled={!canSend}
            size="lg"
            className={cn(
              "shrink-0 h-[44px] w-[44px] p-0",
              "transition-all duration-200",
              canSend 
                ? "bg-blue-600 hover:bg-blue-700" 
                : "bg-gray-300 dark:bg-gray-600"
            )}
          >
            {isLoading ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <Send size={20} />
            )}
          </Button>
        </div>
        
        <div className="mt-2 flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
          <span>Press Enter to send, Shift+Enter for new line</span>
          {isLoading && (
            <span className="text-blue-600 dark:text-blue-400 flex items-center gap-1">
              <Loader2 size={12} className="animate-spin" />
              Sending message...
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
```

**Verification Checklist**:
- [ ] Textarea auto-resizes correctly
- [ ] Enter key sends message
- [ ] Shift+Enter creates new line
- [ ] Character counter works and warns near limit
- [ ] Loading states display
- [ ] Disabled state functions
- [ ] Mobile keyboard friendly
- [ ] Send button visual feedback

**Claude Instructions**: "Create the MessageInput component with auto-resize and keyboard handling. Test all input scenarios."

---

#### ✅ **Step 7.3: ChatWindow Component**
**Goal**: Create main chat interface component

**Actions**: Create `/app/chat/components/ChatWindow.tsx`:
```typescript
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RotateCcw, Settings, Plus, X } from 'lucide-react';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { useChat } from '@/hooks/useChat';
import { cn } from '@/lib/utils';

interface ChatWindowProps {
  className?: string;
}

export default function ChatWindow({ className = '' }: ChatWindowProps) {
  const { 
    messages, 
    sessionId, 
    isLoading, 
    error, 
    sendMessage, 
    retryMessage, 
    clearChat,
    dismissError,
    startNewSession
  } = useChat();
  
  const [showSessionId, setShowSessionId] = useState(false);
  
  const handleQuestionClick = (question: string) => {
    sendMessage(question);
  };
  
  const handleClearChat = () => {
    if (window.confirm('Are you sure you want to clear this chat? This cannot be undone.')) {
      clearChat();
    }
  };
  
  const handleNewSession = () => {
    if (messages.length > 0) {
      if (window.confirm('Start a new session? Your current conversation will be saved but you\'ll get a fresh start.')) {
        startNewSession();
      }
    } else {
      startNewSession();
    }
  };
  
  return (
    <div className={cn(
      "flex flex-col h-full bg-gray-50 dark:bg-gray-900",
      className
    )}>
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              RevUpChat
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              AI Car Shopping Assistant
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSessionId(!showSessionId)}
              title="Session Info"
            >
              <Settings size={16} />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleNewSession}
              title="New Session"
            >
              <Plus size={16} />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearChat}
              disabled={messages.length === 0}
              title="Clear Chat"
            >
              <RotateCcw size={16} />
            </Button>
          </div>
        </div>
        
        {showSessionId && (
          <div className="mt-3 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  Session ID:
                </div>
                <div className="text-xs font-mono text-gray-700 dark:text-gray-300 mt-1">
                  {sessionId}
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSessionId(false)}
              >
                <X size={14} />
              </Button>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Messages: {messages.length} • 
              Status: {isLoading ? 'Processing...' : 'Ready'}
            </div>
          </div>
        )}
      </div>
      
      {/* Error Banner */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border-b border-red-200 dark:border-red-800 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-red-600 dark:text-red-400 text-sm">
                ⚠️ {error}
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={dismissError}
              className="text-red-600 hover:text-red-700 dark:text-red-400"
            >
              <X size={16} />
            </Button>
          </div>
        </div>
      )}
      
      {/* Messages */}
      <MessageList
        messages={messages}
        isLoading={isLoading}
        onRetry={retryMessage}
        onQuestionClick={handleQuestionClick}
        className="flex-1"
      />
      
      {/* Input */}
      <MessageInput
        onSendMessage={sendMessage}
        disabled={!!error}
        isLoading={isLoading}
      />
    </div>
  );
}
```

**Verification Checklist**:
- [ ] All components integrate correctly
- [ ] Header displays properly with all buttons
- [ ] Error banner shows/hides correctly
- [ ] Clear chat confirmation works
- [ ] New session functionality works
- [ ] Session ID toggle functions
- [ ] Responsive layout
- [ ] Dark mode support
- [ ] All tooltips work

**Claude Instructions**: "Create the ChatWindow component integrating all chat functionality. Test the complete chat flow."

---

#### ✅ **Step 7.4: Chat Page Implementation**
**Goal**: Create the main chat page with providers

**Actions**: 

**Update `/app/chat/page.tsx`**:
```typescript
import { Metadata } from 'next';
import ChatWindow from './components/ChatWindow';

export const metadata: Metadata = {
  title: 'Chat - RevUpChat',
  description: 'AI-powered car shopping assistant for finding your perfect vehicle',
};

export default function ChatPage() {
  return (
    <div className="h-screen w-full overflow-hidden">
      <ChatWindow className="h-full" />
    </div>
  );
}
```

**Update `/app/layout.tsx`**:
```typescript
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ChatProvider } from '@/components/providers/ChatProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'RevUpChat - AI Car Shopping Assistant',
  description: 'Find your perfect car with our AI-powered shopping assistant',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ChatProvider>
          {children}
        </ChatProvider>
      </body>
    </html>
  );
}
```

**Update `/app/page.tsx`** (Landing Page):
```typescript
import { Button } from '@/components/ui/button';
import { ArrowRight, MessageCircle, Search, Star, Car } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="mb-16">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg">
                <Car className="w-10 h-10 text-white" />
              </div>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-gray-100 mb-6 leading-tight">
              Find Your Perfect Car with{' '}
              <span className="text-blue-600 dark:text-blue-400">AI</span>
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
              Chat with our intelligent assistant to discover vehicles that match your 
              preferences, budget, and lifestyle. Get personalized recommendations instantly.
            </p>
            
            <Link href="/chat">
              <Button size="lg" className="text-lg px-8 py-6 h-auto shadow-lg hover:shadow-xl transition-all duration-200">
                <MessageCircle className="mr-2" size={24} />
                Start Chatting
                <ArrowRight className="ml-2" size={24} />
              </Button>
            </Link>
          </div>
          
          {/* Features */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-200">
              <Search className="mx-auto mb-4 text-blue-600 dark:text-blue-400" size={48} />
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
                Smart Search
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Natural language search through thousands of vehicles in our inventory.
              </p>
            </div>
            
            <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-200">
              <Star className="mx-auto mb-4 text-blue-600 dark:text-blue-400" size={48} />
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
                Personalized
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Get recommendations based on your preferences, budget, and needs.
              </p>
            </div>
            
            <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-200">
              <MessageCircle className="mx-auto mb-4 text-blue-600 dark:text-blue-400" size={48} />
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
                Instant Help
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Get immediate answers about pricing, features, and availability.
              </p>
            </div>
          </div>
          
          {/* CTA */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-200">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Ready to find your next car?
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Join thousands of satisfied customers who found their perfect vehicle with our AI assistant.
            </p>
            <Link href="/chat">
              <Button size="lg" variant="outline" className="shadow-sm hover:shadow-md transition-all duration-200">
                Get Started Now
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
```

**Verification Checklist**:
- [ ] Chat page loads correctly
- [ ] Providers wrap components properly
- [ ] No hydration errors
- [ ] Navigation between pages works
- [ ] Landing page displays correctly
- [ ] Dark mode functioning across all pages
- [ ] All links work

**Claude Instructions**: "Create the chat page and update the layout/homepage. Verify the complete application flow from landing page to chat."

---

### **Phase 8: Testing & Optimization** ⏳

#### ✅ **Step 8.1: End-to-End Testing**
**Goal**: Test the complete application thoroughly

**Testing Checklist**:
- [ ] **Navigation**: Landing page → Chat page works
- [ ] **Webhook Integration**: Can send message and receive response
- [ ] **Block Rendering**: All block types render correctly (text, gallery, table, survey, questions)
- [ ] **User Interface**: All buttons, inputs, and interactions work
- [ ] **State Management**: Sessions persist, messages save/load
- [ ] **Error Handling**: Network errors, timeouts handled gracefully
- [ ] **Responsive Design**: Works on mobile, tablet, desktop
- [ ] **Dark Mode**: Theme switching works everywhere
- [ ] **Performance**: No lag, smooth animations

**Test Messages to Try**:
1. `"Show me available SUVs"` - Should return gallery
2. `"I want a used car"` - General query
3. `"What can I get for $300/month?"` - Budget query
4. `"Compare Honda vs Toyota"` - Might return table
5. Invalid message to test error handling

**Claude Instructions**: "Perform comprehensive testing of all features. Document any issues found."

---

#### ✅ **Step 8.2: Production Build Test**
**Goal**: Ensure app builds and runs in production mode

**Actions**:
```bash
# Test production build
npm run build
npm start

# Verify no errors
# Check performance
# Test on mobile device
```

**Verification Checklist**:
- [ ] Build completes successfully
- [ ] No TypeScript errors
- [ ] No console errors in production
- [ ] All features work in production
- [ ] Environment variables loaded correctly
- [ ] Performance is acceptable

**Claude Instructions**: "Test the production build thoroughly. Fix any build issues before deploying."

---

#### ✅ **Step 8.3: Performance Optimization**
**Goal**: Optimize app performance and user experience

**Potential Optimizations**:
- Dynamic imports for heavy components
- Image optimization
- Bundle size optimization
- Memory leak prevention

**Actions**: Add optimizations as needed based on testing.

**Verification Checklist**:
- [ ] Fast loading times
- [ ] Smooth animations
- [ ] No memory leaks
- [ ] Good mobile performance

**Claude Instructions**: "Optimize for performance. Use dynamic imports and image optimization where needed."

---

### **Phase 9: Final Polish & Deployment Prep** ⏳

#### ✅ **Step 9.1: Dark Mode Implementation**
**Goal**: Add proper dark mode support with toggle

**Actions**: If needed, enhance dark mode with theme provider and toggle button.

**Verification Checklist**:
- [ ] Dark mode toggle works
- [ ] All components support dark mode
- [ ] Theme preference persists

---

#### ✅ **Step 9.2: Final Testing**
**Goal**: Complete final testing of all features

**Final Testing Checklist**:
- [ ] Send message to webhook ✅
- [ ] Receive and parse response ✅
- [ ] Render all block types correctly ✅
- [ ] Handle errors gracefully ✅
- [ ] Session persistence works ✅
- [ ] Mobile responsiveness ✅
- [ ] Dark mode functionality ✅
- [ ] Performance acceptable ✅
- [ ] All animations smooth ✅
- [ ] Production build works ✅

**Claude Instructions**: "Perform final comprehensive testing. Verify everything works perfectly."

---

## 🚨 Important Notes for Claude Code

### **Critical Requirements**
- **NEVER auto-commit** - Always ask permission before git operations
- **One step at a time** - Wait for verification before proceeding
- **Test everything** - Each component must be verified working
- **Follow types strictly** - Use the defined TypeScript interfaces
- **Use existing setup** - Build on the current Next.js project
- **Reference HTML prototype** - Match the design and functionality

### **Current Project State**
- **Location**: `C:\Users\mike\Desktop\RevUpChat`
- **Framework**: Next.js 14 with TypeScript and Tailwind CSS ✅
- **Webhook**: Live endpoint tested and working ✅
- **Documentation**: Complete response format documentation ✅

### **Success Criteria**
- ✅ Application builds without errors
- ✅ Webhook integration working
- ✅ All block types render correctly
- ✅ Error handling comprehensive
- ✅ Mobile responsive design
- ✅ Dark mode support
- ✅ Session persistence working
- ✅ Matches HTML prototype functionality

---

## 📞 When to Stop and Ask

- Before any git operations (commits, pushes, etc.)
- If encountering build errors
- When webhook responses don't match expected format
- If TypeScript errors persist
- Before making architectural changes
- When unsure about next steps
- If any step verification fails

---

**Remember: This builds on your existing tested HTML prototype and documentation. Each step should be completed, tested, and verified before moving to the next. The goal is a production-ready application that matches your working prototype's functionality.**