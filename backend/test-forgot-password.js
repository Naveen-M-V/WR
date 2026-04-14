// No import needed for fetch in Node 18+

const API = 'http://localhost:5000/api/auth';

async function run() {
  console.log('--- Forgot Password Flow Test ---');

  // Step 1: Request password reset for existing user
  console.log('\n[1] Requesting reset for admin user');
  const forgotRes = await fetch(`${API}/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'sanjaymaheshwaran0124@gmail.com' }),
  });
  const forgotData = await forgotRes.json();
  console.log('Forgot Response:', forgotRes.status, forgotData);

  if (!forgotRes.ok) {
    console.error('Forgot password request failed');
    return;
  }

  const token = forgotData.token;
  if (!token) {
    console.error('Token not returned (set EMAIL_DEBUG=true to receive token in response)');
    return;
  }

  // Step 2: Reset password using token
  console.log('\n[2] Resetting password with token');
  const newPassword = 'NewPassw0rd!';
  const resetRes = await fetch(`${API}/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, newPassword }),
  });
  const resetData = await resetRes.json();
  console.log('Reset Response:', resetRes.status, resetData);

  if (!resetRes.ok) {
    console.error('Reset password failed');
    return;
  }

  // Step 3: Login with new password
  console.log('\n[3] Logging in with new password');
  const loginRes = await fetch(`${API}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'sanjaymaheshwaran0124@gmail.com', password: newPassword }),
  });
  const loginData = await loginRes.json();
  console.log('Login Response:', loginRes.status, loginData);

  if (loginRes.ok) {
    console.log('✓ Forgot password flow verified successfully');
  } else {
    console.error('Login failed with new password');
  }
}

run().catch(err => {
  console.error('Test error:', err);
});
