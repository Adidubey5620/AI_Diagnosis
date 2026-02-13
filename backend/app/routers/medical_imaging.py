from fastapi import APIRouter, UploadFile, File, HTTPException, BackgroundTasks
from app.services.image_processor import ImageProcessor
from app.services.gemini_service import GeminiService
from app.models.schemas import ImageData, AnalysisResponse, AnalysisRequest, ReportRequest
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
import os
import uuid

router = APIRouter()
image_processor = ImageProcessor()
gemini_service = GeminiService()

# In-memory storage for results (replace with DB in production)
analysis_results = {}
image_metadata_store = {}

@router.post("/api/upload-image", response_model=ImageData)
async def upload_image(file: UploadFile = File(...)):
    try:
        content = await file.read()
        image_data = await image_processor.save_and_process(content, file.filename)
        image_metadata_store[image_data.image_id] = image_data
        return image_data
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/api/analyze-image", response_model=AnalysisResponse)
async def analyze_image(request: AnalysisRequest):
    image_id = request.image_id
    if image_id not in image_metadata_store:
        raise HTTPException(status_code=404, detail="Image not found")
    
    image_data = image_metadata_store[image_id]
    
    try:
        # Use Gemini Service
        # We need to construct the image path or pass bytes. 
        # gemini_service.analyze_medical_image expects image_path and image_type.
        
        # Determine image type for prompt
        image_type = image_data.metadata.modality
        
        result = await gemini_service.analyze_medical_image(
            image_path=image_data.file_path,
            image_type=image_type
        )
        
        if "error" in result:
             raise HTTPException(status_code=500, detail=result["error"])

        # Construct AnalysisResponse
        # Note: result keys match requirements but we need to map to our pydantic model if needed
        # Our AnalysisResponse model in schemas.py is:
        # image_id, diagnosis, confidence, details
        
        # We need to adapt the rich JSON from Gemini to this simple model or update the model.
        # The prompt asked for specific JSON structure from Gemini, but schemas.py has a simpler structure.
        # Let's map it:
        # diagnosis -> findings (summary) or differential_diagnosis[0].condition
        # confidence -> differential_diagnosis[0].probability
        # details -> the whole result object
        
        top_diagnosis = "Unknown"
        confidence = 0.0
        
        if result.get("differential_diagnosis") and len(result["differential_diagnosis"]) > 0:
            top = result["differential_diagnosis"][0]
            top_diagnosis = top.get("condition", "Unknown")
            # probability might be string "90%" or int 90. Logic to parse:
            prob = str(top.get("probability", "0")).replace("%", "")
            try:
                confidence = float(prob) / 100.0 if float(prob) > 1 else float(prob)
            except:
                confidence = 0.0

        response = AnalysisResponse(
            image_id=image_id,
            diagnosis=top_diagnosis,
            confidence=confidence,
            details=result
        )
        
        analysis_results[image_id] = response
        return response

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/api/diagnosis/{image_id}", response_model=AnalysisResponse)
async def get_diagnosis(image_id: str):
    if image_id in analysis_results:
        return analysis_results[image_id]
    raise HTTPException(status_code=404, detail="Diagnosis not found")

@router.post("/api/generate-report")
async def generate_report(request: ReportRequest):
    image_id = request.image_id
    if image_id not in analysis_results:
        raise HTTPException(status_code=404, detail="Diagnosis not found for report generation")
    
    analysis = analysis_results[image_id]
    metadata = image_metadata_store.get(image_id) # Might need this for image path
    
    try:
        report_filename = f"report_{image_id}.pdf"
        report_path = os.path.join("reports", report_filename)
        
        c = canvas.Canvas(report_path, pagesize=letter)
        width, height = letter
        
        # Header
        c.setFont("Helvetica-Bold", 20)
        c.drawString(50, height - 50, "Medical Diagnosis Report")
        
        c.setFont("Helvetica", 12)
        c.drawString(50, height - 80, f"Patient: {request.patient_name}")
        c.drawString(50, height - 100, f"Doctor: {request.doctor_name}")
        c.drawString(300, height - 80, f"Image ID: {image_id}")
        
        # Diagnosis
        c.setFont("Helvetica-Bold", 14)
        c.drawString(50, height - 140, "Diagnosis Results")
        
        c.setFont("Helvetica", 12)
        c.drawString(50, height - 160, f"Condition: {analysis.diagnosis}")
        c.drawString(50, height - 180, f"Confidence: {analysis.confidence:.2%}")
        
        # Findings (from details)
        c.setFont("Helvetica-Bold", 14)
        c.drawString(50, height - 220, "Detailed Findings")
        
        text_y = height - 240
        data = analysis.details
        
        # Simple text wrap logic or just listing lines for MVP
        findings = data.get("findings", [])
        if isinstance(findings, list):
             for finding in findings:
                 c.drawString(60, text_y, f"- {str(finding)}")
                 text_y -= 20

        # Recommendations
        text_y -= 20
        c.setFont("Helvetica-Bold", 14)
        c.drawString(50, text_y, "Recommendations")
        text_y -= 20
        c.setFont("Helvetica", 12)
        
        recs = data.get("recommendations", [])
        if isinstance(recs, list):
            for rec in recs:
                c.drawString(60, text_y, f"- {str(rec)}")
                text_y -= 20

        c.save()
        
        return {
            "report_url": f"/reports/{report_filename}",
            "report_id": image_id
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
