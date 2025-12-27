# 🚀 ExpenseSplit - Complete Deployment Guide

## Phase 1: Local Development Setup (15 minutes)

### Step 1: Clone Repository
```bash
git clone https://github.com/aradhanakurup/expensesplit.git
cd expensesplit
```

### Step 2: Copy Environment Variables
```bash
cp .env.example .env
# Edit .env with your secrets (Razorpay keys, JWT secret, etc.)
```

### Step 3: Start Local Services (PostgreSQL + Redis)
```bash
docker-compose up -d

# Verify services are running:
docker-compose ps
```

### Step 4: Install Dependencies
```bash
npm install
cd backend && npm install && cd ..
cd frontend && npm install && cd ..
```

### Step 5: Run Backend Locally
```bash
cd backend
npm run dev
# Should output: ExpenseSplit API running on http://localhost:3000
```

### Step 6: Run Frontend Locally (New Terminal)
```bash
cd frontend
npm start
# Expo will output a QR code for testing on your phone
```

**✅ Local Development Ready!**

---

## Phase 2: Docker Production Build (10 minutes)

### Step 1: Build Docker Image
```bash
docker build -t expensesplit:latest .
```

### Step 2: Test Docker Image Locally
```bash
docker run -p 3000:3000 \
  -e DATABASE_URL=postgresql://user:pass@host:5432/db \
  -e REDIS_URL=redis://host:6379 \
  expensesplit:latest
```

### Step 3: Push to Docker Registry (DockerHub, AWS ECR, or Google Container Registry)

**Option A: DockerHub**
```bash
# Login
docker login

# Tag
docker tag expensesplit:latest yourusername/expensesplit:latest

# Push
docker push yourusername/expensesplit:latest
```

**Option B: AWS ECR**
```bash
# Create ECR repository
aws ecr create-repository --repository-name expensesplit

# Get login token
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 123456789.dkr.ecr.us-east-1.amazonaws.com

# Tag and push
docker tag expensesplit:latest 123456789.dkr.ecr.us-east-1.amazonaws.com/expensesplit:latest
docker push 123456789.dkr.ecr.us-east-1.amazonaws.com/expensesplit:latest
```

**✅ Docker Image Ready for Production!**

---

## Phase 3: Deploy to Railway (RECOMMENDED - Easiest)

### Step 1: Create Railway Account
1. Go to https://railway.app
2. Sign up with GitHub
3. Create new project

### Step 2: Connect GitHub Repository
```
1. Click "New Project"
2. Select "GitHub Repo"
3. Authorize and select: aradhanakurup/expensesplit
4. Select "Deploy from GitHub" template
```

### Step 3: Configure Environment Variables
```
1. Go to Variables tab
2. Add:
   - DATABASE_URL: postgresql://user:pass@host:5432/expensesplit
   - REDIS_URL: redis://host:6379
   - JWT_SECRET: your-secret-key
   - RAZORPAY_KEY_ID: your-key
   - RAZORPAY_KEY_SECRET: your-secret
   - NODE_ENV: production
```

### Step 4: Deploy
```
1. Click "Deploy" button
2. Wait 2-3 minutes for deployment
3. Get public URL from Railway dashboard
```

**✅ App Live on Railway!**

---

## Phase 4: Deploy to Kubernetes (AWS EKS / GKE)

### Prerequisites
- kubectl installed
- Kubernetes cluster running (AWS EKS, Google GKE, or Azure AKS)
- Container image in registry

### Step 1: Create Kubernetes Secrets
```bash
kubectl create secret generic expensesplit-secrets \
  --from-literal=database-url=postgresql://user:pass@db:5432/expensesplit \
  --from-literal=redis-url=redis://redis:6379 \
  --from-literal=jwt-secret=your-secret-key \
  --from-literal=razorpay-key=your-key \
  --from-literal=razorpay-secret=your-secret
```

### Step 2: Update Kubernetes Manifests
Edit `infra/k8s/deployment.yaml`:
```yaml
# Change image URL to your registry
image: yourusername/expensesplit:latest
# or
image: 123456789.dkr.ecr.us-east-1.amazonaws.com/expensesplit:latest
```

### Step 3: Deploy to Kubernetes
```bash
# Apply all manifests
kubectl apply -f infra/k8s/

# Verify deployment
kubectl get pods
kubectl get svc
```

### Step 4: Get Public IP
```bash
# Wait for LoadBalancer to get external IP
kubectl get svc expensesplit-api --watch

# Once External IP appears, your app is live!
```

**✅ App Running on Kubernetes!**

---

## Phase 5: Setup Database (PostgreSQL)

### Option A: Use Managed Database

**AWS RDS:**
```bash
# Create RDS instance from AWS Console
# Then update DATABASE_URL:
DATABASE_URL=postgresql://admin:password@expensesplit.xyz.us-east-1.rds.amazonaws.com:5432/expensesplit
```

**Google Cloud SQL:**
```bash
# Create from GCP Console
DATABASE_URL=postgresql://admin:password@IP:5432/expensesplit
```

### Option B: Self-Hosted PostgreSQL
```bash
docker run -d \
  -e POSTGRES_PASSWORD=secure-password \
  -e POSTGRES_DB=expensesplit \
  -p 5432:5432 \
  postgres:14
```

### Step: Initialize Database
```bash
# Connect to database
psql $DATABASE_URL

# Run migrations (from CODE_TEMPLATES.md)
# Execute the migration scripts for creating tables
```

**✅ Database Ready!**

---

## Phase 6: Setup Caching (Redis)

### Option A: Use Managed Redis

**AWS ElastiCache:**
```
1. Go to AWS Console → ElastiCache
2. Create new Redis cluster
3. Copy endpoint
4. Update REDIS_URL: redis://endpoint:6379
```

**Google Memorystore:**
```
1. Go to GCP Console → Memorystore
2. Create new Redis instance
3. Copy IP address
4. Update REDIS_URL: redis://ip:6379
```

### Option B: Self-Hosted Redis
```bash
docker run -d \
  -p 6379:6379 \
  redis:7-alpine
```

**✅ Cache Ready!**

---

## Phase 7: Configure CI/CD (GitHub Actions)

### Step 1: Trigger Automated Tests
Just push to main branch:
```bash
git add .
git commit -m "Feature: add expense reversal"
git push origin main
```

### Step 2: GitHub Actions Runs Automatically
- `.github/workflows/test.yml` runs tests
- `.github/workflows/deploy.yml` builds and deploys

### Step 3: Monitor Deployment
Go to GitHub Repo → Actions tab → Watch live logs

**✅ CI/CD Pipeline Active!**

---

## Phase 8: Monitor & Scale

### Health Checks
```bash
# Check API health
curl https://your-domain.com/health

# Should return: { "status": "ok" }
```

### View Logs

**Railway:**
```
Dashboard → Logs tab
```

**Kubernetes:**
```bash
kubectl logs -f deployment/expensesplit-api
```

### Auto-Scaling (Kubernetes)
```bash
# Update HPA in deployment.yaml
kubectl autoscale deployment expensesplit-api --min=2 --max=10
```

**✅ Production Monitoring Active!**

---

## Phase 9: Setup Domain & SSL

### Step 1: Point Domain to App

**Railway:**
```
1. Dashboard → Settings → Custom Domain
2. Add your domain
3. Follow CNAME instructions
```

**Kubernetes:**
```bash
# Get LoadBalancer IP
kubectl get svc

# Point A record to this IP in your DNS provider
```

### Step 2: SSL Certificate (Automatic)
- Railway: Automatic with Let's Encrypt
- Kubernetes: Use cert-manager

**✅ Domain Live with HTTPS!**

---

## Phase 10: Post-Deployment Checklist

- [ ] API health check passing
- [ ] Database migrations complete
- [ ] Redis cache connected
- [ ] Razorpay credentials configured
- [ ] Environment variables set
- [ ] CI/CD pipeline running
- [ ] Monitoring alerts active
- [ ] Domain pointing to app
- [ ] SSL certificate installed
- [ ] First 100 beta users invited

**✅ Production Deployment Complete!**

---

## Troubleshooting

### Database Connection Error
```bash
# Verify DATABASE_URL format
echo $DATABASE_URL

# Test connection
psql $DATABASE_URL -c "SELECT version();"
```

### Redis Connection Error
```bash
# Test Redis connection
redis-cli ping
# Should return: PONG
```

### API Not Starting
```bash
# Check logs
kubectl logs -f deployment/expensesplit-api

# Check environment variables
kubectl get configmap expensesplit-config -o yaml
```

### Memory Issues
```bash
# Increase pod memory in deployment.yaml
resources:
  requests:
    memory: "512Mi"
  limits:
    memory: "1Gi"
```

---

## 🎉 You're Live!

Your ExpenseSplit app is now production-ready and deployed!

**Next Steps:**
1. Invite 100 beta users
2. Monitor error rates in Sentry
3. Track user engagement
4. Iterate based on feedback
5. Scale infrastructure as needed

**Support:** Check logs, monitoring dashboards, and GitHub issues for problems.

Happy deploying! 🚀
