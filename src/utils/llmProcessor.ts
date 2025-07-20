import { ParsedQuery, Clause, Decision } from '../types';
import { LLMService } from './llmService';
import { ProcessedDocument } from './documentProcessor';

export class LLMProcessor {
  private static instance: LLMProcessor;
  private documents: ProcessedDocument[] = [];
  
  static getInstance(): LLMProcessor {
    if (!LLMProcessor.instance) {
      LLMProcessor.instance = new LLMProcessor();
    }
    return LLMProcessor.instance;
  }

  setDocuments(documents: ProcessedDocument[]) {
    this.documents = documents;
  }

  async parseQuery(query: string): Promise<ParsedQuery> {
    const llmService = LLMService.getInstance();
    return await llmService.parseQuery(query);
  }

  async semanticSearch(parsedQuery: ParsedQuery): Promise<Clause[]> {
    const llmService = LLMService.getInstance();
    return await llmService.semanticSearch(parsedQuery, this.documents);
  }

  async makeDecision(parsedQuery: ParsedQuery, relevantClauses: Clause[]): Promise<Decision> {

    const llmService = LLMService.getInstance();
    return await llmService.makeDecision(parsedQuery, relevantClauses);
  }
}