import React from 'react';

type TimerProps = {
  seconds: number;
  maxSeconds: number;
};

export const Timer: React.FC<TimerProps> = ({ seconds, maxSeconds }) => {
  // 确保百分比不会超过100%
  const percentage = Math.min((seconds / maxSeconds) * 100, 100);
  
  // 格式化时间显示
  const formatTime = (secs: number): string => {
    return `${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="timer">
      <div className="timer-bar">
        <div 
          className="timer-fill"
          style={{ 
            width: `${percentage}%`,
            transition: 'width 0.3s ease-in-out'
          }}
        />
      </div>
      <div className="timer-value">
        {formatTime(seconds)}s / {formatTime(maxSeconds)}s
      </div>
    </div>
  );
};