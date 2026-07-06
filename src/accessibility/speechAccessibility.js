import {
  textToSpeech,
} from "../providers/Piper";

export async function speakText(
  text,
  language = "en"
) {

  return await textToSpeech({
    text,
    language,
  });

}
