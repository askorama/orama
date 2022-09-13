export function nGram(text: string, size = 3): string[] {
  const ngrams: string[] = [];

  for (let i = 0; i < text.length - (size - 1); i++) {
    const substr: string[] = [];

    for (let j = 0; j < size; j++) {
      substr.push(text[i + j]);
    }

    ngrams.push(substr.join(""));
  }

  return ngrams;
}
