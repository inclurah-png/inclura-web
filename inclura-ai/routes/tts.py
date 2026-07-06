from fastapi import APIRouter
from pydantic import BaseModel

from services.voiceService import generate_voice

router = APIRouter()

class VoiceRequest(BaseModel):

    text: str

    language: str

@router.post("/tts")

def tts_route(
    request: VoiceRequest
):

    return generate_voice(
        request.text,
        request.language,
        "outputs/output.wav"
    )
