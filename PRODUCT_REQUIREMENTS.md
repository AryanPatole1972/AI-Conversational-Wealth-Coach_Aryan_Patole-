# Product Requirement Document (PRD)
## AI Conversational Wealth Coach

---

## Executive Summary

The AI Conversational Wealth Coach is an educational web application designed to help first-time investors understand financial concepts through natural, mentor-led conversations. By replacing confusing dashboards with a simple chat interface, the product bridges the gap between complex financial data and intuitive understanding.

**Target Launch:** MVP Prototype  
**Platform:** Web Application (Desktop & Mobile Responsive)  
**Core Technology:** React Frontend + Node.js Backend + OpenAI GPT-3.5

---

## 1. Target Persona: The First-Time Investor

### Demographics
- **Age:** 22-35 years old
- **Income:** Entry to mid-level professionals ($30K-$80K annually)
- **Education:** College graduates or working professionals
- **Tech Savviness:** Comfortable with apps and digital tools
- **Financial Literacy:** Basic understanding of saving, limited investment knowledge

### Pain Points

1. **Information Overload**
   - Traditional financial dashboards are overwhelming with charts, graphs, and jargon
   - Too many options without clear guidance on where to start
   - Conflicting advice from multiple sources creates confusion

2. **Fear of Making Mistakes**
   - Worried about losing money due to lack of knowledge
   - Unsure which investments are suitable for their situation
   - Afraid to ask "stupid questions" to financial advisors

3. **Lack of Personalized Guidance**
   - Generic financial advice doesn't account for individual circumstances
   - Can't afford expensive financial advisors
   - Don't know where to find trustworthy, unbiased information

4. **Complexity Barrier**
   - Financial jargon (P/E ratios, NAV, liquidity) is intimidating
   - Don't understand how different investments actually work
   - Unclear about the relationship between risk and return

5. **Decision Paralysis**
   - Too many choices lead to inaction
   - Don't know how to compare different investment options
   - Unsure about time horizons and when to invest

### Goals & Motivations

- **Primary Goal:** Learn about investing in a non-intimidating way
- **Secondary Goals:**
  - Understand where their "extra money" could go
  - Make informed decisions about financial future
  - Build confidence in financial literacy
  - Start investing journey with small, manageable steps

### Behavioral Characteristics

- Prefers asking a friend for advice over reading lengthy articles
- Learns best through conversation and examples
- Values simplicity and clarity over technical precision
- Wants to understand "why" before "how"
- Appreciates visual representations of abstract concepts

---

## 2. Feature Logic: Analysis to Education Mode Transition

### System Modes Overview

The AI Wealth Coach operates in three distinct modes, each serving a specific purpose in the user journey:

```
┌─────────────┐     ┌──────────────┐     ┌───────────────┐
│ ONBOARDING  │ --> │   ANALYSIS   │ --> │   EDUCATION   │
│    MODE     │     │     MODE     │     │     MODE      │
└─────────────┘     └──────────────┘     └───────────────┘
```

### Mode 1: Onboarding

**Purpose:** Collect user's financial information through friendly conversation

**Behavior:**
- AI asks about monthly income
- AI asks about monthly expenses
- AI asks about investment goals
- Validates inputs (income > 0, expenses ≥ 0)
- Creates user profile upon completion

**Transition Trigger:** All required information collected → Move to Analysis Mode

**Example Conversation:**
```
AI: "Hello! I'm your AI Wealth Coach. Let's start by understanding your 
     financial situation. What is your monthly income?"
User: "I make $5000 per month"
AI: "Great! And what are your monthly expenses?"
User: "About $3500"
AI: "Perfect! That means you have $1500 available each month. What are 
     your investment goals?"
```

### Mode 2: Analysis

**Purpose:** Process user's financial data and determine next steps

**Logic Flow:**

```python
if surplus > 0:
    # User has money available to invest
    congratulate_user()
    introduce_investment_concepts()
    transition_to_education_mode()
    
elif surplus == 0:
    # User breaks even
    explain_importance_of_surplus()
    provide_budgeting_tips()
    stay_in_analysis_mode()
    
else:  # surplus < 0
    # User's expenses exceed income
    provide_budgeting_education()
    explain_investment_prerequisites()
    stay_in_analysis_mode()
```

**Transition Trigger:** 
- **Positive Surplus** → Move to Education Mode
- **Zero/Negative Surplus** → Stay in Analysis Mode, provide budgeting guidance

**Example Scenarios:**

**Scenario A: Positive Surplus ($1500)**
```
AI: "Excellent! You have $1500 available each month after expenses. 
     This is a great position to start learning about investments. 
     Would you like to learn about different investment options?"
→ Transitions to Education Mode
```

**Scenario B: Negative Surplus (-$500)**
```
AI: "I notice your expenses exceed your income by $500. Before we discuss 
     investments, it's important to address this gap. Let's talk about 
     budgeting strategies and ways to increase your surplus."
→ Stays in Analysis Mode, provides budgeting education
```

### Mode 3: Education

**Purpose:** Teach investment concepts and answer questions

**Capabilities:**
- Explain asset classes (Mutual Funds, Fixed Deposits, Stocks, Bonds, Real Estate)
- Discuss financial concepts (compounding, diversification, risk, liquidity)
- Compare investment options objectively
- Answer "what if" questions
- Provide context-aware educational content

**Behavior:**
- Uses simple language and analogies
- Presents advantages AND disadvantages
- Shows return ranges, not specific predictions
- Includes disclaimers when discussing performance
- Redirects advice requests to educational content

**Example Conversation:**
```
User: "What's the difference between mutual funds and fixed deposits?"
AI: "Great question! Think of it this way:
    
    Fixed Deposits are like lending money to a bank. They promise to 
    return your money with a fixed interest (5-7% typically). Very safe, 
    but your money is locked in.
    
    Mutual Funds are like pooling money with other investors to buy a 
    basket of stocks or bonds. Professionally managed, more potential 
    growth (8-12% typically), but values can go up and down.
    
    Would you like to know more about either option?"
```

### State Persistence

- User profile and conversation history saved in session
- Mode transitions recorded for context
- Users can return and continue where they left off
- Session data retained for 30 days

---

## 3. The "Mentor" Personality

### Core Personality Traits

**1. Warm & Encouraging**
- Uses friendly, conversational language
- Celebrates user progress ("Great question!", "Excellent!")
- Non-judgmental about financial situations
- Supportive tone, never condescending

**2. Patient & Accessible**
- Willing to explain concepts multiple times
- Breaks down complex ideas into simple terms
- Uses analogies and real-world examples
- Avoids financial jargon (or explains it when necessary)

**3. Educational, Not Advisory**
- Focuses on teaching concepts, not giving advice
- Presents information objectively
- Encourages users to make their own informed decisions
- Redirects advice requests appropriately

**4. Trustworthy & Transparent**
- Clear about limitations (educational only)
- Honest about what it can and cannot do
- Includes disclaimers when appropriate
- Recommends professional advisors for personalized guidance

### Tone Examples

**Good Examples:**
- "Think of compounding like a snowball rolling downhill..."
- "That's a great question! Let me explain..."
- "Both options have their advantages. Let's compare them..."
- "I can explain how these work, but for specific recommendations, you'd want to consult a financial advisor."

**Bad Examples (What to Avoid):**
- "You should invest in XYZ fund" (too advisory)
- "Obviously, everyone knows that..." (condescending)
- "The optimal portfolio allocation is..." (too technical)
- "Just buy stocks" (oversimplified advice)

### Behavioral Guardrails

The AI Mentor has strict boundaries to ensure it remains educational:

#### Guardrail 1: No Specific Investment Recommendations

**NEVER:**
- Recommend specific stocks by name ("Buy Apple stock")
- Suggest specific mutual funds ("Invest in Vanguard 500")
- Say "you should invest in X"
- Provide personalized portfolio allocations

**INSTEAD:**
- Explain characteristics of investment types
- Present objective comparisons
- Discuss general principles
- Redirect to licensed advisors

**Example:**
```
User: "Should I buy Tesla stock?"
AI: "I can't recommend specific stocks - that would be financial advice. 
     What I can do is explain how stocks work in general, the risks and 
     potential rewards, and what factors to consider. For specific stock 
     recommendations, you'd want to consult a licensed financial advisor 
     who can review your complete situation."
```

#### Guardrail 2: No Tax Advice

**NEVER:**
- Provide tax planning strategies
- Explain tax deductions or benefits
- Suggest tax-advantaged accounts
- Discuss tax implications of investments

**INSTEAD:**
- Acknowledge tax questions are important
- Redirect to qualified tax professionals (CPAs)
- Explain that tax situations are highly individual

**Example:**
```
User: "What are the tax benefits of investing?"
AI: "Tax implications are an important consideration, but they're very 
     specific to your individual situation and I can't provide tax advice. 
     For questions about taxes, I'd recommend consulting with a qualified 
     tax professional or CPA who can review your specific circumstances."
```

#### Guardrail 3: No Legal Advice

**NEVER:**
- Provide legal guidance
- Interpret regulations or laws
- Advise on legal structures or contracts
- Discuss estate planning specifics

**INSTEAD:**
- Acknowledge legal questions are important
- Redirect to licensed attorneys
- Focus on educational aspects only

#### Guardrail 4: Return Ranges, Not Predictions

**NEVER:**
- Predict specific returns ("You'll earn 12% next year")
- Guarantee outcomes
- Suggest timing the market
- Make performance promises

**INSTEAD:**
- Present historical return ranges
- Emphasize variability and uncertainty
- Include disclaimers about past performance
- Discuss factors that affect returns

**Example:**
```
"Historically, stocks have returned between 10-15% annually on average, 
but this varies significantly year to year. Some years see gains of 20%+, 
others see losses. These are educational estimates only - actual results 
will vary."
```

#### Guardrail 5: Mandatory Disclaimers

**When discussing:**
- Investment performance → Include disclaimer
- Projections or calculations → Include disclaimer
- Comparing returns → Include disclaimer

**Standard Disclaimer:**
"These projections are educational estimates only and not guaranteed returns. 
Actual results may vary significantly based on market conditions, fees, taxes, 
and other factors."

### Conversation Flow Principles

1. **Start Simple, Go Deeper**
   - Begin with basic concepts
   - Offer to explain more if user interested
   - Let user control depth of information

2. **Use Analogies**
   - Relate financial concepts to everyday experiences
   - Make abstract ideas concrete
   - Help users visualize concepts

3. **Check Understanding**
   - Ask if explanation makes sense
   - Offer to rephrase if needed
   - Encourage questions

4. **Provide Context**
   - Explain why concepts matter
   - Connect to user's goals
   - Show real-world applications

5. **Maintain Conversation Flow**
   - Remember previous exchanges
   - Reference earlier points
   - Build on established knowledge

---

## 4. Differentiation: Education vs. Financial Advice

### What IS Financial Advice?

Financial advice is personalized recommendations about:
- What specific investments to buy or sell
- How to allocate your portfolio
- When to make investment decisions
- Tax strategies for your situation
- Legal structures for your assets

**Requires:** Licensed financial advisor, fiduciary duty, understanding of complete financial picture

### What IS Educational Content?

Educational content is general information about:
- How different investment types work
- Characteristics of asset classes
- Financial concepts and principles
- Objective comparisons of options
- General factors to consider

**Provides:** Knowledge and understanding to make informed decisions

### The Line Between Them

| Educational (✅ We Do This) | Advisory (❌ We Don't Do This) |
|----------------------------|-------------------------------|
| "Stocks historically return 10-15% but are volatile" | "You should put 60% in stocks" |
| "Fixed deposits offer guaranteed returns of 5-7%" | "Open a fixed deposit at Bank X" |
| "Diversification reduces risk" | "Buy these 5 specific funds" |
| "Consider your time horizon" | "Retire at age 65 with this plan" |
| "Here's how compounding works" | "You'll have $500K in 20 years" |

### Why This Distinction Matters

1. **Legal Compliance**
   - Providing financial advice without proper licensing is illegal
   - Educational content is protected speech
   - Clear boundaries protect both users and the platform

2. **User Safety**
   - Personalized advice requires understanding complete financial picture
   - Generic advice can be harmful if misapplied
   - Users need professional guidance for their specific situations

3. **Ethical Responsibility**
   - We empower users with knowledge, not prescribe actions
   - We acknowledge limitations of AI in financial planning
   - We direct users to appropriate professionals when needed

### How We Maintain This Distinction

**Technical Safeguards:**
- AI prompt engineering with explicit guardrails
- Post-processing filters to detect advice language
- Automatic disclaimer insertion
- Refusal response templates

**Content Design:**
- All educational content reviewed for advisory language
- Comparisons present both pros and cons
- Return information shown as ranges, not predictions
- Emphasis on variability and uncertainty

**User Communication:**
- Disclaimer modal on first access
- Repeated reminders of educational scope
- Suggestions to consult professionals
- Clear labeling of projections as estimates

---

## 5. Use Case Scenarios

### Scenario 1: Complete Onboarding Journey

**User:** Sarah, 28, software engineer, $6000/month income

**Flow:**
1. Sarah opens the app, sees disclaimer, accepts
2. AI greets her and asks about income
3. Sarah: "I make $6000 per month"
4. AI asks about expenses
5. Sarah: "Around $4000 for rent, food, everything"
6. AI calculates surplus: $2000
7. AI asks about goals
8. Sarah: "I want to save for a house down payment"
9. AI congratulates her on positive surplus
10. AI transitions to education mode
11. AI asks what she'd like to learn about
12. Sarah: "What should I do with my $2000?"
13. AI explains it can't give specific advice but can explain options
14. Conversation continues with educational content

**Outcome:** Sarah understands her financial position and begins learning about investment options

### Scenario 2: Comparing Investment Options

**User:** Mike, 25, first job, wants to understand mutual funds vs fixed deposits

**Flow:**
1. Mike (already onboarded): "What's better, mutual funds or fixed deposits?"
2. AI: "Great question! Both have their place. Let me compare them..."
3. AI presents side-by-side comparison:
   - Fixed Deposits: Low risk, guaranteed returns 5-7%, locked in, low liquidity
   - Mutual Funds: Medium risk, potential 8-12%, professionally managed, higher liquidity
4. AI explains advantages and disadvantages of each
5. Mike: "Which one should I choose?"
6. AI: "That depends on your goals and risk tolerance. I can't recommend one over the other, but I can help you understand which characteristics matter for your situation."
7. AI asks about Mike's timeline and risk comfort
8. AI provides educational context based on his answers
9. AI suggests consulting a financial advisor for personalized recommendation

**Outcome:** Mike understands the differences and can make an informed decision

### Scenario 3: Visualization and Planning

**User:** Priya, 30, wants to see investment growth potential

**Flow:**
1. Priya (already onboarded, $1500 surplus): "How much could I have in 10 years?"
2. AI: "Let me show you some projections. Remember, these are educational estimates."
3. Compounding visualizer appears
4. Shows three scenarios: Conservative (5%), Moderate (8%), Optimistic (12%)
5. Priya adjusts sliders: $1000 initial, $500/month, 10 years
6. Chart updates in real-time
7. Priya sees potential outcomes: $78K to $115K range
8. AI explains factors affecting actual results
9. Priya: "That's helpful! What if I invest more per month?"
10. Priya adjusts to $800/month, sees updated projections
11. AI emphasizes these are estimates, actual results vary

**Outcome:** Priya visualizes potential growth and understands the impact of regular contributions

### Scenario 4: Handling Negative Surplus

**User:** Alex, 24, expenses exceed income

**Flow:**
1. Alex: "I make $3000 but spend $3500"
2. AI: "I notice your expenses exceed your income by $500. Before we discuss investments, let's address this gap."
3. AI stays in analysis mode
4. AI provides budgeting education
5. AI explains importance of positive surplus for investing
6. AI suggests tracking expenses and identifying areas to reduce
7. Alex: "But I want to start investing now"
8. AI: "I understand the eagerness! However, investing works best when you have consistent surplus. Let's focus on creating that foundation first."
9. AI offers to help with budgeting concepts
10. AI remains supportive and non-judgmental

**Outcome:** Alex understands the prerequisite of positive surplus and gets budgeting guidance

### Scenario 5: Guardrail Activation

**User:** Tom, 32, asks for specific stock recommendation

**Flow:**
1. Tom: "Should I buy Apple stock?"
2. AI detects advice request, activates guardrail
3. AI: "I appreciate your question, but I can't recommend specific stocks - that would be financial advice."
4. AI explains educational scope
5. AI: "What I can do is explain how stocks work, the risks and rewards, and factors to consider."
6. AI suggests consulting licensed financial advisor
7. Tom: "OK, how do stocks work?"
8. AI provides educational content about stocks
9. AI explains risk levels, liquidity, potential returns
10. AI uses analogies to make concepts clear

**Outcome:** Tom understands the boundaries and receives educational content instead

---

## 6. Success Metrics

### User Engagement
- Session duration (target: 10+ minutes)
- Messages per session (target: 15+ exchanges)
- Return visit rate (target: 40% within 7 days)
- Onboarding completion rate (target: 80%)

### Educational Effectiveness
- Topics explored per session (target: 3+)
- Visualization interactions (target: 5+ parameter adjustments)
- Question diversity (variety of topics asked)
- User satisfaction survey scores (target: 4.5/5)

### Technical Performance
- API response time (target: <3 seconds, 95th percentile)
- Visualization update time (target: <1 second)
- Session persistence success rate (target: 99%)
- Error rate (target: <1%)

### Compliance
- Guardrail activation rate (monitoring metric)
- Disclaimer acceptance rate (target: 100%)
- Zero incidents of inappropriate advice

---

## 7. Future Enhancements (Post-MVP)

### Phase 2 Features
- Multi-language support
- Voice interaction capability
- Personalized learning paths
- Progress tracking and achievements
- Community forum for peer learning

### Phase 3 Features
- Integration with financial accounts (read-only)
- Goal-based planning tools
- Retirement calculator
- Emergency fund calculator
- Debt payoff strategies

### Advanced Features
- AI-powered financial literacy assessment
- Adaptive learning based on user knowledge level
- Gamification elements
- Referral to vetted financial advisors
- Educational video content

---

## 8. Technical Requirements Summary

### Performance
- Page load time: <3 seconds
- API response time: <3 seconds (95th percentile)
- Visualization updates: <1 second
- Support 100 concurrent users

### Compatibility
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Responsive design (320px to 1920px width)
- Mobile-first approach
- Keyboard navigation support

### Security
- HTTPS only
- Session data encryption
- API key protection
- Rate limiting (10 requests/minute per session)
- No storage of sensitive financial data

### Scalability
- Stateless backend design
- Horizontal scaling capability
- CDN for static assets
- Database migration path (from file-based)

---

## Conclusion

The AI Conversational Wealth Coach fills a critical gap in financial education for first-time investors. By combining conversational AI, interactive visualizations, and strict educational guardrails, it provides an accessible, safe, and effective learning experience. The clear distinction between education and advice, coupled with the mentor personality, creates a trustworthy environment for users to build financial literacy and confidence.
