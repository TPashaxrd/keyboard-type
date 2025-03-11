// Kelimeleri liste halinde döndüren fonksiyon
export const generateRandomWords = (wordCount: number): string[] => {
  const words = [
    "toprak", "taş", "türk", "atatürk", "ne", "neden", "kim", "kime",
    "yabancı", "amerikalı", "ankara", "istanbul", "lütfen", "susarmısın",
    "biraz", "hastalık", "aşk", "sahte", "yazılım", "öğrenci", "mühendis"
  ];
  
  const selectedWords: string[] = [];
  
  // Kelimelerden rastgele seçim yap
  for (let i = 0; i < wordCount; i++) {
    selectedWords.push(words[Math.floor(Math.random() * words.length)]);
  }

  return selectedWords;
};
