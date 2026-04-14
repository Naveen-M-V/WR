import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, AlertTriangle } from 'lucide-react';

const DeleteConfirmModal = ({ company, isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm(company);
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-gradient-to-br from-red-500/20 to-pink-500/20 backdrop-blur-xl border border-red-400/30 rounded-3xl shadow-2xl shadow-red-500/30 w-full max-w-md"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
        >
          <div className="flex justify-between items-center p-6 border-b border-red-400/30">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-red-400" />
              <h2 className="text-xl font-bold text-white">Delete Company</h2>
            </div>
            <motion.button
              onClick={onClose}
              className="text-white hover:text-gray-300 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <X className="w-6 h-6" />
            </motion.button>
          </div>

          <div className="p-6">
            <p className="text-white mb-4">
              Are you sure you want to delete <span className="font-bold text-red-400">{company?.title}</span>?
            </p>
            <p className="text-gray-300 mb-6">
              This action cannot be undone. All company data, including projects, case studies, and associated information will be permanently removed.
            </p>

            <div className="flex justify-end gap-4">
              <motion.button
                onClick={onClose}
                className="px-6 py-2 rounded-lg bg-gray-600 hover:bg-gray-700 text-white font-semibold transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Cancel
              </motion.button>
              
              <motion.button
                onClick={handleConfirm}
                className="px-6 py-2 rounded-lg bg-gradient-to-r from-red-500 to-pink-600 text-white font-semibold shadow-lg hover:shadow-xl"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Company
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default DeleteConfirmModal;
