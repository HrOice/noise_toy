import React, { useState } from 'react';
import { StorageData } from '../services/storage';

interface SettingsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  settings: StorageData['settings'];
  onSave: (settings: StorageData['settings']) => void;
}

export const SettingsDialog: React.FC<SettingsDialogProps> = ({
  isOpen,
  onClose,
  settings,
  onSave,
}) => {
  const [formData, setFormData] = useState(settings);

  if (!isOpen) return null;

  return (
    <div className="settings-dialog">
      <div className="settings-content">
        <h2>设置</h2>
        <div className="form-group">
          <label>计时时间（秒）：</label>
          <input
            type="number"
            value={formData.maxSeconds}
            onChange={(e) => setFormData(prev => ({ ...prev, maxSeconds: Number(e.target.value) }))}
          />
        </div>
        <div className="form-group">
          <label>最大分贝：</label>
          <input
            type="number"
            value={formData.maxDecibel}
            onChange={(e) => setFormData(prev => ({ ...prev, maxDecibel: Number(e.target.value) }))}
          />
        </div>
        <div className="form-group">
          <label>警告阈值：</label>
          <input
            type="number"
            value={formData.alertThreshold}
            onChange={(e) => setFormData(prev => ({ ...prev, alertThreshold: Number(e.target.value) }))}
          />
        </div>
        <div className="dialog-buttons">
          <button onClick={() => onSave(formData)}>保存</button>
          <button onClick={onClose}>取消</button>
        </div>
      </div>
    </div>
  );
};