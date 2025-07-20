import React, { useState } from 'react';
import { BarChart3, Target, Clock, TrendingUp, Play, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { LLMService, EvaluationMetrics } from '../../utils/llmService';
import { ProcessedDocument } from '../../utils/documentProcessor';

interface AccuracyEvaluationProps {
  documents: ProcessedDocument[];
}

const AccuracyEvaluation: React.FC<AccuracyEvaluationProps> = ({ documents }) => {
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [metrics, setMetrics] = useState<EvaluationMetrics | null>(null);

  const testCases = [
    {
      query: "46-year-old male, knee surgery in Pune, 3-month-old insurance policy",
      expectedDecision: "approved",
      expectedAmount: 500000
    },
    {
      query: "35F, appendectomy, Mumbai, 6 months policy duration",
      expectedDecision: "approved",
      expectedAmount: 300000
    },
    {
      query: "75M, knee surgery, Delhi, 1-year policy",
      expectedDecision: "rejected",
      expectedAmount: 0
    },
    {
      query: "28F, cosmetic surgery, Bangalore, 2-year policy",
      expectedDecision: "rejected",
      expectedAmount: 0
    },
    {
      query: "52M, emergency heart surgery, Chennai, 1-day policy",
      expectedDecision: "approved",
      expectedAmount: 1000000
    }
  ];

  const runEvaluation = async () => {
    if (documents.length === 0) {
      alert('Please upload documents first to run evaluation');
      return;
    }

    setIsEvaluating(true);
    const llmService = LLMService.getInstance();
    
    try {
      const evaluationMetrics = await llmService.evaluateAccuracy(testCases, documents);
      setMetrics(evaluationMetrics);
    } catch (error) {
      console.error('Evaluation failed:', error);
    } finally {
      setIsEvaluating(false);
    }
  };

  const MetricCard: React.FC<{
    title: string;
    value: number;
    unit: string;
    icon: React.ReactNode;
    color: string;
  }> = ({ title, value, unit, icon, color }) => (
    <motion.div 
      className={`p-4 rounded-lg border ${color}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">{title}</span>
        {icon}
      </div>
      <div className="text-2xl font-bold text-gray-800">
        {unit === '%' ? `${(value * 100).toFixed(1)}%` : 
         unit === 'ms' ? `${value.toFixed(0)}ms` : 
         value.toFixed(3)}
      </div>
    </motion.div>
  );

  return (
    <motion.div 
      className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-r from-purple-600 to-pink-500 p-2 rounded-lg">
            <BarChart3 className="h-5 w-5 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800">Model Accuracy Evaluation</h3>
        </div>
        
        <motion.button
          onClick={runEvaluation}
          disabled={isEvaluating || documents.length === 0}
          className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white px-4 py-2 rounded-lg font-medium hover:from-purple-700 hover:to-pink-600 transition-all duration-200 disabled:opacity-50"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isEvaluating ? (
            <>
              <motion.div 
                className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              <span>Evaluating...</span>
            </>
          ) : (
            <>
              <Play className="h-4 w-4" />
              <span>Run Evaluation</span>
            </>
          )}
        </motion.button>
      </div>

      {/* Test Cases */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Test Cases ({testCases.length})</h4>
        <div className="space-y-2">
          {testCases.map((testCase, index) => (
            <div key={index} className="p-3 bg-gray-50 rounded-lg text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-700">{testCase.query}</span>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    testCase.expectedDecision === 'approved' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {testCase.expectedDecision}
                  </span>
                  {testCase.expectedAmount > 0 && (
                    <span className="text-xs text-gray-500">
                      ₹{testCase.expectedAmount.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Metrics Display */}
      {metrics && (
        <motion.div 
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center space-x-2 text-green-600 mb-4">
            <CheckCircle className="h-5 w-5" />
            <span className="font-medium">Evaluation Complete</span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MetricCard
              title="Accuracy"
              value={metrics.accuracy}
              unit="%"
              icon={<Target className="h-5 w-5 text-green-600" />}
              color="border-green-200 bg-green-50"
            />
            <MetricCard
              title="Precision"
              value={metrics.precision}
              unit="%"
              icon={<TrendingUp className="h-5 w-5 text-blue-600" />}
              color="border-blue-200 bg-blue-50"
            />
            <MetricCard
              title="F1 Score"
              value={metrics.f1Score}
              unit=""
              icon={<BarChart3 className="h-5 w-5 text-purple-600" />}
              color="border-purple-200 bg-purple-50"
            />
            <MetricCard
              title="Avg Response Time"
              value={metrics.responseTime}
              unit="ms"
              icon={<Clock className="h-5 w-5 text-orange-600" />}
              color="border-orange-200 bg-orange-50"
            />
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <h5 className="font-medium text-gray-800 mb-2">Performance Summary</h5>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Overall Confidence:</span>
                <span className="ml-2 font-medium">
                  {(metrics.confidenceScore * 100).toFixed(1)}%
                </span>
              </div>
              <div>
                <span className="text-gray-600">Test Cases Passed:</span>
                <span className="ml-2 font-medium">
                  {Math.round(metrics.accuracy * testCases.length)}/{testCases.length}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {!metrics && !isEvaluating && (
        <div className="text-center py-8 text-gray-500">
          <BarChart3 className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p>Run evaluation to see accuracy metrics</p>
          <p className="text-sm mt-1">Upload documents and click "Run Evaluation"</p>
        </div>
      )}
    </motion.div>
  );
};

export default AccuracyEvaluation;