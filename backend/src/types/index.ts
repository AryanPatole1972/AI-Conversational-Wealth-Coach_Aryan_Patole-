// Shared TypeScript interfaces and types for AI Conversational Wealth Coach

export type ConversationMode = 'onboarding' | 'analysis' | 'education';

export interface UserProfile {
  income: number;
  expenses: number;
  surplus: number;
  goals: string[];
  riskTolerance?: 'low' | 'medium' | 'high';
}

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  metadata?: {
    modeTransition?: string;
    suggestedActions?: string[];
  };
}

export interface SessionData {
  id: string;
  userProfile: UserProfile | null;
  conversationHistory: Message[];
  mode: ConversationMode;
  createdAt: Date;
  lastAccessedAt: Date;
  metadata: {
    onboardingComplete: boolean;
    disclaimerShown: boolean;
  };
}

export interface ConversationContext {
  userProfile: UserProfile | null;
  mode: ConversationMode;
  conversationHistory: Message[];
}

export interface AssistantResponse {
  message: string;
  suggestedActions?: string[];
  modeTransition?: ConversationMode;
}

export interface AssetClassInfo {
  name: string;
  description: string;
  riskLevel: 'low' | 'medium' | 'high';
  liquidity: 'high' | 'medium' | 'low';
  typicalReturnRange: {
    min: number;
    max: number;
  };
  timeHorizon: string;
  advantages: string[];
  disadvantages: string[];
  examples?: string[];
}

export interface EducationalContent {
  id: string;
  title: string;
  topic: string;
  difficultyLevel: 'beginner' | 'intermediate';
  content: string;
  relatedTopics: string[];
  keywords: string[];
  lastUpdated: Date;
}

export interface ProjectionScenario {
  label: string;
  returnRate: number;
  values: number[];
  metadata: {
    assumptions: string;
    disclaimer: string;
  };
}

export interface ProjectionParams {
  amount: number;
  years: number;
  returnRate: number;
}

// API Request/Response Types
export interface CreateSessionResponse {
  sessionId: string;
}

export interface SendMessageRequest {
  message: string;
}

export interface SendMessageResponse {
  message: string;
  modeTransition?: string;
}

export interface UpdateProfileRequest {
  income?: number;
  expenses?: number;
  goals?: string[];
  riskTolerance?: 'low' | 'medium' | 'high';
}

export interface CalculateProjectionRequest {
  principal: number;
  monthly: number;
  years: number;
}

export interface CalculateProjectionResponse {
  scenarios: ProjectionScenario[];
}

export interface GetAssetClassesResponse {
  assetClasses: AssetClassInfo[];
}
