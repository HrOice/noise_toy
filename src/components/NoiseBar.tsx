import React from 'react';
import { CONFIG } from '../config/constants';

type NoiseBarProps = {
  decibel: number;
  maxDecibel: number;
  alertThreshold:number;
};

export const NoiseBar: React.FC<NoiseBarProps> = ({ decibel, maxDecibel, alertThreshold }) => {
  const percentage = (decibel / maxDecibel) * 100;

  return (
    <div className="noise-bar">
      <div className="bar-container">
        <div 
          className="bar-fill"
          style={{ 
            width: `${percentage}%`,
            backgroundColor: decibel >= alertThreshold ? '#ff4444' : '#44ff44'
          }}
        />
      </div>
      <div className="decibel-value">
        {decibel.toFixed(1)} / {maxDecibel} dB
      </div>
    </div>
  );
};