# Deployment Guide

This guide covers deploying both the frontend (React/Vite) and backend (Node.js/Express) for the CuseHacks website.

## Overview

- **Frontend**: Deploy to Vercel
- **Backend**: Deploy to Railway, Heroku, or similar Node.js hosting service
- **Database**: MongoDB Atlas (already configured)

## Backend Deployment (Railway - Recommended)

### Option 1: Using Railway CLI

1. Install Railway CLI:
   ```bash
   npm install -g @railway/cli
   ```

2. Login to Railway:
   ```bash
   railway login
   ```

3. Navigate to the server directory:
   ```bash
   cd server
   ```

4. Initialize and deploy:
   ```bash
   railway create cusehacks-backend
   railway up
   ```

5. Set environment variables in Railway dashboard:
   - `NODE_ENV=production`
   - `MONGODB_URI=your_mongodb_atlas_connection_string`
   - `JWT_SECRET=your_jwt_secret`
   - `ADMIN_PASSWORD_HASH=your_bcrypt_hashed_password`
   - `ALLOWED_ORIGINS=https://your-frontend-domain.vercel.app`

### Option 2: Using Railway Web Dashboard

1. Go to [Railway.app](https://railway.app)
2. Create new project
3. Connect to GitHub repository
4. Select the `server` folder as root directory
5. Set environment variables as listed above
6. Deploy

## Frontend Deployment (Vercel)

### Environment Variables for Vercel

Set these environment variables in your Vercel project dashboard:

1. `VITE_USE_MOCK_API=false`
2. `VITE_API_URL=https://your-backend-railway-url.com/api`

### Deploy Command

```bash
# From project root directory
vercel --prod
```

Or use Vercel's GitHub integration for automatic deployments.

## Environment Variables Reference

### Backend (.env)
```
NODE_ENV=production
PORT=3001
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/cusehacks
JWT_SECRET=your-super-secret-jwt-key
ADMIN_PASSWORD_HASH=$2a$12$your.bcrypt.hashed.password.here
ALLOWED_ORIGINS=https://your-frontend-domain.vercel.app,https://another-domain.com
```

### Frontend (Vercel Environment Variables)
```
VITE_USE_MOCK_API=false
VITE_API_URL=https://your-backend-url.railway.app/api
```

## Testing Deployment

1. Test backend health check:
   ```
   GET https://your-backend-url.railway.app/api/health
   ```

2. Test admin login:
   ```
   POST https://your-backend-url.railway.app/api/auth/login
   Body: {"email": "admin", "password": "0hjzaExb4uU7aJJ2Xi49"}
   ```

3. Test frontend admin panel:
   ```
   https://your-frontend-domain.vercel.app/admin
   ```

## Current Status

✅ Backend is fully configured and ready for deployment
✅ Frontend is configured for production environment switching
⚠️  Backend needs to be deployed to a hosting service
⚠️  Vercel environment variables need to be set with backend URL

## Next Steps

1. Deploy backend to Railway or similar service
2. Update Vercel environment variables with the backend URL
3. Test all functionality end-to-end
4. Update CORS settings in backend if needed