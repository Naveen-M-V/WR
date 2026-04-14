import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, FileText } from 'lucide-react';
import mammoth from 'mammoth';

export default function DocumentModal({ isOpen, onClose, title, fileName }) {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && fileName) {
      setLoading(true);
      setError(null);
      setContent('');
      
      // Correctly encode filename, handling special characters like '&'
      // fileName is expected to be like "/path/to/file.docx"
      // We split by '/' to encode each segment independently to avoid encoding the path separators
      const encodedFileName = fileName.split('/').map(segment => 
        encodeURIComponent(segment)
      ).join('/');
      
      fetch(encodedFileName)
        .then(response => {
           if (!response.ok) {
             throw new Error(`Failed to load document: ${response.statusText}`);
           }
           return response.arrayBuffer();
        })
        .then(arrayBuffer => mammoth.convertToHtml({ arrayBuffer }))
        .then(result => {
          setContent(result.value);
          setLoading(false);
        })
        .catch(err => {
          console.error("Error loading document:", err);
          setError("Failed to load document content. Please try again later.");
          setLoading(false);
        });
    }
  }, [isOpen, fileName]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-4xl max-h-[90vh] bg-[#0f172a] border border-slate-700 rounded-2xl shadow-2xl flex flex-col pointer-events-auto overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-700 bg-[#0f172a]">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-500/10 rounded-lg">
                    <FileText className="w-5 h-5 text-emerald-400" />
                  </div>
                  <h2 className="text-xl font-semibold text-white">{title}</h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6 sm:p-8 bg-[#0f172a] custom-scrollbar">
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-20">
                    <Loader2 className="w-10 h-10 text-emerald-500 animate-spin mb-4" />
                    <p className="text-slate-400">Loading document...</p>
                  </div>
                ) : error ? (
                  <div className="text-center py-20 text-red-400">
                    <p>{error}</p>
                  </div>
                ) : (
                  <div 
                    className="prose prose-invert max-w-none prose-headings:text-emerald-400 prose-a:text-emerald-400 prose-strong:text-white text-slate-300"
                    dangerouslySetInnerHTML={{ __html: content }}
                  />
                )}
              </div>
              
              {/* Footer */}
              <div className="p-4 border-t border-slate-700 bg-[#0f172a] flex justify-between items-center">
                 <img src="/wr.png" alt="Which Renewables Logo" className="h-10" />
                 <button
                  onClick={onClose}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
