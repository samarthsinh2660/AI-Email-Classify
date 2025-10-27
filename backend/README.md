# Backend - EmailClassify API 🚀

Express.js backend with TypeScript for AI-powered email classification.

**📖 [Back to Main README](../README.md)**

## 🌟 Features

- 🔐 **Google OAuth 2.0** - Secure authentication
- 📧 **Gmail API** - Fetch emails directly
- 🤖 **Dual AI Support** - Google Gemini + OpenAI GPT-4
- 🔒 **Security** - Rate limiting, Helmet, CORS
- 📝 **Logging** - Winston logger (error.log only)
- ⚡ **Error Handling** - Custom error classes
- 🖄 **TypeScript** - Full type safety

## 🛠️ Tech Stack

- **Runtime**: Node.js 22
- **Framework**: Express.js
- **Language**: TypeScript
- **AI**: Langchain.js + Google Generative AI + OpenAI
- **Auth**: Google OAuth 2.0
- **APIs**: Gmail API
- **Security**: Helmet, Rate Limiting, CORS
- **Logging**: Winston

## Project Structure

```
backend/
├── src/
│   ├── controllers/        # Route controllers
│   │   ├── authController.ts
│   │   └── emailController.ts
│   ├── middleware/         # Custom middleware
│   │   ├── auth.ts
│   │   ├── errorHandler.ts
│   │   └── rateLimiter.ts
│   ├── routes/            # API routes
│   │   ├── authRoutes.ts
│   │   └── emailRoutes.ts
│   ├── services/          # Business logic
│   │   ├── gmailService.ts
│   │   └── classificationService.ts
│   ├── utils/             # Utilities
│   │   ├── error.ts       # Custom error classes
│   │   ├── response.ts    # Response helpers
│   │   └── logger.ts      # Winston logger config
│   └── server.ts          # Entry point
├── logs/                  # Log files (auto-generated)
├── .env.example          # Environment variables template
├── package.json
├── tsconfig.json
└── README.md
```

## 📦 Installation

### Prerequisites

- Node.js 22+ and npm
- Docker (optional, for Docker setup)
- Google Cloud Console project
- Google Gemini or OpenAI API key (users provide)

### Installation

1. **Clone and navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   - Copy `.env.example` to `.env`
   ```bash
   cp .env.example .env
   ```
   - Fill in the required values:

   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=development

   # Google OAuth Credentials
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   GOOGLE_REDIRECT_URI=http://localhost:5000/api/auth/google/callback

   # Frontend URL
   FRONTEND_URL=http://localhost:3000

   # Rate Limiting
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100
   ```

### Getting Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the following APIs:
   - Gmail API
   - Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
5. Configure OAuth consent screen
6. Add test users (including `theindianappguy@gmail.com`)
7. Create OAuth 2.0 Client ID:
   - Application type: Web application
   - Authorized redirect URIs: `http://localhost:5000/api/auth/google/callback`
8. Copy Client ID and Client Secret to `.env`

### Running the Application

#### Option 1: Local Development (npm)

**Development mode** (with hot reload):
```bash
npm run dev
```

**Build for production**:
```bash
npm run build
```

**Start production server**:
```bash
npm start
```

The server will start on `http://localhost:5000`

#### Option 2: Docker (Recommended for Production)

**With Docker Compose**:
```bash
# Copy environment file
cp .env.docker .env
# Edit .env with your credentials

# Build and start
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

**Build Docker image manually**:
```bash
docker build -t magicslice-backend .
docker run -p 5000:5000 --env-file .env magicslice-backend
```

The server will start on `http://localhost:5000`

## API Endpoints

### Authentication

#### `GET /api/auth/google`
Get Google OAuth authorization URL
- **Access**: Public
- **Rate Limit**: 10 requests per 15 minutes
- **Response**: `{ authUrl: string }`

#### `GET /api/auth/google/callback`
Handle Google OAuth callback
- **Access**: Public
- **Query Params**: `code` - Authorization code from Google
- **Redirects to**: Frontend with access token

#### `GET /api/auth/verify`
Verify authentication token
- **Access**: Protected
- **Headers**: `Authorization: Bearer <access_token>`
- **Response**: User information

#### `POST /api/auth/refresh`
Refresh access token
- **Access**: Public
- **Body**: `{ refreshToken: string }`
- **Response**: New access token

### Emails

#### `GET /api/emails?limit=15`
Fetch emails from Gmail
- **Access**: Protected
- **Headers**: `Authorization: Bearer <access_token>`
- **Query Params**: 
  - `limit` (optional): Number of emails to fetch (1-50, default: 15)
- **Rate Limit**: 5 requests per minute
- **Response**: Array of email objects

#### `POST /api/emails/classify`
Classify emails using OpenAI
- **Access**: Protected
- **Headers**: `Authorization: Bearer <access_token>`
- **Body**: 
  ```json
  {
    "emails": [/* array of email objects */],
    "openaiApiKey": "sk-..."
  }
  ```
- **Rate Limit**: 10 requests per minute
- **Response**: Array of classified emails with categories

#### `POST /api/emails/fetch-and-classify?limit=15`
Fetch and classify emails in one request
- **Access**: Protected
- **Headers**: `Authorization: Bearer <access_token>`
- **Query Params**: 
  - `limit` (optional): Number of emails to fetch (1-50, default: 15)
- **Body**: 
  ```json
  {
    "openaiApiKey": "sk-..."
  }
  ```
- **Rate Limit**: 5 requests per minute
- **Response**: Array of classified emails with statistics

### Health Check

#### `GET /health`
Server health check
- **Access**: Public
- **No Rate Limit**
- **Response**: Server status and uptime

## Email Categories

Emails are classified into the following categories:

- **Important**: Personal or work-related emails requiring immediate attention
- **Promotional**: Sales, discounts, and promotional campaigns
- **Social**: Emails from social networks, friends, and family
- **Marketing**: Marketing emails, newsletters, and notifications
- **Spam**: Unwanted or unsolicited emails
- **General**: Default category if none match

## Error Handling

The API uses standardized error responses:

```json
{
  "success": false,
  "message": "Error description",
  "error": {
    "code": "ERROR_CODE",
    "details": {}
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

Common error codes:
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `429` - Too Many Requests
- `500` - Internal Server Error

## Logging

Logs are stored in the `logs/` directory:
- `combined.log` - All logs
- `error.log` - Error logs only
- `exceptions.log` - Uncaught exceptions
- `rejections.log` - Unhandled promise rejections

## Security Features

- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing protection
- **Rate Limiting**: Prevents abuse with configurable limits
- **Input Validation**: Request validation
- **Error Sanitization**: Sensitive data not exposed in production

## Development

### Code Quality

Run TypeScript type checking:
```bash
npm run build
```

### Best Practices

- All async functions use proper error handling with `try-catch`
- Errors are propagated using `next(error)`
- Custom error classes for different error types
- Structured logging throughout the application
- Rate limiting on all endpoints
- Authentication middleware for protected routes

## Production Deployment

1. Set `NODE_ENV=production` in environment variables
2. Update `FRONTEND_URL` to production URL
3. Use a process manager like PM2:
   ```bash
   npm install -g pm2
   pm2 start dist/server.js --name magicslice-backend
   ```

## Troubleshooting

### Common Issues

1. **OAuth errors**: Ensure Google OAuth credentials are correct and redirect URI matches
2. **Rate limit errors**: Check rate limit configuration in `.env`
3. **TypeScript errors**: Run `npm install` to ensure all types are installed
4. **Port already in use**: Change `PORT` in `.env`

## Docker Setup

### Docker Files

The project includes the following Docker files:

- **Dockerfile** - Multi-stage production build
- **docker-compose.yml** - Production compose file
- **.dockerignore** - Files to exclude from Docker build
- **.env.docker** - Environment variables template for Docker

### Docker Features

✅ **Multi-stage builds** - Optimized production image size
✅ **Non-root user** - Security best practice
✅ **Health checks** - Container health monitoring
✅ **Log persistence** - Logs volume mounted
✅ **Signal handling** - Proper process management with dumb-init
✅ **Network isolation** - Custom bridge network

### Docker Commands

```bash
# Build
docker-compose build

# Start in detached mode
docker-compose up -d

# View logs
docker-compose logs -f backend

# Stop
docker-compose stop

# Remove containers
docker-compose down

# Remove with volumes
docker-compose down -v
```

**Docker Image Info**:
```bash
# Check image size
docker images magicslice-backend

# Inspect container
docker inspect magicslice-backend

# Execute command in container
docker-compose exec backend sh
```

### Environment Variables for Docker

Create a `.env` file in the backend directory:
```env
PORT=5000
NODE_ENV=production
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
GOOGLE_REDIRECT_URI=http://localhost:5000/api/auth/google/callback
FRONTEND_URL=http://localhost:3000
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## Support

For issues and questions, refer to the main project README or create an issue in the repository.
