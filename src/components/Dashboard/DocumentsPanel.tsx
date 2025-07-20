import React from 'react';
import { FileText, Download, Eye, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { mockDocuments } from '../../utils/mockData';

const DocumentsPanel: React.FC = () => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready': return 'text-green-600 bg-green-50';
      case 'processing': return 'text-orange-600 bg-orange-50';
      case 'error': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const formatFileSize = (bytes: number) => {
    const kb = bytes / 1024;
    return `${Math.round(kb)} KB`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <motion.div 
      className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Knowledge Base</h3>
        <span className="text-sm text-gray-500">{mockDocuments.length} documents</span>
      </div>

      <div className="space-y-3">
        {mockDocuments.map((doc, index) => (
          <motion.div 
            key={doc.id}
            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200 hover:border-blue-200"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-start space-x-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <FileText className="h-4 w-4 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-gray-800 truncate">{doc.name}</h4>
                <div className="flex items-center space-x-4 mt-1">
                  <span className="text-xs text-gray-500">{formatFileSize(doc.size)}</span>
                  <span className="text-xs text-gray-500">{formatDate(doc.uploadedAt)}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(doc.status)}`}>
                    {doc.status}
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <motion.button 
                  className="p-1 text-gray-400 hover:text-blue-600 transition-colors duration-200"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Eye className="h-4 w-4" />
                </motion.button>
                <motion.button 
                  className="p-1 text-gray-400 hover:text-green-600 transition-colors duration-200"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Download className="h-4 w-4" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.button 
        className="w-full mt-4 p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-all duration-200 text-sm font-medium"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        + Upload New Document
      </motion.button>
    </motion.div>
  );
};

export default DocumentsPanel;