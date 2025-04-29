from fastapi import APIRouter
from prometheus_client import Counter, Histogram
import time

router = APIRouter(prefix="/users", tags=["users"])

# Metrics
user_requests = Counter('user_requests_total', 'Total user-related requests')
user_request_duration = Histogram('user_request_duration_seconds', 'User request duration')

@router.get("/metrics")
async def get_metrics():
    return {
        "requests": user_requests._value.get(),
        "request_duration": user_request_duration._sum.get()
    } 