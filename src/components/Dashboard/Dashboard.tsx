import React, { useState } from 'react';
import { motion } from 'framer-motion';
import QueryInput from './QueryInput';
import ProcessingStages from './ProcessingStages';
import ResultsDisplay from './ResultsDisplay';
import FileUpload from './FileUpload';
import AccuracyEvaluation from './AccuracyEvaluation';
import LLMSettings from './LLMSettings';
import { LLMProcessor } from '../../utils/llmProcessor';
import { ProcessedDocument } from '../../utils/documentProcessor';
import { Decision, ParsedQuery } from '../../types';

const Dashboard: React.FC = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStage, setCurrentStage] = useState<'parsing' | 'searching' | 'deciding' | 'completed'>('completed');
  const [decision, setDecision] = useState<Decision | null>(null);
  const [parsedQuery, setParsedQuery] = useState<ParsedQuery | null>(null);
  const [documents, setDocuments] = useState<ProcessedDocument[]>([]);

  const handleDocumentsProcessed = (processedDocs: ProcessedDocument[]) => {
    setDocuments(processedDocs);
    const processor = LLMProcessor.getInstance();
    processor.setDocuments(processedDocs);
  };

  const handleSubmitQuery = async (query: string) => {
    setIsProcessing(true);
    setDecision(null);
    setParsedQuery(null);
    
    const processor = LLMProcessor.getInstance();
    
    try {
      // Stage 1: Parse Query
      setCurrentStage('parsing');
      const parsed = await processor.parseQuery(query);
      setParsedQuery(parsed);
      
      // Stage 2: Semantic Search
      setCurrentStage('searching');
      const relevantClauses = await processor.semanticSearch(parsed);
      
      // Stage 3: Make Decision
      setCurrentStage('deciding');
      const result = await processor.makeDecision(parsed, relevantClauses);
      
      // Stage 4: Complete
      setCurrentStage('completed');
      setDecision(result);
      
    } catch (error) {
      console.error('Error processing query:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-teal-50 to-orange-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            LLM Document Analysis Dashboard
          </h1>
          <p className="text-gray-600">
            Process natural language queries against your policy documents using advanced AI
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <QueryInput onSubmitQuery={handleSubmitQuery} isProcessing={isProcessing} />
            
            {isProcessing && (
              <ProcessingStages currentStage={currentStage} />
            )}
            
            {decision && parsedQuery && !isProcessing && (
              <ResultsDisplay decision={decision} parsedQuery={parsedQuery} />
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <LLMSettings />
            <FileUpload onDocumentsProcessed={handleDocumentsProcessed} />
            <AccuracyEvaluation documents={documents} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;