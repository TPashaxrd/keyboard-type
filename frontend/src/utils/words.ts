export const generateRandomWords = (wordCount: number): string[] => {
  const words = [
    "toprak", "taş", "türk", "atatürk", "ne", "neden", "kim", "kime",
    "yabancı", "amerikalı", "ankara", "istanbul", "lütfen", "susarmısın",
    "biraz", "hastalık", "aşk", "sahte", "yazılım", "öğrenci", "mühendis",
    "ahmet", "süleyman", "osmanlı", "naber", "kimsin", "halı", "çilek",
    "çiğköfte", "para", "dolar", "benim", "oyuncak", "yalnızlık" 
  ];
  
  const selectedWords: string[] = [];
  
  for (let i = 0; i < wordCount; i++) {
    selectedWords.push(words[Math.floor(Math.random() * words.length)]);
  }

  return selectedWords;
};
