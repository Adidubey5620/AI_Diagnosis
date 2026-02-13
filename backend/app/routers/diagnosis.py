from fastapi import APIRouter

router = APIRouter()

@router.get("/diagnosis/{image_id}")
async def get_diagnosis(image_id: str):
    # TODO: Retrieve diagnosis from database/storage
    return {"image_id": image_id, "diagnosis": "Pending..."}
