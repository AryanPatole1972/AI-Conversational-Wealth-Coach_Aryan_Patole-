import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ChatInterface } from './components/ChatInterface';
import { FinancialDashboard } from './components/FinancialDashboard';
import { CompoundingVisualizer } from './components/CompoundingVisualizer';
import { DisclaimerModal } from './components/DisclaimerModal';
import { Message, UserProfile, SessionData, ProjectionScenario } from './types';

const API_URL = 'http://localhost:3000';

function App() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [projectionData, setProjectionData] = useState<ProjectionScenario[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if user has seen disclaimer
    const disclaimerAccepted = localStorage.getItem('disclaimerAccepted');
    if (disclaimerAccepted) {
      setShowDisclaimer(false);
    }

    // Try to restore session
    const savedSessionId = localStorage.getItem('sessionId');
    if (savedSessionId) {
      restoreSession(savedSessionId);
    } else {
      createNewSession();
    }
  }, []);

  const createNewSession = async () => {
    try {
      const response = await axios.post(`${API_URL}/api/sessions`);
      const newSessionId = response.data.sessionId;
      setSessionId(newSessionId);
      localStorage.setItem('sessionId', newSessionId);
      
      // Add welcome message
      const welcomeMessage: Message = {
        id: 'welcome',
        role: 'assistant',
        content: "Hello! I'm your AI Wealth Coach. I'm here to help you learn about investing and understand your financial options. Let's start by getting to know your financial situation.\n\nWhat is your monthly income?",
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
    } catch (error) {
      console.error('Error creating session:', error);
      setError('Failed to start session. Please refresh the page.');
    }
  };

  const restoreSession = async (savedSessionId: string) => {
    try {
      const response = await axios.get(`${API_URL}/api/sessions/${savedSessionId}`);
      const session: SessionData = response.data;
      
      setSessionId(savedSessionId);
      setMessages(session.conversationHistory);
      setUserProfile(session.userProfile);
    } catch (error) {
      console.error('Error restoring session:', error);
      // If session not found, create new one
      createNewSession();
    }
  };

  const handleMessageSent = async (message: string) => {
    if (!sessionId) return;

    // Add user message immediately
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: message,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        `${API_URL}/api/sessions/${sessionId}/messages`,
        { message }
      );

      // Add assistant response
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: response.data.message,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);

      // Update profile if session changed
      const sessionResponse = await axios.get(`${API_URL}/api/sessions/${sessionId}`);
      setUserProfile(sessionResponse.data.userProfile);
    } catch (error: any) {
      console.error('Error sending message:', error);
      
      if (error.response?.status === 429) {
        setError('Too many requests. Please wait a moment before sending another message.');
      } else {
        setError('Failed to send message. Please try again.');
      }

      // Add error message
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisclaimerAccept = () => {
    localStorage.setItem('disclaimerAccepted', 'true');
    setShowDisclaimer(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <DisclaimerModal isOpen={showDisclaimer} onAccept={handleDisclaimerAccept} />
      
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            AI Conversational Wealth Coach
          </h1>
          <p className="text-gray-600">
            Learn about investing through friendly conversation
          </p>
        </header>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chat Interface - Takes 2 columns on large screens */}
          <div className="lg:col-span-2 h-[600px]">
            <ChatInterface
              sessionId={sessionId || ''}
              onMessageSent={handleMessageSent}
              messages={messages}
              isLoading={isLoading}
            />
          </div>

          {/* Sidebar - Dashboard and Visualizer */}
          <div className="space-y-6">
            <FinancialDashboard userProfile={userProfile} projectionData={projectionData} />
            
            {userProfile && userProfile.surplus > 0 && (
              <CompoundingVisualizer
                initialAmount={userProfile.surplus}
                monthlyContribution={Math.round(userProfile.surplus * 0.5)}
                onProjectionUpdate={setProjectionData}
              />
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-8 text-center text-sm text-gray-600">
          <p>
            This is an educational tool. For personalized financial advice, consult a licensed financial advisor.
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
