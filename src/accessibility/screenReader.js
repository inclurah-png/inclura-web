export function announce(
  text
) {

  if (
    "speechSynthesis" in window
  ) {

    const speech =
      new SpeechSynthesisUtterance(
        text
      );

    window.speechSynthesis.speak(
      speech
    );

  }

}
