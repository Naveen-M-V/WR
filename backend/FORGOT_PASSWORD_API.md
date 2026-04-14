# Forgot Password API

## Overview
Implements secure password reset flow for the login popup system with rate limiting, token expiration, and email delivery.

## Endpoints

### POST /api/auth/forgot-password
- Description: Request a password reset link.
- Body:
```
{
  "email": "user@example.com"
}
```
- Response (200):
```
{
  "success": true,
  "message": "If an account exists, a reset link has been emailed",
  "expiresInMinutes": 30,
  "token": "<development-only>"
}
```
- Notes:
  - Response does not reveal whether the email exists (prevents enumeration).
  - In development or when EMAIL_DEBUG=true, `token` is returned for testing.

### POST /api/auth/reset-password
- Description: Reset password using the token.
- Body:
```
{
  "token": "<raw-token-from-email>",
  "newPassword": "NewPassw0rd!"
}
```
- Response (200):
```
{
  "success": true,
  "message": "Password has been reset successfully"
}
```
- Error responses:
  - 400: Invalid or expired token, or weak password
  - 404: User no longer exists
  - 500: Server error

## Email
- The reset email contains a styled "Reset Password" button linking to:
  - `${RESET_PASSWORD_URL}?token=<raw-token>`
  - Configure `RESET_PASSWORD_URL` in backend `.env`.

## Security
- Rate limiting: 5 requests per 15 minutes per IP on forgot-password.
- Token: 32-byte random hex; only SHA-256 hash is stored.
- Expiration: 30 minutes; used tokens are marked and cannot be reused.
- Password policy: at least 8 chars with upper, lower, numbers.

## Logging
- Key actions are logged to console with timestamps for auditing.

## Testing
- Run server, then:
```
node backend/test-forgot-password.js
```
- Ensure `EMAIL_DEBUG=true` in backend `.env` to receive token in response.
