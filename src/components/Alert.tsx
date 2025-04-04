import React from 'react';
import { AlertType } from '../types';

type AlertProps = {
  alert: AlertType;
};

export const Alert: React.FC<AlertProps> = ({ alert }) => {
  if (!alert.show) return null;

  return (
    <div className="alert">
      <p>{alert.message}</p>
    </div>
  );
};