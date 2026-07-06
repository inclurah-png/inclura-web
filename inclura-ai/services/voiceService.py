from providers.piperProvider import text_to_speech

def generate_voice(
    text,
    language,
    output_path
):
    file = text_to_speech(
        text,
        language,
        output_path
    )

    return {
        "audioUrl": file
    }
