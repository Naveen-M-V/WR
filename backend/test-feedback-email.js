// No import needed for fetch in Node 18+

const API_URL = 'http://localhost:5000/api/contact';

async function testFeedbackEmail() {
  console.log('--- Testing Feedback Form Email ---');

  // Test 1: Positive Feedback
  console.log('\nTest 1: Positive Feedback');
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'feedback',
        name: 'Happy User',
        email: 'happy@example.com',
        companyName: 'Happy Corp',
        category: 'User Experience',
        rating: 5,
        subject: 'Great new design!',
        feedback: 'I really love the new look and feel of the dashboard.',
        recommend: 'Yes',
        improvements: 'Maybe add a dark mode toggle.',
      }),
    });
    const data = await response.json();
    console.log('Status:', response.status);
    console.log('Response:', data);
  } catch (err) {
    console.error('Test 1 Failed:', err);
  }

  // Test 2: Negative Feedback
  console.log('\nTest 2: Negative Feedback');
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'feedback',
        name: 'Unhappy User',
        email: 'unhappy@example.com',
        companyName: 'Grumpy Ltd',
        category: 'Bug Report',
        rating: 2,
        subject: 'Slow loading times',
        feedback: 'The dashboard takes forever to load on my connection.',
        recommend: 'No',
        improvements: 'Optimize image loading please.',
      }),
    });
    const data = await response.json();
    console.log('Status:', response.status);
    console.log('Response:', data);
  } catch (err) {
    console.error('Test 2 Failed:', err);
  }
}

testFeedbackEmail();
