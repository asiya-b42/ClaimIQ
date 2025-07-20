import { ParsedQuery, Clause, Decision } from '../types';
import { ProcessedDocument } from './documentProcessor';

export interface LLMResponse {
  success: boolean;
  data?: any;
  error?: string;
}

export interface EvaluationMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  responseTime: number;
  confidenceScore: number;
}

export class LLMService {
  private static instance: LLMService;
  private apiKey: string | null = null;
  private baseURL = 'https://api.openai.com/v1';
  
  static getInstance(): LLMService {
    if (!LLMService.instance) {
      LLMService.instance = new LLMService();
    }
    return LLMService.instance;
  }

  setApiKey(apiKey: string) {
    this.apiKey = apiKey;
  }

  async parseQuery(query: string): Promise<ParsedQuery> {
    const startTime = Date.now();
    
    if (!this.apiKey) {
      // Fallback to mock processing for demo
      return this.mockParseQuery(query);
    }

    try {
      const prompt = `
        Parse the following insurance query and extract structured information:
        Query: "${query}"
        
        Extract and return JSON with these fields:
        - age: number (if mentioned)
        - gender: "male" | "female" (if mentioned)
        - procedure: string (medical procedure if mentioned)
        - location: string (city/location if mentioned)
        - policyDuration: string (policy tenure if mentioned)
        - amount: number (claim amount if mentioned)
        - category: string (always "insurance-claim")
        
        Return only valid JSON, no additional text.
      `;

      const response = await this.callLLM(prompt);
      return JSON.parse(response);
    } catch (error) {
      console.warn('LLM parsing failed, using fallback:', error);
      return this.mockParseQuery(query);
    }
  }

  async semanticSearch(query: ParsedQuery, documents: ProcessedDocument[]): Promise<Clause[]> {
    if (!this.apiKey || documents.length === 0) {
      return this.mockSemanticSearch(query);
    }

    try {
      const searchQuery = this.buildSearchQuery(query);
      const relevantClauses: Clause[] = [];

      for (const doc of documents) {
        const clauses = await this.findRelevantClauses(searchQuery, doc);
        relevantClauses.push(...clauses);
      }

      // Sort by relevance and return top 5
      return relevantClauses
        .sort((a, b) => b.confidence - a.confidence)
        .slice(0, 5);
    } catch (error) {
      console.warn('Semantic search failed, using fallback:', error);
      return this.mockSemanticSearch(query);
    }
  }

  async makeDecision(query: ParsedQuery, clauses: Clause[]): Promise<Decision> {
    if (!this.apiKey) {
      return this.mockMakeDecision(query, clauses);
    }

    try {
      const prompt = `
        Based on the following insurance query and policy clauses, make a decision:
        
        Query Details:
        ${JSON.stringify(query, null, 2)}
        
        Relevant Policy Clauses:
        ${clauses.map(c => `- ${c.section}: ${c.content}`).join('\n')}
        
        Analyze the query against the clauses and return a JSON decision with:
        - decision: "approved" | "rejected" | "pending"
        - amount: number (coverage amount if applicable)
        - confidence: number (0-1, confidence in decision)
        - justification: string (detailed explanation)
        
        Consider factors like age eligibility, procedure coverage, policy tenure, and geographic coverage.
        Return only valid JSON, no additional text.
      `;

      const response = await this.callLLM(prompt);
      const llmDecision = JSON.parse(response);

      return {
        id: `decision-${Date.now()}`,
        queryId: `query-${Date.now()}`,
        decision: llmDecision.decision,
        amount: llmDecision.amount,
        confidence: llmDecision.confidence,
        justification: llmDecision.justification,
        relevantClauses: clauses,
        createdAt: new Date().toISOString()
      };
    } catch (error) {
      console.warn('Decision making failed, using fallback:', error);
      return this.mockMakeDecision(query, clauses);
    }
  }

  async evaluateAccuracy(testCases: Array<{
    query: string;
    expectedDecision: string;
    expectedAmount?: number;
  }>, documents: ProcessedDocument[]): Promise<EvaluationMetrics> {
    const results = [];
    const startTime = Date.now();

    for (const testCase of testCases) {
      try {
        const parsed = await this.parseQuery(testCase.query);
        const clauses = await this.semanticSearch(parsed, documents);
        const decision = await this.makeDecision(parsed, clauses);

        const isCorrect = decision.decision === testCase.expectedDecision;
        const amountAccurate = !testCase.expectedAmount || 
          Math.abs((decision.amount || 0) - testCase.expectedAmount) < 10000;

        results.push({
          correct: isCorrect && amountAccurate,
          confidence: decision.confidence,
          responseTime: Date.now() - startTime
        });
      } catch (error) {
        results.push({
          correct: false,
          confidence: 0,
          responseTime: Date.now() - startTime
        });
      }
    }

    const totalTime = Date.now() - startTime;
    const correctResults = results.filter(r => r.correct).length;
    const accuracy = correctResults / results.length;
    const avgConfidence = results.reduce((sum, r) => sum + r.confidence, 0) / results.length;

    return {
      accuracy,
      precision: accuracy, // Simplified for demo
      recall: accuracy,    // Simplified for demo
      f1Score: accuracy,   // Simplified for demo
      responseTime: totalTime / results.length,
      confidenceScore: avgConfidence
    };
  }

  private async callLLM(prompt: string): Promise<string> {
    const response = await fetch(`${this.baseURL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.1,
        max_tokens: 1000
      })
    });

    if (!response.ok) {
      throw new Error(`LLM API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }

  private buildSearchQuery(query: ParsedQuery): string {
    const parts = [];
    if (query.procedure) parts.push(query.procedure);
    if (query.age) parts.push(`age ${query.age}`);
    if (query.location) parts.push(query.location);
    if (query.policyDuration) parts.push(`policy ${query.policyDuration}`);
    return parts.join(' ');
  }

  private async findRelevantClauses(searchQuery: string, doc: ProcessedDocument): Promise<Clause[]> {
    // Simplified semantic search - in production, use embeddings
    const clauses: Clause[] = [];
    
    doc.chunks.forEach((chunk, index) => {
      const relevanceScore = this.calculateRelevance(searchQuery, chunk.content);
      if (relevanceScore > 0.3) {
        clauses.push({
          id: `${doc.id}-clause-${index}`,
          documentId: doc.id,
          content: chunk.content,
          category: this.categorizeClause(chunk.content),
          confidence: relevanceScore,
          section: `Section ${index + 1}`
        });
      }
    });

    return clauses;
  }

  private calculateRelevance(query: string, content: string): number {
    const queryWords = query.toLowerCase().split(/\s+/);
    const contentWords = content.toLowerCase().split(/\s+/);
    
    let matches = 0;
    queryWords.forEach(word => {
      if (contentWords.some(cWord => cWord.includes(word) || word.includes(cWord))) {
        matches++;
      }
    });

    return Math.min(matches / queryWords.length, 1);
  }

  private categorizeClause(content: string): string {
    const lower = content.toLowerCase();
    if (lower.includes('surgery') || lower.includes('surgical')) return 'surgical-coverage';
    if (lower.includes('age') || lower.includes('eligibility')) return 'eligibility';
    if (lower.includes('waiting') || lower.includes('period')) return 'waiting-period';
    if (lower.includes('geographic') || lower.includes('location')) return 'geographic-coverage';
    if (lower.includes('emergency')) return 'emergency-coverage';
    return 'general';
  }

  // Fallback methods for demo purposes
  private async mockParseQuery(query: string): Promise<ParsedQuery> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const parsed: ParsedQuery = { category: 'insurance-claim' };
    
    const ageMatch = query.match(/(\d{1,2})[^\d]*(?:year|yr|y)?/i);
    if (ageMatch) parsed.age = parseInt(ageMatch[1]);

    const genderMatch = query.match(/(male|female|M|F)/i);
    if (genderMatch) {
      parsed.gender = genderMatch[1].toLowerCase().startsWith('m') ? 'male' : 'female';
    }

    const procedures = ['knee surgery', 'appendectomy', 'heart bypass', 'cataract surgery'];
    const procedureMatch = procedures.find(proc => 
      query.toLowerCase().includes(proc.toLowerCase())
    );
    if (procedureMatch) parsed.procedure = procedureMatch;

    const locations = ['pune', 'mumbai', 'delhi', 'bangalore', 'chennai'];
    const locationMatch = locations.find(loc => 
      query.toLowerCase().includes(loc.toLowerCase())
    );
    if (locationMatch) {
      parsed.location = locationMatch.charAt(0).toUpperCase() + locationMatch.slice(1);
    }

    const durationMatch = query.match(/(\d+)[^\d]*(?:month|year|yr)/i);
    if (durationMatch) parsed.policyDuration = durationMatch[0];

    return parsed;
  }

  private async mockSemanticSearch(query: ParsedQuery): Promise<Clause[]> {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Return mock clauses based on query
    const mockClauses: Clause[] = [
      {
        id: 'clause-1',
        documentId: 'doc-1',
        content: 'Knee replacement surgery is covered under the comprehensive plan for patients aged 40-70 years with a minimum policy tenure of 2 months.',
        category: 'surgical-coverage',
        confidence: 0.92,
        section: 'Section 4.2 - Surgical Procedures'
      },
      {
        id: 'clause-2',
        documentId: 'doc-2',
        content: 'Coverage is available across all major cities in India including Mumbai, Delhi, Bangalore, Chennai, Hyderabad, and Pune.',
        category: 'geographic-coverage',
        confidence: 0.85,
        section: 'Section 1.3 - Geographic Coverage'
      }
    ];

    return mockClauses;
  }

  private async mockMakeDecision(query: ParsedQuery, clauses: Clause[]): Promise<Decision> {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    let decision: 'approved' | 'rejected' | 'pending' = 'approved';
    let amount = 500000;
    let confidence = 0.89;
    let justification = 'Claim approved based on policy coverage for knee surgery in eligible age group and location.';

    if (query.age && (query.age < 40 || query.age > 70)) {
      decision = 'rejected';
      amount = 0;
      confidence = 0.95;
      justification = 'Claim rejected: Patient age is outside the eligible range of 40-70 years for knee surgery coverage.';
    }

    return {
      id: `decision-${Date.now()}`,
      queryId: `query-${Date.now()}`,
      decision,
      amount: amount > 0 ? amount : undefined,
      confidence,
      justification,
      relevantClauses: clauses,
      createdAt: new Date().toISOString()
    };
  }
}