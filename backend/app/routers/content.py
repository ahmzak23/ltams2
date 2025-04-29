from fastapi import APIRouter
from prometheus_client import Counter, Histogram
import time

router = APIRouter(prefix="/content", tags=["content"])

# Metrics
content_requests = Counter('content_requests_total', 'Total content-related requests')
content_processing_time = Histogram('content_processing_time_seconds', 'Content processing time')

@router.get("/metrics")
async def get_metrics():
    return {
        "requests": content_requests._value.get(),
        "processing_time": content_processing_time._sum.get()
    } 