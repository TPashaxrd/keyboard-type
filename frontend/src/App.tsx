import React, { useState, useEffect } from "react";
import { generateRandomWords } from './utils/words';
import { FaCopy, FaShare } from "react-icons/fa";

const App: React.FC = () => {
  const [words, setWords] = useState<string[]>(generateRandomWords(10));
  const [typedWords, setTypedWords] = useState<string[]>([]);
  const [currentInput, setCurrentInput] = useState<string>(""); 
  const [currentWordIndex, setCurrentWordIndex] = useState<number>(0); 
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [wpm, setWpm] = useState<number | null>(null);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [wrongCount, setWrongCount] = useState<number>(0);
  const [testFinished, setTestFinished] = useState<boolean>(false);

  useEffect(() => {
    if (startTime && !endTime) {
      const timer = setTimeout(() => {
        finishTest();
      }, 60000);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [startTime, endTime]);

  function copyToClipboard() {
    navigator.clipboard.writeText(`Doğru Kelime: ${correctCount}\nYanlış Kelime: ${wrongCount}\nToplam Kelime:${correctCount + wrongCount}\nWPM:${wpm}\nSüre:${getTotalTime()}`)
  }
  function shareResult() {
    navigator.share({
      text: `Doğru Sayı: ${correctCount}\nYanlış Kelime:${wrongCount}\nToplam Kelime: ${correctCount + wrongCount}\nWPM: ${wpm}\nToplam Süre: ${getTotalTime()}`
    }).catch((error) => console.error('Paylaşım hatası:', error));
  }  

  useEffect(() => {
    if (startTime && !endTime) {
      const interval = setInterval(() => {
        if (currentWordIndex >= 10 && currentInput === "") {
          setWords(generateRandomWords(10)); 
          setCurrentWordIndex(0);
        }
      }, 5000);

      return () => {
        clearInterval(interval);
      };
    }
  }, [startTime, endTime, currentWordIndex, currentInput]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCurrentInput(value);

    if (!startTime) setStartTime(Date.now());

    if (value.endsWith(" ")) {
      checkWord();
      setCurrentInput(""); 
    }
  };

  const checkWord = () => {
    const trimmedWord = currentInput.trim();
    setTypedWords([...typedWords, trimmedWord]);

    if (trimmedWord === words[currentWordIndex]) {
      setCorrectCount(correctCount + 1);
    } else {
      setWrongCount(wrongCount + 1);
    }

    if (currentWordIndex + 1 === words.length) {
      setWords(generateRandomWords(10));
      setCurrentWordIndex(0);
    } else {
      setCurrentWordIndex(currentWordIndex + 1);
    }
  };

  const finishTest = () => {
    if (!startTime) return;
    const end = Date.now();
    setEndTime(end);
    const elapsedTime = (end - startTime) / 60000;
    setWpm(Math.round(correctCount / elapsedTime));
    setTestFinished(true);
  };

  const getWordStyle = (index: number): string => {
    if (index < currentWordIndex) {
      return words[index] === typedWords[index] ? "text-green-400" : "text-red-400"; 
    } else if (index === currentWordIndex) {
      if (words[index].startsWith(currentInput)) {
        return "text-blue-400";
      } else {
        return "text-red-400";
      }
    }
    return "text-gray-400";
  };

  const getTotalTime = (): string => {
    if (!startTime || !endTime) return "Test devam ediyor...";
    const totalTime = (endTime - startTime) / 1000;
    return `Süre: ${totalTime} saniye`;
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl md:text-4xl font-bold mb-4 md:mb-8 text-blue-400">Klavye Hız Testi</h1>
      <div className="words text-lg md:text-2xl text-center border-2 md:border-4 border-blue-500 p-4 md:p-6 shadow-lg rounded-lg mb-4 w-full max-w-2xl bg-gray-800">
        {words.map((word, index) => (
          <span key={index} className={`mx-1 ${getWordStyle(index)}`}>
            <span className="word text-sm md:text-base lg:text-xl">
              {word.toLowerCase()}
            </span>
          </span>
        ))}
      </div>
      {!testFinished ? (
        <input
          type="text"
          value={currentInput}
          onChange={handleChange}
          className="w-full max-w-2xl p-2 md:p-4 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
          placeholder="Buraya yazmaya başla..."
        />
      ) : (
        <>
          <div className="flex gap-2 md:gap-4 mt-4 md:mt-6">
            <button
              onClick={copyToClipboard}
              className="functions flex items-center gap-1 md:gap-2 p-1 md:p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <FaCopy size={20} color="white" />
              <span className="text-sm md:text-base">Kopyala</span>
            </button>
            <button
              onClick={shareResult}
              className="functions flex items-center gap-1 md:gap-2 p-1 md:p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              <FaShare size={20} color="white" />
              <span className="text-sm md:text-base">Paylaş</span>
            </button>
          </div>
          <div className="text-base md:text-xl mt-4 md:mt-6 p-4 md:p-6 bg-gray-800 rounded-lg text-center w-full max-w-2xl">
            <p className="text-green-400 mb-1 md:mb-2">✅ Doğru Kelime: {correctCount}</p>
            <p className="text-red-400 mb-1 md:mb-2">❌ Yanlış Kelime: {wrongCount}</p>
            <p className="text-blue-400 mb-1 md:mb-2">📊 Toplam Kelime: {correctCount + wrongCount}</p>
            <p className="text-yellow-400 mb-1 md:mb-2">⚡ Hız: {wpm} WPM</p>
            <p className="text-purple-400">{getTotalTime()}</p>
          </div>
        </>
      )}
    </div>
  );
};

export default App;