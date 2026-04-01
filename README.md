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
