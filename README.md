# AI Conversational Wealth Coach

An educational application that helps first-time investors understand financial concepts through natural conversation with an AI mentor.

## 🎯 Project Overview

The AI Conversational Wealth Coach bridges the gap between complex financial data and intuitive understanding by providing a mentor-led conversational interface. It explains investment options, visualizes financial projections, and guides users through their investment journey **without providing legal financial advice**.

## ✨ Features

### 1. Conversational Onboarding
- Friendly AI mentor collects financial information through natural conversation
- Validates income (positive numbers) and expenses (non-negative)
- Calculates available surplus for investment

### 2. Educational Guidance
- Explains different asset classes (Mutual Funds, Fixed Deposits, Stocks, Bonds, Real Estate)
- Discusses key concepts: compounding, diversification, risk, liquidity
- Compares investment options objectively with advantages and disadvantages
- Uses simple language and real-world analogies

### 3. Investment Visualization
- Dynamic compounding chart showing growth projections
- Multiple scenarios (Conservative 5%, Moderate 8%, Optimistic 12%)
- Interactive sliders for amount, monthly contribution, and time horizon (1-30 years)
- Real-time updates within 1 second

### 4. Financial Dashboard
- Visual summary of income, expenses, and surplus
- Color-coded indicators (green for positive, red for negative)
- Expense ratio progress bar
- Investment goals display

### 5. Compliance & Safety
- Built-in guardrails prevent financial advice
- Refuses specific investment recommendations
- Refuses tax and legal advice
- Disclaimer modal on first access
- Educational disclaimers on all projections

## 🏗️ Architecture

### Technology Stack

**Frontend:**
- React 18+ with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- Recharts for visualizations
- Axios for API requests

**Backend:**
- Node.js 18+ with Express
- TypeScript for type safety
- Google Gemini API (gemini-2.5-flash) for conversational AI
- File-based JSON storage for sessions
- UUID for session management

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Google Gemini API key

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd ai-wealth-coach
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Backend (.env):
```bash
cd backend
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY
```

Frontend (.env):
```bash
cd frontend
cp .env.example .env
# Edit if needed (default: http://localhost:3000)
```

4. **Start the development servers**

From the root directory:
```bash
npm run dev
```

This starts both backend (port 3000) and frontend (port 5173).

Or start them separately:
```bash
# Terminal 1 - Backend
npm run dev:backend

# Terminal 2 - Frontend
npm run dev:frontend
```

5. **Access the application**

Open your browser to: http://localhost:5173

## 📁 Project Structure

```
ai-wealth-coach/
├── backend/
│   ├── src/
│   │   ├── data/
│   │   │   ├── asset-classes/     # Asset class JSON files
│   │   │   └── educational-content/ # Educational topic files
│   │   ├── services/
│   │   │   ├── SessionManager.ts
│   │   │   ├── FinancialCalculator.ts
│   │   │   ├── ContentLibrary.ts
│   │   │   └── ConversationEngine.ts
│   │   ├── types/
│   │   │   └── index.ts           # Shared TypeScript types
│   │   └── index.ts               # Express server & API routes
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChatInterface.tsx
│   │   │   ├── FinancialDashboard.tsx
│   │   │   ├── CompoundingVisualizer.tsx
│   │   │   └── DisclaimerModal.tsx
│   │   ├── types/
│   │   │   └── index.ts           # Shared TypeScript types
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
└── package.json                   # Root workspace config
```

## 🎓 Educational Content

The system includes comprehensive educational content:

**Asset Classes:**
- Mutual Funds
- Fixed Deposits
- Stocks
- Bonds
- Real Estate

**Financial Concepts:**
- Compounding
- Diversification
- Risk and Return
- Liquidity
- Time Horizon

## 🛡️ Guardrails & Compliance

The AI Wealth Coach has strict guardrails to ensure it remains educational:

1. **No Specific Investment Recommendations** - Won't suggest specific stocks, funds, or investments
2. **No Tax Advice** - Redirects tax questions to qualified professionals
3. **No Legal Advice** - Redirects legal questions to licensed attorneys
4. **Return Ranges Only** - Presents ranges, never specific predictions
5. **Mandatory Disclaimers** - All projections include educational disclaimers

## 📊 API Endpoints

### Session Management
- `POST /api/sessions` - Create new session
- `GET /api/sessions/:sessionId` - Get session data
- `PUT /api/sessions/:sessionId/profile` - Update user profile

### Conversation
- `POST /api/sessions/:sessionId/messages` - Send message, get AI response

### Calculations
- `POST /api/calculate/projection` - Calculate investment projections

### Content
- `GET /api/content/asset-classes` - Get all asset classes
- `GET /api/content/educational/:topic` - Get educational content

## 🧪 Testing

Run tests:
```bash
npm test
```

Run with coverage:
```bash
npm run test:coverage
```

## 🚢 Deployment

### Build for Production

```bash
npm run build
```

This builds both frontend and backend.

### Deployment Options

**Recommended Platforms:**
- **Frontend**: Vercel, Netlify (static hosting)
- **Backend**: Railway, Render, Heroku (Node.js hosting)

**Environment Variables for Production:**
- `GEMINI_API_KEY` - Your Gemini API key
- `PORT` - Backend port (default: 3000)
- `NODE_ENV` - Set to "production"

## 📝 Assignment Deliverables

This project fulfills all assignment requirements:

### Task 1: Product Requirement Document (PRD) ✅
- Target Persona: First-Time Investor profile with pain points
- Feature Logic: Analysis → Education mode transitions
- Mentor Personality: Defined tone and guardrails

### Task 2: User Stories & Prioritization ✅
- Detailed user stories with acceptance criteria
- MoSCoW prioritization framework applied
- MVP vs. backlog clearly distinguished

### Task 3: Working Prototype ✅
- **Onboarding Flow**: Conversational data collection
- **Conversational Capability**: Natural Q&A (e.g., "Why Mutual Fund over Fixed Deposit?")
- **Visualization**: Dynamic compounding chart with real-time updates

## 🤝 Contributing

This is an educational project. For improvements:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is for educational purposes.

## ⚠️ Disclaimer

This AI Wealth Coach is an educational tool only. It does not provide financial advice, tax advice, or legal guidance. For personalized financial recommendations, consult a licensed financial advisor.

## 🙏 Acknowledgments

- Google for Gemini API
- React and TypeScript communities
- All open-source libraries used in this project
