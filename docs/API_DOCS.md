# API Documentation

## Logic Flow
1. **Upload**: Client POSTs image to `/api/upload`. Backend saves file, validates type, and returns `image_id`.
2. **Analysis**: Client calls `/api/diagnosis/{image_id}`. Backend processes image with Gemini Pro Vision.
3. **Report**: Client calls `/api/generate-report`. Backend generates PDF using ReportLab.

## Endpoints

### `POST /api/upload`
- **Description**: Upload a medical image file.
- **Request Body**: `multipart/form-data`, file field `file`.
- **Response**:
  ```json
  {
    "filename": "scan.jpg",
    "image_id": "uuid-string"
  }
  ```

### `GET /api/diagnosis/{image_id}`
- **Description**: Analyze an uploaded image using AI.
- **Parameters**: `image_id` (path)
- **Response**:
  ```json
  {
    "image_id": "uuid",
    "diagnosis": "Pneumonia",
    "confidence": 0.92,
    "details": {
       "findings": ["Opacification in lower right lobe"],
       "recommendations": ["Antibiotics"]
    }
  }
  ```

### `POST /api/generate-report`
- **Description**: Generate a PDF report.
- **Request Body**: JSON with patient details and analysis data.
- **Response**:
  ```json
  {
    "image_id": "uuid",
    "report_url": "/reports/report_id.pdf"
  }
  ```
