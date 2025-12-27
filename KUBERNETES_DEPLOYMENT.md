# Kubernetes Deployment Guide for ExpenseSplit

## Prerequisites
- Kubernetes cluster (v1.20+)
- kubectl CLI configured
- Docker registry access
- Helm (optional)

## Step 1: Create Namespace
```bash
kubectl create namespace expensesplit
```

## Step 2: Create ConfigMaps

For PostgreSQL Configuration:
```bash
kubectl create configmap postgres-config \
  --from-literal=POSTGRES_DB=expensesplit \
  --from-literal=POSTGRES_USER=postgres \
  -n expensesplit
```

For API Configuration:
```bash
kubectl create configmap api-config \
  --from-literal=DB_HOST=postgres.expensesplit.svc.cluster.local \
  --from-literal=DB_PORT=5432 \
  --from-literal=DB_NAME=expensesplit \
  --from-literal=DB_USER=postgres \
  --from-literal=REDIS_HOST=redis.expensesplit.svc.cluster.local \
  --from-literal=REDIS_PORT=6379 \
  --from-literal=NODE_ENV=production \
  -n expensesplit
```

## Step 3: Create Secrets

```bash
kubectl create secret generic postgres-secret \
  --from-literal=POSTGRES_PASSWORD=your_secure_password \
  -n expensesplit

kubectl create secret generic api-secret \
  --from-literal=DB_PASSWORD=your_secure_password \
  -n expensesplit
```

## Step 4: Create Persistent Volumes (for local testing)

```bash
kubectl apply -f k8s/pvc-postgres.yaml -n expensesplit
kubectl apply -f k8s/pvc-redis.yaml -n expensesplit
```

## Step 5: Deploy Services

### Deploy PostgreSQL
```bash
kubectl apply -f k8s/postgres-deployment.yaml -n expensesplit
kubectl apply -f k8s/postgres-service.yaml -n expensesplit
```

### Deploy Redis
```bash
kubectl apply -f k8s/redis-deployment.yaml -n expensesplit
kubectl apply -f k8s/redis-service.yaml -n expensesplit
```

### Deploy API
```bash
kubectl apply -f k8s/api-deployment.yaml -n expensesplit
kubectl apply -f k8s/api-service.yaml -n expensesplit
```

## Step 6: Verify Deployments

```bash
# Check pods
kubectl get pods -n expensesplit

# Check services
kubectl get svc -n expensesplit

# Check pod logs
kubectl logs -n expensesplit -l app=expensesplit-api
```

## Step 7: Port Forwarding (for testing)

```bash
# Forward API service
kubectl port-forward -n expensesplit svc/expensesplit-api 3000:3000

# Access at http://localhost:3000
```

## Step 8: Production Deployment

### Using Ingress
```bash
kubectl apply -f k8s/ingress.yaml -n expensesplit
```

### Using LoadBalancer (cloud providers)
```yaml
apiVersion: v1
kind: Service
metadata:
  name: api-lb
  namespace: expensesplit
spec:
  type: LoadBalancer
  selector:
    app: expensesplit-api
  ports:
    - protocol: TCP
      port: 80
      targetPort: 3000
```

## Monitoring and Logging

### View API logs
```bash
kubectl logs -f -n expensesplit deployment/expensesplit-api
```

### Get pod status
```bash
kubectl describe pod -n expensesplit pod-name
```

### Check resource usage
```bash
kubectl top nodes
kubectl top pods -n expensesplit
```

## Scaling

### Scale API deployment
```bash
kubectl scale deployment expensesplit-api --replicas=3 -n expensesplit
```

### Autoscaling (requires metrics-server)
```bash
kubectl autoscale deployment expensesplit-api --min=2 --max=10 \
  --cpu-percent=80 -n expensesplit
```

## Database Migrations

```bash
# Connect to PostgreSQL pod
kubectl exec -it -n expensesplit postgres-pod -- psql -U postgres

# Run migrations from migrations folder
kubectl exec -it -n expensesplit postgres-pod -- \
  psql -U postgres -d expensesplit -f /migrations/001-create-initial-schema.sql
```

## Cleanup

```bash
# Delete entire namespace
kubectl delete namespace expensesplit
```

## Troubleshooting

### Pod not starting
```bash
kubectl describe pod -n expensesplit pod-name
kubectl logs -n expensesplit pod-name
```

### Service not accessible
```bash
# Check if service exists
kubectl get svc -n expensesplit

# Check service endpoints
kubectl get endpoints -n expensesplit
```

### Database connection issues
```bash
# Test connectivity
kubectl exec -it -n expensesplit api-pod -- \
  curl postgres.expensesplit.svc.cluster.local:5432
```

## Production Checklist

- [ ] Use persistent storage (EBS, NFS, etc.)
- [ ] Configure resource requests and limits
- [ ] Enable RBAC for security
- [ ] Use sealed secrets or external secret management
- [ ] Enable pod security policies
- [ ] Configure network policies
- [ ] Set up monitoring (Prometheus, Grafana)
- [ ] Configure logging (ELK, CloudWatch)
- [ ] Enable pod disruption budgets
- [ ] Configure health checks (readiness/liveness probes)
- [ ] Use load balancing and horizontal pod autoscaling
- [ ] Implement backup strategy for databases
