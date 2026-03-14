import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import { SessionManager } from './services/SessionManager.js';
import { FinancialCalculator } from './services/FinancialCalculator.js';
import { ContentLibrary } from './services/ContentLibrary.js';
import { ConversationEngine } from './services/ConversationEngine.js';
import { Message } from './types/index.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize services
const sessionManager = new SessionManager();
const financialCalculator = new FinancialCalculator();
const contentLibrary = new ContentLibrary();
await contentLibrary.initialize();

const geminiApiKey = process.env.GEMINI_API_KEY;
if (!geminiApiKey) {
  console.error('GEMINI_API_KEY environment variable is required');
  process.exit(1);
}

const conversationEngine = new ConversationEngine(geminiApiKey, contentLibrary);

// Rate limiting map (simple in-memory implementation)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(sessionId: string): boolean {
  const now = Date.now();
  const limit = rateLimitMap.get(sessionId);

  if (!limit || now > limit.resetTime) {
    rateLimitMap.set(sessionId, { count: 1, resetTime: now + 60000 }); // 1 minute window
    return true;
  }

  if (limit.count >= 10) {
    return false;
  }

  limit.count++;
  return true;
}

// POST /api/sessions - Create new session
app.post('/api/sessions', async (req, res) => {
  try {
    const sessionId = await sessionManager.createSession();
    res.json({ sessionId });
  } catch (error) {
    console.error('Error creating session:', error);
    res.status(500).json({ error: 'Failed to create session' });
  }
});

// GET /api/sessions/:sessionId - Get session data
app.get('/api/sessions/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = await sessionManager.getSession(sessionId);

    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    res.json(session);
  } catch (error) {
    console.error('Error retrieving session:', error);
    res.status(500).json({ error: 'Failed to retrieve session' });
  }
});

// PUT /api/sessions/:sessionId/profile - Update user profile
app.put('/api/sessions/:sessionId/profile', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { income, expenses, goals, riskTolerance } = req.body;

    const session = await sessionManager.getSession(sessionId);
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    const surplus = financialCalculator.calculateSurplus(income || 0, expenses || 0);

    const updatedProfile = {
      ...session.userProfile,
      income: income !== undefined ? income : session.userProfile?.income || 0,
      expenses: expenses !== undefined ? expenses : session.userProfile?.expenses || 0,
      surplus,
      goals: goals || session.userProfile?.goals || [],
      riskTolerance: riskTolerance || session.userProfile?.riskTolerance,
    };

    await sessionManager.updateSession(sessionId, {
      userProfile: updatedProfile,
    });

    res.json({ success: true, profile: updatedProfile });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// POST /api/sessions/:sessionId/messages - Send message and get response
app.post('/api/sessions/:sessionId/messages', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { message } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Check rate limit
    if (!checkRateLimit(sessionId)) {
      return res.status(429).json({ error: 'Too many requests. Please wait a moment before sending another message.' });
    }

    const session = await sessionManager.getSession(sessionId);
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    // Create user message
    const userMessage: Message = {
      id: uuidv4(),
      role: 'user',
      content: message,
      timestamp: new Date(),
    };

    // Add to conversation history
    session.conversationHistory.push(userMessage);

    // Handle onboarding data extraction
    if (session.mode === 'onboarding') {
      const incomeMatch = message.match(/(\d+(?:,\d{3})*(?:\.\d{2})?)/);
      const expenseMatch = message.match(/(\d+(?:,\d{3})*(?:\.\d{2})?)/);

      if (incomeMatch && !session.userProfile) {
        const income = parseFloat(incomeMatch[1].replace(/,/g, ''));
        if (income > 0) {
          session.userProfile = {
            income,
            expenses: 0,
            surplus: income,
            goals: [],
          };
        }
      } else if (expenseMatch && session.userProfile && session.userProfile.expenses === 0) {
        const expenses = parseFloat(expenseMatch[1].replace(/,/g, ''));
        if (expenses >= 0) {
          session.userProfile.expenses = expenses;
          session.userProfile.surplus = financialCalculator.calculateSurplus(
            session.userProfile.income,
            expenses
          );
          session.metadata.onboardingComplete = true;
        }
      }
    }

    // Get AI response
    const context = {
      userProfile: session.userProfile,
      mode: session.mode,
      conversationHistory: session.conversationHistory,
    };

    const aiResponse = await conversationEngine.processMessage(message, context);

    // Create assistant message
    const assistantMessage: Message = {
      id: uuidv4(),
      role: 'assistant',
      content: aiResponse.message,
      timestamp: new Date(),
      metadata: {
        modeTransition: aiResponse.modeTransition,
        suggestedActions: aiResponse.suggestedActions,
      },
    };

    session.conversationHistory.push(assistantMessage);

    // Handle mode transition
    if (aiResponse.modeTransition) {
      session.mode = aiResponse.modeTransition;
    }

    // Save updated session
    await sessionManager.updateSession(sessionId, session);

    res.json({
      message: aiResponse.message,
      modeTransition: aiResponse.modeTransition,
    });
  } catch (error) {
    console.error('Error processing message:', error);
    res.status(500).json({ error: 'Failed to process message' });
  }
});

// POST /api/calculate/projection - Calculate investment projections
app.post('/api/calculate/projection', async (req, res) => {
  try {
    const { principal, monthly, years } = req.body;

    const validation = financialCalculator.validateProjectionParams(principal, monthly, years);
    if (!validation.valid) {
      return res.status(400).json({ error: validation.error });
    }

    const scenarios = financialCalculator.generateScenarios(principal, monthly, years);
    res.json({ scenarios });
  } catch (error) {
    console.error('Error calculating projection:', error);
    res.status(500).json({ error: 'Failed to calculate projection' });
  }
});

// GET /api/content/asset-classes - Get all asset classes
app.get('/api/content/asset-classes', async (req, res) => {
  try {
    const assetClasses = contentLibrary.getAllAssetClasses();
    res.json({ assetClasses });
  } catch (error) {
    console.error('Error retrieving asset classes:', error);
    res.status(500).json({ error: 'Failed to retrieve asset classes' });
  }
});

// GET /api/content/educational/:topic - Get educational content by topic
app.get('/api/content/educational/:topic', async (req, res) => {
  try {
    const { topic } = req.params;
    const content = contentLibrary.getEducationalContent(topic);

    if (!content) {
      return res.status(404).json({ error: 'Content not found' });
    }

    res.json(content);
  } catch (error) {
    console.error('Error retrieving educational content:', error);
    res.status(500).json({ error: 'Failed to retrieve content' });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`AI Wealth Coach backend running on port ${PORT}`);
});
