// Based on tested webhook response formats from documentation

// Webhook request/response types
export interface WebhookRequest {
  sessionId: string;
  action: 'sendMessage';
  chatInput: string;
}

export interface WebhookResponse {
  output: string; // Stringified JSON or direct text
}

// Vehicle data structure (from HTML prototype testing)
export interface VehicleDataBase {
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
  vdp?: string; // Vehicle Detail Page URL
  // Financial fields
  payment?: number;
  downPayment?: number;
  loanTermMonths?: number;
  ltv?: number;
  interestRate?: number;
  taxRate?: number;
  amountFinanced?: number;
  profit?: number;
  newProfit?: number;
  NewProfit?: number;
  Profit?: number;
  "New Profit"?: number;
  // Additional fields
  ageDays?: number;
  priceofit?: number;
  paymentment?: number;
  downpaymentment?: number;
}

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
  vdp?: string; // Vehicle Detail Page URL
  // Financial fields
  payment?: number;
  downPayment?: number;
  loanTermMonths?: number;
  ltv?: number;
  interestRate?: number;
  taxRate?: number;
  amountFinanced?: number;
  profit?: number;
  newProfit?: number;
  NewProfit?: number;
  Profit?: number;
  "New Profit"?: number;
  // Additional fields
  ageDays?: number;
  priceofit?: number;
  paymentment?: number;
  downpaymentment?: number;
  score?: number; // Match score from CarAPI
}

// Block type definitions (from tested responses)
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

// Survey types
export interface SurveyQuestion {
  id: string;
  text: string;
  type: 'rating' | 'text' | 'choice';
  options?: string[];
  required?: boolean;
}

// API response types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: 'success' | 'error';
}