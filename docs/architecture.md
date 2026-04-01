# Incident Management System - Architecture

## 📐 System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client Layer                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │   Browser   │  │   Mobile    │  │  CLI Tools  │             │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘             │
└─────────┼────────────────┼────────────────┼────────────────────┘
          │                │                │
          └────────────────┼────────────────┘
                           │
                    ┌──────▼──────┐
                    │   Nginx     │  (Reverse Proxy, SSL)
                    │   :80/:443  │
                    └──────┬──────┘
                           │
          ┌────────────────┼────────────────┐
          │                │                │
    ┌─────▼─────┐   ┌─────▼─────┐   ┌─────▼─────┐
    │ Frontend  │   │  Backend  │   │   API     │
    │ React     │   │ FastAPI   │   │ Gateway   │
    │ :5173     │   │ :8000     │   │           │
    └───────────┘   └─────┬─────┘   └───────────┘
                          │
                ┌─────────┼─────────┐
                │         │         │
          ┌─────▼──┐ ┌───▼───┐ ┌──▼──────┐
          │ Postgres│ │ Redis │ │ Kafka/  │
          │ :5432  │ │ :6379 │ │ RabbitMQ│
          └────────┘ └───────┘ └─────────┘
```

## 🏗️ Technology Stack

### Frontend
- **Framework:** React 19 + TypeScript
- **Build Tool:** Vite 8
- **Styling:** Tailwind CSS 4
- **State Management:** Zustand
- **Routing:** React Router v7
- **UI Components:** Radix UI, shadcn/ui

### Backend
- **Framework:** FastAPI (Python 3.12)
- **Database:** PostgreSQL 16
- **Cache:** Redis 7
- **Message Broker:** Kafka / RabbitMQ
- **ORM:** SQLAlchemy 2.0 + Alembic
- **Validation:** Pydantic v2

### Infrastructure
- **Containerization:** Docker + Docker Compose
- **Reverse Proxy:** Nginx
- **CI/CD:** GitHub Actions

## 📁 Project Structure

```
IM/
├── frontend/           # React application
├── backend/            # FastAPI application
├── shared/             # Shared contracts & types
├── .docker/            # Docker configurations
├── .github/            # CI/CD workflows
└── docs/               # Documentation
```

## 🔄 Data Flow

1. **User Action** → Frontend
2. **Frontend** → API Request → Nginx
3. **Nginx** → Backend (FastAPI)
4. **Backend** → Database (PostgreSQL)
5. **Backend** → Cache (Redis)
6. **Backend** → Message Queue (Kafka/RabbitMQ)
7. **Response** → Frontend → User

## 🔐 Security

- JWT Authentication
- CORS configuration
- Rate limiting
- Input validation (Pydantic)
- SQL injection prevention (SQLAlchemy ORM)

## 📊 Monitoring

- Health check endpoints
- Structured logging
- Metrics collection (Prometheus compatible)
- Distributed tracing (OpenTelemetry ready)
