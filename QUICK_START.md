# ExpenseSplit - Quick Start Guide

Get ExpenseSplit running in minutes with Docker!

## Prerequisites

- Docker Desktop (already open - good!)
- 4GB+ RAM allocated to Docker

## Quick Start with Docker

### Step 1: Clone Repository

```bash
git clone https://github.com/aradhanakurup/expensesplit.git
cd expensesplit
```

### Step 2: Make Startup Script Executable

```bash
chmod +x START.sh
```

### Step 3: Run the Application

```bash
./START.sh
```

The script will:
- Create .env configuration
- Start PostgreSQL and Redis
- Run database migrations
- Install dependencies
- Build and start API server

### Step 4: Access Application

Once complete, access at:
- **API:** http://localhost:3000
- **Health Check:** http://localhost:3000/health

## Manual Docker Commands

If you prefer manual control:

```bash
# Create environment file
cp .env.example .env

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## Management Commands

```bash
# View API logs
docker-compose logs -f api

# Access database
docker-compose exec db psql -U postgres -d expensesplit

# Access Redis
docker-compose exec cache redis-cli

# Check container status
docker-compose ps
```

## API Testing

```bash
# Health check
curl http://localhost:3000/health

# API is ready to accept requests
# See API.md for complete endpoint documentation
```

## Stopping

```bash
# Stop all containers
docker-compose down

# Stop and remove volumes (reset database)
docker-compose down -v
```

## Documentation

- **API Docs:** ./API.md
- **Deployment:** ./DEPLOYMENT.md  
- **Monitoring:** ./MONITORING.md
- **Full Setup:** ./SETUP.md

## Troubleshooting

**Port already in use:**
```bash
lsof -i :3000 | grep LISTEN | awk '{print $2}' | xargs kill -9
```

**Docker containers won't start:**
```bash
# Rebuild
docker-compose down
docker-compose up -d --build
```

**Database connection error:**
```bash
# Restart database
docker-compose restart db
```

Happy coding!
