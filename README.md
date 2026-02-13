# Medical Imaging Platform

A full-stack medical imaging platform taking advantage of Gemini for analysis.

## Documentation
- [User Guide](docs/USER_GUIDE.md)
- [Developer Setup](docs/DEVELOPER_SETUP.md)
- [API Documentation](docs/API_DOCS.md)
- [Disclaimer](docs/DISCLAIMER.md)

## Tech Stack

### Backend (FastAPI)
- **Framework**: FastAPI
- **Services**:
  - `gemini_service`: Handles communication with Google Gemini API.
  - `image_processor`: Handles DICOM/Image processing.
- **Storage**:
  - `/uploads`: Temporary image storage.
  - `/reports`: Generated PDF reports.

### Frontend (React + TypeScript)
- **Framework**: React with Vite
- **UI**: TailwindCSS (implicit in Vite React-TS if configured, otherwise standard CSS)
- **State/Routing**: React Router DOM
- **HTTP Client**: Axios

## Setup Instructions

### Backend
1. Navigate to `backend`:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Run the server:
   ```bash
   uvicorn app.main:app --reload
   ```

### Frontend
1. Navigate to `frontend`:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```

## Features
- Upload medical images (DICOM, PNG, JPG).
- Analyze images using Gemini.
- View diagnosis results.
- Generate PDF reports.
