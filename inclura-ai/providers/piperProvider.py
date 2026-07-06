import subprocess

def text_to_speech(
    text,
    model_path,
    output_file
):
    subprocess.run([
        "piper",
        "--model",
        model_path,
        "--output_file",
        output_file
    ], input=text.encode("utf-8"))

    return output_file
