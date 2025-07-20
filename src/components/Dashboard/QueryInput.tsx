import React, { useState } from 'react';
import { Send, Mic, FileText, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { sampleQueries } from '../../utils/mockData';

interface QueryInputProps {
  onSubmitQuery: (query: string) => void;
  isProcessing: boolean;
}

const QueryInput: React.FC<QueryInputProps> = ({ onSubmitQuery, isProcessing }) => {
  const [query, setQuery] = useState('');
  const [showSamples, setShowSamples] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !isProcessing) {
      onSubmitQuery(query.trim());
    }
  };

  const handleSampleClick = (sampleQuery: string) => {
    setQuery(sampleQuery);
    setShowSamples(false);
  };

  return (
    <motion.div 
      className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="flex items-center space-x-3 mb-4">
        <div className="bg-gradient-to-r from-blue-600 to-teal-500 p-2 rounded-lg">
          <FileText className="h-5 w-5 text-white" />
        </div>
        <h2 className="text-xl font-semibold text-gray-800">Natural Language Query</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter your query in plain English (e.g., '46-year-old male, knee surgery in Pune, 3-month-old insurance policy')"
            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none h-24 transition-all duration-200"
            disabled={isProcessing}
          />
          <motion.button
            type="button"
            onClick={() => setShowSamples(!showSamples)}
            className="absolute top-2 right-2 p-2 text-gray-400 hover:text-blue-600 transition-colors duration-200"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Sparkles className="h-4 w-4" />
          </motion.button>
        </div>

        <AnimatePresence>
          {showSamples && (
            <motion.div 
              className="space-y-2"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-sm text-gray-600 font-medium">Sample Queries:</p>
              <div className="grid gap-2">
                {sampleQueries.map((sample, index) => (
                  <motion.button
                    key={index}
                    type="button"
                    onClick={() => handleSampleClick(sample)}
                    className="text-left p-3 bg-gray-50 hover:bg-blue-50 rounded-lg text-sm text-gray-700 hover:text-blue-700 transition-all duration-200 border border-transparent hover:border-blue-200"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.3 }}
                  >
                    {sample}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center space-x-3">
          <motion.button
            type="submit"
            disabled={!query.trim() || isProcessing}
            className="flex-1 bg-gradient-to-r from-blue-600 to-teal-500 text-white py-3 rounded-lg font-medium hover:from-blue-700 hover:to-teal-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            whileHover={{ scale: isProcessing ? 1 : 1.02 }}
            whileTap={{ scale: isProcessing ? 1 : 0.98 }}
          >
            {isProcessing ? (
              <>
                <motion.div 
                  className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                <span>Analyze Query</span>
              </>
            )}
          </motion.button>
          
          <motion.button
            type="button"
            className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled
          >
            <Mic className="h-4 w-4 text-gray-400" />
          </motion.button>
        </div>
      </form>

      {isProcessing && (
        <motion.div 
          className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="flex items-center space-x-3">
            <motion.div 
              className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <div>
              <p className="text-sm font-medium text-blue-800">Processing Query</p>
              <p className="text-xs text-blue-600">Parsing language, searching documents, and generating response...</p>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default QueryInput;