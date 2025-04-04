import React from 'react';

interface TimerProps {
  seconds: number;
  maxSeconds: number;
}

export const Timer: React.FC<TimerProps> = ({ seconds, maxSeconds }) => {
  const percentage = Math.min((seconds / maxSeconds) * 100, 100);

  return (
    <div className="timer-bar">
      <div 
        className="timer-fill"
        style={{ width: `${percentage}%` }}
      />
      <span className="value-display">
        {seconds}s / {maxSeconds}s
      </span>
    </div>
  );
};