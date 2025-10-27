# EmailClassify 📧

An intelligent email classification system that automatically categorizes your Gmail emails using AI (Google Gemini or OpenAI GPT-4).

## 🌟 Features

- **Dual AI Support**: Choose between Google Gemini or OpenAI GPT-4
- **Smart Classification**: Automatically categorizes emails into 6 categories
- **Intelligent Batching**: Dynamic batch processing optimized for speed and API limits
- **Google OAuth**: Secure authentication with Google
- **Real-time Processing**: Classify up to 50 emails at once
- **Persistent Storage**: API keys and preferences saved locally
- **Modern UI**: Beautiful, responsive interface with overlay detail view
- **Full Email Content**: Complete email display with HTML rendering and images
- **No Database**: All data stored in browser localStorage

## 📊 Email Categories

| Category | Description | Icon |
|----------|-------------|------|
| **Important** | Personal or work-related emails requiring immediate attention | ⚡ |
| **Promotional** | Sales, discounts, and promotional campaigns | 🎁 |
| **Social** | Social networks, friends, and family | 👥 |
| **Marketing** | Marketing emails and newsletters | 📢 |
| **Spam** | Unwanted or unsolicited emails | 🚫 |
| **General** | All other emails | 📧 |

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js 22
- **Framework**: Express.js
- **Language**: TypeScript
- **AI Libraries**: Langchain.js + Google Generative AI + OpenAI
- **Authentication**: Google OAuth 2.0
- **Security**: Helmet, CORS, Rate Limiting
- **Logging**: Winston

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **State Management**: TanStack Query (React Query)
- **HTTP Client**: Axios
- **Icons**: Lucide React

### Development
- **Package Manager**: npm
- **Code Quality**: TypeScript, ESLint
- **Containerization**: Docker & Docker Compose

## Project Structure

```
magicslice/
├── backend/                 # Express.js backend
│   ├── src/
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Custom middleware
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   ├── utils/          # Utilities
│   │   └── server.ts       # Entry point
│   ├── logs/               # Log files (auto-generated)
│   ├── package.json
│   └── tsconfig.json
├── frontend/                # Next.js frontend
│   ├── src/
│   │   ├── app/            # Next.js pages
│   │   ├── components/     # React components
│   │   ├── hooks/          # Custom hooks
│   │   └── lib/            # Utilities
│   ├── package.json
│   └── tsconfig.json
└── README.md               # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js 22+ and npm
- Docker & Docker Compose (for Docker setup)
- Google Cloud Console project with OAuth credentials
- Google Gemini API key OR OpenAI API key (provided by users)

---

## 📦 Installation

Choose your preferred setup method:

### Option 1: Docker Setup (Recommended)

**Quick Start with Docker:**

```bash
# 1. Clone the repository
git clone <repository-url>
cd magicslice

# 2. Setup environment files
cp backend/.env.example backend/.env
cp frontend/.env.local.example frontend/.env.local

# 3. Edit backend/.env with your Google OAuth credentials
# (See Environment Variables section below)

# 4. Start all services
docker-compose up --build

# Backend: http://localhost:5000
# Frontend: http://localhost:3000
```

**Docker Commands:**
```bash
# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Rebuild after code changes
docker-compose up --build
```

**📖 Detailed Docker Guide**: See [DOCKER_SETUP.md](./DOCKER_SETUP.md)

---

### Option 2: Local Development Setup

#### Backend Setup

```bash
# 1. Navigate to backend
cd backend

# 2. Install dependencies
npm install

# 3. Setup environment
cp .env.example .env
# Edit .env with your Google OAuth credentials

# 4. Start development server
npm run dev

# Backend runs on http://localhost:5000
```

**📖 Detailed Backend Guide**: See [backend/README.md](./backend/README.md)

#### Frontend Setup

```bash
# 1. Navigate to frontend (in a new terminal)
cd frontend

# 2. Install dependencies
npm install

# 3. Setup environment (optional)
cp .env.local.example .env.local
# Edit if you need to change API URL

# 4. Start development server
npm run dev

# Frontend runs on http://localhost:3000
```

**📖 Detailed Frontend Guide**: See [frontend/README.md](./frontend/README.md)

---

## 🔐 Environment Variables

### Backend (.env)

**Required:**
```env
# Google OAuth Credentials
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:5000/api/auth/google/callback

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

**Optional:**
```env
# Server Configuration
NODE_ENV=development
PORT=5000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Frontend (.env.local)

```env
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:5000
```

---

## ⚙️ Google OAuth Setup

### 1. Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Note your **Project ID**

### 2. Enable Required APIs

1. Go to **APIs & Services** > **Library**
2. Enable:
   - **Gmail API**
   - **Google+ API** (or Google People API)

### 3. Configure OAuth Consent Screen

1. Go to **APIs & Services** > **OAuth consent screen**
2. Select **External** user type
3. Fill in:
   - App name: `EmailClassify`
   - User support email: Your email
   - Developer contact: Your email
4. **Add Scopes**:
   - `userinfo.email`
   - `userinfo.profile`
   - `gmail.readonly`
5. **Add Test Users**:
   - Add your email for testing

### 4. Create OAuth Credentials

1. Go to **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **OAuth 2.0 Client ID**
3. Application type: **Web application**
4. Name: `EmailClassify Web Client`
5. **Authorized redirect URIs**:
   ```
   http://localhost:5000/api/auth/google/callback
   ```
6. Click **Create**
7. Copy **Client ID** and **Client Secret**
8. Add them to `backend/.env`

### 5. Test the Setup

1. Start backend and frontend
2. Visit `http://localhost:3000`
3. Click "Login with Google"
4. Should redirect to Google OAuth
5. Select test user account
6. Should redirect back to dashboard

## 📱 Usage Guide

### 1. Login
1. Open `http://localhost:3000`
2. Click **"Login with Google"**
3. Authorize the application
4. Redirected to dashboard

### 2. Select AI Provider
- Choose **Google Gemini** or **OpenAI GPT**
- Your preference is saved automatically

### 3. Enter API Key
- Enter your Gemini or OpenAI API key
- Key is saved in browser localStorage
- Only shown once - hidden after saving

### 4. Classify Emails
- Select number of emails (5, 10, 15, 25, or 50)
- Click **"Classify"** button
- Watch real-time classification progress

### 5. View Results
- **Email List**: See all classified emails with badges
- **Categories**: Color-coded by importance
- **Stats Panel**: View distribution across categories
- **Detail View**: Click any email for full content

### 6. Email Detail
- Overlay panel slides from right
- Shows full email content with HTML/images
- Category badge displayed
- Click backdrop or X to close

### 7. Switch Providers
- Change between Gemini and OpenAI anytime
- Each provider has separate saved API key
- Re-classify with different AI

## ✨ Key Features

### Authentication & Security
- ✅ Google OAuth 2.0 integration
- ✅ Secure token management
- ✅ Protected API routes
- ✅ Rate limiting (100 requests/15min)
- ✅ Helmet security headers
- ✅ CORS protection

### Email Processing
- ✅ Fetch up to 50 emails from Gmail
- ✅ HTML and plain text support
- ✅ Image rendering in detail view
- ✅ Batch processing with error handling
- ✅ No database - localStorage only

### AI Classification
- ✅ Dual AI support (Gemini + OpenAI)
- ✅ 6 smart categories
- ✅ Langchain.js integration
- ✅ Case-insensitive category mapping
- ✅ Fallback to "General" on errors

### User Experience
- ✅ Modern, responsive UI
- ✅ Persistent API keys
- ✅ Provider preference saved
- ✅ Overlay email detail panel
- ✅ Real-time statistics
- ✅ URL-based email selection

## 📚 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/auth/google` | Get Google OAuth URL |
| GET | `/api/auth/google/callback` | OAuth callback handler |
| POST | `/api/auth/refresh` | Refresh access token |

### Email Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/emails/fetch-and-classify` | Fetch and classify emails |
| GET | `/api/emails` | Fetch emails only |
| POST | `/api/emails/classify` | Classify existing emails |

**POST `/api/emails/fetch-and-classify`**
```json
{
  "apiKey": "your-gemini-or-openai-key",
  "provider": "gemini" | "openai"
}
```
Query: `?limit=15` (max: 50)

Response:
```json
{
  "success": true,
  "data": {
    "classifiedEmails": [...],
    "stats": {
      "Important": 5,
      "Marketing": 3,
      ...
    },
    "count": 15,
    "provider": "gemini"
  }
}
```

## 🧪 Troubleshooting

### Code Quality
- ✅ TypeScript throughout
- ✅ ESLint configuration
- ✅ Consistent code style
- ✅ Comprehensive error handling
- ✅ Structured logging

### Architecture
- ✅ Clean separation of concerns
- ✅ Service layer pattern
- ✅ Custom middleware
- ✅ React custom hooks
- ✅ Component composition

### Security
- ✅ Environment variables
- ✅ OAuth 2.0 flow
- ✅ Rate limiting
- ✅ CORS protection
- ✅ Helmet security headers

## 🧪 Troubleshooting

### Common Issues

#### Backend won't start
```bash
# Check if port is in use
lsof -i :5000  # Mac/Linux
netstat -ano | findstr :5000  # Windows

# Solution: Change port in .env
PORT=5001

# Or kill the process using the port
```

#### OAuth "redirect_uri_mismatch" error
1. Check `GOOGLE_REDIRECT_URI` in `.env`
2. Must exactly match Google Console setting:
   ```
   http://localhost:5000/api/auth/google/callback
   ```
3. No trailing slashes!
4. Restart backend after changing

#### "Gmail API has not been used" error
1. Go to Google Cloud Console
2. APIs & Services > Library
3. Search "Gmail API"
4. Click **Enable**
5. Wait 1-2 minutes for activation

#### Frontend can't connect to backend
1. Check backend is running: `http://localhost:5000/health`
2. Verify `.env.local`:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000
   ```
3. Check browser console for CORS errors
4. Restart both services

#### Classification returns all "General"
- Fixed in latest version!
- Make sure you updated the code
- Clear browser cache

#### API key not saving
- Check browser localStorage is enabled
- Try incognito mode to test
- Clear localStorage: `localStorage.clear()`

#### Docker issues
```bash
# Container won't start
docker-compose down
docker-compose up --build --force-recreate

# Can't see environment variables
# Make sure .env files exist:
ls backend/.env
ls frontend/.env.local

# Permission denied
sudo docker-compose up
```

### Getting Help

1. Check logs:
   ```bash
   # Backend logs
   tail -f backend/logs/error.log
   
   # Docker logs
   docker-compose logs -f backend
   docker-compose logs -f frontend
   ```

2. Enable debug mode:
   ```env
   # backend/.env
   NODE_ENV=development
   ```

3. Test API manually:
   ```bash
   # Health check
   curl http://localhost:5000/health
   
   # Auth URL
   curl http://localhost:5000/api/auth/google
   ```

## 📝 Project Checklist

### Core Features
- ✅ Google OAuth 2.0 authentication
- ✅ Dual AI support (Gemini + OpenAI)
- ✅ Gmail API integration
- ✅ Smart email classification
- ✅ localStorage (no database)
- ✅ API key persistence
- ✅ Modern responsive UI
- ✅ Overlay detail panel

### Code Quality
- ✅ TypeScript throughout
- ✅ Clean architecture
- ✅ Error handling
- ✅ Rate limiting
- ✅ Security headers
- ✅ Structured logging
- ✅ Comprehensive documentation

### Setup Guides
- ✅ Main README (this file)
- ✅ Backend README
- ✅ Frontend README
- ✅ Environment examples

## 📚 Documentation

- **Main Guide**: [README.md](./README.md) (this file)
- **Backend Guide**: [backend/README.md](./backend/README.md)
- **Frontend Guide**: [frontend/README.md](./frontend/README.md)

## ⚡ Smart Batching System

The application uses intelligent dynamic batching to optimize performance and avoid API rate limits:

### Batch Strategy

| Email Count | Batch Size | Delay | Strategy |
|-------------|------------|-------|----------|
| **1-5** | All at once | 0ms | Instant processing |
| **6-10** | All at once | 500ms | Fast with minimal delay |
| **11-15** | Split in 2 | 800ms | Balanced approach |
| **16-25** | 10 per batch | 1000ms | Optimal throughput |
| **26-40** | 10 per batch | 1200ms | Steady processing |
| **40+** | 8 per batch | 1500ms | Rate limit safe |

### Benefits

- ✅ **Fast for Small Batches**: 1-10 emails process instantly
- ✅ **Optimized for Medium**: 11-25 emails use smart splitting
- ✅ **Safe for Large**: 40+ emails avoid rate limits
- ✅ **No Restrictions**: Full email content, no truncation
- ✅ **Progress Tracking**: Real-time batch progress logging

### Example Processing Times

- **5 emails**: ~5-10 seconds (all at once)
- **15 emails**: ~15-20 seconds (2 batches)
- **25 emails**: ~30-35 seconds (3 batches)
- **50 emails**: ~60-75 seconds (7 batches)

*Times vary based on AI provider response speed*

## 🛡️ License

This project is for demonstration purposes.

## 🚀 Quick Links

- **Local Backend**: http://localhost:5000
- **Local Frontend**: http://localhost:3000
- **Health Check**: http://localhost:5000/health
- **Google Cloud Console**: https://console.cloud.google.com/

## ✨ Features at a Glance

| Feature | Status |
|---------|--------|
| Google OAuth Login | ✅ |
| Gemini AI | ✅ |
| OpenAI GPT-4 | ✅ |
| Email Classification | ✅ |
| Persistent API Keys | ✅ |
| Modern UI | ✅ |
| Docker Support | ✅ |
| TypeScript | ✅ |
| Security | ✅ |
| Documentation | ✅ |

---

**Built with ❤️ using Next.js, Express, and AI**
