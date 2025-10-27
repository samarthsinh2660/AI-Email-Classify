# Frontend - EmailClassify UI 🎨

Next.js 15 frontend with TypeScript for AI-powered email classification.

**📖 [Back to Main README](../README.md)**

## 🌟 Features

- 🎨 **Modern UI** - Beautiful, responsive design
- 🔐 **Google OAuth** - Secure authentication
- 🤖 **Dual AI** - Choose Gemini or OpenAI
- 💾 **Persistent Storage** - API keys saved locally
- 📋 **Overlay Detail** - Slide-in email panel
- 📊 **Statistics** - Real-time category distribution
- ⚡ **React Query** - Efficient data management
- 🎯 **TypeScript** - Full type safety

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript  
- **Styling**: TailwindCSS
- **State**: TanStack Query (React Query)
- **HTTP**: Axios with interceptors
- **Icons**: Lucide React
- **Storage**: localStorage API

## Project Structure

```
frontend/
├── src/
│   ├── app/                    # Next.js app router pages
│   │   ├── auth/
│   │   │   └── callback/      # OAuth callback handler
│   │   ├── dashboard/         # Main dashboard page
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Home/auth page
│   │   ├── providers.tsx      # React Query provider
│   │   └── globals.css        # Global styles
│   ├── components/            # React components
│   │   ├── auth/
│   │   │   └── AuthPage.tsx   # Login page component
│   │   └── dashboard/
│   │       ├── EmailList.tsx  # Email list component
│   │       ├── EmailDetail.tsx # Email detail view
│   │       └── StatsPanel.tsx # Statistics component
│   ├── hooks/                 # Custom React hooks
│   │   ├── useAuth.ts         # Authentication hooks
│   │   └── useEmails.ts       # Email management hooks
│   └── lib/                   # Utilities and configuration
│       ├── api.ts             # Axios instance and interceptors
│       ├── queryClient.ts     # React Query configuration
│       ├── storage.ts         # localStorage utilities
│       └── utils.ts           # Helper functions
├── public/                    # Static assets
├── .env.local.example         # Environment variables template
├── next.config.js            # Next.js configuration
├── tailwind.config.ts        # Tailwind configuration
├── tsconfig.json             # TypeScript configuration
└── package.json              # Dependencies
```

## 📦 Installation

### Prerequisites

- Node.js 22+ and npm
- Docker (optional, for Docker setup)
- Backend server running

### Option 1: Docker Setup (Recommended)

```bash
# 1. From root directory
cd magicslice

# 2. Start with docker-compose
docker-compose up --build

# Frontend runs on http://localhost:3000
```

**📖 Full Docker Guide**: See [DOCKER_SETUP.md](../DOCKER_SETUP.md)

### Option 2: Local Development

```bash
# 1. Navigate to frontend
cd frontend

# 2. Install dependencies
npm install

# 3. Setup environment (optional)
cp .env.local.example .env.local
# Edit if needed - defaults work fine

# 4. Start dev server
npm run dev

# Opens on http://localhost:3000
```

## 🔐 Environment Variables

**File**: `.env.local` (optional)

```env
# Backend API URL (default works for local setup)
NEXT_PUBLIC_API_URL=http://localhost:5000
```

**Note**: This is optional - the default value works for standard local development.

## 🛠️ Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Run production build
npm run lint         # Run ESLint
```

## 📱 Usage Guide

### 1. Login
1. Open `http://localhost:3000`
2. Click **"Login with Google"**
3. Authorize Gmail access
4. Redirected to dashboard

### 2. Select AI Provider
- Choose **Google Gemini** or **OpenAI GPT**
- Selection saved automatically
- Switch anytime

### 3. Enter API Key
- Enter your API key (first time only)
- Automatically saved to localStorage
- Shows "API Key saved ✓" when stored
- Click "Remove" to change key

### 4. Classify Emails
- Select email count (5, 10, 15, 25, or 50)
- Click **"Classify"** button
- Watch progress
- View results instantly

### 5. View Email Detail
- Click any email in list
- Overlay panel slides from right
- Shows full content with images
- Category badge displayed
- Click backdrop or X to close
- URL updates: `/dashboard?id=<emailId>`

### 6. Statistics
- View category distribution
- Color-coded badges
- Real-time updates

### 7. Logout
Click logout icon in header

## ✨ Key Features

### Dual AI Support
- **Google Gemini**: `gemini-pro` model
- **OpenAI GPT-4**: Latest GPT-4 model
- Switch between providers anytime
- Separate API keys for each

### Persistent Storage
Stored in localStorage:
- ✅ Access & refresh tokens
- ✅ User information
- ✅ OpenAI API key
- ✅ Gemini API key
- ✅ AI provider preference
- ✅ Classified emails

**Privacy**: No data sent to external servers except AI providers.

### Email Categories

| Category | Description | Color |
|----------|-------------|-------|
| Important | Work-related, urgent | Green |
| Promotional | Sales, discounts | Blue |
| Social | Social networks, friends | Indigo |
| Marketing | Newsletters, marketing | Yellow |
| Spam | Unwanted emails | Red |
| General | All other emails | Purple |

### UI Features
- ✅ Responsive design (mobile-ready)
- ✅ Overlay detail panel (slides from right)
- ✅ Color-coded category badges
- ✅ Real-time statistics
- ✅ URL-based email selection
- ✅ HTML email rendering with images
- ✅ Conditional API key input (hidden when saved)

## API Integration

### Endpoints Used

- `GET /api/auth/google` - Get OAuth URL
- `GET /api/auth/google/callback` - OAuth callback
- `POST /api/emails/fetch-and-classify` - Fetch and classify emails

### Error Handling

- Automatic retry on network errors
- Token refresh on 401 errors
- User-friendly error messages
- Request/response interceptors

## Customization

### Styling

Modify `src/app/globals.css` and `tailwind.config.ts` for theme customization.

### Categories

Update `src/lib/utils.ts` to customize category colors and icons:
```typescript
export function getCategoryColor(category: string): string {
  // Add custom category colors
}
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | `http://localhost:5000` |

## 🧪 Troubleshooting

### Common Issues

#### "Cannot connect to backend"
1. Check backend is running: `http://localhost:5000/health`
2. Verify `NEXT_PUBLIC_API_URL` in `.env.local`
3. Check browser console for CORS errors
4. Restart both frontend and backend

#### "Hydration error" (Next.js 15)
- ✅ Fixed in latest version with Suspense wrapper
- Clear `.next` folder: `rm -rf .next`
- Restart dev server

#### API key not saving
- Check browser allows localStorage
- Try incognito mode to test
- Clear localStorage: `localStorage.clear()` in console

#### Classification returns all "General"
- ✅ Fixed in latest version
- Update to latest code
- Clear browser cache

#### Images not loading in email detail
- ✅ Fixed with HTML rendering
- Images render using `dangerouslySetInnerHTML`
- Gmail sanitizes HTML before sending

#### Build errors
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules
npm install

# Rebuild
npm run build
```

### Debug Tips

1. **Open browser console** (F12) for errors
2. **Check Network tab** for API calls
3. **Inspect localStorage**:
   ```javascript
   // In browser console
   console.log(localStorage);
   ```
4. **Clear all data**:
   ```javascript
   localStorage.clear();
   location.reload();
   ```

## 🌐 Browser Support

- ✅ Chrome/Edge (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Opera
- ✅ Mobile browsers

## 📚 Documentation Links

- **Main README**: [../README.md](../README.md)
- **Backend Guide**: [../backend/README.md](../backend/README.md)
- **Docker Setup**: [../DOCKER_SETUP.md](../DOCKER_SETUP.md)

## ⚡ Performance

- Code splitting with Next.js 15
- Automatic image optimization
- Server components where applicable
- Suspense boundaries for async data
- Optimized bundle size

## 🔒 Security

- Secure token storage (localStorage)
- XSS protection built-in
- CORS handled by backend
- Rate limiting on backend
- No sensitive data in client

---

**Built with ❤️ using Next.js 15 and TypeScript**
