# Implementation Plan: AI Conversational Wealth Coach

## Overview

This implementation plan breaks down the AI Conversational Wealth Coach into discrete coding tasks. The system will be built as a full-stack TypeScript application with a React frontend and Node.js/Express backend, integrating with OpenAI's API for conversational capabilities.

The implementation follows an incremental approach: establish core infrastructure first, then build backend services, followed by frontend components, and finally integrate everything with testing and documentation. Each task builds on previous work to ensure no orphaned code.

## Tasks

- [x] 1. Project setup and infrastructure
  - [x] 1.1 Initialize project structure and dependencies
    - Create monorepo structure with frontend and backend directories
    - Initialize package.json for both frontend (React + TypeScript + Vite) and backend (Node.js + Express + TypeScript)
    - Install core dependencies: React 18+, Express, TypeScript, OpenAI SDK, Chart.js/Recharts, Tailwind CSS, Axios
    - Install dev dependencies: Jest, React Testing Library, fast-check, ESLint, Prettier
    - Configure TypeScript (tsconfig.json) for both frontend and backend with strict mode
    - Configure Vite for frontend build tooling
    - Create .env.example files for environment variables (OPENAI_API_KEY, PORT)
    - Set up .gitignore to exclude node_modules, .env, and build artifacts
    - _Requirements: 11.1, 15.6_

  - [ ]* 1.2 Set up testing infrastructure
    - Configure Jest for both frontend and backend with TypeScript support
    - Configure React Testing Library for component tests
    - Install and configure fast-check for property-based testing
    - Create test utilities and mock factories
    - Set up test coverage reporting (80% line coverage, 75% branch coverage)
    - _Requirements: All acceptance criteria validation_

  - [x] 1.3 Create shared TypeScript interfaces and types
    - Define UserProfile, Message, SessionData, ConversationContext interfaces
    - Define AssetClassInfo, EducationalContent, ProjectionScenario interfaces
    - Define API request/response types for all endpoints
    - Define ConversationMode type ('onboarding' | 'analysis' | 'education')
    - Export all types from shared types file for use across frontend and backend
    - _Requirements: 1.5, 1.6, 2.6, 3.1, 4.2, 6.1, 7.1, 8.1, 9.1_

- [x] 2. Backend core services implementation
  - [x] 2.1 Implement SessionManager service
    - Create SessionManager class with methods: createSession, getSession, updateSession, deleteSession
    - Implement unique session ID generation using UUID
    - Implement file-based JSON storage for session persistence (data/sessions directory)
    - Implement session expiration logic (30 days retention)
    - Add error handling for file read/write operations
    - Ensure session data isolation and privacy
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6_

  - [ ]* 2.2 Write property tests for SessionManager
    - **Property 9: Session Persistence Round Trip**
    - **Validates: Requirements 9.1, 9.2**
    - **Property 26: Session Retention Period**
    - **Validates: Requirements 9.3**
    - **Property 27: New Session Creation**
    - **Validates: Requirements 9.4**
    - **Property 28: Conversation History Access**
    - **Validates: Requirements 9.5**

  - [x] 2.3 Implement FinancialCalculator service
    - Create FinancialCalculator class with calculateSurplus method
    - Implement calculateCompoundGrowth method using standard compound interest formula: FV = P(1+r)^t + PMT × [((1+r)^t - 1) / r]
    - Implement generateScenarios method with three scenarios: conservative (5%), moderate (8%), optimistic (12%)
    - Add input validation for positive principal, non-negative monthly contribution, valid year range (1-30)
    - Return yearly projection values as arrays
    - _Requirements: 1.6, 4.2, 4.4, 4.5, 6.2_

  - [ ]* 2.4 Write property tests for FinancialCalculator
    - **Property 3: Surplus Calculation**
    - **Validates: Requirements 1.6**
    - **Property 13: Compound Interest Calculation**
    - **Validates: Requirements 4.2**
    - **Property 14: Projection Time Horizon Range**
    - **Validates: Requirements 4.4**
    - **Property 15: Multiple Projection Scenarios**
    - **Validates: Requirements 4.5**

  - [x] 2.5 Implement ContentLibrary service
    - Create ContentLibrary class with methods: getAssetClassInfo, getEducationalContent, searchContent
    - Create JSON data files for asset classes (Mutual Funds, Fixed Deposits, Stocks, Bonds, Real Estate)
    - Create JSON data files for educational content (compounding, diversification, risk, liquidity)
    - Implement content loading from JSON files on service initialization
    - Implement search functionality using keyword matching
    - Implement related content suggestion logic
    - _Requirements: 3.1, 3.2, 3.3, 3.5, 8.1, 8.2, 8.3, 8.4, 8.5, 8.6_

  - [ ]* 2.6 Write property tests for ContentLibrary
    - **Property 10: Asset Class Information Completeness**
    - **Validates: Requirements 3.1, 3.2, 3.3**
    - **Property 11: Return Ranges Not Single Values**
    - **Validates: Requirements 3.5**
    - **Property 22: Educational Content Coverage**
    - **Validates: Requirements 8.1**
    - **Property 23: Educational Content Retrieval**
    - **Validates: Requirements 8.3**
    - **Property 24: Educational Content Structure**
    - **Validates: Requirements 8.4**
    - **Property 25: Related Content Links**
    - **Validates: Requirements 8.5**

- [x] 3. Conversation engine and AI integration
  - [x] 3.1 Implement ConversationEngine service
    - Create ConversationEngine class with processMessage method
    - Implement buildSystemPrompt method that constructs prompts with mentor personality and guardrails
    - Define system prompt template emphasizing educational focus, no specific advice, no tax/legal guidance
    - Integrate OpenAI SDK for API calls (use GPT-4 or GPT-3.5-turbo)
    - Implement conversation context management (include last 10 messages + user profile)
    - Implement mode transition logic (onboarding → analysis → education)
    - Add error handling for OpenAI API failures with fallback responses
    - Implement timeout handling (10 second limit)
    - Implement exponential backoff retry logic (3 attempts)
    - _Requirements: 2.1, 2.2, 2.3, 2.5, 2.6, 5.1, 5.2, 5.3, 6.1_

  - [x] 3.2 Implement guardrail enforcement
    - Create applyGuardrails method for post-processing AI responses
    - Implement detection patterns for specific investment recommendations (stock picks, fund names, "you should invest")
    - Implement detection patterns for tax advice and legal guidance
    - Implement refusal response generation with educational scope explanation and licensed advisor suggestion
    - Add logging for guardrail violations to improve system prompts
    - _Requirements: 2.4, 5.4, 5.5, 5.6, 12.4, 12.5, 12.6_

  - [ ]* 3.3 Write property tests for ConversationEngine guardrails
    - **Property 6: Investment Advice Guardrail**
    - **Validates: Requirements 2.4, 5.4, 12.4**
    - **Property 7: Tax and Legal Advice Guardrail**
    - **Validates: Requirements 5.5, 12.5**
    - **Property 8: Guardrail Refusal Response**
    - **Validates: Requirements 5.6, 12.6**

  - [ ]* 3.4 Write unit tests for ConversationEngine
    - Test system prompt construction with different contexts
    - Test mode transition logic (onboarding → analysis → education)
    - Test specific guardrail examples (stock picks, tax questions)
    - Test OpenAI API error handling and fallback responses
    - Test context window truncation for long conversations
    - _Requirements: 2.1, 2.2, 2.3, 2.5, 2.6_

- [x] 4. Backend API endpoints
  - [x] 4.1 Implement session management endpoints
    - Create POST /api/sessions endpoint (creates new session, returns sessionId)
    - Create GET /api/sessions/:sessionId endpoint (retrieves session data)
    - Create PUT /api/sessions/:sessionId/profile endpoint (updates user profile)
    - Add request validation middleware
    - Add error handling for session not found (404), write failures (500)
    - Implement rate limiting (10 requests per minute per session)
    - _Requirements: 9.1, 9.2, 9.4_

  - [x] 4.2 Implement conversation endpoint
    - Create POST /api/sessions/:sessionId/messages endpoint
    - Accept user message in request body
    - Retrieve session context from SessionManager
    - Call ConversationEngine.processMessage with session context
    - Handle onboarding data collection and validation (income, expenses)
    - Update session with new messages and mode transitions
    - Return AI response and optional mode transition indicator
    - Add error handling for invalid session, API failures
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.7, 2.1, 2.2, 2.3, 2.4, 2.5, 2.6_

  - [ ]* 4.3 Write property tests for onboarding validation
    - **Property 1: Income Validation**
    - **Validates: Requirements 1.3**
    - **Property 2: Expense Validation**
    - **Validates: Requirements 1.4**
    - **Property 4: Profile Creation After Onboarding**
    - **Validates: Requirements 1.2, 1.5**
    - **Property 5: Mode Transition After Onboarding**
    - **Validates: Requirements 1.7**

  - [x] 4.4 Implement calculation and content endpoints
    - Create POST /api/calculate/projection endpoint (accepts principal, monthly, years; returns scenarios)
    - Create GET /api/content/asset-classes endpoint (returns list of all asset classes)
    - Create GET /api/content/educational/:topic endpoint (returns educational content by topic)
    - Add input validation for projection parameters
    - Add error handling for invalid parameters (400), missing content (404)
    - _Requirements: 3.1, 4.2, 4.4, 4.5, 8.3_

  - [ ]* 4.5 Write integration tests for API endpoints
    - Test complete onboarding flow from session creation to profile creation
    - Test multi-turn conversation maintaining context
    - Test projection calculation pipeline
    - Test session persistence across simulated server restart
    - Test error responses and status codes
    - _Requirements: 1.1-1.7, 2.1-2.6, 4.2, 9.1-9.5_

- [x] 5. Checkpoint - Backend services complete
  - Ensure all backend tests pass, ask the user if questions arise.

- [x] 6. Frontend core components
  - [x] 6.1 Implement ChatInterface component
    - Create ChatInterface React component with TypeScript
    - Implement message list rendering with role-based styling (user vs assistant)
    - Implement text input field with send button
    - Implement auto-scroll to latest message on new message
    - Add typing indicator during AI response generation
    - Implement message submission via Enter key and button click
    - Connect to POST /api/sessions/:sessionId/messages endpoint using Axios
    - Handle loading states and error messages
    - Style with Tailwind CSS for responsive design
    - _Requirements: 2.1, 2.2, 2.6, 11.1, 11.4_

  - [ ]* 6.2 Write unit tests for ChatInterface
    - Test message rendering with different roles
    - Test input handling and submission
    - Test scroll behavior on new messages
    - Test loading and error states
    - Test keyboard navigation (Enter to send)
    - _Requirements: 2.1, 11.6_

  - [x] 6.3 Implement FinancialDashboard component
    - Create FinancialDashboard React component with TypeScript
    - Display income, expenses, and surplus in card layout
    - Implement color coding (green for positive surplus, red for negative)
    - Add visual indicators (progress bars or simple charts)
    - Handle null/undefined profile state with placeholder message
    - Update reactively when profile prop changes
    - Style with Tailwind CSS for responsive layout
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.6, 11.2_

  - [ ]* 6.4 Write unit tests for FinancialDashboard
    - Test profile display with various income/expense combinations
    - Test color coding for positive and negative surplus
    - Test null state handling
    - Test responsive layout on different screen sizes
    - _Requirements: 7.1, 7.2, 7.3, 7.4_

  - [x] 6.5 Implement CompoundingVisualizer component
    - Create CompoundingVisualizer React component with TypeScript
    - Integrate Chart.js or Recharts for line chart rendering
    - Implement sliders for adjusting amount, years (1-30), and return rate
    - Display multiple scenario lines (conservative, moderate, optimistic) on same chart
    - Implement debounced API calls to POST /api/calculate/projection (update within 1 second)
    - Add disclaimer text about educational nature of projections
    - Add labels for axes and scenario legends
    - Style with Tailwind CSS for responsive design
    - Ensure chart is readable on screens as small as 320px wide
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 11.3_

  - [ ]* 6.6 Write unit tests for CompoundingVisualizer
    - Test chart rendering with sample projection data
    - Test parameter adjustment and debounced updates
    - Test scenario display (multiple lines)
    - Test disclaimer text presence
    - Test responsive behavior on small screens
    - _Requirements: 4.1, 4.3, 4.4, 4.5, 4.6_

- [x] 7. Frontend application integration
  - [x] 7.1 Implement main App component and routing
    - Create App.tsx as main application component
    - Implement session initialization on app load (POST /api/sessions)
    - Store sessionId in React state or context
    - Create layout with ChatInterface, FinancialDashboard, and CompoundingVisualizer
    - Implement responsive layout (stack vertically on mobile, side-by-side on desktop)
    - Add disclaimer notice modal on first access
    - Implement session restoration for returning users (store sessionId in localStorage)
    - _Requirements: 1.1, 9.2, 11.1, 11.2, 12.1, 12.2, 12.3_

  - [x] 7.2 Implement state management and data flow
    - Create React context or state management for session data
    - Implement profile state updates from conversation responses
    - Implement projection state updates from visualizer interactions
    - Connect FinancialDashboard to profile state
    - Connect CompoundingVisualizer to projection state
    - Ensure dashboard updates within 1 second of profile changes
    - _Requirements: 7.3, 7.5, 9.1, 9.2_

  - [x] 7.3 Implement error handling and loading states
    - Add global error boundary for React component errors
    - Implement network error handling with retry functionality
    - Add loading spinners for API calls
    - Implement fallback UI for chart rendering failures (table format)
    - Display user-friendly error messages
    - _Requirements: 2.1, 11.5_

  - [ ]* 7.4 Write integration tests for frontend
    - Test complete user flow from session creation to conversation
    - Test profile updates reflecting in dashboard
    - Test visualizer parameter changes triggering calculations
    - Test error handling and retry logic
    - Test responsive layout on different screen sizes
    - _Requirements: 1.1-1.7, 7.1-7.6, 11.1-11.6_

- [x] 8. Educational content creation
  - [x] 8.1 Create asset class content files
    - Create JSON file for Mutual Funds (description, risk: medium, liquidity: high, returns: 8-12%, advantages, disadvantages)
    - Create JSON file for Fixed Deposits (description, risk: low, liquidity: low, returns: 5-7%, advantages, disadvantages)
    - Create JSON file for Stocks (description, risk: high, liquidity: high, returns: 10-15%, advantages, disadvantages)
    - Create JSON file for Bonds (description, risk: low-medium, liquidity: medium, returns: 4-8%, advantages, disadvantages)
    - Create JSON file for Real Estate (description, risk: medium, liquidity: low, returns: 6-10%, advantages, disadvantages)
    - Ensure all files include required fields and return ranges (not single values)
    - _Requirements: 3.1, 3.2, 3.3, 3.5, 8.1_

  - [x] 8.2 Create educational topic content files
    - Create content for "Compounding" topic (beginner level, explanation with examples)
    - Create content for "Diversification" topic (beginner level, explanation with examples)
    - Create content for "Risk and Return" topic (beginner level, explanation with examples)
    - Create content for "Liquidity" topic (beginner level, explanation with examples)
    - Create content for "Time Horizon" topic (intermediate level, explanation with examples)
    - Link related topics in each content file
    - _Requirements: 8.1, 8.2, 8.4, 8.5, 8.6_

  - [ ]* 8.3 Write property tests for content structure
    - **Property 29: Asset Class Comparison Structure**
    - **Validates: Requirements 10.1, 10.2**
    - **Property 30: Comparison Size Limit**
    - **Validates: Requirements 10.5**

- [-] 9. Analysis mode and comparative features
  - [x] 9.1 Implement analysis mode logic in ConversationEngine
    - Add analysis mode processing in ConversationEngine
    - Implement surplus identification from user profile
    - Implement negative surplus detection and budgeting content routing
    - Implement positive surplus detection and education mode transition
    - Store analysis results in session data
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

  - [ ]* 9.2 Write property tests for analysis mode
    - **Property 16: Analysis Mode Surplus Identification**
    - **Validates: Requirements 6.2**
    - **Property 17: Negative Surplus Triggers Budgeting Content**
    - **Validates: Requirements 6.3**
    - **Property 18: Positive Surplus Triggers Education Mode**
    - **Validates: Requirements 6.4**
    - **Property 19: Analysis Results Persistence**
    - **Validates: Requirements 6.5**

  - [x] 9.3 Implement asset class comparison functionality
    - Add comparison logic to ConversationEngine for handling comparison requests
    - Implement side-by-side comparison formatting (table or comparison cards)
    - Support comparison of 2-4 asset classes simultaneously
    - Include risk level, liquidity, return ranges, time horizon, advantages, disadvantages
    - Add explanations for suitability based on different goals
    - Include disclaimers in comparison responses
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.6_

  - [ ] 9.4 Implement comparison UI component (optional enhancement)
    - Create ComparisonTable component for visual side-by-side display
    - Display comparison data in structured table format
    - Use color coding for risk levels
    - Add visual indicators for liquidity and time horizon
    - Integrate with ChatInterface to display comparison results
    - _Requirements: 10.4_

- [x] 10. Disclaimer and compliance features
  - [x] 10.1 Implement disclaimer system
    - Create disclaimer text content for initial app access
    - Implement disclaimer modal component with accept button
    - Store disclaimer acceptance in session metadata
    - Add disclaimer text to projection visualizations
    - Add disclaimer text to asset class return discussions
    - Ensure ConversationEngine includes disclaimers when discussing performance
    - _Requirements: 3.6, 4.6, 10.6, 12.1, 12.2, 12.3_

  - [ ]* 10.2 Write property tests for disclaimer presence
    - **Property 12: Disclaimer Presence**
    - **Validates: Requirements 3.6, 4.6, 10.6**

  - [ ]* 10.3 Write unit tests for compliance guardrails
    - Test refusal of specific investment recommendations
    - Test refusal of tax planning advice
    - Test refusal of legal guidance
    - Test refusal responses include educational scope explanation
    - Test refusal responses suggest licensed advisor consultation
    - _Requirements: 12.4, 12.5, 12.6_

- [x] 11. Dashboard projection display
  - [x] 11.1 Add projection summary to FinancialDashboard
    - Extend FinancialDashboard to accept projection data prop
    - Display projection summary cards when projection data available
    - Show projected values for 5, 10, and 20 year horizons
    - Add visual indicators (mini charts or sparklines)
    - Handle null projection state gracefully
    - _Requirements: 7.5_

  - [ ]* 11.2 Write property tests for dashboard display
    - **Property 20: Dashboard Profile Display**
    - **Validates: Requirements 7.1**
    - **Property 21: Dashboard Projection Display**
    - **Validates: Requirements 7.5**

- [x] 12. Checkpoint - Frontend and integration complete
  - Ensure all frontend tests pass, ask the user if questions arise.

- [x] 13. Documentation generation
  - [x] 13.1 Create Product Requirement Document (PRD)
    - Write detailed First_Time_Investor persona (demographics, pain points, goals)
    - Document Analysis_Mode to Education_Mode transition logic
    - Define Mentor_Personality characteristics and behavioral guardrails
    - Explain differentiation between educational content and financial advice
    - Include use case scenarios for key user flows (onboarding, asking questions, viewing projections)
    - Format as professional PDF document
    - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5, 13.6_

  - [x] 13.2 Create user stories and prioritization document
    - Write detailed user stories in "As a [User], I want to [Action], so that [Value]" format
    - Include specific acceptance criteria for each user story
    - Apply MoSCoW or RICE prioritization framework
    - Clearly distinguish MVP features from backlog items
    - Include rationale for prioritization decisions
    - Format as part of PRD or separate document
    - _Requirements: 14.1, 14.2, 14.3, 14.4, 14.5, 14.6_

- [x] 14. Deployment and hosting setup
  - [x] 14.1 Configure production build
    - Create production build scripts for frontend (Vite build)
    - Create production build scripts for backend (TypeScript compilation)
    - Configure environment variables for production
    - Set up OPENAI_API_KEY management (environment variable or secrets manager)
    - Optimize frontend bundle size and enable code splitting
    - _Requirements: 11.5, 15.6_

  - [x] 14.2 Deploy prototype to hosting platform
    - Choose hosting platform (Vercel, Netlify, Railway, or similar)
    - Deploy frontend as static site or SPA
    - Deploy backend as serverless functions or container
    - Configure CORS for frontend-backend communication
    - Set up HTTPS for secure communication
    - Ensure prototype is accessible via public URL without authentication
    - _Requirements: 15.6, 16.6, 17.6_

  - [x] 14.3 Configure monitoring and logging
    - Set up error logging for backend (console logs or logging service)
    - Set up API monitoring for OpenAI API failures
    - Configure alerts for high error rates (>5% over 5 minutes)
    - Set up session write failure alerts
    - Monitor API response times (95th percentile < 3 seconds)
    - _Requirements: 2.1, 11.5_

- [ ] 15. Final testing and validation
  - [ ]* 15.1 Run comprehensive property-based tests
    - Execute all 30 property tests with 1000 iterations each
    - Verify all properties pass consistently
    - Document any edge cases discovered
    - Fix any failures and re-run tests
    - _Requirements: All acceptance criteria_

  - [ ]* 15.2 Perform cross-browser and device testing
    - Test on Chrome, Firefox, Safari, Edge (desktop)
    - Test on iOS Safari and Chrome Android (mobile)
    - Verify responsive layout on screens 320px to 1920px wide
    - Test keyboard navigation and accessibility
    - Verify chart rendering on all platforms
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.6_

  - [ ]* 15.3 Conduct stakeholder demo validation
    - Demonstrate complete onboarding flow (Requirement 15)
    - Demonstrate conversational capability with 10+ question variations (Requirement 16)
    - Demonstrate dynamic visualization with real-time updates (Requirement 17)
    - Verify mentor personality and guardrails in action
    - Collect feedback and document any issues
    - _Requirements: 15.1-15.6, 16.1-16.6, 17.1-17.6_

  - [ ]* 15.4 Perform load and performance testing
    - Test 100 concurrent user sessions
    - Verify API response times (95th percentile < 3 seconds)
    - Verify projection calculation times (< 100ms)
    - Test long conversation histories (50+ messages)
    - Test rapid visualizer parameter adjustments
    - _Requirements: 2.1, 11.5_

- [x] 16. Final checkpoint - Production ready
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP delivery
- Each task references specific requirements for traceability
- The implementation uses TypeScript throughout as specified in the design document
- Property tests validate universal correctness properties across randomized inputs
- Unit tests validate specific examples, edge cases, and integration points
- Checkpoints ensure incremental validation at major milestones
- All code should be production-ready with proper error handling and logging
- The prototype should be fully functional and accessible via hosted URL for stakeholder demos
