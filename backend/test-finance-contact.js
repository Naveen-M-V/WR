// No import needed for fetch in Node 18+

const API_URL = 'http://localhost:5000/api/finance-contact';

async function testFinanceContact() {
  console.log('--- Testing Finance Contact Backend ---');

  // Test 1: Validation Error (Missing fields)
  console.log('\nTest 1: Testing Validation (Missing fields)');
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test User',
        // email missing
        phone: '1234567890',
        companyName: 'Test Company',
        fundingAmount: '$100k - $500k',
        projectDescription: 'This is a test project description.',
      }),
    });
    const data = await response.json();
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Test 1 Failed:', err);
  }

  // Test 2: Successful Submission
  console.log('\nTest 2: Testing Successful Submission');
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        phone: '1234567890',
        companyName: 'Test Company',
        fundingAmount: '$100k - $500k',
        projectDescription: 'This is a test project description.',
      }),
    });
    const data = await response.json();
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Test 2 Failed:', err);
  }

  // Test 3: Rate Limiting (Run 6 times)
  console.log('\nTest 3: Testing Rate Limiting');
  for (let i = 0; i < 6; i++) {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `Rate Limit User ${i}`,
          email: `test${i}@example.com`,
          phone: '1234567890',
          companyName: 'Test Company',
          fundingAmount: '$100k - $500k',
          projectDescription: 'Rate limit test.',
        }),
      });
      console.log(`Request ${i + 1}: Status ${response.status}`);
      if (response.status === 429) {
        console.log('Rate limit hit successfully!');
      }
    } catch (err) {
      console.error(`Request ${i + 1} Failed:`, err);
    }
  }
}

testFinanceContact();
