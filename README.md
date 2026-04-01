# Incident Management System

[![Frontend CI](https://github.com/your-org/IM/actions/workflows/frontend-ci.yml/badge.svg)](https://github.com/your-org/IM/actions/workflows/frontend-ci.yml)
[![Backend CI](https://github.com/your-org/IM/actions/workflows/backend-ci.yml/badge.svg)](https://github.com/your-org/IM/actions/workflows/backend-ci.yml)

A comprehensive security incident management system with real-time collaboration features.

## 🚀 Quick Start

### Prerequisites

- Docker 24+
- Docker Compose 2.20+
- Node.js 20+ (for local development)
- Python 3.12+ (for local development)

### Development Setup

```bash
# Clone repository
git clone <repository-url>
cd IM

# Start all services
docker-compose -f .docker/docker-compose.dev.yml up -d

# Access services
# Frontend: http://localhost:5173
# Backend API: http://localhost:8000
# API Docs: http://localhost:8000/docs
```

## 📁 Project Structure

```
IM/
├── frontend/           # React + TypeScript application
│   ├── src/
│   ├── public/
│   └── package.json
├── backend/            # FastAPI (Python) application
│   ├── app/
│   ├── tests/
│   └── requirements.txt
├── shared/             # Shared contracts & types
│   ├── api-spec/
│   ├── constants/
│   └── events/
├── .docker/            # Docker configurations
│   ├── docker-compose.yml
│   ├── docker-compose.dev.yml
│   └── ...
├── .github/            # CI/CD workflows
├── docs/               # Documentation
└── scripts/            # Development scripts
```

## 🛠 Technology Stack

### Frontend
- **Framework:** React 19 + TypeScript
- **Build Tool:** Vite 8
- **Styling:** Tailwind CSS 4
- **State Management:** Zustand
- **UI Components:** Radix UI

### Backend
- **Framework:** FastAPI (Python 3.12)
- **Database:** PostgreSQL 16
- **Cache:** Redis 7
- **Message Queue:** Kafka / RabbitMQ
- **ORM:** SQLAlchemy 2.0

### Infrastructure
- **Containerization:** Docker
- **Reverse Proxy:** Nginx
- **CI/CD:** GitHub Actions

## 📚 Documentation

- [Architecture](docs/architecture.md)
- [Development Guide](docs/development.md)
- [Deployment Guide](docs/deployment.md)
- [API Documentation](http://localhost:8000/docs)

## 🔧 Development

```bash
# Frontend
cd frontend
npm run dev

# Backend
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

## 🧪 Testing

```bash
# Frontend tests
cd frontend
npm run test

# Backend tests
cd backend
pytest tests/
```

## 📝 License

MIT License - see [LICENSE](LICENSE) for details.

## 👥 Team

- SOC Team - Initial work
