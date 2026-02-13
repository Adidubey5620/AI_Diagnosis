from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

app = FastAPI(title="Medical Imaging Platform")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For development; restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ensure directories exist
os.makedirs("uploads", exist_ok=True)
os.makedirs("reports", exist_ok=True)

@app.get("/")
async def root():
    return {"message": "Medical Imaging Platform API"}

# Import routers
from app.routers import medical_imaging

app.include_router(medical_imaging.router)