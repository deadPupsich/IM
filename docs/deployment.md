# Deployment Guide

## 🚀 Quick Start

### Development Environment

```bash
# Start all services
docker-compose -f .docker/docker-compose.dev.yml up -d

# View logs
docker-compose -f .docker/docker-compose.dev.yml logs -f

# Stop all services
docker-compose -f .docker/docker-compose.dev.yml down
```

### Production Environment

```bash
# Build and start
docker-compose -f .docker/docker-compose.yml up -d --build

# Scale backend
docker-compose -f .docker/docker-compose.yml up -d --scale backend=3
```

## 📋 Prerequisites

- Docker 24+
- Docker Compose 2.20+
- Node.js 20+ (for local development)
- Python 3.12+ (for local development)

## 🔧 Configuration

### Environment Variables

Create `.env` file in the root directory:

```env
# Database
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_secure_password
POSTGRES_DB=incident_db

# Backend
DATABASE_URL=postgresql://postgres:your_secure_password@database:5432/incident_db
REDIS_URL=redis://redis:6379
SECRET_KEY=your_secret_key_here
DEBUG=false

# Frontend
VITE_API_URL=https://your-domain.com/api
```

## 📦 Database Migration

```bash
# Run migrations
docker-compose exec backend alembic upgrade head

# Create new migration
docker-compose exec backend alembic revision --autogenerate -m "description"

# Rollback
docker-compose exec backend alembic downgrade -1
```

## 🔍 Monitoring

### Health Checks

```bash
# Frontend
curl http://localhost:5173/health

# Backend
curl http://localhost:8000/health

# Database
docker-compose exec database pg_isready
```

### Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
```

## 🆘 Troubleshooting

### Frontend not starting
```bash
docker-compose -f .docker/docker-compose.dev.yml up frontend --build
```

### Database connection error
```bash
docker-compose exec database psql -U postgres -c "SELECT 1"
```

### Clear all data
```bash
docker-compose down -v
docker-compose up -d
```
