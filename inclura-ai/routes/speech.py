from fastapi import APIRouter, UploadFile, File
import os

from services.speechService import transcribe

router = APIRouter()

UPLOAD_FOLDER = "uploads"

os.makedirs(
    UPLOAD_FOLDER,
    exist_ok=True
)

@router.post("/speech")
async def speech_route(
    audio: UploadFile = File(...)
):

    file_path = os.path.join(
        UPLOAD_FOLDER,
        audio.filename
    )

    with open(
        file_path,
        "wb"
    ) as buffer:
        buffer.write(
            await audio.read()
        )

    return transcribe(file_path)
