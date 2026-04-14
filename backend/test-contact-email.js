// No import needed for fetch in Node 18+

const API_URL = 'http://localhost:5000/api/contact';

async function testContactEmail() {
  console.log('--- Testing Contact Form Email ---');

  // Test 1: Financial Contact
  console.log('\nTest 1: Financial Contact');
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'financial',
        name: 'John Financial',
        email: 'john.fin@example.com',
        companyName: 'Finance Corp',
        invoiceNumber: 'INV-12345',
        issueCategory: 'Payments & Billing',
        subCategory: 'Invoice request',
        natureOfEnquiry: 'I need a copy of my last invoice.',
      }),
    });
    const data = await response.json();
    console.log('Status:', response.status);
    console.log('Response:', data);
  } catch (err) {
    console.error('Test 1 Failed:', err);
  }

  // Test 2: Sales Contact
  console.log('\nTest 2: Sales Contact');
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'sales',
        name: 'Jane Sales',
        email: 'jane.sales@example.com',
        companyName: 'Sales Ltd',
        category: 'Advertise with Which Renewables',
        subCategory: 'Sponsorship request',
        natureOfEnquiry: 'We would like to sponsor your next event.',
      }),
    });
    const data = await response.json();
    console.log('Status:', response.status);
    console.log('Response:', data);
  } catch (err) {
    console.error('Test 2 Failed:', err);
  }

    // Test 3: Support Contact
    console.log('\nTest 3: Support Contact');
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            type: 'support',
            name: 'Sam Support',
            email: 'sam.sup@example.com',
            companyName: 'Tech Solutions',
            priority: 'High',
            supportQuery: 'Login Issues',
            subCategory: 'Password reset',
            issueDescription: 'I cannot reset my password.',
            errorMessage: 'Error 500: Internal Server Error',
        }),
      });
      const data = await response.json();
      console.log('Status:', response.status);
      console.log('Response:', data);
    } catch (err) {
      console.error('Test 3 Failed:', err);
    }
}

testContactEmail();
