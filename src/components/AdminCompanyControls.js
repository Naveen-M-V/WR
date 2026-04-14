import React from 'react';
import { motion } from 'framer-motion';
import { Edit, Trash2 } from 'lucide-react';

const AdminCompanyControls = ({ company, onEdit, onDelete }) => {
  const isAdmin = localStorage.getItem('role') === 'admin';
  
  console.log('AdminCompanyControls - isAdmin:', isAdmin, 'company:', company);

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="flex gap-2">
      <motion.button
        onClick={() => {
          console.log('Edit button clicked, company:', company);
          onEdit(company);
        }}
        className="px-4 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold shadow-lg hover:shadow-xl"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        title="Edit Company"
      >
        <Edit className="w-4 h-4" />
      </motion.button>
      
      <motion.button
        onClick={() => {
          console.log('Delete button clicked, company:', company);
          onDelete(company);
        }}
        className="px-4 py-3 rounded-lg bg-gradient-to-r from-red-500 to-pink-600 text-white font-semibold shadow-lg hover:shadow-xl"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        title="Delete Company"
      >
        <Trash2 className="w-4 h-4" />
      </motion.button>
    </div>
  );
};

export default AdminCompanyControls;
