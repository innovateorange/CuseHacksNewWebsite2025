# CuseHacks Website - Full Implementation Guide

## 🏗️ Project Overview

This is a complete full-stack CuseHacks website with both frontend (Vite + React + TypeScript) and backend (Node.js + Express + MongoDB) implementations. The project includes comprehensive security measures, admin panel, contact system, team management, and feature flags.

## 🛡️ Security Features

### ✅ **Security Protections Implemented:**

1. **Rate Limiting**
   - General API: 100 requests/15min per IP
   - Auth endpoints: 5 login attempts/15min per IP  
   - Contact forms: 10 submissions/hour per IP

2. **Input Validation & Sanitization**
   - XSS protection with HTML tag stripping
   - MongoDB injection prevention
   - HTTP Parameter Pollution (HPP) protection
   - Input length limits and format validation
   - Spam detection in contact messages

3. **Security Headers**
   - Helmet.js for security headers
   - Content Security Policy (CSP)
   - CORS properly configured

4. **Data Protection**
   - Request body size limits (1MB)
   - Parameter count limits
   - Email normalization
   - Path traversal prevention

## 📁 Project Structure

```
CuseHacksWebsite/
├── src/                          # Frontend (Vite + React)
│   ├── components/               # React components
│   ├── pages/                   # Page components
│   ├── contexts/                # React contexts (feature flags)
│   └── lib/                     # API clients and utilities
├── server/                      # Backend (Node.js + Express)
│   ├── models/                  # MongoDB models
│   ├── routes/                  # API routes
│   ├── middleware/              # Security & validation
│   └── config/                  # Database configuration
└── dist/                        # Built frontend files
```

## 🚀 Quick Start

### **Option 1: Mock Data (Development)**

```bash
# Frontend only with mock data
cd CuseHacksWebsite
npm install
npm run dev
# Visit: http://localhost:5173
```

### **Option 2: Full Stack (Production-Ready)**

```bash
# 1. Setup backend
cd CuseHacksWebsite/server
npm install

# 2. Configure environment
cp .env.example .env
# Edit .env with your MongoDB URI and settings

# 3. Start backend
npm run dev
# Backend runs on: http://localhost:3001

# 4. Setup frontend (new terminal)
cd ../
npm install

# 5. Configure for real API
echo "VITE_USE_MOCK_API=false" > .env
echo "VITE_API_URL=http://localhost:3001/api" >> .env

# 6. Start frontend
npm run dev
# Frontend runs on: http://localhost:5173
```

## 🌐 Deployment Options

### **1. Vercel (Recommended)**

**Frontend + API Routes:**
```bash
# 1. Push to GitHub
git add .
git commit -m "Complete full-stack implementation"
git push origin main

# 2. Connect to Vercel
# - Connect GitHub repo
# - Auto-deploy on git push

# 3. Environment Variables in Vercel:
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/cusehacks
JWT_SECRET=your-super-secret-key-here
ADMIN_EMAIL=admin@cusehacks.org
ADMIN_PASSWORD=your-secure-password
NODE_ENV=production
```

**Vercel Configuration (vercel.json):**
```json
{
  "version": 2,
  "builds": [
    {
      "src": "server/server.js",
      "use": "@vercel/node"
    },
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/server/server.js"
    },
    {
      "src": "/(.*)",
      "dest": "/dist/$1"
    }
  ]
}
```

### **2. Railway**

```bash
# 1. Install Railway CLI
npm install -g @railway/cli

# 2. Login and deploy
railway login
railway init
railway add mongodb
railway deploy

# 3. Set environment variables in Railway dashboard
```

### **3. Render + MongoDB Atlas**

```bash
# 1. Create MongoDB Atlas cluster (free tier)
# 2. Deploy to Render
# 3. Connect environment variables
```

### **4. Netlify + Netlify Functions**

**Structure for Netlify:**
```
netlify/functions/
├── auth.js
├── contact.js
└── team.js
```

## ⚙️ Configuration

### **Environment Variables**

**Backend (.env):**
```bash
MONGODB_URI=mongodb://localhost:27017/cusehacks
JWT_SECRET=your-super-secret-jwt-key-here
NODE_ENV=development
PORT=3001
ADMIN_EMAIL=admin@cusehacks.org
ADMIN_PASSWORD=password123
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

**Frontend (.env):**
```bash
VITE_USE_MOCK_API=false          # Set to true for mock data
VITE_API_URL=http://localhost:3001/api
```

## 🗄️ Database Setup

### **MongoDB Atlas (Free Tier)**

1. **Create Account**: Sign up at [mongodb.com](https://mongodb.com)
2. **Create Cluster**: Free tier gives 512MB storage
3. **Setup User**: Create database user with read/write permissions
4. **Network Access**: Add your IP or allow all (0.0.0.0/0 for development)
5. **Get Connection String**: Copy URI and add to environment variables

### **Local MongoDB**

```bash
# Install MongoDB locally
# macOS
brew install mongodb-community

# Start MongoDB service
brew services start mongodb-community

# Connection string
MONGODB_URI=mongodb://localhost:27017/cusehacks
```

## 🎯 Features

### **✅ Implemented Features:**

1. **Landing Page**
   - Hero section with conditional Register/Submit buttons
   - Team section with dynamic member loading
   - FAQ section with contact modal
   - Feature flag-driven navigation

2. **Admin Panel** (`/admin`)
   - Team member management (CRUD operations)
   - Contact message management
   - Feature flag controls
   - Registration management (placeholder)
   - Photo upload with drag-and-drop

3. **Contact System**
   - Contact form modal
   - Message storage in MongoDB
   - Admin message management
   - Email reply integration
   - Spam protection

4. **Feature Flags**
   - Project submissions toggle
   - Registration toggle
   - Voting toggle (placeholder)
   - Dynamic UI based on flags

5. **Security**
   - Input validation and sanitization
   - Rate limiting
   - XSS protection
   - MongoDB injection prevention
   - CORS configuration

### **📋 TODO (Future Enhancements):**

1. **Project System**
   - Project submission form
   - Project gallery
   - Voting system
   - Categories and judging

2. **Registration System**
   - Full registration workflow
   - Email confirmations
   - Waitlist management

3. **User Authentication**
   - User accounts
   - Profile management
   - Password reset

## 🔧 Development

### **Adding New Features**

1. **Backend Route:**
```javascript
// server/routes/newfeature.js
import express from 'express'
const router = express.Router()

router.get('/', async (req, res) => {
  // Implementation
})

export default router
```

2. **Frontend API Call:**
```typescript
// src/lib/api.ts
export const realAPI = {
  // Add new method
  newFeature: async () => {
    return await apiRequest('/newfeature')
  }
}
```

3. **Add to Mock API:**
```typescript
// src/lib/mockData.ts
const mockAPIImpl = {
  newFeature: async () => {
    // Mock implementation
  }
}
```

### **Testing**

```bash
# Test API endpoints
curl -X GET http://localhost:3001/api/health

# Test with authentication
curl -X GET http://localhost:3001/api/contact \
  -H "Authorization: Bearer YOUR_TOKEN"

# Test contact submission
curl -X POST http://localhost:3001/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","subject":"Test","message":"Test message here"}'
```

## 🚨 Security Considerations

1. **Production Setup:**
   - Use strong JWT secrets (minimum 32 characters)
   - Set up proper CORS origins
   - Use HTTPS in production
   - Regular security audits
   - Monitor rate limits and logs

2. **Database Security:**
   - Use MongoDB Atlas IP whitelist
   - Regular backups
   - Monitor database access logs
   - Use read/write user permissions

3. **Environment Security:**
   - Never commit .env files
   - Rotate secrets regularly
   - Use environment-specific configs
   - Monitor for security vulnerabilities

## 📊 Performance

- **Frontend**: Optimized with Vite, code splitting, lazy loading
- **Backend**: Rate limiting, input validation, efficient queries
- **Database**: Indexed fields, connection pooling
- **Security**: Minimal performance impact with optimized middleware

## 🔍 Monitoring & Logs

```bash
# Backend logs
npm run dev  # Development logs
npm start    # Production logs

# Monitor rate limits
# Check server logs for security events
# Database query performance monitoring
```

## 📞 Support

For deployment assistance or questions:
1. Check environment variables
2. Verify database connection
3. Test API endpoints individually
4. Check browser console for errors
5. Review server logs for backend issues

## 🎉 Success!

Your CuseHacks website is now fully implemented with:
- ✅ Secure backend with MongoDB
- ✅ Modern React frontend
- ✅ Admin management system
- ✅ Contact message system
- ✅ Feature flag management
- ✅ Production-ready deployment options
- ✅ Comprehensive security measures

**Next Steps:** Choose your deployment platform and go live! 🚀