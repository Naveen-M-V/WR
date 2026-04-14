import React from 'react';
import { useNavigate } from 'react-router-dom';

const TestDynamicCompany = () => {
  const navigate = useNavigate();

  const handleTestCompany = () => {
    // Use a sample company ID - this would come from your database
    const sampleCompanyId = 'sample-company-id';
    navigate(`/company/${sampleCompanyId}`);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={handleTestCompany}
        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-lg"
      >
        Test Dynamic Company Page
      </button>
    </div>
  );
};

export default TestDynamicCompany;
