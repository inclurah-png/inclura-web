from providers.seamlessM4T import translate_text

def translate(
    text,
    source_lang,
    target_lang
):
    translated = translate_text(
        text,
        source_lang,
        target_lang
    )

    return {
        "translatedText": translated
    }
