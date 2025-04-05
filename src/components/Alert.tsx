import React from 'react';
import { AlertType } from '../types';
import './Alert.css';

interface AlertProps {
  alert: AlertType;
}

export const Alert: React.FC<AlertProps> = ({ alert }) => {
  if (!alert.show) return null;
  
  return (
    <div className="alert">
      <div className="alert-content">
        <div className="alert-icon">!</div>
        <div className="alert-message">
          <div className="alert-text">声音太大了</div>
          <div className="alert-text">请保持安静</div>
        </div>
      </div>
    </div>
  );
};