from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.translation import router as translation_router
from routes.speech import router as speech_router
from routes.tts import router as tts_router

app = FastAPI(
    title="Inclura AI API",
    description="FastAPI backend for Inclura AI services",
    version="0.1.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register AI routes
app.include_router(
    translation_router,
    prefix="/api/v1"
)

app.include_router(
    speech_router,
    prefix="/api/v1"
)

app.include_router(
    tts_router,
    prefix="/api/v1"
)

@app.get("/")
async def root():
    """Root endpoint"""
    return {"message": "Welcome to Inclura AI API", "status": "running"}

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "inclura-ai"}

@app.get("/api/v1/info")
async def api_info():
    """API information endpoint"""
    return {
        "name": "Inclura AI",
        "version": "0.1.0",
        "description": "FastAPI backend service"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
