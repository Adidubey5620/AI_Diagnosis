import os
import json
import asyncio
import google.generativeai as genai
from google.generativeai.types import HarmCategory, HarmBlockThreshold
import typing

# Configure API Key
GOOGLE_API_KEY = os.environ.get("GOOGLE_API_KEY")
if GOOGLE_API_KEY:
    genai.configure(api_key=GOOGLE_API_KEY)

class GeminiService:
    def __init__(self):
        self.model = genai.GenerativeModel('gemini-2.0-flash-exp') # Using experimental flash model as requested, fallbacks might be needed
        self.generation_config = genai.types.GenerationConfig(
            temperature=0.4,
            response_mime_type="application/json"
        )

    async def analyze_medical_image(self, image_path: str, image_type: str, retries=3):
        """
        Analyzes a medical image using Gemini 2.0 Flash.
        """
        if not GOOGLE_API_KEY:
            return {"error": "GOOGLE_API_KEY not set"}

        prompt = f"""You are an expert radiologist. Analyze this {image_type} medical image and provide:
        
        1. FINDINGS: List all abnormalities detected with anatomical locations
        2. SEVERITY: Classify each finding as URGENT, MODERATE, or ROUTINE
        3. DIFFERENTIAL DIAGNOSIS: Top 5 possible conditions with probability estimates (%)
        4. EXPLANATION: Describe findings in both medical terminology AND plain language
        5. RECOMMENDATIONS: Suggest next steps (additional tests, specialist referral, treatment)
        6. ANNOTATIONS: Provide bounding box coordinates [ymin, xmin, ymax, xmax] for abnormalities (normalized 0-1000)

        Return response as structured JSON with these exact keys:
        {{
            "findings": [...],
            "severity": "URGENT/MODERATE/ROUTINE",
            "differential_diagnosis": [{{condition, probability, reasoning}}],
            "patient_explanation": "...",
            "medical_explanation": "...",
            "recommendations": [...],
            "annotations": [{{label, coordinates, confidence}}]
        }}
        """

        # Load image data
        try:
            # simple retry logic
            for attempt in range(retries):
                try:
                    # Upload file to Gemini (File API is recommended for multimodal, but for single image bytes is okay too if small, 
                    # but File API is safer for large dicoms converted to images. We will assume path is a local file)
                    # For simplicity with 'image_path', we can use the file API or inline data. 
                    # Let's use inline data for speed if it's an image file.
                    
                    # Note: You need to make sure 'image_path' points to a valid image file.
                    # If it's a DICOM, it should have been converted to JPG/PNG by image_processor before this call usually, 
                    # or we assume Gemini can handle it (it can handle some, but conversion is safer).
                    # The prompt implies we pass the image.
                    
                    myfile = genai.upload_file(image_path)
                    
                    response = await self.model.generate_content_async(
                        [prompt, myfile],
                        generation_config=self.generation_config
                    )
                    
                    # Parse JSON
                    result = json.loads(response.text)
                    return result

                except Exception as e:
                    if attempt == retries - 1:
                        raise e
                    await asyncio.sleep(2 ** attempt) # Exponential backoff
                    
        except Exception as e:
            return {
                "error": str(e),
                "findings": [],
                "severity": "UNKNOWN",
                "differential_diagnosis": [],
                "patient_explanation": "Error analyzing image.",
                "medical_explanation": "Analysis failed.",
                "recommendations": [],
                "annotations": []
            }
