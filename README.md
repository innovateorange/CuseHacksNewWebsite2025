# CuseHacks Website

A modern, full-stack web application for Syracuse University's premier hackathon event.

## 🚀 Tech Stack

### Frontend
- **Vite** + **React 18** + **TypeScript**
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **React Router** for navigation
- **Lucide React** for icons

### Backend
- **Express.js** server with security middleware
- **MongoDB** with Mongoose ODM
- **JWT** authentication
- **Express Validator** for input validation
- **Helmet**, **Rate Limiting**, **XSS Protection**

## 🏃‍♂️ Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)

### Frontend Development
```bash
npm install
npm run dev
```
Visit: http://localhost:5173

### Backend Development
```bash
cd server
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and credentials
npm run dev
```
Server runs on: http://localhost:3001

## ✨ Features

- **Admin Panel**: Team management, contact messages, feature flags
- **Contact System**: Secure message submission with spam protection
- **Team Management**: CRUD operations for team members with image upload
- **Feature Flags**: Dynamic site functionality control
- **Security**: Protection against XSS, NoSQL injection, rate limiting
- **Performance**: Lazy loading, code splitting, optimized bundles (97KB gzipped)
- **Dual API**: Switch between mock and real API for development

## 📁 Project Structure

```
├── src/                    # Frontend React app
│   ├── components/         # Reusable components
│   ├── pages/             # Page components (lazy loaded)
│   ├── contexts/          # React contexts
│   └── lib/               # API client & utilities
├── server/                # Express.js backend
│   ├── routes/            # API endpoints
│   ├── models/            # MongoDB schemas
│   ├── middleware/        # Security & validation
│   └── config/            # Database configuration
└── public/                # Static assets
```

## 🔧 Environment Variables

### Frontend (.env)
```
VITE_API_URL=http://localhost:3001/api
VITE_USE_MOCK_API=false
```

### Backend (server/.env)
```
MONGODB_URI=mongodb://localhost:27017/cusehacks
JWT_SECRET=your-super-secret-jwt-key
ADMIN_EMAIL=admin@cusehacks.org
ADMIN_PASSWORD=your-secure-password
PORT=3001
NODE_ENV=development
```

## 📜 Scripts

### Frontend
- `npm run dev` - Development server
- `npm run build` - Production build (97KB gzipped)
- `npm run lint` - ESLint check
- `npm run preview` - Preview production build

### Backend
- `npm run dev` - Development server with nodemon
- `npm start` - Production server

## 🚀 Deployment

See `IMPLEMENTATION.md` for detailed deployment instructions including:
- MongoDB setup and security
- Environment configuration
- Production deployment guides
- Security best practices

## 🔐 Admin Access

- **URL**: `/admin`
- **Login**: Use credentials set in server/.env
- **Features**: Team management, contact messages, feature flags

## 🛡️ Security Features

- Rate limiting (100 req/15min general, 5 login attempts/15min)
- Input validation and sanitization
- XSS protection
- NoSQL injection prevention
- Secure headers with Helmet
- JWT authentication