import React, { useState } from 'react';
import { Settings, Key, Save, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { LLMService } from '../../utils/llmService';

const LLMSettings: React.FC = () => {
  const [apiKey, setApiKey] = useState('');
  const [isConfigured, setIsConfigured] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveApiKey = async () => {
    setIsSaving(true);
    if (apiKey.trim()) {
      const llmService = LLMService.getInstance();
      llmService.setApiKey(apiKey.trim());
      
      // Don't store the actual key for security
      localStorage.setItem('llm_configured', 'true');
      
      // Simulate API validation
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsConfigured(true);
    }
    setIsSaving(false);
  };

  const handleClearApiKey = () => {
    setApiKey('');
    setIsConfigured(false);
    localStorage.removeItem('llm_configured');
  };

  React.useEffect(() => {
    const configured = localStorage.getItem('llm_configured') === 'true';
    setIsConfigured(configured);
  }, []);

  return (
    <motion.div 
      className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
    >
      <div className="flex items-center space-x-3 mb-6">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-500 p-2 rounded-lg">
          <Settings className="h-5 w-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800">LLM Configuration</h3>
          <p className="text-sm text-gray-500">Configure OpenAI API for real-time processing</p>
        </div>
      </div>

      <div className="space-y-4">
        {!isConfigured ? (
          <>
            <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
              <div className="flex items-start space-x-3">
                <Key className="h-6 w-6 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-blue-800">🚀 Enable Real LLM Processing</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    Add your OpenAI API key to unlock real-time document analysis and query processing.
                  </p>
                  <div className="mt-2 text-xs text-blue-600">
                    <p>✓ Natural language query parsing</p>
                    <p>✓ Semantic document search</p>
                    <p>✓ Intelligent decision making</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                OpenAI API Key *
              </label>
              <p className="text-xs text-gray-500 mb-2">
                Get your API key from <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">OpenAI Platform</a>
              </p>
              <div className="relative">
                <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type={showKey ? 'text' : 'password'}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="sk-proj-... (starts with sk-)"
                  className="w-full pl-10 pr-20 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-12 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm"
                >
                  {showKey ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <motion.button
              onClick={handleSaveApiKey}
              disabled={!apiKey.trim() || isSaving}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-500 text-white py-3 rounded-lg font-medium hover:from-indigo-700 hover:to-purple-600 transition-all duration-200 disabled:opacity-50 flex items-center justify-center space-x-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isSaving ? (
                <>
                  <motion.div 
                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                  <span>Configuring...</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>Enable Real LLM Processing</span>
                </>
              )}
            </motion.button>
            
            <div className="text-xs text-gray-500 text-center">
              Your API key is stored securely and never transmitted to our servers
            </div>
          </>
        ) : (
          <div className="space-y-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                <span className="text-sm font-medium text-green-800">
                  🎉 Real LLM Processing Active
                </span>
              </div>
              <p className="text-sm text-green-700 mt-1">
                Real-time processing enabled with OpenAI GPT-3.5-turbo
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Model:</span>
                <span className="ml-2 font-medium">GPT-3.5-turbo</span>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Temperature:</span>
                <span className="ml-2 font-medium">0.1</span>
              </div>
            </div>

            <button
              onClick={handleClearApiKey}
              className="w-full border border-red-300 text-red-700 py-2 rounded-lg font-medium hover:bg-red-50 transition-colors duration-200"
            >
              Remove API Key
            </button>
          </div>
        )}

        <div className="pt-4 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Features</h4>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span>Natural language query parsing</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span>Semantic document search</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span>Intelligent decision making</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span>Accuracy evaluation metrics</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default LLMSettings;