# Quick Start Guide - AI Conversational Wealth Coach

Get the application running in 5 minutes!

## Prerequisites

- Node.js 18+ installed ([Download here](https://nodejs.org/))
- Google Gemini API key ([Get one here](https://aistudio.google.com/app/apikey))

## Step-by-Step Setup

### 1. Install Dependencies

```bash
npm install
```

This installs dependencies for both frontend and backend.

### 2. Configure Backend

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env` and add your Gemini API key:

```env
GEMINI_API_KEY=your-actual-api-key-here
PORT=3000
```

### 3. Start the Application

From the root directory:

```bash
npm run dev
```

This starts both servers:
- Backend: http://localhost:3000
- Frontend: http://localhost:5173

### 4. Open in Browser

Navigate to: **http://localhost:5173**

## First Time Usage

1. **Accept Disclaimer**: Click "I Understand" on the disclaimer modal
2. **Start Onboarding**: The AI will ask about your monthly income
3. **Provide Information**: Answer questions about income, expenses, and goals
4. **Explore Features**: 
   - View your financial dashboard
   - Ask questions about investments
   - Use the compounding visualizer

## Example Questions to Try

- "What's the difference between mutual funds and fixed deposits?"
- "How does compounding work?"
- "Compare stocks and bonds for me"
- "What is diversification?"
- "Should I invest in Apple stock?" (Watch the guardrails in action!)

## Troubleshooting

### Backend won't start
- Check that you added your Gemini API key to `backend/.env`
- Ensure port 3000 is not in use
- Run `cd backend && npm install` to ensure dependencies are installed

### Frontend won't start
- Ensure port 5173 is not in use
- Run `cd frontend && npm install` to ensure dependencies are installed

### "Failed to send message" error
- Check that backend is running on port 3000
- Verify your OpenAI API key is valid
- Check browser console for detailed error messages

### Gemini API errors
- Verify your API key is correct
- Check you have access in your Google AI Studio account
- Ensure you're not hitting rate limits

## Development Commands

### Run backend only
```bash
npm run dev:backend
```

### Run frontend only
```bash
npm run dev:frontend
```

### Run tests
```bash
npm test
```

### Build for production
```bash
npm run build
```

### Lint code
```bash
npm run lint
```

## Project Structure

```
├── backend/          # Node.js + Express API
│   ├── src/
│   │   ├── services/ # Business logic
│   │   ├── data/     # Educational content
│   │   └── index.ts  # Server entry point
│   └── .env          # Your API key goes here
│
├── frontend/         # React application
│   ├── src/
│   │   ├── components/
│   │   ├── App.tsx
│   │   └── main.tsx
│   └── package.json
│
└── package.json      # Root workspace
```

## Key Features to Demo

1. **Onboarding Flow**: Conversational data collection
2. **Financial Dashboard**: Visual summary of finances
3. **Compounding Visualizer**: Interactive growth projections
4. **Asset Comparisons**: Side-by-side investment comparisons
5. **Guardrails**: AI refuses to give specific advice

## Next Steps

- Read `PRODUCT_REQUIREMENTS.md` for detailed product information
- Check `USER_STORIES_PRIORITIZATION.md` for feature prioritization
- See `DEPLOYMENT.md` for hosting instructions
- Review `ASSIGNMENT_COMPLETION_SUMMARY.md` for complete overview

## Need Help?

- Check `README.md` for comprehensive documentation
- Review `.kiro/specs/ai-conversational-wealth-coach/` for detailed specs
- Ensure all prerequisites are installed correctly
- Verify environment variables are set properly

---

**Ready to go!** Open http://localhost:5173 and start exploring! 🚀
