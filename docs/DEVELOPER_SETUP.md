# Developer Setup Guide

## Prerequisites
- Node.js (v18+)
- Python (v3.9+)
- Gemini API Key

## Backend Setup
1. Navigate to `backend/`:
   ```bash
   cd backend
   ```
2. Create virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # Windows: venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Configure Environment:
   - Create `.env` file with `GEMINI_API_KEY=your_key_here`.
5. Run Server:
   ```bash
   uvicorn app.main:app --reload
   ```

## Frontend Setup
1. Navigate to `frontend/`:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run Development Server:
   ```bash
   npm run dev
   ```

## Testing
- **Backend Tests**:
  ```bash
  pytest
  ```
- **Frontend Tests**:
  ```bash
  npm test
  ```
