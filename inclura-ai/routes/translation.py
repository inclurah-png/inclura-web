from fastapi import APIRouter
from pydantic import BaseModel

from services.translationService import translate

router = APIRouter()

class TranslationRequest(BaseModel):
    text: str
    sourceLanguage: str
    targetLanguage: str

@router.post("/translate")
def translate_route(
    request: TranslationRequest
):
    return translate(
        request.text,
        request.sourceLanguage,
        request.targetLanguage
    )
