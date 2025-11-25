from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.api import auth, tickers, news, watchlist, alerts
from app.db.init_db import init_db

app = FastAPI(
    title="Feather API",
    description="Next-day market insights API",
    version="0.1.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Bulletproof CORS configuration - this WILL work
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,  # Set to False to allow wildcard origins
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

# Additional CORS middleware for complete coverage
@app.middleware("http")
async def add_cors_headers(request: Request, call_next):
    """Add CORS headers to all responses"""
    # Handle preflight OPTIONS requests
    if request.method == "OPTIONS":
        response = JSONResponse(
            content={},
            headers={
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With, Accept, Origin",
                "Access-Control-Max-Age": "86400",
            }
        )
        return response
    
    # Process the request
    response = await call_next(request)
    
    # Add CORS headers to all responses
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization, X-Requested-With, Accept, Origin"
    # Removed Access-Control-Allow-Credentials to fix CORS wildcard issue
    response.headers["Access-Control-Max-Age"] = "86400"
    
    return response

# Include routers
app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(tickers.router, prefix="/api/tickers", tags=["tickers"])
app.include_router(news.router, prefix="/api", tags=["news"])
app.include_router(watchlist.router, prefix="/api/watchlist", tags=["watchlist"])
app.include_router(alerts.router, prefix="/api/alerts", tags=["alerts"])

@app.on_event("startup")
async def startup_event():
    """Initialize database on startup"""
    init_db()

@app.get("/")
async def root():
    return {"message": "Feather API", "version": "0.1.0"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}