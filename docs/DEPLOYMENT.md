# KADD-AI Deployment Guide

## Overview

This guide covers deploying the KADD-AI application to various environments, from local development to production. The application can be deployed using Firebase Hosting, Vercel, or Docker containers.

## Prerequisites

- Node.js 18+ installed
- Firebase CLI installed (`npm install -g firebase-tools`)
- Git repository access
- Environment variables configured

## Environment Setup

### 1. Environment Variables

Create environment-specific `.env` files:

#### Development (`.env.local`)
```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_dev_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-dev-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-dev-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-dev-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_dev_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_dev_app_id

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key

# Application Configuration
NEXT_PUBLIC_APP_URL=http://localhost:9002
NODE_ENV=development
```

#### Production (`.env.production`)
```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_prod_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-prod-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-prod-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-prod-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_prod_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_prod_app_id

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key

# Application Configuration
NEXT_PUBLIC_APP_URL=https://your-domain.com
NODE_ENV=production
```

### 2. Firebase Configuration

1. **Initialize Firebase project:**
   ```bash
   firebase login
   firebase init
   ```

2. **Select services:**
   - Hosting
   - Firestore
   - Storage
   - Functions (if using serverless)

3. **Configure hosting:**
   ```bash
   # Build directory
   out
   
   # Single-page app
   Yes
   
   # GitHub Actions
   Yes
   ```

## Deployment Options

### Option 1: Firebase Hosting (Recommended)

#### Local Build & Deploy

1. **Build the application:**
   ```bash
   npm run build
   npm run export
   ```

2. **Deploy to Firebase:**
   ```bash
   firebase deploy
   ```

#### Automated Deployment with GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Firebase Hosting

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build_and_deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build application
      run: npm run build
      env:
        NEXT_PUBLIC_FIREBASE_API_KEY: ${{ secrets.FIREBASE_API_KEY }}
        NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: ${{ secrets.FIREBASE_AUTH_DOMAIN }}
        NEXT_PUBLIC_FIREBASE_PROJECT_ID: ${{ secrets.FIREBASE_PROJECT_ID }}
        NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: ${{ secrets.FIREBASE_STORAGE_BUCKET }}
        NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: ${{ secrets.FIREBASE_MESSAGING_SENDER_ID }}
        NEXT_PUBLIC_FIREBASE_APP_ID: ${{ secrets.FIREBASE_APP_ID }}
        OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
    
    - name: Export static files
      run: npm run export
    
    - name: Deploy to Firebase
      uses: FirebaseExtended/action-hosting-deploy@v0
      with:
        repoToken: '${{ secrets.GITHUB_TOKEN }}'
        firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
        channelId: live
        projectId: your-project-id
```

### Option 2: Vercel Deployment

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Deploy:**
   ```bash
   vercel
   ```

3. **Configure environment variables in Vercel dashboard**

4. **Set up custom domain (optional):**
   ```bash
   vercel domains add your-domain.com
   ```

### Option 3: Docker Deployment

#### Dockerfile

Create `Dockerfile`:

```dockerfile
# Use Node.js 18 Alpine image
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./
RUN npm ci --only=production

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Environment variables must be present at build time
ARG NEXT_PUBLIC_FIREBASE_API_KEY
ARG NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
ARG NEXT_PUBLIC_FIREBASE_PROJECT_ID
ARG NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
ARG NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
ARG NEXT_PUBLIC_FIREBASE_APP_ID
ARG OPENAI_API_KEY

ENV NEXT_PUBLIC_FIREBASE_API_KEY=$NEXT_PUBLIC_FIREBASE_API_KEY
ENV NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=$NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
ENV NEXT_PUBLIC_FIREBASE_PROJECT_ID=$NEXT_PUBLIC_FIREBASE_PROJECT_ID
ENV NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=$NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
ENV NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=$NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
ENV NEXT_PUBLIC_FIREBASE_APP_ID=$NEXT_PUBLIC_FIREBASE_APP_ID
ENV OPENAI_API_KEY=$OPENAI_API_KEY

RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

#### Docker Compose

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  kadd-ai:
    build:
      context: .
      args:
        - NEXT_PUBLIC_FIREBASE_API_KEY=${NEXT_PUBLIC_FIREBASE_API_KEY}
        - NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=${NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN}
        - NEXT_PUBLIC_FIREBASE_PROJECT_ID=${NEXT_PUBLIC_FIREBASE_PROJECT_ID}
        - NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=${NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET}
        - NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=${NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID}
        - NEXT_PUBLIC_FIREBASE_APP_ID=${NEXT_PUBLIC_FIREBASE_APP_ID}
        - OPENAI_API_KEY=${OPENAI_API_KEY}
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - kadd-ai
    restart: unless-stopped
```

#### Build and Run

```bash
# Build image
docker build -t kadd-ai .

# Run with Docker Compose
docker-compose up -d

# Or run standalone
docker run -p 3000:3000 --env-file .env.production kadd-ai
```

## Production Considerations

### 1. Security

- **HTTPS**: Always use HTTPS in production
- **CORS**: Configure CORS properly for your domain
- **Rate Limiting**: Implement rate limiting for API endpoints
- **Input Validation**: Validate all user inputs
- **Secrets Management**: Use secure secret management

### 2. Performance

- **CDN**: Use a CDN for static assets
- **Caching**: Implement proper caching strategies
- **Image Optimization**: Optimize uploaded images
- **Database Indexing**: Index Firestore collections properly

### 3. Monitoring

- **Error Tracking**: Set up error monitoring (Sentry)
- **Analytics**: Implement usage analytics
- **Health Checks**: Add health check endpoints
- **Logging**: Configure proper logging

### 4. Scaling

- **Auto-scaling**: Configure auto-scaling for your deployment
- **Load Balancing**: Use load balancers for high traffic
- **Database Scaling**: Plan for database scaling
- **Storage**: Use scalable storage solutions

## Environment-Specific Configurations

### Development

```bash
# Start development server
npm run dev

# Start AI services
npm run genkit:dev

# Run tests
npm test

# Lint code
npm run lint
```

### Staging

```bash
# Build for staging
npm run build:staging

# Deploy to staging
firebase deploy --project staging-project-id
```

### Production

```bash
# Build for production
npm run build:production

# Deploy to production
firebase deploy --project production-project-id
```

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check Node.js version compatibility
   - Verify all dependencies are installed
   - Check environment variables

2. **Deployment Failures**
   - Verify Firebase project configuration
   - Check authentication and permissions
   - Review build logs

3. **Runtime Errors**
   - Check environment variables
   - Verify API keys and configurations
   - Review application logs

### Debug Commands

```bash
# Check Firebase configuration
firebase projects:list

# View deployment logs
firebase hosting:log

# Test local build
npm run build && npm start

# Check environment variables
node -e "console.log(process.env.NODE_ENV)"
```

## Backup and Recovery

### Database Backup

```bash
# Export Firestore data
firebase firestore:export ./backup

# Import Firestore data
firebase firestore:import ./backup
```

### File Storage Backup

```bash
# Backup Firebase Storage
gsutil -m cp -r gs://your-bucket ./storage-backup

# Restore Firebase Storage
gsutil -m cp -r ./storage-backup gs://your-bucket
```

## Maintenance

### Regular Tasks

- **Security Updates**: Keep dependencies updated
- **Performance Monitoring**: Monitor application performance
- **Backup Verification**: Verify backup integrity
- **Log Rotation**: Implement log rotation
- **SSL Certificate Renewal**: Monitor SSL certificate expiration

### Update Procedures

1. **Code Updates**
   ```bash
   git pull origin main
   npm install
   npm run build
   npm run deploy
   ```

2. **Dependency Updates**
   ```bash
   npm audit fix
   npm update
   npm run test
   npm run deploy
   ```

For more detailed information, refer to the [API Documentation](API.md) and [Contributing Guidelines](../CONTRIBUTING.md). 