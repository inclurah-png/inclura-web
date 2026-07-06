from providers.whisperProvider import speech_to_text

def transcribe(audio_path):
    text = speech_to_text(audio_path)

    return {
        "text": text
    }
