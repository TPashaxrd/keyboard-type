import React from 'react';

interface TimerProps {
  startTime: number | null;
  endTime: number | null;
  selectedDuration: number;
}

const Timer: React.FC<TimerProps> = ({ startTime, endTime, selectedDuration }) => {
  const [currentTime, setCurrentTime] = React.useState<number>(Date.now());

  React.useEffect(() => {
    if (startTime && !endTime) {
      const interval = setInterval(() => setCurrentTime(Date.now()), 1000);
      return () => clearInterval(interval);
    }
  }, [startTime, endTime]);

  const elapsedTime = startTime ? (endTime || currentTime) - startTime : 0;
  const remainingTime = selectedDuration * 1000 - elapsedTime;
  const seconds = Math.floor(remainingTime / 1000);

  return (
    <div className="text-xl mb-4">
      Kalan Süre: {seconds >= 0 ? `${seconds} saniye` : 'Süre doldu!'}
    </div>
  );
};

export default Timer;