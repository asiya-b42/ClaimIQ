import { Document } from '../types';

export interface ProcessedDocument {
  id: string;
  name: string;
  content: string;
  chunks: DocumentChunk[];
  metadata: {
    pageCount?: number;
    wordCount: number;
    uploadedAt: string;
    size: number;
  };
}

export interface DocumentChunk {
  id: string;
  content: string;
  startIndex: number;
  endIndex: number;
  embedding?: number[];
}

export class DocumentProcessor {
  private static instance: DocumentProcessor;
  
  static getInstance(): DocumentProcessor {
    if (!DocumentProcessor.instance) {
      DocumentProcessor.instance = new DocumentProcessor();
    }
    return DocumentProcessor.instance;
  }

  async processFile(file: File): Promise<ProcessedDocument> {
    const content = await this.extractTextFromFile(file);
    const chunks = this.chunkDocument(content);
    
    return {
      id: `doc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: file.name,
      content,
      chunks,
      metadata: {
        wordCount: content.split(/\s+/).length,
        uploadedAt: new Date().toISOString(),
        size: file.size
      }
    };
  }

  private async extractTextFromFile(file: File): Promise<string> {
    const fileType = file.type;
    
    if (fileType === 'application/pdf') {
      return await this.extractFromPDF(file);
    } else if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      return await this.extractFromDocx(file);
    } else if (fileType === 'text/plain') {
      return await this.extractFromText(file);
    } else {
      throw new Error(`Unsupported file type: ${fileType}`);
    }
  }

  private async extractFromPDF(file: File): Promise<string> {
    try {
      // For demo purposes, we'll simulate PDF extraction
      // In production, you'd use pdf-parse or similar
      const arrayBuffer = await file.arrayBuffer();
      
      // Simulated PDF content extraction
      return `
        HEALTH INSURANCE POLICY DOCUMENT
        
        Section 1: Coverage Details
        This comprehensive health insurance policy provides coverage for medical expenses including surgical procedures, hospitalization, and emergency care.
        
        Section 2: Eligibility Criteria
        - Minimum age: 18 years
        - Maximum age: 65 years at entry
        - Waiting period: 30 days for general treatment, 24 months for pre-existing conditions
        
        Section 3: Surgical Coverage
        Knee replacement surgery is covered under this policy for patients aged 40-70 years with a minimum policy tenure of 2 months. Maximum coverage amount is ₹5,00,000 per policy year.
        
        Section 4: Geographic Coverage
        Coverage is available across all major cities in India including Mumbai, Delhi, Bangalore, Chennai, Hyderabad, and Pune.
        
        Section 5: Emergency Procedures
        Emergency surgical procedures are covered from day one of policy inception with no waiting period.
        
        Section 6: Exclusions
        - Cosmetic surgery
        - Experimental treatments
        - Self-inflicted injuries
        
        Section 7: Claim Process
        Claims must be submitted within 30 days of discharge with all required documentation.
      `;
    } catch (error) {
      throw new Error('Failed to extract text from PDF');
    }
  }

  private async extractFromDocx(file: File): Promise<string> {
    try {
      // Simulated DOCX extraction
      return `
        SURGICAL COVERAGE GUIDELINES
        
        Orthopedic Procedures:
        - Knee surgery: Covered for ages 40-70, minimum 2-month policy tenure
        - Hip replacement: Covered for ages 45-75, minimum 6-month policy tenure
        - Shoulder surgery: Covered for ages 30-65, minimum 3-month policy tenure
        
        Coverage Amounts:
        - Maximum per procedure: ₹5,00,000
        - Annual limit: ₹10,00,000
        
        Pre-authorization Required:
        All surgical procedures require pre-authorization 48 hours before the procedure.
      `;
    } catch (error) {
      throw new Error('Failed to extract text from DOCX');
    }
  }

  private async extractFromText(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = () => reject(new Error('Failed to read text file'));
      reader.readAsText(file);
    });
  }

  private chunkDocument(content: string, chunkSize: number = 500): DocumentChunk[] {
    const words = content.split(/\s+/);
    const chunks: DocumentChunk[] = [];
    
    for (let i = 0; i < words.length; i += chunkSize) {
      const chunkWords = words.slice(i, i + chunkSize);
      const chunkContent = chunkWords.join(' ');
      
      chunks.push({
        id: `chunk-${i / chunkSize}`,
        content: chunkContent,
        startIndex: i,
        endIndex: Math.min(i + chunkSize, words.length)
      });
    }
    
    return chunks;
  }
}