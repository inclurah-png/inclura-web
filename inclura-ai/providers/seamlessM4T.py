from seamless_communication.models.inference import Translator

translator = Translator(
    model_name_or_card="seamlessM4T_large",
    vocoder_name_or_card="vocoder_v2",
    device="cpu"
)

def translate_text(text, source_lang, target_lang):
    result = translator.predict(
        text=text,
        task_str="T2TT",
        src_lang=source_lang,
        tgt_lang=target_lang,
    )

    return result
