import React, { useState, useEffect } from "react";
import { generateRandomWords } from '../utils/words';
import { FaCopy, FaShare } from "react-icons/fa";

const Main: React.FC = () => {
  const [words, setWords] = useState<string[]>(generateRandomWords(9));
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
      }, 1000);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [startTime, endTime]);

  function copyToClipboard() {
    navigator.clipboard.writeText(`Doğru Kelime: ${correctCount}\nYanlış Kelime: ${wrongCount}\nToplam Kelime:${correctCount + wrongCount}\nWPM:${wpm}\n${getTotalTime()}`)
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
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-br from-purple-900 via-indigo-900 to-gray-900 font-sans">
      <h1 className="text-4xl md:text-6xl font-bold mb-6 md:mb-10 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-teal-400 animate-pulse">
        Keyboard TYPE Test
      </h1>
        <div className="words text-xl md:text-3xl text-center border-2 border-purple-500 p-6 md:p-8 shadow-2xl rounded-xl mb-6 w-full max-w-4xl bg-gray-800/50 backdrop-blur-sm hover:bg-gray-800/70 transition-colors duration-300">
        {words.map((word, index) => (
          <span key={index} className={`mx-1 ${getWordStyle(index)}`}>
            <span className="word text-base md:text-xl lg:text-2xl font-medium">
              {word.toLowerCase()}
            </span>
          </span>
        ))}
      </div>
        {!testFinished ? (
        <input
          type="text"
          value={currentInput.toLowerCase()}
          onChange={handleChange}
          className="w-full max-w-2xl p-3 md:p-4 bg-gray-700/50 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-400 hover:bg-gray-700/70 transition-colors duration-300 backdrop-blur-sm"
          placeholder="Buraya yazmaya başla..."
        />
      ) : (
        <>
          <div className="flex gap-3 md:gap-5 mt-6 md:mt-8">
            <button
              onClick={copyToClipboard}
              className="flex items-center gap-2 p-3 md:p-4 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-xl hover:from-purple-600 hover:to-indigo-600 transition-all duration-300 hover:scale-105 transform shadow-lg hover:shadow-xl"
            >
              <FaCopy size={24} color="white" />
              <span className="text-sm md:text-base">Kopyala</span>
            </button>
            <button
              onClick={shareResult}
              className="flex items-center gap-2 p-3 md:p-4 bg-gradient-to-r from-teal-500 to-green-500 text-white rounded-xl hover:from-teal-600 hover:to-green-600 transition-all duration-300 hover:scale-105 transform shadow-lg hover:shadow-xl"
            >
              <FaShare size={24} color="white" />
              <span className="text-sm md:text-base">Paylaş</span>
            </button>
          </div>
            <div className="text-lg md:text-2xl mt-6 md:mt-8 p-6 md:p-8 bg-gray-800/50 rounded-xl text-center w-full max-w-4xl backdrop-blur-sm shadow-2xl">
            <p className="text-purple-400 mb-3 md:mb-4">✅ Doğru Kelime: {correctCount}</p>
            <p className="text-red-400 mb-3 md:mb-4">❌ Yanlış Kelime: {wrongCount}</p>
            <p className="text-teal-400 mb-3 md:mb-4">📊 Toplam Kelime: {correctCount + wrongCount}</p>
            <p className="text-yellow-400 mb-3 md:mb-4">⚡ Hız: {wpm} WPM</p>
            <p className="text-indigo-400">⌛{getTotalTime()}</p>
          </div>
        </>
      )}
    </div>
  );
};

export default Main;