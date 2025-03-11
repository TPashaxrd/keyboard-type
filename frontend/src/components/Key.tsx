import React from 'react';

interface KeyProps {
  char: string;
  typedChar?: string;
}

const Key: React.FC<KeyProps> = ({ char, typedChar }) => {
  const isCorrect = typedChar === char;
  const isTyped = typedChar !== undefined;

  return (
    <span
      className={`inline-block mx-1 ${
        isTyped ? (isCorrect ? 'text-green-400' : 'text-red-400') : 'text-gray-400'
      }`}
    >
      {char}
    </span>
  );
};

export default Key;