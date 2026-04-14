import { createCompany } from './database/db.js';
import { sampleCompanyData } from '../src/utils/companyDataStructure.js';

// Add sample company to database
const addSampleCompany = async () => {
  try {
    const company = await createCompany(sampleCompanyData);
    console.log('Sample company added successfully:');
    console.log(`Company ID: ${company.id}`);
    console.log(`Company Name: ${company.companyName}`);
    console.log(`Access URL: http://localhost:3000/company/${company.id}`);
    console.log('\nCopy the Company ID to test the dynamic company page.');
  } catch (error) {
    console.error('Error adding sample company:', error);
  }
};

addSampleCompany();
