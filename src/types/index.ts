export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'analyst' | 'user';
  createdAt: string;
}

export interface Document {
  id: string;
  name: string;
  type: 'policy' | 'contract' | 'email' | 'claim';
  content: string;
  uploadedAt: string;
  size: number;
  status: 'processing' | 'ready' | 'error';
}

export interface Clause {
  id: string;
  documentId: string;
  content: string;
  category: string;
  confidence: number;
  section: string;
}

export interface Query {
  id: string;
  content: string;
  userId: string;
  createdAt: string;
  status: 'processing' | 'completed' | 'error';
  processingTime?: number;
}

export interface Decision {
  id: string;
  queryId: string;
  decision: 'approved' | 'rejected' | 'pending';
  amount?: number;
  confidence: number;
  justification: string;
  relevantClauses: Clause[];
  createdAt: string;
}

export interface ParsedQuery {
  age?: number;
  gender?: string;
  procedure?: string;
  location?: string;
  policyDuration?: string;
  amount?: number;
  category: string;
}