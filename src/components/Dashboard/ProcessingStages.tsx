import React from 'react';
import { Brain, Search, FileText, CheckCircle, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

interface ProcessingStagesProps {
  currentStage: 'parsing' | 'searching' | 'deciding' | 'completed';
}

const ProcessingStages: React.FC<ProcessingStagesProps> = ({ currentStage }) => {
  const stages = [
    { id: 'parsing', label: 'Query Parsing', icon: Brain, description: 'Understanding natural language' },
    { id: 'searching', label: 'Semantic Search', icon: Search, description: 'Finding relevant clauses' },
    { id: 'deciding', label: 'Decision Engine', icon: FileText, description: 'Evaluating against policies' },
    { id: 'completed', label: 'Response Ready', icon: CheckCircle, description: 'Generated structured output' }
  ];

  const getStageStatus = (stageId: string) => {
    const stageIndex = stages.findIndex(s => s.id === stageId);
    const currentIndex = stages.findIndex(s => s.id === currentStage);
    
    if (stageIndex < currentIndex) return 'completed';
    if (stageIndex === currentIndex) return 'active';
    return 'pending';
  };

  return (
    <motion.div 
      className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <h3 className="text-lg font-semibold text-gray-800 mb-6">Processing Pipeline</h3>
      
      <div className="space-y-4">
        {stages.map((stage, index) => {
          const status = getStageStatus(stage.id);
          const Icon = stage.icon;
          
          return (
            <motion.div 
              key={stage.id}
              className="flex items-center space-x-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300
                ${status === 'completed' ? 'bg-green-100 text-green-600' : ''}
                ${status === 'active' ? 'bg-blue-100 text-blue-600' : ''}
                ${status === 'pending' ? 'bg-gray-100 text-gray-400' : ''}
              `}>
                {status === 'active' ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <Icon className="h-5 w-5" />
                  </motion.div>
                ) : status === 'completed' ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <CheckCircle className="h-5 w-5" />
                  </motion.div>
                ) : (
                  <Clock className="h-5 w-5" />
                )}
              </div>
              
              <div className="flex-1">
                <h4 className={`font-medium transition-colors duration-200 ${
                  status === 'completed' ? 'text-green-600' :
                  status === 'active' ? 'text-blue-600' : 'text-gray-400'
                }`}>
                  {stage.label}
                </h4>
                <p className="text-sm text-gray-500">{stage.description}</p>
              </div>
              
              <div className={`w-3 h-3 rounded-full transition-all duration-300 ${
                status === 'completed' ? 'bg-green-400' :
                status === 'active' ? 'bg-blue-400 animate-pulse' : 'bg-gray-300'
              }`} />
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default ProcessingStages;