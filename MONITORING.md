# ExpenseSplit Monitoring & Observability Guide

## Overview
This document outlines the monitoring, logging, and observability setup for ExpenseSplit application deployed on Kubernetes.

## Logging

### Application Logs
All application logs are sent to centralized logging system with the following structure:

```json
{
  "timestamp": "2024-01-15T10:00:00Z",
  "level": "info|error|warn|debug",
  "service": "expensesplit-api",
  "pod_name": "expensesplit-api-xxxxx",
  "namespace": "expensesplit",
  "message": "User login successful",
  "user_id": 123,
  "request_id": "req-123456",
  "duration_ms": 245
}
```

### Log Levels
- **ERROR**: Critical errors that need immediate attention
- **WARN**: Warning conditions that should be reviewed
- **INFO**: General informational messages (default)
- **DEBUG**: Detailed debug information (development only)

### Log Access
Logs can be viewed in real-time:
```bash
kubectl logs -f deployment/expensesplit-api -n expensesplit
```

## Metrics

### Prometheus Metrics
Application exposes Prometheus metrics at `/metrics` endpoint:

```
GET /metrics

Returns:
- http_requests_total{method, endpoint, status}
- http_request_duration_seconds{method, endpoint}
- database_connection_pool{status}
- cache_hits_total{cache_name}
- cache_misses_total{cache_name}
- active_users{}
- expense_splits_processed_total{}
```

### Dashboard
Grafana dashboard available at: `https://grafana.expensesplit.com`

**Key Dashboards:**
- API Performance: Request rates, latencies, error rates
- Database: Connection pool, query performance
- Infrastructure: CPU, memory, disk usage
- Business Metrics: Active users, transactions, expense volume

## Alerting

### Alert Rules
Alerts are configured in AlertManager:

```yaml
AlertRules:
  - HighErrorRate: > 5% errors in 5 minutes
  - SlowResponse: > 1000ms avg response time
  - HighMemory: > 80% memory usage
  - DatabaseDown: Cannot connect to database
  - RediDown: Cannot connect to Redis
  - PodRestart: Pod restarting frequently
```

### Notification Channels
- **Slack**: #expensesplit-alerts channel
- **PagerDuty**: On-call team notifications
- **Email**: alert@expensesplit.com

## Health Checks

### Liveness Probe
```
GET /health

Response: 200 OK
{
  "status": "alive",
  "timestamp": "2024-01-15T10:00:00Z"
}
```

### Readiness Probe
```
GET /ready

Response: 200 OK
{
  "status": "ready",
  "database": "connected",
  "cache": "connected",
  "timestamp": "2024-01-15T10:00:00Z"
}
```

## Tracing

### Distributed Tracing with Jaeger
Traces are sent to Jaeger for request tracking across services.

```
Access Jaeger UI: https://jaeger.expensesplit.com
```

**Traces include:**
- API request start to finish
- Database query execution
- Cache operations
- External service calls (Razorpay, etc.)

## Performance Monitoring

### Key Metrics to Monitor
1. **API Response Time**: Target < 500ms (p95)
2. **Error Rate**: Target < 1%
3. **Database Query Time**: Target < 100ms (p95)
4. **Cache Hit Rate**: Target > 80%
5. **Pod Restart Rate**: Target = 0 in 24h
6. **Memory Usage**: Target < 70% of limit
7. **CPU Usage**: Target < 80% of request

### SLA Targets
- **Availability**: 99.9% uptime
- **Response Time**: 99th percentile < 1000ms
- **Error Rate**: < 0.5%

## Troubleshooting

### High Error Rate
1. Check recent deployments
2. Review logs for errors: `kubectl logs -l app=expensesplit-api --tail=1000`
3. Check database connectivity
4. Review error traces in Jaeger
5. Check pod resources

### Slow Response
1. Check database slow logs
2. Review query performance in metrics
3. Check cache hit rate
4. Review distributed traces
5. Check pod CPU/memory usage

### Pod Crashes
1. Check pod logs: `kubectl logs <pod-name> -n expensesplit`
2. Check previous logs: `kubectl logs <pod-name> --previous -n expensesplit`
3. Check pod events: `kubectl describe pod <pod-name> -n expensesplit`
4. Check pod resource limits

## Scaling Triggers

Horizontal Pod Autoscaler (HPA) is configured with:
- **Min Replicas**: 2
- **Max Replicas**: 10
- **Target CPU**: 70%
- **Target Memory**: 80%

## Backup & Recovery

### Database Backups
- **Schedule**: Daily at 2 AM UTC
- **Retention**: 30 days
- **Location**: S3 bucket `expensesplit-backups`

### Recovery Procedure
```bash
# List available backups
aws s3 ls s3://expensesplit-backups/

# Restore from backup
kubectl create job --from=cronjob/backup-job restore-backup-<timestamp>
```

## Compliance & Audit

### Audit Logging
All sensitive operations are logged:
- User authentication
- Payment transactions
- Data access
- Configuration changes

Audit logs are retained for 1 year.

### GDPR Compliance
- User data is encrypted at rest
- All logs are anonymized
- Data retention follows GDPR guidelines
