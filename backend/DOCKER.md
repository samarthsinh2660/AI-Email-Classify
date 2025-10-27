# Docker Guide for MagicSlice Backend

Complete Docker setup for development and production environments.

## 📁 Docker Files Overview

| File | Purpose |
|------|---------|
| `Dockerfile` | Multi-stage production build |
| `docker-compose.yml` | Production orchestration |
| `.dockerignore` | Exclude files from build |
| `.env.docker` | Environment template |

## 🚀 Quick Start

### Setup

```bash
# 1. Copy environment template
cp .env.docker .env

# 2. Edit .env with your credentials
# Add GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, etc.

# 3. Build and start
docker-compose up -d

# 4. Check logs
docker-compose logs -f backend

# 5. Access at http://localhost:5000
```

## 🏗️ Docker Architecture

### Production Dockerfile

**Multi-stage build** for optimized image size:

1. **Builder stage**: Compiles TypeScript
2. **Production stage**: Minimal runtime image

**Features**:
- ✅ Alpine Linux (lightweight)
- ✅ Non-root user (nodejs:nodejs)
- ✅ dumb-init for signal handling
- ✅ Health check endpoint
- ✅ Production dependencies only
- ✅ Optimized layer caching

## 📋 Common Commands

### Container Management

```bash
# Start containers
docker-compose up -d

# Stop containers
docker-compose stop

# Restart containers
docker-compose restart

# Remove containers
docker-compose down

# Remove with volumes
docker-compose down -v

# View running containers
docker-compose ps
```

### Logs and Debugging

```bash
# View logs
docker-compose logs -f backend

# Last 100 lines
docker-compose logs --tail=100 backend

# Enter container shell
docker-compose exec backend sh

# Run command in container
docker-compose exec backend node --version
```

### Building and Rebuilding

```bash
# Build/rebuild images
docker-compose build

# Build without cache
docker-compose build --no-cache

# Pull latest base images
docker-compose pull

# Build specific service
docker-compose build backend
```

### Image Management

```bash
# List images
docker images

# Remove unused images
docker image prune

# Remove all unused data
docker system prune -a

# Check image size
docker images magicslice-backend
```

## 🔧 Configuration

### Environment Variables

Required variables in `.env`:

```env
# Server
PORT=5000
NODE_ENV=production

# Google OAuth
GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_secret_here
GOOGLE_REDIRECT_URI=http://localhost:5000/api/auth/google/callback

# Frontend
FRONTEND_URL=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Volume Mounts

`docker-compose.yml`:
- `./logs:/app/logs` - Log persistence

### Port Mapping

Default: `5000:5000` (host:container)

Change host port:
```bash
# In .env
PORT=3001

# Or in docker-compose.yml
ports:
  - "3001:5000"
```

## 🏥 Health Checks

Built-in health check at `/health`:

```bash
# Check health status
curl http://localhost:5000/health

# View health in docker
docker inspect --format='{{.State.Health.Status}}' magicslice-backend
```

Health check configuration:
- **Interval**: 30s
- **Timeout**: 10s
- **Retries**: 3
- **Start period**: 40s

## 🔒 Security Best Practices

✅ **Non-root user**: Runs as `nodejs` (UID 1001)
✅ **Minimal base**: Alpine Linux (small attack surface)
✅ **No secrets in image**: Use environment variables
✅ **Read-only where possible**: Immutable infrastructure
✅ **Health checks**: Auto-restart on failure
✅ **Resource limits**: Can be set in compose file

### Adding Resource Limits

Add to `docker-compose.yml`:

```yaml
services:
  backend:
    # ... other config
    deploy:
      resources:
        limits:
          cpus: '1.0'
          memory: 512M
        reservations:
          memory: 256M
```

## 🐛 Troubleshooting

### Container won't start

```bash
# Check logs
docker-compose logs backend

# Check if port is in use
netstat -ano | findstr :5000  # Windows
lsof -i :5000                 # Mac/Linux

# Remove old containers
docker-compose down
docker-compose up -d
```

### Build failures

```bash
# Clear cache and rebuild
docker-compose build --no-cache

# Check Dockerfile syntax
docker build -t test .

# View build logs
docker-compose build --progress=plain
```

### Permission issues

```bash
# On Linux, fix log directory permissions
sudo chown -R 1001:1001 logs/

# Or run as current user (not recommended)
USER $(id -u):$(id -g)  # Add to Dockerfile
```

### Module not found errors

```bash
# Rebuild with fresh node_modules
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### Hot reload not working (dev)

```bash
# Ensure volume mounts are correct
docker-compose -f docker-compose.dev.yml config

# Restart container
docker-compose -f docker-compose.dev.yml restart
```

## 📊 Monitoring

### View container stats

```bash
# Real-time stats
docker stats magicslice-backend

# Container info
docker inspect magicslice-backend
```

### Log management

Logs are automatically rotated:
- Max size: 10MB per file
- Max files: 3
- Total: ~30MB max

View in container:
```bash
docker-compose exec backend ls -lh /app/logs/
```

## 🚢 Production Deployment

### Using Docker

```bash
# On production server
git clone <repository>
cd backend

# Setup environment
cp .env.docker .env
nano .env  # Add production values

# Build and start
docker-compose up -d

# Enable auto-restart
docker-compose restart backend
```

### Using Docker Hub

```bash
# Build and tag
docker build -t your-username/magicslice-backend:latest .

# Push to Docker Hub
docker push your-username/magicslice-backend:latest

# Pull and run on server
docker pull your-username/magicslice-backend:latest
docker run -d -p 5000:5000 --env-file .env your-username/magicslice-backend:latest
```

### Using Docker Registry

```bash
# Tag for private registry
docker tag magicslice-backend registry.example.com/magicslice-backend:latest

# Push
docker push registry.example.com/magicslice-backend:latest
```

## 🔄 CI/CD Integration

### GitHub Actions Example

```yaml
name: Build and Push Docker Image

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Build Docker image
        run: docker build -t magicslice-backend .
      
      - name: Run tests in container
        run: docker run magicslice-backend npm test
```

## 📚 Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Node.js Docker Best Practices](https://github.com/nodejs/docker-node/blob/main/docs/BestPractices.md)
- [Alpine Linux](https://alpinelinux.org/)

## 💡 Tips

1. **Use .dockerignore**: Faster builds, smaller context
2. **Layer caching**: Order Dockerfile commands by change frequency
3. **Multi-stage builds**: Smaller production images
4. **Health checks**: Auto-recovery from failures
5. **Volume mounts**: Persist data and enable hot reload
6. **Non-root user**: Security best practice
7. **Alpine base**: Smaller image, faster pulls
8. **Environment variables**: Never hardcode secrets

## 🎯 Next Steps

- [ ] Set up Docker on your machine
- [ ] Configure `.env` file
- [ ] Run `docker-compose up -d`
- [ ] Access http://localhost:5000/health
- [ ] Check logs with `docker-compose logs -f`
- [ ] Deploy to production server

Need help? Check the main README or create an issue!
