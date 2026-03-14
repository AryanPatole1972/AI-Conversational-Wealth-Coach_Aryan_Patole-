# Deployment Guide - AI Conversational Wealth Coach

## Prerequisites

- Node.js 18+ installed
- OpenAI API key
- A hosting platform account (Vercel, Netlify, Railway, or similar)

## Environment Variables

### Backend (.env)
```
OPENAI_API_KEY=your_openai_api_key_here
PORT=3000
NODE_ENV=production
```

### Frontend (.env)
```
VITE_API_URL=https://your-backend-url.com
```

## Local Development

### Backend
```bash
cd backend
npm install
cp .env.example .env
# Add your OPENAI_API_KEY to .env
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Production Build

### Backend
```bash
cd backend
npm install
npm run build
npm start
```

### Frontend
```bash
cd frontend
npm install
npm run build
# Output will be in frontend/dist
```

## Deployment Options

### Option 1: Vercel (Recommended for Frontend)

1. Install Vercel CLI: `npm install -g vercel`
2. Deploy frontend:
   ```bash
   cd frontend
   vercel --prod
   ```
3. Set environment variable `VITE_API_URL` in Vercel dashboard

### Option 2: Railway (Recommended for Backend)

1. Install Railway CLI: `npm install -g @railway/cli`
2. Deploy backend:
   ```bash
   cd backend
   railway login
   railway init
   railway up
   ```
3. Set environment variables in Railway dashboard:
   - `OPENAI_API_KEY`
   - `PORT=3000`
   - `NODE_ENV=production`

### Option 3: Netlify (Alternative for Frontend)

1. Install Netlify CLI: `npm install -g netlify-cli`
2. Deploy frontend:
   ```bash
   cd frontend
   npm run build
   netlify deploy --prod --dir=dist
   ```

### Option 4: Heroku (Alternative for Backend)

1. Install Heroku CLI
2. Deploy backend:
   ```bash
   cd backend
   heroku create your-app-name
   heroku config:set OPENAI_API_KEY=your_key
   git push heroku main
   ```

## CORS Configuration

Make sure to update the CORS settings in `backend/src/index.ts` to allow your frontend domain:

```typescript
app.use(cors({
  origin: ['http://localhost:5173', 'https://your-frontend-domain.com'],
  credentials: true
}));
```

## Post-Deployment Checklist

- [ ] Backend is accessible and returns 200 on health check
- [ ] Frontend can connect to backend API
- [ ] OpenAI API key is configured correctly
- [ ] CORS is configured to allow frontend domain
- [ ] Session storage directory exists and is writable
- [ ] Educational content files are deployed with backend
- [ ] Disclaimer modal appears on first visit
- [ ] Test complete onboarding flow
- [ ] Test conversational capability
- [ ] Test investment visualization

## Monitoring

Set up monitoring for:
- API response times (target: <3 seconds for 95th percentile)
- OpenAI API error rates (alert if >5% over 5 minutes)
- Session write failures
- Frontend error tracking

## Scaling Considerations

For production use beyond prototype:
1. Replace file-based session storage with Redis or database
2. Implement proper authentication and authorization
3. Add rate limiting per user (not just per session)
4. Set up CDN for frontend assets
5. Implement proper logging and monitoring
6. Add backup and disaster recovery procedures
7. Implement data retention and privacy policies

## Support

For issues or questions, refer to:
- Requirements: `.kiro/specs/ai-conversational-wealth-coach/requirements.md`
- Design: `.kiro/specs/ai-conversational-wealth-coach/design.md`
- Tasks: `.kiro/specs/ai-conversational-wealth-coach/tasks.md`
