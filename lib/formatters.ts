export function formatLanguagePair(languagePair: string) {
  if (languagePair === "tr-fr") {
    return "Türkçe -> Fransızca";
  }

  if (languagePair === "fr-tr") {
    return "Fransızca -> Türkçe";
  }

  return languagePair;
}
