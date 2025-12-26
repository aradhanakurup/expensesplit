# ExpenseSplit - Setup Guide

## Quick Start

### Prerequisites
- Node.js 18+
- Docker & Docker Compose
- PostgreSQL 14+ (if not using Docker)
- Redis 6+ (if not using Docker)

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/aradhanakurup/expensesplit.git
   cd expensesplit
   ```

2. **Setup environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Start services with Docker**
   ```bash
   docker-compose up -d
   ```

4. **Install dependencies**
   ```bash
   npm install
   cd backend && npm install && cd ..
   cd frontend && npm install && cd ..
   ```

5. **Run backend API**
   ```bash
   cd backend
   npm run dev
   ```

6. **Run mobile app**
   ```bash
   cd frontend
   npm start
   ```

## Project Structure

```
expensesplit/
├── backend/              # NestJS API
├── frontend/             # React Native (Expo) app  
├── Dockerfile            # Production build
├── docker-compose.yml    # Development services
├── .env.example          # Environment template
└── README.md             # Project info
```

## Technology Stack

- **Backend**: NestJS + TypeScript
- **Database**: PostgreSQL
- **Cache**: Redis
- **Frontend**: React Native + Expo
- **Payments**: Razorpay UPI
- **OCR**: Google Vision API
- **DevOps**: Docker, Kubernetes

## Key Features

✅ Ledger-based expense splitting
✅ Camera-first OCR bill detection
✅ Razorpay UPI payments
✅ Real-time balance derivation
✅ WhatsApp integration
✅ Offline-first mobile app

## Next Steps

See CONTRIBUTING.md for development guidelines.
