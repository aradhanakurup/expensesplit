#!/bin/bash

# ExpenseSplit Application Startup Script
# This script sets up and starts the ExpenseSplit application with Docker

set -e

echo "🚀 ExpenseSplit - Application Startup"
echo "======================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Docker is installed
echo "${YELLOW}Checking prerequisites...${NC}"
if ! command -v docker &> /dev/null; then
    echo "${RED}❌ Docker is not installed. Please install Docker Desktop first.${NC}"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "${RED}❌ Docker Compose is not installed. Please install Docker Desktop.${NC}"
    exit 1
fi

echo "${GREEN}✓ Docker and Docker Compose are installed${NC}"
echo ""

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "${YELLOW}Creating .env file...${NC}"
    cp .env.example .env
    echo "${GREEN}✓ .env file created from .env.example${NC}"
else
    echo "${GREEN}✓ .env file already exists${NC}"
fi
echo ""

# Start Docker containers
echo "${YELLOW}Starting Docker containers...${NC}"
echo "This may take a few minutes on first run..."
echo ""

docker-compose up -d

if [ $? -eq 0 ]; then
    echo ""
    echo "${GREEN}✓ Docker containers started successfully${NC}"
else
    echo "${RED}❌ Failed to start Docker containers${NC}"
    exit 1
fi
echo ""

# Wait for services to be ready
echo "${YELLOW}Waiting for services to be ready (30 seconds)...${NC}"
sleep 10

# Check if PostgreSQL is ready
echo "${YELLOW}Checking PostgreSQL connection...${NC}"
for i in {1..30}; do
    if docker exec expensesplit-db psql -U postgres -d expensesplit -c "SELECT 1" > /dev/null 2>&1; then
        echo "${GREEN}✓ PostgreSQL is ready${NC}"
        break
    fi
    if [ $i -lt 30 ]; then
        echo "Waiting... ($i/30)"
        sleep 1
    fi
done
echo ""

# Run database migrations
echo "${YELLOW}Running database migrations...${NC}"
docker exec expensesplit-db psql -U postgres -d expensesplit -f /migrations/001-create-initial-schema.sql > /dev/null 2>&1
echo "${GREEN}✓ Database migrations completed${NC}"
echo ""

# Install backend dependencies
echo "${YELLOW}Installing backend dependencies...${NC}"
docker exec expensesplit-api npm ci > /dev/null 2>&1
echo "${GREEN}✓ Backend dependencies installed${NC}"
echo ""

# Build backend
echo "${YELLOW}Building backend application...${NC}"
docker exec expensesplit-api npm run build > /dev/null 2>&1
echo "${GREEN}✓ Backend build completed${NC}"
echo ""

# Start the API server
echo "${YELLOW}Starting API server...${NC}"
docker exec -d expensesplit-api npm start
sleep 3

if docker exec expensesplit-api curl -f http://localhost:3000/health > /dev/null 2>&1; then
    echo "${GREEN}✓ API server is running${NC}"
else
    echo "${YELLOW}⚠ API health check failed, but server may still be initializing...${NC}"
fi
echo ""

echo "${GREEN}═════════════════════════════════════════${NC}"
echo "${GREEN}✅ ExpenseSplit is now running!${NC}"
echo "${GREEN}═════════════════════════════════════════${NC}"
echo ""
echo "📱 Access the application:"
echo "${GREEN}API:      http://localhost:3000${NC}"
echo "${GREEN}API Docs: http://localhost:3000/api${NC}"
echo ""
echo "🛠️  Management:"
echo "  View logs:     docker-compose logs -f"
echo "  Stop app:      docker-compose down"
echo "  Database:      psql postgresql://postgres:postgres@localhost:5432/expensesplit"
echo "  Redis:         redis-cli -p 6379"
echo ""
echo "📚 Documentation:"
echo "  API Docs:      ./API.md"
echo "  Deployment:    ./DEPLOYMENT.md"
echo "  Monitoring:    ./MONITORING.md"
echo ""
echo "Ctrl+C to stop the services"
