import { Document, Clause, User } from '../types';

export const mockUser: User = {
  id: '1',
  email: 'demo@claimiq.com',
  name: 'Demo User',
  role: 'analyst',
  createdAt: '2024-01-01T00:00:00Z'
};

export const mockDocuments: Document[] = [
  {
    id: 'doc-1',
    name: 'Health Insurance Policy - Comprehensive Care',
    type: 'policy',
    content: 'Health Insurance Policy Document',
    uploadedAt: '2024-01-15T10:00:00Z',
    size: 245760,
    status: 'ready'
  },
  {
    id: 'doc-2',
    name: 'Surgical Coverage Guidelines',
    type: 'policy',
    content: 'Surgical procedures coverage document',
    uploadedAt: '2024-01-10T14:30:00Z',
    size: 189432,
    status: 'ready'
  },
  {
    id: 'doc-3',
    name: 'Regional Coverage Limitations',
    type: 'contract',
    content: 'Geographic coverage limitations',
    uploadedAt: '2024-01-05T09:15:00Z',
    size: 156890,
    status: 'ready'
  }
];

export const mockClauses: Clause[] = [
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
    content: 'Orthopedic procedures including knee, hip, and shoulder surgeries are eligible for coverage with a maximum claim amount of ₹5,00,000 per policy year.',
    category: 'orthopedic-coverage',
    confidence: 0.89,
    section: 'Section 3.1 - Orthopedic Coverage'
  },
  {
    id: 'clause-3',
    documentId: 'doc-1',
    content: 'Waiting period for pre-existing conditions is waived after 24 months of continuous policy coverage.',
    category: 'waiting-period',
    confidence: 0.85,
    section: 'Section 2.4 - Waiting Periods'
  },
  {
    id: 'clause-4',
    documentId: 'doc-3',
    content: 'Coverage is available across all major cities in India including Mumbai, Delhi, Bangalore, Chennai, Hyderabad, and Pune.',
    category: 'geographic-coverage',
    confidence: 0.94,
    section: 'Section 1.3 - Geographic Coverage'
  },
  {
    id: 'clause-5',
    documentId: 'doc-2',
    content: 'Emergency surgical procedures are covered from day one of policy inception with no waiting period.',
    category: 'emergency-coverage',
    confidence: 0.87,
    section: 'Section 5.1 - Emergency Care'
  }
];

export const sampleQueries = [
  '46-year-old male, knee surgery in Pune, 3-month-old insurance policy',
  '35F, appendectomy, Mumbai, 6 months policy duration',
  '52M, heart bypass surgery, Delhi, 18 months coverage',
  '28F, maternity benefits, Bangalore, 1-year policy',
  '65M, cataract surgery, Chennai, 5-year policy holder'
];