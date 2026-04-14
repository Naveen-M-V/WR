import { getAllCompanies, updateCompany } from './database/db.js';

async function diagnoseCompanies() {
  const companies = await getAllCompanies();
  console.log(`\n=== Found ${companies.length} companies ===\n`);
  
  let needsFix = false;
  
  for (const company of companies) {
    const hasUserId = company.userId && company.userId !== 'undefined';
    const hasCreatedBy = company.createdByUserId;
    
    console.log(`Company: ${company.companyName}`);
    console.log(`  _id: ${company._id}`);
    console.log(`  slug: ${company.slug}`);
    console.log(`  userId: ${company.userId || 'MISSING/UNDEFINED'}`);
    console.log(`  createdByUserId: ${company.createdByUserId || 'MISSING'}`);
    console.log(`  Has valid userId: ${hasUserId ? '✓' : '✗'}`);
    console.log('');
    
    if (!hasUserId && hasCreatedBy) {
      needsFix = true;
      console.log(`  ⚠️  This company needs fixing - setting userId to createdByUserId`);
      
      // Fix it
      await updateCompany(company._id.toString(), { userId: hasCreatedBy });
      console.log(`  ✓ Fixed!\n`);
    }
  }
  
  if (!needsFix) {
    console.log('✓ All companies have valid userId fields');
  }
  
  process.exit(0);
}

diagnoseCompanies().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
