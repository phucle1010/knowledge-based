# Knowledge-Based Interview AI System

![AI Core System](./system/AI-core-system.png)

A comprehensive AI-powered interview platform with vector search capabilities and JWT authentication.

## Setup

### 1. Environment Configuration

Copy the example environment file and configure your settings:

```bash
cp .env.example .env
```

Edit `.env` with your actual configuration values:

```env
# Database Configuration
NEXT_PUBLIC_MONGODB_URI=

# Vector Database (Milvus)
NEXT_PUBLIC_MILVUS_ADDRESS=

# Redis Cache
NEXT_PUBLIC_UPSTASH_REDIS_URL=
NEXT_PUBLIC_UPSTASH_REDIS_TOKEN=

# AI Service (Groq)
NEXT_PUBLIC_GROQ_API_KEY=
NEXT_PUBLIC_GROQ_MODEL=

# Application Settings
NEXT_PUBLIC_BASE_URL=

# Authentication (WARNING: Do not use NEXT_PUBLIC_ prefix for sensitive data in production)
NEXT_PUBLIC_JWT_SECRET=
NEXT_PUBLIC_JWT_ACCESS_EXPIRATION=
NEXT_PUBLIC_JWT_REFRESH_EXPIRATION=
NEXT_PUBLIC_JWT_RESET_PASSWORD_EXPIRATION=
NEXT_PUBLIC_JWT_VERIFY_EMAIL_EXPIRATION=
```

### 2. MongoDB Setup

This application uses MongoDB Atlas. Make sure you have:

- A MongoDB Atlas cluster running
- Database user with read/write permissions
- Network access configured to allow connections

### 3. Milvus Vector Database

## Milvus

### Run by Docker

1. Start Milvus Standalone

```bash
curl -sfL https://raw.githubusercontent.com/milvus-io/milvus/master/scripts/standalone_embed.sh -o standalone_embed.sh
```

```bash
bash standalone_embed.sh start
```

2. Run Attu to track data

```bash
docker run -p 8000:3000 -e MILVUS_URL=YOUR_MILVUS_IP:19530 zilliz/attu:latest
```

3. Connect Attu

- Provide connection information:

```bash
Milvus Address: host.docker.internal:19530
Username: root
Password: Milvus
```

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm start
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh-token` - Refresh access token
- `POST /api/auth/logout` - User logout
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password
- `GET /api/auth/profile` - Get user profile (protected)

### Interview

- `POST /api/interview/session` - Create interview session
- `POST /api/interview/message` - Send interview message
- `POST /api/interview/submit-answer` - Submit answer
- `POST /api/interview/final-result` - Get final interview result

## Troubleshooting

### MongoDB Connection Issues

If you encounter connection errors:

1. **ETIMEOUT/querySrv errors**: Check your internet connection and MongoDB Atlas cluster status
2. **Authentication failed**: Verify your MongoDB username and password
3. **ENOTFOUND**: Check your MongoDB URI hostname
4. **ECONNREFUSED**: Ensure MongoDB Atlas allows connections from your IP

### OverwriteModelError

This error occurs during development due to hot reloading. The fix has been applied to prevent model redefinition.

### Environment Variables

Ensure all required environment variables are set. Missing variables will cause runtime errors.
