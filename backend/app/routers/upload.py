from fastapi import APIRouter, UploadFile, File

router = APIRouter()

@router.post("/upload-image")
async def upload_image(file: UploadFile = File(...)):
    # TODO: Save file to uploads/
    return {"filename": file.filename, "status": "uploaded"}
