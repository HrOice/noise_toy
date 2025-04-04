import React, { useEffect, useRef, useState } from 'react';

interface NoiseBarProps {
  decibel: number;
  maxDecibel: number;
  alertThreshold: number;
}

export const NoiseBar: React.FC<NoiseBarProps> = ({ 
  decibel, 
  maxDecibel, 
  alertThreshold 
}) => {
  const [peaks, setPeaks] = useState<Array<{ id: number; value: number }>>([]);
  const nextPeakId = useRef(0);
  
  const percentage = Math.min((decibel / maxDecibel) * 100, 100);
  const isWarning = decibel >= alertThreshold;

  useEffect(() => {
    // 添加新的峰值
    const newPeak = {
      id: nextPeakId.current,
      value: decibel
    };
    nextPeakId.current += 1;
    setPeaks(prev => [...prev, newPeak]);

    // 2秒后移除峰值
    const timer = setTimeout(() => {
      setPeaks(prev => prev.filter(p => p.id !== newPeak.id));
    }, 2000);

    return () => clearTimeout(timer);
  }, [decibel]);

  return (
    <div className={`noise-bar ${isWarning ? 'warning' : ''}`}>
      {/* 显示所有峰值 */}
      {peaks.map(peak => (
        <div 
          key={peak.id}
          className={`noise-fill peak ${isWarning ? 'warning' : ''}`}
          style={{ 
            width: `${Math.min((peak.value / maxDecibel) * 100, 100)}%`
          }}
        />
      ))}
      {/* 当前值显示条 */}
      <div 
        className={`noise-fill current ${isWarning ? 'warning' : ''}`}
        style={{ width: `${percentage}%` }}
      />
      <span className="value-display">
        {decibel.toFixed(1)} dB
      </span>
    </div>
  );
};