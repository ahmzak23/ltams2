from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from opentelemetry import trace
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor
from opentelemetry.exporter.otlp.proto.grpc.trace_exporter import OTLPSpanExporter
from opentelemetry.instrumentation.fastapi import FastAPIInstrumentor
from opentelemetry.instrumentation.sqlalchemy import SQLAlchemyInstrumentor
from prometheus_client import Counter, Histogram, generate_latest, make_asgi_app, CollectorRegistry
from pythonjsonlogger import jsonlogger
import logging
import time
import os
import json
from datetime import datetime
from typing import Optional

# Configure logging
logger = logging.getLogger("ltams_backend")
logHandler = logging.StreamHandler()
formatter = jsonlogger.JsonFormatter(
    fmt="%(timestamp)s %(log_level)s %(service)s %(environment)s %(traceId)s %(userId)s %(ipAddress)s %(host)s %(message)s",
    json_ensure_ascii=False
)
logHandler.setFormatter(formatter)
logger.addHandler(logHandler)
logger.setLevel(logging.INFO)

# Configure OpenTelemetry
trace.set_tracer_provider(TracerProvider())
otlp_exporter = OTLPSpanExporter(endpoint=os.getenv("OTEL_EXPORTER_OTLP_ENDPOINT", "http://otel-collector:4317"))
span_processor = BatchSpanProcessor(otlp_exporter)
trace.get_tracer_provider().add_span_processor(span_processor)

# Initialize FastAPI app
app = FastAPI(title="LTAMS Backend API")

# Initialize FastAPI instrumentation
FastAPIInstrumentor.instrument_app(app)
SQLAlchemyInstrumentor().instrument()

# Create metrics
registry = CollectorRegistry()
http_requests_total = Counter(
    'http_requests_total',
    'Total HTTP requests',
    ['method', 'endpoint', 'status'],
    registry=registry
)
http_request_duration_seconds = Histogram(
    'http_request_duration_seconds',
    'HTTP request duration',
    ['method', 'endpoint'],
    registry=registry
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.middleware("http")
async def logging_middleware(request: Request, call_next):
    # Extract trace context
    trace_id = trace.get_current_span().get_span_context().trace_id
    
    # Start timer
    start_time = time.time()
    
    # Process request
    response: Response = await call_next(request)
    
    # Calculate duration
    duration = time.time() - start_time
    
    # Get client IP
    client_ip = request.client.host if request.client else None
    
    # Extract user ID from request if available
    user_id = None
    if hasattr(request.state, "user"):
        user_id = request.state.user.id
    
    # Log request
    log_data = {
        "timestamp": datetime.utcnow().isoformat(),
        "log_level": "INFO",
        "service": "backend-api",
        "environment": os.getenv("ENVIRONMENT", "production"),
        "traceId": format(trace_id, "032x"),
        "userId": user_id,
        "ipAddress": client_ip,
        "host": os.getenv("HOSTNAME", "unknown"),
        "message": f"{request.method} {request.url.path} {response.status_code}",
        "context": {
            "method": request.method,
            "path": request.url.path,
            "status_code": response.status_code,
            "duration": duration
        }
    }
    
    logger.info(json.dumps(log_data))
    
    # Update metrics
    http_requests_total.labels(
        method=request.method,
        endpoint=request.url.path,
        status=response.status_code
    ).inc()
    
    http_request_duration_seconds.labels(
        method=request.method,
        endpoint=request.url.path
    ).observe(duration)
    
    return response

@app.get("/metrics")
async def metrics():
    return Response(generate_latest(), media_type="text/plain")

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

# Import and include routers
from app.routers import users, surveys, content, subscriptions

app.include_router(users.router, prefix="/users", tags=["users"])
app.include_router(surveys.router, prefix="/surveys", tags=["surveys"])
app.include_router(content.router, prefix="/content", tags=["content"])
app.include_router(subscriptions.router, prefix="/subscriptions", tags=["subscriptions"])

# Mount Prometheus metrics endpoint
metrics_app = make_asgi_app(registry=registry)
app.mount("/metrics", metrics_app)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 