import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { AssetClassInfo, EducationalContent } from '../types/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class ContentLibrary {
  private assetClasses: Map<string, AssetClassInfo> = new Map();
  private educationalContent: Map<string, EducationalContent> = new Map();
  private initialized = false;

  async initialize(): Promise<void> {
    if (this.initialized) return;

    await Promise.all([
      this.loadAssetClasses(),
      this.loadEducationalContent(),
    ]);

    this.initialized = true;
  }

  private async loadAssetClasses(): Promise<void> {
    const assetClassesDir = path.join(__dirname, '../data/asset-classes');
    
    try {
      const files = await fs.readdir(assetClassesDir);
      
      for (const file of files) {
        if (file.endsWith('.json')) {
          const filePath = path.join(assetClassesDir, file);
          const data = await fs.readFile(filePath, 'utf-8');
          const assetClass: AssetClassInfo = JSON.parse(data);
          
          // Store by lowercase name for case-insensitive lookup
          this.assetClasses.set(assetClass.name.toLowerCase(), assetClass);
        }
      }
    } catch (error) {
      console.error('Error loading asset classes:', error);
    }
  }

  private async loadEducationalContent(): Promise<void> {
    const contentDir = path.join(__dirname, '../data/educational-content');
    
    try {
      const files = await fs.readdir(contentDir);
      
      for (const file of files) {
        if (file.endsWith('.json')) {
          const filePath = path.join(contentDir, file);
          const data = await fs.readFile(filePath, 'utf-8');
          const content: EducationalContent = JSON.parse(data);
          
          // Convert date string to Date object
          content.lastUpdated = new Date(content.lastUpdated);
          
          // Store by topic for easy lookup
          this.educationalContent.set(content.topic, content);
        }
      }
    } catch (error) {
      console.error('Error loading educational content:', error);
    }
  }

  getAssetClassInfo(assetClass: string): AssetClassInfo | null {
    return this.assetClasses.get(assetClass.toLowerCase()) || null;
  }

  getAllAssetClasses(): AssetClassInfo[] {
    return Array.from(this.assetClasses.values());
  }

  getEducationalContent(topic: string): EducationalContent | null {
    return this.educationalContent.get(topic) || null;
  }

  getAllEducationalContent(): EducationalContent[] {
    return Array.from(this.educationalContent.values());
  }

  searchContent(query: string): EducationalContent[] {
    const lowerQuery = query.toLowerCase();
    const results: EducationalContent[] = [];

    for (const content of this.educationalContent.values()) {
      // Search in title, topic, and keywords
      if (
        content.title.toLowerCase().includes(lowerQuery) ||
        content.topic.toLowerCase().includes(lowerQuery) ||
        content.keywords.some(keyword => keyword.toLowerCase().includes(lowerQuery))
      ) {
        results.push(content);
      }
    }

    return results;
  }

  getRelatedContent(topic: string): EducationalContent[] {
    const content = this.getEducationalContent(topic);
    if (!content) return [];

    const related: EducationalContent[] = [];
    for (const relatedTopic of content.relatedTopics) {
      const relatedContent = this.getEducationalContent(relatedTopic);
      if (relatedContent) {
        related.push(relatedContent);
      }
    }

    return related;
  }

  compareAssetClasses(assetClassNames: string[]): AssetClassInfo[] {
    if (assetClassNames.length > 4) {
      throw new Error('Cannot compare more than 4 asset classes at once');
    }

    const comparison: AssetClassInfo[] = [];
    for (const name of assetClassNames) {
      const assetClass = this.getAssetClassInfo(name);
      if (assetClass) {
        comparison.push(assetClass);
      }
    }

    return comparison;
  }
}
