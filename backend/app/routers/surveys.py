from fastapi import APIRouter
from prometheus_client import Counter, Histogram
import time

router = APIRouter(prefix="/surveys", tags=["surveys"])

# Metrics
survey_requests = Counter('survey_requests_total', 'Total survey-related requests')
survey_completion_time = Histogram('survey_completion_time_seconds', 'Survey completion time')

@router.get("/metrics")
async def get_metrics():
    return {
        "requests": survey_requests._value.get(),
        "completion_time": survey_completion_time._sum.get()
    } 