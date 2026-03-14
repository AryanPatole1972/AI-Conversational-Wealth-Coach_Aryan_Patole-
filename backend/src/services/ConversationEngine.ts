import { GoogleGenAI } from '@google/genai';
import { ConversationContext, AssistantResponse, Message } from '../types/index.js';
import { ContentLibrary } from './ContentLibrary.js';

export class ConversationEngine {
  private ai: GoogleGenAI;
  private contentLibrary: ContentLibrary;
  private readonly MAX_RETRIES = 3;

  constructor(apiKey: string, contentLibrary: ContentLibrary) {
    this.ai = new GoogleGenAI({ apiKey });
    this.contentLibrary = contentLibrary;
  }

  async processMessage(
    userMessage: string,
    context: ConversationContext
  ): Promise<AssistantResponse> {
    try {
      // Check if this is a comparison request
      const comparisonResult = this.detectComparisonRequest(userMessage);
      if (comparisonResult) {
        return this.handleComparisonRequest(comparisonResult.assetClasses);
      }

      // Try demo mode first (works without Gemini)
      const demoResponse = this.getDemoResponse(userMessage, context);
      if (demoResponse) {
        return demoResponse;
      }

      const systemPrompt = this.buildSystemPrompt(context);
      const messages = this.buildMessageHistory(context, userMessage);

      let attempt = 0;
      let lastError: Error | null = null;

      while (attempt < this.MAX_RETRIES) {
        try {
          const completion = await this.ai.models.generateContent({
             model: 'gemini-2.5-flash',
             contents: messages,
             config: {
                systemInstruction: systemPrompt,
                temperature: 0.7,
                maxOutputTokens: 500
             }
          });

          const responseMessage = completion.text || '';
          const processedResponse = this.applyGuardrails(responseMessage);
          
          // Detect mode transitions
          const modeTransition = this.detectModeTransition(userMessage, context, processedResponse);

          return {
            message: processedResponse,
            modeTransition,
          };
        } catch (error) {
          console.error('Gemini API attempt failed:', error);
          lastError = error as Error;
          attempt++;
          
          if (attempt < this.MAX_RETRIES) {
            // Exponential backoff
            await this.sleep(Math.pow(2, attempt) * 1000);
          }
        }
      }

      // All retries failed - use demo mode as fallback
      console.error('Gemini API failed after retries:', lastError);
      const fallback = this.getDemoResponse(userMessage, context);
      return fallback || this.getFallbackResponse(context.mode);
      
    } catch (error) {
      console.error('Error in processMessage:', error);
      const fallback = this.getDemoResponse(userMessage, context);
      return fallback || this.getFallbackResponse(context.mode);
    }
  }

  private getDemoResponse(userMessage: string, context: ConversationContext): AssistantResponse | null {
    const lowerMessage = userMessage.toLowerCase();

    // Onboarding mode responses
    if (context.mode === 'onboarding') {
      // Check if message contains a number (income or expense)
      const numberMatch = userMessage.match(/(\d+(?:,\d{3})*(?:\.\d{2})?)/);
      if (numberMatch) {
        const value = parseFloat(numberMatch[1].replace(/,/g, ''));
        
        const lastAssistantMsg = [...context.conversationHistory]
          .reverse()
          .find(m => m.role === 'assistant');
        const lastContent = lastAssistantMsg?.content.toLowerCase() || '';
        
        const isAskingForIncome = lastContent.includes('what is your monthly income') || lastContent.includes('tell me your monthly income');
        const isAskingForExpenses = lastContent.includes('what are your monthly expenses');
        
        if (isAskingForIncome) {
          if (value > 0) {
            return {
              message: `Great! So your monthly income is ${value.toLocaleString()}. Now, what are your monthly expenses?`,
            };
          } else {
            return {
              message: "Income should be a positive number. Could you tell me your monthly income?",
            };
          }
        }
        else if (isAskingForExpenses) {
          return {
            message: `Got it! Your monthly expenses are ${value.toLocaleString()}. What are your investment goals? For example: retirement, buying a home, building an emergency fund, or general wealth building.`,
          };
        }
      }
      
      // Goals response
      if (lowerMessage.includes('retirement') || lowerMessage.includes('home') || 
          lowerMessage.includes('emergency') || lowerMessage.includes('wealth') ||
          lowerMessage.includes('save') || lowerMessage.includes('future')) {
        return {
          message: "Excellent goals! I've recorded that. Let me analyze your financial situation and we can start exploring investment options that might help you work toward these goals.\n\nRemember, I provide educational information only - for personalized advice, consult a licensed financial advisor.",
          modeTransition: 'analysis',
        };
      }
    }

    // Analysis mode responses
    if (context.mode === 'analysis') {
      const surplus = context.userProfile?.surplus || 0;
      
      const alreadySentNegativeAnalysis = context.conversationHistory.some(m => 
        m.role === 'assistant' && m.content.includes('I notice your expenses currently exceed your income')
      );
      const alreadySentPositiveAnalysis = context.conversationHistory.some(m => 
        m.role === 'assistant' && m.content.includes('Great news! You have')
      );

      if (surplus < 0 && !alreadySentNegativeAnalysis) {
        return {
          message: "I notice your expenses currently exceed your income. Before we talk about investing, let's focus on budgeting and expense management. Building a positive surplus is the first step toward investing.\n\nWould you like some tips on managing expenses and creating a budget?",
        };
      } else if (surplus >= 0 && !alreadySentPositiveAnalysis) {
        return {
          message: `Great news! You have ${Math.abs(surplus).toLocaleString()} available each month after expenses. This surplus can be used for investing to help you reach your goals.\n\nI can help you learn about different investment options like Mutual Funds, Fixed Deposits, Stocks, Bonds, and Real Estate. What would you like to explore first?`,
          modeTransition: 'education',
        };
      }
    }

    // Education mode responses
    if (context.mode === 'education') {
      // Mutual Fund questions
      if (lowerMessage.includes('mutual fund')) {
        const mutualFund = this.contentLibrary.getAssetClassInfo('mutual fund');
        if (mutualFund) {
          return {
            message: `**Mutual Funds** are investment vehicles that pool money from many investors to buy a diversified portfolio of stocks, bonds, or other securities.\n\n**Key Characteristics:**\n- Risk Level: ${mutualFund.riskLevel}\n- Liquidity: ${mutualFund.liquidity}\n- Typical Returns: ${mutualFund.typicalReturnRange.min}%-${mutualFund.typicalReturnRange.max}% annually\n- Time Horizon: ${mutualFund.timeHorizon}\n\n**Advantages:** ${mutualFund.advantages.join(', ')}\n\n**Disadvantages:** ${mutualFund.disadvantages.join(', ')}\n\n**Think of it like this:** Instead of buying individual stocks yourself, you're joining a group of investors and hiring a professional manager to make investment decisions for everyone.\n\n*Disclaimer: These are educational estimates. Actual returns vary and past performance doesn't guarantee future results.*\n\nWould you like to learn about other investment options?`,
          };
        }
      }

      // Fixed Deposit questions
      if (lowerMessage.includes('fixed deposit') || lowerMessage.includes('fd')) {
        const fd = this.contentLibrary.getAssetClassInfo('fixed deposit');
        if (fd) {
          return {
            message: `**Fixed Deposits** are savings instruments offered by banks where you deposit money for a fixed period at a guaranteed interest rate.\n\n**Key Characteristics:**\n- Risk Level: ${fd.riskLevel}\n- Liquidity: ${fd.liquidity}\n- Typical Returns: ${fd.typicalReturnRange.min}%-${fd.typicalReturnRange.max}% annually\n- Time Horizon: ${fd.timeHorizon}\n\n**Advantages:** ${fd.advantages.join(', ')}\n\n**Disadvantages:** ${fd.disadvantages.join(', ')}\n\n**Think of it like this:** You're lending money to the bank for a specific period, and they pay you interest. It's very safe but your money is locked in.\n\n*Disclaimer: These are educational estimates. Actual returns vary based on bank and market conditions.*\n\nWould you like to compare this with other options?`,
          };
        }
      }

      // Compounding questions
      if (lowerMessage.includes('compound') || lowerMessage.includes('compounding')) {
        return {
          message: "**Compounding** is when your investment earnings generate their own earnings over time. It's often called 'earning interest on interest.'\n\n**Simple Example:**\n- Year 1: You invest $1,000 at 10% return → You have $1,100\n- Year 2: That $1,100 earns 10% → You have $1,210 (not $1,200!)\n- Year 3: That $1,210 earns 10% → You have $1,331\n\nThe extra $31 in year 3 is compounding at work - you earned returns on your previous returns!\n\n**Why it matters:** The longer you invest, the more powerful compounding becomes. That's why starting early is so important.\n\n**Albert Einstein reportedly called it** 'the eighth wonder of the world.'\n\nYou can see compounding in action using the visualizer on the right side of the screen. Try adjusting the time horizon to see how much difference time makes!\n\nWould you like to learn about other investment concepts?",
        };
      }

      // Diversification questions
      if (lowerMessage.includes('diversif')) {
        return {
          message: "**Diversification** means spreading your investments across different types of assets to reduce risk. It's the financial equivalent of 'don't put all your eggs in one basket.'\n\n**Why it works:**\n- Different investments perform well at different times\n- If one investment drops, others might stay stable or grow\n- Reduces the impact of any single investment failing\n\n**Example:**\nInstead of putting all $10,000 in one stock, you might split it:\n- $3,000 in Mutual Funds\n- $3,000 in Fixed Deposits\n- $2,000 in Bonds\n- $2,000 in Stocks\n\nThis way, if stocks drop 20%, you only lose $400 (20% of $2,000), not $2,000 (20% of $10,000).\n\n**The key principle:** Diversification can help manage risk, but it doesn't eliminate it entirely.\n\nWould you like to learn about specific investment types to diversify into?",
        };
      }

      // Risk questions
      if (lowerMessage.includes('risk')) {
        return {
          message: "**Investment Risk** refers to the possibility that your investment might lose value or not perform as expected.\n\n**Risk Levels:**\n- **Low Risk:** Fixed Deposits, Bonds - More stable but lower returns\n- **Medium Risk:** Mutual Funds, Real Estate - Balanced risk and return\n- **High Risk:** Individual Stocks - Higher potential returns but more volatility\n\n**Important Principle:** Generally, higher risk comes with potential for higher returns, and lower risk means lower potential returns. This is called the risk-return tradeoff.\n\n**Your Risk Tolerance depends on:**\n- Your age and time horizon (younger = can take more risk)\n- Your financial goals\n- Your comfort with market fluctuations\n- Your emergency fund status\n\n**Key Insight:** Risk isn't just about losing money - it's also about volatility (how much the value goes up and down). Some people can't sleep at night if their investments fluctuate, even if they recover.\n\nWhat's your comfort level with seeing your investments go up and down?",
        };
      }

      // Stock questions
      if (lowerMessage.includes('stock')) {
        const stock = this.contentLibrary.getAssetClassInfo('stock');
        if (stock) {
          return {
            message: `**Stocks** represent ownership shares in a company. When you buy a stock, you become a part-owner of that business.\n\n**Key Characteristics:**\n- Risk Level: ${stock.riskLevel}\n- Liquidity: ${stock.liquidity}\n- Typical Returns: ${stock.typicalReturnRange.min}%-${stock.typicalReturnRange.max}% annually\n- Time Horizon: ${stock.timeHorizon}\n\n**Advantages:** ${stock.advantages.join(', ')}\n\n**Disadvantages:** ${stock.disadvantages.join(', ')}\n\n**Think of it like this:** If you own stock in a coffee company and they open 100 new stores and profits soar, your shares become more valuable. But if they have a bad year, your shares might drop in value.\n\n*Disclaimer: Stock returns are highly variable. Past performance doesn't guarantee future results.*\n\nWould you like to learn about less risky options?`,
          };
        }
      }

      // General investment question
      if (lowerMessage.includes('invest') || lowerMessage.includes('where') || lowerMessage.includes('what')) {
        return {
          message: "I can help you learn about several investment options:\n\n1. **Mutual Funds** - Professionally managed, diversified portfolios\n2. **Fixed Deposits** - Safe, guaranteed returns from banks\n3. **Stocks** - Ownership in individual companies\n4. **Bonds** - Lending money to governments or corporations\n5. **Real Estate** - Property investments\n\nEach has different risk levels, returns, and liquidity. Which would you like to explore first? Or would you like me to compare two options?",
        };
      }
    }

    return null;
  }

  private detectComparisonRequest(userMessage: string): { assetClasses: string[] } | null {
    const lowerMessage = userMessage.toLowerCase();
    
    // Check for comparison keywords
    const comparisonKeywords = ['compare', 'difference', 'vs', 'versus', 'better'];
    const hasComparisonKeyword = comparisonKeywords.some(keyword => lowerMessage.includes(keyword));
    
    if (!hasComparisonKeyword) {
      return null;
    }

    // Extract asset class names
    const assetClassNames = ['mutual fund', 'fixed deposit', 'stock', 'bond', 'real estate'];
    const foundAssetClasses: string[] = [];

    for (const assetClass of assetClassNames) {
      if (lowerMessage.includes(assetClass)) {
        foundAssetClasses.push(assetClass);
      }
    }

    // Return if we found 1-4 asset classes
    if (foundAssetClasses.length >= 1 && foundAssetClasses.length <= 4) {
      return { assetClasses: foundAssetClasses };
    }

    return null;
  }

  private handleComparisonRequest(assetClassNames: string[]): AssistantResponse {
    if (assetClassNames.length > 4) {
      return {
        message: "I can compare up to 4 investment types at once. Could you narrow down your selection to make the comparison more focused and easier to understand?",
      };
    }

    const assetClasses = assetClassNames
      .map(name => this.contentLibrary.getAssetClassInfo(name))
      .filter(ac => ac !== null);

    if (assetClasses.length === 0) {
      return {
        message: "I couldn't find information about those investment types. I can help you learn about Mutual Funds, Fixed Deposits, Stocks, Bonds, and Real Estate. Which would you like to explore?",
      };
    }

    // Build comparison table
    let comparison = "Here's an educational comparison of these investment options:\n\n";
    
    comparison += "**Investment Type Comparison:**\n\n";
    
    for (const ac of assetClasses) {
      comparison += `**${ac.name}**\n`;
      comparison += `- Risk Level: ${ac.riskLevel}\n`;
      comparison += `- Liquidity: ${ac.liquidity}\n`;
      comparison += `- Typical Returns: ${ac.typicalReturnRange.min}% - ${ac.typicalReturnRange.max}%\n`;
      comparison += `- Time Horizon: ${ac.timeHorizon}\n`;
      comparison += `- Advantages: ${ac.advantages.join(', ')}\n`;
      comparison += `- Disadvantages: ${ac.disadvantages.join(', ')}\n\n`;
    }

    comparison += "\n**Important Disclaimer:** These are general educational comparisons. Actual returns vary and past performance doesn't guarantee future results. The best choice depends on your individual goals, risk tolerance, and time horizon. For personalized recommendations, please consult a licensed financial advisor.\n\n";
    comparison += "Would you like me to explain any of these characteristics in more detail?";

    return {
      message: comparison,
    };
  }

  buildSystemPrompt(context: ConversationContext): string {
    const basePrompt = `You are a friendly and supportive AI Wealth Coach designed to help first-time investors learn about financial concepts. Your role is EDUCATIONAL ONLY - you do not provide financial advice, tax advice, or legal guidance.

**Your Personality:**
- Warm, encouraging, and non-judgmental
- Patient and willing to explain concepts multiple times
- Use simple language and avoid jargon (or explain it when necessary)
- Use analogies and real-world examples
- Supportive mentor, not an authoritative advisor

**CRITICAL GUARDRAILS - YOU MUST FOLLOW THESE:**
1. NEVER recommend specific stocks, funds, or investments by name
2. NEVER say "you should invest in X" or give personalized investment advice
3. NEVER provide tax planning or legal advice
4. ALWAYS present return ranges, never specific predictions
5. ALWAYS include disclaimers when discussing investment performance
6. When asked for specific advice, redirect to educational content and suggest consulting a licensed financial advisor

**Your Responses Should:**
- Explain concepts clearly with examples
- Compare options objectively (advantages and disadvantages)
- Emphasize that you provide education, not advice
- Encourage users to consult licensed professionals for personalized guidance`;

    // Add mode-specific instructions
    if (context.mode === 'onboarding') {
      return basePrompt + `\n\n**Current Mode: Onboarding**
You are collecting the user's financial information through friendly conversation:
1. Ask about their monthly income
2. Ask about their monthly expenses
3. Ask about their investment goals
Be conversational and encouraging. Validate that income is a positive number and expenses are non-negative.`;
    }

    if (context.mode === 'analysis') {
      const surplus = context.userProfile?.surplus || 0;
      if (surplus <= 0) {
        return basePrompt + `\n\n**Current Mode: Analysis**
The user has negative or zero surplus (expenses meet or exceed income). Focus on:
- Budgeting basics and expense management
- Building an emergency fund
- Explain that investing comes after having a positive surplus
Be supportive and non-judgmental.`;
      } else {
        return basePrompt + `\n\n**Current Mode: Analysis**
The user has a positive surplus of ${surplus}. Transition to education mode by:
- Congratulating them on having money available to invest
- Introducing the concept of different investment options
- Asking what they'd like to learn about`;
      }
    }

    if (context.mode === 'education') {
      return basePrompt + `\n\n**Current Mode: Education**
The user is ready to learn about investments. You can:
- Explain different asset classes (Mutual Funds, Fixed Deposits, Stocks, Bonds, Real Estate)
- Discuss concepts like compounding, diversification, risk, and liquidity
- Compare investment options objectively
- Answer questions about how investments work
Remember: Educate, don't advise. Present information objectively.`;
    }

    return basePrompt;
  }

  private buildMessageHistory(context: ConversationContext, userMessage: string): Array<{ role: 'user' | 'model'; parts: Array<{text: string}> }> {
    const messages: Array<{ role: 'user' | 'model'; parts: Array<{text: string}> }> = [];
    
    // Include last 10 messages for context
    const recentHistory = context.conversationHistory.slice(-10);
    
    for (const msg of recentHistory) {
      if (msg.role === 'user' || msg.role === 'assistant') {
        const role = msg.role === 'assistant' ? 'model' : 'user';
        // Check if the previous message was from the same role. If so, don't push it or append it. 
        // Gemini API strictly requires alternating user/model turns unless handled very carefully.
        // Easiest fix: coalesce messages from the same role, or just filter.
        
        if (messages.length > 0 && messages[messages.length - 1].role === role) {
           messages[messages.length - 1].parts.push({text: "\n" + msg.content});
        } else {
           messages.push({
             role: role,
             parts: [{text: msg.content}]
           });
        }
      }
    }

    // Add current user message
    if (messages.length > 0 && messages[messages.length - 1].role === 'user') {
       messages[messages.length - 1].parts.push({text: "\n" + userMessage});
    } else {
       messages.push({
         role: 'user',
         parts: [{text: userMessage}]
       });
    }

    return messages;
  }

  applyGuardrails(response: string): string {
    const violations: string[] = [];

    // Check for specific investment recommendations
    const investmentAdvicePatterns = [
      /you should (buy|invest in|purchase)/i,
      /I recommend (buying|investing in)/i,
      /(buy|invest in) (apple|google|tesla|amazon|microsoft)/i,
      /specific fund.*recommend/i,
    ];

    for (const pattern of investmentAdvicePatterns) {
      if (pattern.test(response)) {
        violations.push('investment_advice');
        break;
      }
    }

    // Check for tax/legal advice
    const taxLegalPatterns = [
      /tax (deduction|benefit|strategy|planning)/i,
      /you can (deduct|claim).*tax/i,
      /legal(ly)? (advice|guidance)/i,
      /consult.*lawyer/i,
    ];

    for (const pattern of taxLegalPatterns) {
      if (pattern.test(response)) {
        violations.push('tax_legal_advice');
        break;
      }
    }

    // If violations detected, return refusal response
    if (violations.length > 0) {
      console.warn('Guardrail violation detected:', violations);
      return this.getRefusalResponse(violations[0]);
    }

    return response;
  }

  private getRefusalResponse(violationType: string): string {
    if (violationType === 'investment_advice') {
      return "I appreciate your question, but I can't provide specific investment recommendations or tell you what to buy. My role is educational - I can explain how different investment types work, their characteristics, and general concepts, but I can't give personalized advice.\n\nFor specific investment recommendations tailored to your situation, I'd encourage you to consult with a licensed financial advisor who can review your complete financial picture.\n\nIs there a general concept about investing I can help explain instead?";
    }

    if (violationType === 'tax_legal_advice') {
      return "I can't provide tax planning or legal advice - that's outside my educational scope. Tax and legal matters are complex and very specific to individual situations.\n\nFor tax questions, please consult with a qualified tax professional or CPA. For legal matters, a licensed attorney would be the right resource.\n\nI'm happy to explain general investment concepts and how different investment types work from an educational perspective. What would you like to learn about?";
    }

    return "I want to make sure I stay within my educational role. I can explain financial concepts and how different investments work, but I can't provide personalized advice. For specific guidance tailored to your situation, please consult with a licensed financial advisor.";
  }

  private detectModeTransition(
    userMessage: string,
    context: ConversationContext,
    response: string
  ): 'onboarding' | 'analysis' | 'education' | undefined {
    // Check if onboarding is complete
    if (context.mode === 'onboarding' && context.userProfile) {
      return 'analysis';
    }

    // Check if analysis should transition to education
    if (context.mode === 'analysis' && context.userProfile) {
      if (context.userProfile.surplus > 0) {
        return 'education';
      }
    }

    return undefined;
  }

  private getFallbackResponse(mode: string): AssistantResponse {
    const fallbackMessages = {
      onboarding: "I'm having trouble processing your response right now. Could you please try again? I'd like to learn about your financial situation to help guide our conversation.",
      analysis: "I'm experiencing some technical difficulties. Please try your question again in a moment.",
      education: "I'm having trouble processing your question right now. Please try rephrasing it, and I'll do my best to help you learn about investing.",
    };

    return {
      message: fallbackMessages[mode as keyof typeof fallbackMessages] || fallbackMessages.education,
    };
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
