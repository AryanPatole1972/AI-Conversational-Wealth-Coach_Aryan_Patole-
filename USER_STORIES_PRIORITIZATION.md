# User Stories & Prioritization
## AI Conversational Wealth Coach

---

## Table of Contents
1. [User Stories](#user-stories)
2. [Prioritization Framework](#prioritization-framework)
3. [MVP Features](#mvp-features)
4. [Backlog Features](#backlog-features)
5. [Prioritization Rationale](#prioritization-rationale)

---

## User Stories

### Epic 1: User Onboarding

#### US-1.1: Initial Welcome and Disclaimer
**As a** first-time investor  
**I want to** see a clear disclaimer when I first access the app  
**So that** I understand this is an educational tool, not financial advice

**Acceptance Criteria:**
- [ ] Disclaimer modal appears on first app access
- [ ] Modal explains educational scope clearly
- [ ] Modal lists what the tool does NOT provide (advice, tax guidance, legal guidance)
- [ ] User must click "I Understand" to proceed
- [ ] Disclaimer acceptance is stored in localStorage
- [ ] Disclaimer does not reappear on subsequent visits

**Priority:** MUST HAVE (MVP)  
**Story Points:** 3

---

#### US-1.2: Conversational Income Collection
**As a** first-time investor  
**I want to** provide my monthly income through natural conversation  
**So that** the experience feels friendly and not like filling out a form

**Acceptance Criteria:**
- [ ] AI asks about monthly income in conversational tone
- [ ] System accepts numeric input in various formats ($5000, 5000, 5,000)
- [ ] System validates income is a positive number (> 0)
- [ ] System provides friendly error message if invalid input
- [ ] System stores validated income in user profile
- [ ] AI acknowledges receipt and moves to next question

**Priority:** MUST HAVE (MVP)  
**Story Points:** 5

---

#### US-1.3: Conversational Expense Collection
**As a** first-time investor  
**I want to** provide my monthly expenses through natural conversation  
**So that** I can easily share my financial situation

**Acceptance Criteria:**
- [ ] AI asks about monthly expenses after income is collected
- [ ] System accepts numeric input in various formats
- [ ] System validates expenses are non-negative (≥ 0)
- [ ] System calculates surplus automatically (income - expenses)
- [ ] System stores validated expenses in user profile
- [ ] AI acknowledges and shows calculated surplus

**Priority:** MUST HAVE (MVP)  
**Story Points:** 5

---

#### US-1.4: Investment Goals Collection
**As a** first-time investor  
**I want to** share my investment goals  
**So that** the AI can provide relevant educational content

**Acceptance Criteria:**
- [ ] AI asks about investment goals after financial data collected
- [ ] System accepts free-text goal descriptions
- [ ] System stores goals in user profile
- [ ] AI acknowledges goals and transitions to next mode
- [ ] Goals are displayed in financial dashboard

**Priority:** SHOULD HAVE (MVP)  
**Story Points:** 3

---

### Epic 2: Financial Analysis

#### US-2.1: Surplus Calculation
**As a** first-time investor  
**I want to** see how much money I have available for investment  
**So that** I understand my financial capacity

**Acceptance Criteria:**
- [ ] System calculates surplus as income minus expenses
- [ ] Calculation is accurate to 2 decimal places
- [ ] Surplus is displayed in financial dashboard
- [ ] Positive surplus shown in green
- [ ] Negative surplus shown in red with warning
- [ ] Zero surplus shown with neutral color

**Priority:** MUST HAVE (MVP)  
**Story Points:** 3

---

#### US-2.2: Mode Transition Logic
**As a** first-time investor  
**I want to** receive appropriate guidance based on my financial situation  
**So that** I get relevant information for my circumstances

**Acceptance Criteria:**
- [ ] If surplus > 0: AI transitions to education mode
- [ ] If surplus ≤ 0: AI provides budgeting guidance
- [ ] Mode transition is seamless and explained to user
- [ ] AI congratulates user on positive surplus
- [ ] AI is supportive and non-judgmental about negative surplus
- [ ] Mode is persisted in session data

**Priority:** MUST HAVE (MVP)  
**Story Points:** 5

---

### Epic 3: Conversational Education

#### US-3.1: Ask Questions About Investments
**As a** first-time investor  
**I want to** ask questions about different investment options in natural language  
**So that** I can learn without feeling intimidated

**Acceptance Criteria:**
- [ ] System accepts free-text questions
- [ ] AI responds within 3 seconds
- [ ] AI uses simple, jargon-free language
- [ ] AI provides relevant educational content
- [ ] AI maintains conversation context
- [ ] AI offers to explain further if needed

**Priority:** MUST HAVE (MVP)  
**Story Points:** 8

---

#### US-3.2: Learn About Asset Classes
**As a** first-time investor  
**I want to** understand different investment types (mutual funds, fixed deposits, stocks, etc.)  