import {
  speechToText,
} from "../providers/Whisper";

export async function createCaptions(
  audio
) {

  return await speechToText(audio);

}
