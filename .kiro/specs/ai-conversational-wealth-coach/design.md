# Design Document: AI Conversational Wealth Coach

## Overview

The AI Conversational Wealth Coach is a web-based educational application that helps first-time investors understand financial concepts through natural conversation. The system combines conversational AI, financial calculations, and interactive visualizations to create an accessible learning experience.

The architecture follows a client-server model with a React-based frontend for the user interface and a Node.js backend that orchestrates the AI conversation engine, financial calculations, and data persistence. The system is designed as a prototype to demonstrate core capabilities: onboarding flow, conversational interaction, and investment visualization.

Key design principles:
- Educational focus: All content and interactions emphasize learning, not advice
- Conversational interface: Natural language interaction reduces barriers for first-time investors
- Visual feedback: Charts and dashboards make abstract financial concepts concrete
- Guardrails: Built-in safeguards prevent the system from providing financial advice
- Stateful sessions: Conversation context persists to enable coherent multi-turn interactions

## Architecture

### System Architecture

The system uses a three-tier architecture:

```
┌─────────────────────────────────────────────────────────────┐
│                     Client Layer (Browser)                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Chat UI      │  │ Dashboard    │  │ Visualizer   │      │
│  │ Component    │  │ Component    │  │ Component    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                React Application (SPA)                       │
└─────────────────────────────────────────────────────────────┘
                            │ HTTPS/WebSocket
┌─────────────────────────────────────────────────────────────┐
│                   Application Layer (Node.js)                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ API Routes   │  │ Conversation │  │ Financial    │      │
│  │              │  │ Engine       │  │ Calculator   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐                        │
│  │ Session Mgr  │  │ Content      │                        │
│  │              │  │ Library      │                        │
│  └──────────────┘  └──────────────┘                        │
└─────────────────────────────────────────────────────────────┘
                            │
┌─────────────────────────────────────────────────────────────┐
│                      Data Layer                              │
│  ┌──────────────┐  ┌──────────────┐                        │
│  │ Session      │  │ Educational  │                        │
│  │ Storage      │  │ Content DB   │                        │
│  │ (JSON files) │  │ (JSON files) │                        │
│  └──────────────┘  └──────────────┘                        │
└─────────────────────────────────────────────────────────────┘
                            │
┌─────────────────────────────────────────────────────────────┐
│                   External Services                          │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         OpenAI API (GPT-4 or similar)                │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

**Client Layer:**
- Chat UI: Renders conversation interface, handles user input, displays AI responses
- Dashboard: Displays financial summary (income, expenses, surplus)
- Visualizer: Renders interactive investment projection charts

**Application Layer:**
- API Routes: RESTful endpoints for session management, conversation, and calculations
- Conversation Engine: Manages AI interactions, applies guardrails, maintains context
- Financial Calculator: Computes surplus allocation and investment projections
- Session Manager: Handles session persistence and retrieval
- Content Library: Provides structured educational content about asset classes

**Data Layer:**
- Session Storage: Persists user profiles and conversation history
- Educational Content DB: Stores pre-written educational content and asset class information

**External Services:**
- OpenAI API: Provides natural language understanding and generation capabilities

### Technology Stack

**Frontend:**
- React 18+ with TypeScript
- Chart.js or Recharts for visualizations
- Tailwind CSS for styling
- Axios for HTTP requests

**Backend:**
- Node.js 18+ with Express
- TypeScript for type safety
- OpenAI SDK for AI integration
- File-based JSON storage (for prototype simplicity)

**Development:**
- Vite for frontend build tooling
- Jest for testing
- ESLint and Prettier for code quality

## Components and Interfaces

### Frontend Components

#### ChatInterface Component
```typescript
interface ChatInterfaceProps {
  sessionId: string;
  onMessageSent: (message: string) => void;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}
```

Responsibilities:
- Render conversation history
- Handle user text input
- Display typing indicators during AI response generation
- Scroll to latest message automatically

#### FinancialDashboard Component
```typescript
interface FinancialDashboardProps {
  userProfile: UserProfile | null;
}

interface UserProfile {
  income: number;
  expenses: number;
  surplus: number;
  goals: string[];
}
```

Responsibilities:
- Display income, expenses, and surplus in visual format
- Use color coding (green for surplus, red for deficit)
- Update reactively when profile data changes
- Show placeholder state when no profile exists

#### CompoundingVisualizer Component
```typescript
interface CompoundingVisualizerProps {
  initialAmount: number;
  monthlyContribution: number;
  onParametersChange: (params: ProjectionParams) => void;
}

interface ProjectionParams {
  amount: number;
  years: number;
  returnRate: number;
}

interface ProjectionScenario {
  label: string;
  returnRate: number;
  values: number[]; // yearly values
}
```

Responsibilities:
- Render line chart showing investment growth over time
- Display multiple scenarios (conservative, moderate, optimistic)
- Provide sliders for adjusting amount, time horizon, and return rates
- Update chart within 1 second of parameter changes
- Include disclaimer text about educational nature

### Backend Services

#### ConversationEngine
```typescript
interface ConversationEngine {
  processMessage(
    sessionId: string,
    userMessage: string,
    context: ConversationContext
  ): Promise<AssistantResponse>;
  
  applyGuardrails(response: string): string;
  buildSystemPrompt(context: ConversationContext): string;
}

interface ConversationContext {
  userProfile: UserProfile | null;
  mode: 'onboarding' | 'analysis' | 'education';
  conversationHistory: Message[];
}

interface AssistantResponse {
  message: string;
  suggestedActions?: string[];
  modeTransition?: 'onboarding' | 'analysis' | 'education';
}
```

Responsibilities:
- Construct prompts for OpenAI API with system instructions
- Apply mentor personality through system prompt
- Enforce guardrails (no specific advice, no tax/legal guidance)
- Manage conversation context and mode transitions
- Handle API errors gracefully

#### FinancialCalculator
```typescript
interface FinancialCalculator {
  calculateSurplus(income: number, expenses: number): number;
  
  calculateCompoundGrowth(
    principal: number,
    monthlyContribution: number,
    annualRate: number,
    years: number
  ): number[];
  
  generateScenarios(
    principal: number,
    monthlyContribution: number,
    years: number
  ): ProjectionScenario[];
}
```

Responsibilities:
- Calculate surplus allocation (income - expenses)
- Compute compound growth projections using standard formulas
- Generate multiple scenarios with different return rate assumptions
- Validate input parameters (positive numbers, reasonable ranges)

#### SessionManager
```typescript
interface SessionManager {
  createSession(): Promise<string>;
  getSession(sessionId: string): Promise<SessionData | null>;
  updateSession(sessionId: string, data: Partial<SessionData>): Promise<void>;
  deleteSession(sessionId: string): Promise<void>;
}

interface SessionData {
  id: string;
  userProfile: UserProfile | null;
  conversationHistory: Message[];
  mode: 'onboarding' | 'analysis' | 'education';
  createdAt: Date;
  lastAccessedAt: Date;
}
```

Responsibilities:
- Generate unique session IDs
- Persist session data to JSON files
- Retrieve and update session data
- Handle session expiration (30 days)
- Ensure data privacy and isolation between sessions

#### ContentLibrary
```typescript
interface ContentLibrary {
  getAssetClassInfo(assetClass: string): AssetClassInfo | null;
  getEducationalContent(topic: string): EducationalContent | null;
  searchContent(query: string): EducationalContent[];
}

interface AssetClassInfo {
  name: string;
  description: string;
  riskLevel: 'low' | 'medium' | 'high';
  liquidity: 'high' | 'medium' | 'low';
  typicalReturnRange: { min: number; max: number };
  timeHorizon: string;
  advantages: string[];
  disadvantages: string[];
}

interface EducationalContent {
  id: string;
  title: string;
  topic: string;
  difficultyLevel: 'beginner' | 'intermediate';
  content: string;
  relatedTopics: string[];
}
```

Responsibilities:
- Load educational content from JSON files
- Provide structured information about asset classes
- Support content search and retrieval
- Suggest related content based on context

### API Endpoints

```
POST   /api/sessions
  Creates a new session
  Response: { sessionId: string }

GET    /api/sessions/:sessionId
  Retrieves session data
  Response: SessionData

POST   /api/sessions/:sessionId/messages
  Sends a user message and receives AI response
  Body: { message: string }
  Response: { message: string, modeTransition?: string }

PUT    /api/sessions/:sessionId/profile
  Updates user profile
  Body: UserProfile
  Response: { success: boolean }

POST   /api/calculate/projection
  Calculates investment projections
  Body: { principal: number, monthly: number, years: number }
  Response: { scenarios: ProjectionScenario[] }

GET    /api/content/asset-classes
  Retrieves list of asset classes
  Response: { assetClasses: AssetClassInfo[] }

GET    /api/content/educational/:topic
  Retrieves educational content by topic
  Response: EducationalContent
```

## Data Models

### UserProfile
```typescript
interface UserProfile {
  income: number;           // Monthly income in currency units
  expenses: number;         // Monthly expenses in currency units
  surplus: number;          // Calculated: income - expenses
  goals: string[];          // Investment goals (e.g., "retirement", "emergency fund")
  riskTolerance?: 'low' | 'medium' | 'high';
}
```

Validation rules:
- income must be positive number
- expenses must be non-negative number
- surplus is computed, not user-provided
- goals array can be empty but not null

### Message
```typescript
interface Message {
  id: string;               // UUID
  role: 'user' | 'assistant' | 'system';
  content: string;          // Message text
  timestamp: Date;          // When message was created
  metadata?: {
    modeTransition?: string;
    suggestedActions?: string[];
  };
}
```

### SessionData
```typescript
interface SessionData {
  id: string;                                    // UUID
  userProfile: UserProfile | null;               // Null until onboarding complete
  conversationHistory: Message[];                // All messages in session
  mode: 'onboarding' | 'analysis' | 'education'; // Current conversation mode
  createdAt: Date;                               // Session creation timestamp
  lastAccessedAt: Date;                          // Last activity timestamp
  metadata: {
    onboardingComplete: boolean;
    disclaimerShown: boolean;
  };
}
```

### AssetClassInfo
```typescript
interface AssetClassInfo {
  name: string;                                  // e.g., "Mutual Funds"
  description: string;                           // Brief explanation
  riskLevel: 'low' | 'medium' | 'high';
  liquidity: 'high' | 'medium' | 'low';
  typicalReturnRange: {
    min: number;                                 // Percentage
    max: number;                                 // Percentage
  };
  timeHorizon: string;                           // e.g., "3-5 years"
  advantages: string[];
  disadvantages: string[];
  examples?: string[];                           // Specific examples for education
}
```

### ProjectionScenario
```typescript
interface ProjectionScenario {
  label: string;                                 // e.g., "Conservative (5%)"
  returnRate: number;                            // Annual return as decimal (0.05 = 5%)
  values: number[];                              // Projected values for each year
  metadata: {
    assumptions: string;                         // Description of scenario assumptions
    disclaimer: string;                          // Educational disclaimer
  };
}
```

### EducationalContent
```typescript
interface EducationalContent {
  id: string;                                    // UUID
  title: string;
  topic: string;                                 // e.g., "compounding", "diversification"
  difficultyLevel: 'beginner' | 'intermediate';
  content: string;                               // Markdown formatted content
  relatedTopics: string[];                       // IDs of related content
  keywords: string[];                            // For search functionality
  lastUpdated: Date;
}
```

## Data Flow Examples

### Onboarding Flow
```
1. User accesses application
   → Frontend creates new session via POST /api/sessions
   → Backend creates SessionData with mode='onboarding'
   
2. Frontend loads ChatInterface with sessionId
   → ChatInterface displays welcome message from system
   
3. User provides income information
   → POST /api/sessions/:id/messages with user message
   → ConversationEngine processes with onboarding context
   → Validates income as positive number
   → Stores in session, prompts for expenses
   
4. User provides expenses
   → POST /api/sessions/:id/messages
   → ConversationEngine validates expenses
   → FinancialCalculator computes surplus
   → Updates UserProfile in session
   → Transitions mode to 'analysis'
   
5. System analyzes profile
   → If surplus > 0: transition to 'education' mode
   → If surplus <= 0: provide budgeting education
   → Dashboard updates with profile data
```

### Conversation Flow
```
1. User asks: "What's the difference between mutual funds and fixed deposits?"
   → POST /api/sessions/:id/messages
   
2. ConversationEngine processes request
   → Retrieves session context (mode='education', profile exists)
   → Builds system prompt with mentor personality and guardrails
   → Queries ContentLibrary for asset class info
   → Constructs prompt with educational content
   → Calls OpenAI API
   
3. OpenAI returns response
   → ConversationEngine applies guardrails
   → Checks for inappropriate advice language
   → Adds disclaimer if discussing returns
   → Returns formatted response
   
4. Frontend displays response
   → ChatInterface renders message
   → Suggests related topics from ContentLibrary
```

### Visualization Flow
```
1. User adjusts investment amount slider
   → CompoundingVisualizer updates local state
   → Debounced call to POST /api/calculate/projection
   
2. FinancialCalculator generates scenarios
   → Conservative: 5% annual return
   → Moderate: 8% annual return
   → Optimistic: 12% annual return
   → Computes yearly values using compound interest formula
   
3. Response returns to frontend
   → CompoundingVisualizer updates chart data
   → Chart.js re-renders with new values
   → Update completes within 1 second
```


## Correctness Properties

A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.

### Property 1: Income Validation

For any income value provided during onboarding, the system should accept it if and only if it is a positive number (greater than zero).

**Validates: Requirements 1.3**

### Property 2: Expense Validation

For any expense value provided during onboarding, the system should accept it if and only if it is a non-negative number (greater than or equal to zero).

**Validates: Requirements 1.4**

### Property 3: Surplus Calculation

For any user profile with valid income and expense values, the calculated surplus should equal income minus expenses.

**Validates: Requirements 1.6**

### Property 4: Profile Creation After Onboarding

For any onboarding session where all required information (income, expenses, goals) has been collected, a user profile should be created with all fields populated.

**Validates: Requirements 1.2, 1.5**

### Property 5: Mode Transition After Onboarding

For any completed onboarding session, the system should transition from onboarding mode to either analysis mode or education mode (depending on surplus).

**Validates: Requirements 1.7**

### Property 6: Investment Advice Guardrail

For any response generated by the conversation engine, the response should not contain specific investment recommendations (stock picks, specific fund names, or "you should invest in X" statements).

**Validates: Requirements 2.4, 5.4, 12.4**

### Property 7: Tax and Legal Advice Guardrail

For any response generated by the conversation engine, the response should not provide tax planning advice or legal guidance.

**Validates: Requirements 5.5, 12.5**

### Property 8: Guardrail Refusal Response

For any request that triggers guardrails (investment advice, tax advice, legal advice), the system response should include both an explanation of the educational scope and a suggestion to consult a licensed professional.

**Validates: Requirements 5.6, 12.6**

### Property 9: Session Persistence Round Trip

For any session data (including user profile and conversation history), saving the session and then loading it should produce equivalent data with all fields preserved.

**Validates: Requirements 2.6, 9.1, 9.2**

### Property 10: Asset Class Information Completeness

For any asset class in the content library, the asset class information should include all required fields: name, description, risk level, liquidity, typical return range (min and max), time horizon, advantages, and disadvantages.

**Validates: Requirements 3.1, 3.2, 3.3**

### Property 11: Return Ranges Not Single Values

For any asset class in the content library, the typical return information should be represented as a range with minimum and maximum values, not as a single predicted value.

**Validates: Requirements 3.5**

### Property 12: Disclaimer Presence

For any content that discusses investment performance, returns, or projections, the content should include disclaimer text indicating the educational nature of the information.

**Validates: Requirements 3.6, 4.6, 10.6**

### Property 13: Compound Interest Calculation

For any valid investment projection parameters (principal amount, monthly contribution, annual return rate, time period in years), the calculated future value should match the standard compound interest formula: FV = P(1+r)^t + PMT × [((1+r)^t - 1) / r], where r is the periodic rate.

**Validates: Requirements 4.2**

### Property 14: Projection Time Horizon Range

For any projection request, the system should generate projections for any time horizon between 1 and 30 years (inclusive) and reject requests outside this range.

**Validates: Requirements 4.4**

### Property 15: Multiple Projection Scenarios

For any projection request, the system should generate at least three scenarios with different return rate assumptions (conservative, moderate, optimistic).

**Validates: Requirements 4.5**

### Property 16: Analysis Mode Surplus Identification

For any user profile processed in analysis mode, the system should correctly identify the surplus allocation value from the profile data.

**Validates: Requirements 6.2**

### Property 17: Negative Surplus Triggers Budgeting Content

For any user profile with negative surplus (expenses exceed income), the system should provide budgeting educational content before investment topics.

**Validates: Requirements 6.3**

### Property 18: Positive Surplus Triggers Education Mode

For any user profile with positive surplus (income exceeds expenses), the system should transition to education mode.

**Validates: Requirements 6.4**

### Property 19: Analysis Results Persistence

For any analysis performed on a user profile, the analysis results should be stored in the session data and remain accessible throughout the conversation session.

**Validates: Requirements 6.5**

### Property 20: Dashboard Profile Display

For any user profile, the financial dashboard should display all three core values: income, expenses, and surplus allocation.

**Validates: Requirements 7.1**

### Property 21: Dashboard Projection Display

For any session that has projection data available, the financial dashboard should display the projection summaries.

**Validates: Requirements 7.5**

### Property 22: Educational Content Coverage

For any major asset class (Mutual Funds, Fixed Deposits, Stocks, Bonds, Real Estate), educational content should exist in the content library.

**Validates: Requirements 8.1**

### Property 23: Educational Content Retrieval

For any valid topic identifier in the content library, the system should be able to retrieve the corresponding educational content.

**Validates: Requirements 8.3**

### Property 24: Educational Content Structure

For any educational content item in the library, it should include all required fields: id, title, topic, difficulty level, content, and related topics.

**Validates: Requirements 8.4**

### Property 25: Related Content Links

For any educational content item, the related topics field should contain references to other content items that can be retrieved from the library.

**Validates: Requirements 8.5**

### Property 26: Session Retention Period

For any session created within the last 30 days, the session data should be retrievable from storage.

**Validates: Requirements 9.3**

### Property 27: New Session Creation

For any request to create a new session, the system should generate a unique session ID and initialize empty session state (no profile, empty conversation history, onboarding mode).

**Validates: Requirements 9.4**

### Property 28: Conversation History Access

For any session with conversation history, all previous message exchanges should be accessible and retrievable in chronological order.

**Validates: Requirements 9.5**

### Property 29: Asset Class Comparison Structure

For any comparison request involving 2-4 asset classes, the system should return structured comparison data with all requested asset classes included.

**Validates: Requirements 10.1, 10.2**

### Property 30: Comparison Size Limit

For any comparison request, the system should accept requests for 1-4 asset classes and reject requests for more than 4 asset classes.

**Validates: Requirements 10.5**

## Error Handling

### Input Validation Errors

**Invalid Financial Data:**
- Scenario: User provides non-numeric or negative income during onboarding
- Handling: Return validation error with clear message ("Income must be a positive number")
- Recovery: Prompt user to re-enter valid value
- Logging: Log validation failure with sanitized input type

**Invalid Projection Parameters:**
- Scenario: User requests projection with invalid parameters (negative amount, years > 30)
- Handling: Return 400 Bad Request with specific validation error
- Recovery: Frontend displays error and resets to valid default values
- Logging: Log validation failure with parameter details

### External Service Errors

**OpenAI API Failures:**
- Scenario: OpenAI API returns error (rate limit, timeout, service unavailable)
- Handling: Catch exception, return fallback response
- Fallback: "I'm having trouble processing your question right now. Please try again in a moment."
- Recovery: Implement exponential backoff retry (3 attempts)
- Logging: Log API error with request ID and error details
- Monitoring: Alert if error rate exceeds 5% over 5 minutes

**OpenAI API Timeout:**
- Scenario: API call exceeds 10 second timeout
- Handling: Cancel request, return timeout message
- Fallback: "This is taking longer than expected. Please try rephrasing your question."
- Recovery: User can retry with same or different question
- Logging: Log timeout with request details

### Data Persistence Errors

**Session Not Found:**
- Scenario: User requests session that doesn't exist or has expired
- Handling: Return 404 Not Found
- Recovery: Frontend creates new session automatically
- Logging: Log session lookup failure with session ID

**Session Write Failure:**
- Scenario: Unable to write session data to disk (permissions, disk full)
- Handling: Return 500 Internal Server Error
- Recovery: Retry write operation once, then fail gracefully
- Logging: Log write failure with error details and file path
- Monitoring: Alert on any write failures

**Session Read Corruption:**
- Scenario: Session file exists but contains invalid JSON
- Handling: Log corruption, treat as session not found
- Recovery: Create new session for user
- Logging: Log corruption with file path and parse error
- Monitoring: Alert if corruption rate exceeds 0.1%

### Content Library Errors

**Asset Class Not Found:**
- Scenario: User asks about asset class not in content library
- Handling: Return generic educational response
- Fallback: "I don't have detailed information about that specific investment type. Let me explain some common options..."
- Recovery: Suggest related asset classes that are available
- Logging: Log missing content request for future content expansion

**Educational Content Not Found:**
- Scenario: System tries to retrieve content that doesn't exist
- Handling: Return null, handle gracefully in calling code
- Recovery: Use general explanation instead of specific content
- Logging: Log missing content ID

### Conversation Engine Errors

**Guardrail Violation Detection:**
- Scenario: AI response contains inappropriate advice despite system prompt
- Handling: Apply post-processing filters to detect and remove violations
- Recovery: If violations detected, return generic educational response
- Logging: Log guardrail violations for prompt improvement
- Monitoring: Track violation rate to improve system prompts

**Context Window Exceeded:**
- Scenario: Conversation history exceeds OpenAI context window limit
- Handling: Truncate older messages while preserving recent context
- Strategy: Keep system prompt + last 10 messages + current user message
- Recovery: Conversation continues with reduced history
- Logging: Log context truncation events

### Frontend Errors

**Network Request Failure:**
- Scenario: API request fails due to network issues
- Handling: Display user-friendly error message
- Recovery: Provide retry button, implement automatic retry with exponential backoff
- User Message: "Connection issue. Retrying..."

**Chart Rendering Failure:**
- Scenario: Chart library fails to render visualization
- Handling: Catch rendering exception, display error state
- Recovery: Show projection data in table format as fallback
- Logging: Log rendering error with browser and data details

### Rate Limiting

**API Rate Limit Protection:**
- Implementation: Limit to 10 requests per minute per session
- Handling: Return 429 Too Many Requests
- Recovery: Frontend displays cooldown message with retry timer
- User Message: "Please wait a moment before sending another message."

### Security Errors

**Session Hijacking Attempt:**
- Scenario: Request with invalid or tampered session ID format
- Handling: Reject request, return 403 Forbidden
- Recovery: Force creation of new valid session
- Logging: Log suspicious session access attempts
- Monitoring: Alert on patterns of invalid session access

## Testing Strategy

### Overview

The testing strategy employs a dual approach combining unit tests for specific scenarios and property-based tests for comprehensive coverage. Unit tests verify concrete examples, edge cases, and integration points, while property-based tests validate universal properties across randomized inputs.

### Property-Based Testing

**Framework:** fast-check (JavaScript/TypeScript property-based testing library)

**Configuration:**
- Minimum 100 iterations per property test
- Each test tagged with reference to design document property
- Tag format: `Feature: ai-conversational-wealth-coach, Property {number}: {property_text}`

**Property Test Coverage:**

Each correctness property defined in this document must be implemented as a property-based test:

1. **Input Validation Properties (1-2):** Generate random numeric and non-numeric values, test acceptance/rejection
2. **Calculation Properties (3, 13):** Generate random valid inputs, verify mathematical correctness
3. **State Transition Properties (4-5, 17-18):** Generate random session states, verify mode transitions
4. **Guardrail Properties (6-8):** Generate various request types, verify refusal patterns
5. **Data Persistence Properties (9, 19, 26-28):** Generate random session data, verify round-trip preservation
6. **Content Structure Properties (10-11, 22-25):** Generate content items, verify required fields present
7. **Projection Properties (14-15):** Generate random projection parameters, verify output structure
8. **Comparison Properties (29-30):** Generate random asset class combinations, verify comparison structure

**Example Property Test:**
```typescript
// Feature: ai-conversational-wealth-coach, Property 3: Surplus Calculation
describe('Property 3: Surplus Calculation', () => {
  it('should calculate surplus as income minus expenses for any valid inputs', () => {
    fc.assert(
      fc.property(
        fc.float({ min: 0.01, max: 1000000 }), // income
        fc.float({ min: 0, max: 1000000 }),    // expenses
        (income, expenses) => {
          const profile = createUserProfile(income, expenses);
          expect(profile.surplus).toBeCloseTo(income - expenses, 2);
        }
      ),
      { numRuns: 100 }
    );
  });
});
```

### Unit Testing

**Framework:** Jest with React Testing Library

**Focus Areas:**

**Component Tests:**
- ChatInterface: Message rendering, input handling, scroll behavior
- FinancialDashboard: Profile display, color coding, null state handling
- CompoundingVisualizer: Chart rendering, parameter updates, scenario display

**Service Tests:**
- ConversationEngine: System prompt construction, mode transitions, specific guardrail examples
- FinancialCalculator: Edge cases (zero values, very large numbers, boundary years)
- SessionManager: Session creation, expiration logic, concurrent access
- ContentLibrary: Content search, missing content handling

**API Tests:**
- Endpoint response formats
- Error status codes
- Request validation
- Authentication (if implemented)

**Integration Tests:**
- Complete onboarding flow from start to profile creation
- Multi-turn conversation maintaining context
- Projection calculation and visualization pipeline
- Session persistence across server restart

**Example Unit Test:**
```typescript
describe('ConversationEngine Guardrails', () => {
  it('should refuse specific stock pick requests', async () => {
    const engine = new ConversationEngine();
    const response = await engine.processMessage(
      'session-123',
      'Should I buy Apple stock?',
      mockContext
    );
    
    expect(response.message).toContain('educational');
    expect(response.message).toContain('licensed advisor');
    expect(response.message).not.toContain('yes');
    expect(response.message).not.toContain('buy');
  });
});
```

### Test Data Management

**Fixtures:**
- Sample user profiles (various income/expense combinations)
- Sample conversation histories (different lengths and contexts)
- Sample asset class data (all major types)
- Sample educational content (various topics and difficulty levels)

**Generators (for property tests):**
- Valid user profiles with random income/expenses
- Random conversation messages
- Random projection parameters within valid ranges
- Random asset class combinations

### Coverage Goals

- Line coverage: 80% minimum
- Branch coverage: 75% minimum
- Property test coverage: 100% of defined correctness properties
- Critical paths: 100% (onboarding, guardrails, calculations)

### Continuous Integration

- Run all tests on every pull request
- Run property tests with 1000 iterations nightly
- Block merges if tests fail or coverage drops
- Generate coverage reports and track trends

### Manual Testing

**Prototype Validation:**
- Stakeholder demo scenarios
- Cross-browser compatibility (Chrome, Firefox, Safari, Edge)
- Mobile responsiveness (iOS Safari, Chrome Android)
- Accessibility audit (keyboard navigation, screen reader compatibility)

**User Acceptance Testing:**
- First-time investor persona testing
- Conversation flow naturalness
- Visualization clarity and usefulness
- Error message clarity

### Performance Testing

**Load Testing:**
- Concurrent user sessions: 100 simultaneous users
- API response times: 95th percentile < 3 seconds
- Projection calculation: < 100ms for any valid input

**Stress Testing:**
- Long conversation histories (50+ messages)
- Large projection time horizons (30 years)
- Rapid parameter adjustments in visualizer

