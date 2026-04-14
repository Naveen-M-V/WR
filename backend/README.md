# Which Renewables Backend

Complete backend server for the Which Renewables platform with authentication, OTP verification, and user management.

## Quick Start

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Setup Environment
```bash
cp .env.example .env
# Edit .env with your configuration
```

### 3. Email Configuration

#### Option A: Gmail (Recommended)
1. Go to [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
2. Select "Mail" and "Windows Computer"
3. Copy the 16-character password (without spaces)
4. Update `.env`:
   ```
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=xxxx xxxx xxxx xxxx
   USE_ETHEREAL=false
   ```

#### Option B: Ethereal Email (Development/Testing)
1. Set in `.env`:
   ```
   USE_ETHEREAL=true
   EMAIL_DEBUG=true
   ```
2. Backend will auto-generate test credentials
3. Check console for preview URL and OTP code

### 4. Start Server
```bash
npm run dev    # Development with auto-reload
npm start      # Production
```

Server will run on `http://localhost:4000`

## API Endpoints

### Authentication

#### Request OTP
```
POST /api/auth/request-otp
Content-Type: application/json

{
  "email": "user@example.com"
}

Response:
{
  "ok": true,
  "message": "OTP sent to email",
  "otp": "123456"  // Only in development
}
```

#### Verify OTP
```
POST /api/auth/verify-otp
Content-Type: application/json

{
  "email": "user@example.com",
  "otp": "123456"
}

Response:
{
  "ok": true,
  "message": "OTP verified successfully"
}
```

#### Register User
```
POST /api/auth/register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "user@example.com",
  "password": "SecurePass123",
  "otp": "123456"
}

Response:
{
  "ok": true,
  "message": "User registered successfully",
  "data": {
    "userId": "1234567890",
    "username": "johndoe",
    "email": "user@example.com",
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

#### Login User
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123"
}

Response:
{
  "ok": true,
  "message": "Login successful",
  "data": {
    "userId": "1234567890",
    "username": "johndoe",
    "email": "user@example.com",
    "profileCompletion": 0,
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

#### Get Profile (Protected)
```
GET /api/auth/profile
Authorization: Bearer <token>

Response:
{
  "ok": true,
  "data": {
    "id": "1234567890",
    "username": "johndoe",
    "email": "user@example.com",
    "profileCompletion": 0,
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

#### Update Profile (Protected)
```
PUT /api/auth/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "username": "johndoe_updated",
  "profileCompletion": 50
}

Response:
{
  "ok": true,
  "message": "Profile updated successfully",
  "data": { ... }
}
```

#### Logout (Protected)
```
POST /api/auth/logout
Authorization: Bearer <token>

Response:
{
  "ok": true,
  "message": "Logged out successfully"
}
```

### Health Check
```
GET /api/health

Response:
{
  "ok": true,
  "message": "Backend is running",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## Validation Rules

### Username
- 3-20 characters
- Alphanumeric and underscore only
- Example: `john_doe`, `user123`

### Password
- Minimum 8 characters
- At least 1 uppercase letter
- At least 1 lowercase letter
- At least 1 number
- Example: `SecurePass123`

### Email
- Valid email format
- Example: `user@example.com`

### OTP
- 6 digits
- Example: `123456`

## Error Responses

All errors follow this format:
```json
{
  "error": "Error message describing what went wrong"
}
```

Common errors:
- `400`: Bad request (validation failed)
- `401`: Unauthorized (invalid credentials or token)
- `404`: Not found
- `500`: Server error

## Database

Currently using in-memory storage for development. Ready to migrate to:
- MongoDB
- PostgreSQL
- MySQL
- Firebase

## Security Features

- ✅ JWT-based authentication
- ✅ OTP email verification
- ✅ Password hashing with bcryptjs
- ✅ Input validation and sanitization
- ✅ CORS protection
- ✅ Protected routes with token verification

## Environment Variables

```
PORT=4000
NODE_ENV=development
JWT_SECRET=your_jwt_secret_key_here_change_in_production
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password-here
USE_ETHEREAL=false
EMAIL_DEBUG=true
```

## Testing the Flow

1. **Request OTP**
   ```bash
   curl -X POST http://localhost:4000/api/auth/request-otp \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com"}'
   ```

2. **Verify OTP**
   ```bash
   curl -X POST http://localhost:4000/api/auth/verify-otp \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","otp":"123456"}'
   ```

3. **Register User**
   ```bash
   curl -X POST http://localhost:4000/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{
       "username":"testuser",
       "email":"test@example.com",
       "password":"TestPass123",
       "otp":"123456"
     }'
   ```

4. **Login**
   ```bash
   curl -X POST http://localhost:4000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"TestPass123"}'
   ```

## Troubleshooting

### "Backend not running" error
- Make sure backend server is running: `npm run dev`
- Check if port 4000 is available
- Verify CORS is configured correctly

### "Failed to send OTP" error
- Check email configuration in `.env`
- If using Gmail, verify app password is correct
- If using Ethereal, set `USE_ETHEREAL=true`
- Check `EMAIL_DEBUG=true` for detailed logs

### "Invalid OTP" error
- OTP expires after 10 minutes
- Make sure you're using the correct OTP from the email
- Request a new OTP if expired

## Next Steps

1. Connect frontend to these endpoints
2. Store JWT token in localStorage/sessionStorage
3. Include token in Authorization header for protected routes
4. Implement token refresh mechanism
5. Add rate limiting
6. Add password reset functionality
7. Migrate to production database

## Support

For issues or questions, check the console logs for detailed error messages.
