import { v4 as uuidv4 } from 'uuid';
import fs from 'fs/promises';
import path from 'path';
import { SessionData } from '../types/index.js';

export class SessionManager {
  private sessionsDir: string;
  private readonly RETENTION_DAYS = 30;

  constructor(dataDir: string = './data/sessions') {
    this.sessionsDir = dataDir;
    this.ensureSessionsDirectory();
  }

  private async ensureSessionsDirectory(): Promise<void> {
    try {
      await fs.mkdir(this.sessionsDir, { recursive: true });
    } catch (error) {
      console.error('Failed to create sessions directory:', error);
    }
  }

  async createSession(): Promise<string> {
    const sessionId = uuidv4();
    const now = new Date();
    
    const sessionData: SessionData = {
      id: sessionId,
      userProfile: null,
      conversationHistory: [],
      mode: 'onboarding',
      createdAt: now,
      lastAccessedAt: now,
      metadata: {
        onboardingComplete: false,
        disclaimerShown: false,
      },
    };

    await this.saveSession(sessionId, sessionData);
    return sessionId;
  }

  async getSession(sessionId: string): Promise<SessionData | null> {
    try {
      const filePath = path.join(this.sessionsDir, `${sessionId}.json`);
      const data = await fs.readFile(filePath, 'utf-8');
      const session: SessionData = JSON.parse(data);
      
      // Check if session has expired
      const daysSinceCreation = (Date.now() - new Date(session.createdAt).getTime()) / (1000 * 60 * 60 * 24);
      if (daysSinceCreation > this.RETENTION_DAYS) {
        await this.deleteSession(sessionId);
        return null;
      }

      // Update last accessed time
      session.lastAccessedAt = new Date();
      await this.saveSession(sessionId, session);
      
      return session;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        return null;
      }
      console.error('Error reading session:', error);
      throw error;
    }
  }

  async updateSession(sessionId: string, data: Partial<SessionData>): Promise<void> {
    const session = await this.getSession(sessionId);
    if (!session) {
      throw new Error(`Session ${sessionId} not found`);
    }

    const updatedSession: SessionData = {
      ...session,
      ...data,
      id: sessionId, // Ensure ID doesn't change
      lastAccessedAt: new Date(),
    };

    await this.saveSession(sessionId, updatedSession);
  }

  async deleteSession(sessionId: string): Promise<void> {
    try {
      const filePath = path.join(this.sessionsDir, `${sessionId}.json`);
      await fs.unlink(filePath);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
        console.error('Error deleting session:', error);
        throw error;
      }
    }
  }

  private async saveSession(sessionId: string, session: SessionData): Promise<void> {
    try {
      await this.ensureSessionsDirectory();
      const filePath = path.join(this.sessionsDir, `${sessionId}.json`);
      await fs.writeFile(filePath, JSON.stringify(session, null, 2), 'utf-8');
    } catch (error) {
      console.error('Error saving session:', error);
      throw error;
    }
  }

  // Cleanup expired sessions
  async cleanupExpiredSessions(): Promise<number> {
    try {
      const files = await fs.readdir(this.sessionsDir);
      let deletedCount = 0;

      for (const file of files) {
        if (file.endsWith('.json')) {
          const sessionId = file.replace('.json', '');
          const session = await this.getSession(sessionId);
          if (!session) {
            deletedCount++;
          }
        }
      }

      return deletedCount;
    } catch (error) {
      console.error('Error cleaning up sessions:', error);
      return 0;
    }
  }
}
