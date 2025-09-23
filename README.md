# Developer Portal - Google OAuth Integration

## 🚀 Quick Start

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Test Google Sign-In:**
   - Go to `http://localhost:3001/signup` or `http://localhost:3001/login`
   - Click "Continue with Google"
   - Sign in with your Google account

3. **Capture Google Token for Backend Testing:**
   - Open `capture-google-token.html` in your browser
   - Sign in with Google
   - Copy the token for your backend developer

## 🔧 Current Status

- ✅ **Frontend**: Google OAuth integration complete
- ✅ **Mock Backend**: Working with MSW
- ✅ **Token Logging**: Console shows Google tokens for testing
- ⏳ **Real Backend**: Waiting for implementation

## 📋 For Backend Developer

**Google Credentials:**
- Client ID: `1014126568369-l9moqqlcka953cjui6fqt7alf0o0qkli.apps.googleusercontent.com`
- Client Secret: `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`

**Required Endpoints:**
- `POST /api/auth/google` - Google Sign-In
- `POST /api/auth/google/signup` - Google Sign-Up

**Request Format:**
```json
{
  "id_token": "google_id_token_from_frontend"
}
```

**Response Format:**
```json
{
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "User Name",
    "avatar": "profile_picture_url",
    "isGoogleUser": true,
    "createdAt": "2024-01-15T10:30:00Z",
    "lastLoginAt": "2024-01-15T10:30:00Z"
  },
  "accessToken": "jwt_token",
  "refreshToken": "jwt_refresh_token"
}
```

## 🎯 Next Steps

1. **Backend developer implements the endpoints**
2. **Test with captured Google tokens**
3. **Update frontend to use real backend API**
4. **Deploy to production**

The frontend is ready and waiting! 🚀