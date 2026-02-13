from pydantic import BaseModel
from typing import List, Optional

class ImageUploadResponse(BaseModel):
    image_id: str
    filename: str
    status: str

class AnalysisRequest(BaseModel):
    image_id: str
    prompt: Optional[str] = None

class AnalysisResponse(BaseModel):
    image_id: str
    diagnosis: str
    confidence: float
    details: dict

class ImageMetadata(BaseModel):
    modality: str
    body_part: Optional[str] = None
    patient_id: Optional[str] = None
    width: int
    height: int
    format: str

class ReportRequest(BaseModel):
    image_id: str
    patient_name: str
    doctor_name: str
    clinical_indication: Optional[str] = None
    diagnosis: str
    confidence: float
    findings: List[str]
    recommendations: List[str]
    medical_explanation: str


class ImageData(BaseModel):
    image_id: str
    file_path: str # Path to the processed image (ready for Gemini/Web)
    metadata: ImageMetadata
    thumbnail_path: Optional[str] = None
