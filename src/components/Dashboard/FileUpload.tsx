import React, { useCallback, useState } from 'react';
import { Upload, File, X, CheckCircle, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { DocumentProcessor, ProcessedDocument } from '../../utils/documentProcessor';

interface FileUploadProps {
  onDocumentsProcessed: (documents: ProcessedDocument[]) => void;
}

interface UploadedFile {
  file: File;
  status: 'uploading' | 'processing' | 'completed' | 'error';
  progress: number;
  document?: ProcessedDocument;
  error?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({ onDocumentsProcessed }) => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      handleFiles(files);
    }
  };

  const handleFiles = async (files: File[]) => {
    const processor = DocumentProcessor.getInstance();
    
    // Add files to upload queue
    const newUploads: UploadedFile[] = files.map(file => ({
      file,
      status: 'uploading',
      progress: 0
    }));
    
    setUploadedFiles(prev => [...prev, ...newUploads]);

    // Process each file
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const uploadIndex = uploadedFiles.length + i;
      
      try {
        // Simulate upload progress
        setUploadedFiles(prev => prev.map((upload, idx) => 
          idx === uploadIndex 
            ? { ...upload, status: 'uploading', progress: 30 }
            : upload
        ));

        await new Promise(resolve => setTimeout(resolve, 1000));

        // Start processing
        setUploadedFiles(prev => prev.map((upload, idx) => 
          idx === uploadIndex 
            ? { ...upload, status: 'processing', progress: 60 }
            : upload
        ));

        const processedDoc = await processor.processFile(file);

        // Complete processing
        setUploadedFiles(prev => {
          const updated = prev.map((upload, idx) => 
            idx === uploadIndex 
              ? { ...upload, status: 'completed', progress: 100, document: processedDoc }
              : upload
          );
          
          // Notify parent of new documents
          const completedDocs = updated
            .filter(u => u.document)
            .map(u => u.document!);
          onDocumentsProcessed(completedDocs);
          
          return updated;
        });

      } catch (error) {
        setUploadedFiles(prev => prev.map((upload, idx) => 
          idx === uploadIndex 
            ? { 
                ...upload, 
                status: 'error', 
                progress: 0, 
                error: error instanceof Error ? error.message : 'Processing failed' 
              }
            : upload
        ));
      }
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => {
      const updated = prev.filter((_, idx) => idx !== index);
      const completedDocs = updated
        .filter(u => u.document)
        .map(u => u.document!);
      onDocumentsProcessed(completedDocs);
      return updated;
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'error': return <AlertCircle className="h-5 w-5 text-red-600" />;
      default: return <File className="h-5 w-5 text-blue-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'border-green-200 bg-green-50';
      case 'error': return 'border-red-200 bg-red-50';
      case 'processing': return 'border-blue-200 bg-blue-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  return (
    <motion.div 
      className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Document Upload</h3>
      
      {/* Drop Zone */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
          isDragOver 
            ? 'border-blue-400 bg-blue-50' 
            : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
        }`}
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
      >
        <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 mb-2">
          Drag and drop files here, or{' '}
          <label className="text-blue-600 hover:text-blue-700 cursor-pointer font-medium">
            browse
            <input
              type="file"
              multiple
              accept=".pdf,.docx,.txt"
              onChange={handleFileSelect}
              className="hidden"
            />
          </label>
        </p>
        <p className="text-sm text-gray-500">
          Supports PDF, DOCX, and TXT files
        </p>
      </div>

      {/* Uploaded Files */}
      <AnimatePresence>
        {uploadedFiles.length > 0 && (
          <motion.div 
            className="mt-6 space-y-3"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <h4 className="text-sm font-medium text-gray-700">Uploaded Files</h4>
            {uploadedFiles.map((upload, index) => (
              <motion.div
                key={index}
                className={`p-4 rounded-lg border ${getStatusColor(upload.status)}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(upload.status)}
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        {upload.file.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {(upload.file.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    {upload.status === 'uploading' || upload.status === 'processing' ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <motion.div 
                            className="bg-blue-600 h-2 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${upload.progress}%` }}
                            transition={{ duration: 0.5 }}
                          />
                        </div>
                        <span className="text-xs text-gray-600">{upload.progress}%</span>
                      </div>
                    ) : upload.status === 'error' ? (
                      <span className="text-xs text-red-600">{upload.error}</span>
                    ) : (
                      <span className="text-xs text-green-600">Processed</span>
                    )}
                    
                    <button
                      onClick={() => removeFile(index)}
                      className="text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {upload.document && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="grid grid-cols-3 gap-4 text-xs">
                      <div>
                        <span className="text-gray-500">Words:</span>
                        <span className="ml-1 font-medium">
                          {upload.document.metadata.wordCount.toLocaleString()}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Chunks:</span>
                        <span className="ml-1 font-medium">
                          {upload.document.chunks.length}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Status:</span>
                        <span className="ml-1 font-medium text-green-600">Ready</span>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default FileUpload;