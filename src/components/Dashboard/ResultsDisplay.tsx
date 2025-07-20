import React from 'react';
import { CheckCircle, XCircle, AlertCircle, DollarSign, FileText, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { Decision, ParsedQuery } from '../../types';

interface ResultsDisplayProps {
  decision: Decision;
  parsedQuery: ParsedQuery;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ decision, parsedQuery }) => {
  const getDecisionIcon = () => {
    switch (decision.decision) {
      case 'approved': return CheckCircle;
      case 'rejected': return XCircle;
      case 'pending': return AlertCircle;
      default: return AlertCircle;
    }
  };

  const getDecisionColor = () => {
    switch (decision.decision) {
      case 'approved': return 'text-green-600 bg-green-50 border-green-200';
      case 'rejected': return 'text-red-600 bg-red-50 border-red-200';
      case 'pending': return 'text-orange-600 bg-orange-50 border-orange-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const DecisionIcon = getDecisionIcon();

  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Decision Summary */}
      <motion.div 
        className={`p-6 rounded-2xl border-2 ${getDecisionColor()}`}
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, type: "spring" }}
      >
        <div className="flex items-start space-x-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
          >
            <DecisionIcon className="h-8 w-8" />
          </motion.div>
          <div className="flex-1">
            <motion.h3 
              className="text-xl font-bold capitalize mb-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              Claim {decision.decision}
            </motion.h3>
            {decision.amount && (
              <motion.div 
                className="flex items-center space-x-2 mb-3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <DollarSign className="h-5 w-5" />
                <span className="text-lg font-semibold">
                  ₹{decision.amount.toLocaleString('en-IN')}
                </span>
                <span className="text-sm opacity-75">coverage amount</span>
              </motion.div>
            )}
            <motion.div 
              className="flex items-center space-x-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <span className="text-sm">Confidence:</span>
              <div className="flex-1 bg-white bg-opacity-50 rounded-full h-2 max-w-24">
                <motion.div 
                  className="h-2 bg-current rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${decision.confidence * 100}%` }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                />
              </div>
              <span className="text-sm font-medium">{Math.round(decision.confidence * 100)}%</span>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Parsed Query Details */}
      <motion.div 
        className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        <h4 className="text-lg font-semibold text-gray-800 mb-4">Query Analysis</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {parsedQuery.age && (
            <motion.div 
              className="bg-blue-50 p-3 rounded-lg"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.3 }}
            >
              <p className="text-sm text-blue-600 font-medium">Age</p>
              <p className="text-lg font-semibold text-blue-800">{parsedQuery.age} years</p>
            </motion.div>
          )}
          {parsedQuery.gender && (
            <motion.div 
              className="bg-teal-50 p-3 rounded-lg"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.3 }}
            >
              <p className="text-sm text-teal-600 font-medium">Gender</p>
              <p className="text-lg font-semibold text-teal-800 capitalize">{parsedQuery.gender}</p>
            </motion.div>
          )}
          {parsedQuery.procedure && (
            <motion.div 
              className="bg-orange-50 p-3 rounded-lg"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.3 }}
            >
              <p className="text-sm text-orange-600 font-medium">Procedure</p>
              <p className="text-lg font-semibold text-orange-800 capitalize">{parsedQuery.procedure}</p>
            </motion.div>
          )}
          {parsedQuery.location && (
            <motion.div 
              className="bg-green-50 p-3 rounded-lg"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.3 }}
            >
              <p className="text-sm text-green-600 font-medium">Location</p>
              <p className="text-lg font-semibold text-green-800">{parsedQuery.location}</p>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Justification */}
      <motion.div 
        className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        <h4 className="text-lg font-semibold text-gray-800 mb-4">Decision Justification</h4>
        <p className="text-gray-700 leading-relaxed">{decision.justification}</p>
      </motion.div>

      {/* Relevant Clauses */}
      <motion.div 
        className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
      >
        <h4 className="text-lg font-semibold text-gray-800 mb-4">Referenced Policy Clauses</h4>
        <div className="space-y-4">
          {decision.relevantClauses.map((clause, index) => (
            <motion.div 
              key={clause.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 + index * 0.1, duration: 0.5 }}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <FileText className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-600">{clause.section}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-500">Relevance:</span>
                  <span className="text-xs font-medium text-green-600">
                    {Math.round(clause.confidence * 100)}%
                  </span>
                </div>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed">{clause.content}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* JSON Output */}
      <motion.div 
        className="bg-gray-900 rounded-2xl p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
      >
        <h4 className="text-lg font-semibold text-white mb-4">Structured JSON Response</h4>
        <pre className="text-green-400 text-sm overflow-x-auto">
{JSON.stringify({
  decision: decision.decision,
  amount: decision.amount,
  confidence: decision.confidence,
  justification: decision.justification,
  relevantClauses: decision.relevantClauses.map(c => ({
    section: c.section,
    content: c.content,
    confidence: c.confidence
  })),
  timestamp: decision.createdAt
}, null, 2)}
        </pre>
      </motion.div>
    </motion.div>
  );
};

export default ResultsDisplay;