# Development Guide

## 🛠 Local Development Setup

### 1. Clone and Install

```bash
# Clone repository
git clone <repository-url>
cd IM

# Frontend
cd frontend
npm install

# Backend
cd ../backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
pip install -r requirements-dev.txt
```

### 2. Environment Setup

Create `frontend/.env`:
```env
VITE_API_URL=http://localhost:8000
```

Create `backend/.env`:
```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/incident_db
REDIS_URL=redis://localhost:6379
DEBUG=true
```

### 3. Start Services

```bash
# Using Docker (recommended)
docker-compose -f .docker/docker-compose.dev.yml up -d

# Or manually start each service
# Terminal 1 - Frontend
cd frontend
npm run dev

# Terminal 2 - Backend
cd backend
source venv/bin/activate
uvicorn app.main:app --reload

# Terminal 3 - Database (if not using Docker)
postgres -D /usr/local/var/postgres
```

## 📝 Coding Standards

### Frontend

```bash
# Lint
npm run lint

# Format
npm run format

# Type check
npm run type-check
```

### Backend

```bash
# Lint
flake8 app/

# Format
black app/

# Type check
mypy app/

# Tests
pytest tests/
```

## 🧪 Testing

### Frontend Tests
```bash
npm run test
npm run test:coverage
```

### Backend Tests
```bash
pytest tests/ -v
pytest tests/ -v --cov=app
```

## 📚 API Documentation

When backend is running:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## 🔧 Useful Commands

```bash
# Database reset
docker-compose -f .docker/docker-compose.dev.yml down -v
docker-compose -f .docker/docker-compose.dev.yml up -d database

# View environment variables
docker-compose -f .docker/docker-compose.dev.yml exec backend env

# Access database shell
docker-compose -f .docker/docker-compose.dev.yml exec database psql -U postgres

# Access backend shell
docker-compose -f .docker/docker-compose.dev.yml exec backend python

# Clear npm cache
npm cache clean --force

# Clear Python cache
find . -type d -name __pycache__ -exec rm -rf {} +
find . -type f -name "*.pyc" -delete
```

## 🐛 Debugging

### Frontend (VS Code)
Add to `.vscode/launch.json`:
```json
{
  "type": "chrome",
  "request": "launch",
  "name": "Debug Frontend",
  "url": "http://localhost:5173",
  "webRoot": "${workspaceFolder}/frontend"
}
```

### Backend (VS Code)
Add to `.vscode/launch.json`:
```json
{
  "name": "Debug Backend",
  "type": "debugpy",
  "request": "launch",
  "module": "uvicorn",
  "args": ["app.main:app", "--reload"],
  "cwd": "${workspaceFolder}/backend"
}
```
