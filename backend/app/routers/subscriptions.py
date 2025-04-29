from fastapi import APIRouter
from prometheus_client import Counter, Histogram
import time

router = APIRouter(prefix="/subscriptions", tags=["subscriptions"])

# Metrics
subscription_requests = Counter('subscription_requests_total', 'Total subscription-related requests')
subscription_processing_time = Histogram('subscription_processing_time_seconds', 'Subscription processing time')

@router.get("/metrics")
async def get_metrics():
    return {
        "requests": subscription_requests._value.get(),
        "processing_time": subscription_processing_time._sum.get()
    } 