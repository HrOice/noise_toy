import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import { Alert } from './components/Alert';
import { Garden } from './components/Garden';
import { NoiseBar } from './components/NoiseBar';
import { SettingsDialog } from './components/SettingsDialog';
import { Timer } from './components/Timer';
import { CONFIG } from './config/constants';
import { useAudioLevel } from './hooks/useAudioLevel';
import { StorageData, storageService } from './services/storage';
import { AlertType, Plant } from './types';

// 添加一个计数器用于生成唯一ID
let plantIdCounter = 0;
const generateId = () => `plant_${Date.now()}_${++plantIdCounter}`;

const App: React.FC = () => {
    const decibel = useAudioLevel();
    const [seconds, setSeconds] = useState(0);
    const [plants, setPlants] = useState<Plant[]>([]);
    const [alert, setAlert] = useState<AlertType>({ show: false, message: '' });
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [settings, setSettings] = useState<StorageData['settings']>(() => {
        return storageService.getData().settings;
    });
    const settingRef = useRef(settings);
    const timerRef = useRef<NodeJS.Timeout>(null);
    const isAddingPlant = useRef(false);  // 新增：用于防止重复添加植物

    // 在组件挂载时加载植物数据
    useEffect(() => {
        const data = storageService.getData();
        setPlants(data.plants);
        setSettings(data.settings);
    }, []);

    // 当植物更新时保存数据
    useEffect(() => {
        storageService.saveData({ plants, settings });
    }, [plants, settings]);

    useEffect(() => {
        if (decibel >= settingRef.current.alertThreshold) {
            setSeconds(0);
            setAlert({
                show: true,
                message: '噪音太大了！请保持安静。'
            });
            setTimeout(() => setAlert({ show: false, message: '' }), 3000);
        } else {
            if (!timerRef.current) {
                timerRef.current = setInterval(() => {
                    setSeconds(prev => {
                        if (prev < settingRef.current.maxSeconds) {
                            return prev + 1;
                        }
                        return 0;
                    });
                }, CONFIG.TIMER.UPDATE_INTERVAL);
            }
        }

        // 组件卸载时清理定时器
        // return () => {
        //   if (timerRef.current) {
        //     clearInterval(timerRef.current);
        //   }
        // };
    }, [decibel, settings.maxSeconds, settings.alertThreshold]); // 添加依赖项

    const addPlant = () => {

        setPlants(prevPlants => {
            // 统计当前植物数量
            const seedlings = prevPlants.filter(p => p.type === 'seedling');
            const trees = prevPlants.filter(p => p.type === 'tree');
            // 如果有足够的树，转换为一朵花
            if (trees.length >= settings.treesToFlower - 1 && seedlings.length >= settings.seedlingsToTree - 1) {
                // 移除所有树，添加一朵新花
                const remainingPlants = prevPlants.filter(p => p.type !== 'tree' && p.type !== 'seedling');
                return [...remainingPlants, { id: generateId(), type: 'flower' }];
            }
            // 如果有足够的树苗，转换为一棵树
            if (seedlings.length >= settings.seedlingsToTree - 1) {
                // 移除所有树苗，添加一棵新树
                const remainingPlants = prevPlants.filter(p => p.type !== 'seedling');
                return [...remainingPlants, { id: generateId(), type: 'tree' }];
            }

            // 默认添加一个新的树苗
            return [...prevPlants, { id: generateId(), type: 'seedling' }];
        });
    };

    if (seconds === settings.maxSeconds) {
        addPlant();
        setSeconds(0);
    }

    const handleSettingsSave = (newSettings: StorageData['settings']) => {
        setSettings({...newSettings});
        settingRef.current = newSettings
        setIsSettingsOpen(false);
    };

    const handleReset = () => {
        if (window.confirm('确定要重置花园吗？')) {
            storageService.resetData();
            const data = storageService.getData();
            setPlants(data.plants);
            setSettings(data.settings);
            settingRef.current = data.settings
            setSeconds(0);
        }
    };

    return (
        <div className="app">
            <div className="header">
                <button onClick={() => setIsSettingsOpen(true)}>⚙️ 设置</button>
                <button onClick={handleReset}>🔄 重置花园</button>
            </div>
            <div className="monitor-section">
                <div className="monitor-title">
                    🌱 保持安静，让花园慢慢长大吧！
                </div>
                <div className="timer-section">
                    <h3>🕒 安静时间</h3>
                    <Timer seconds={seconds} maxSeconds={settingRef.current.maxSeconds} />
                </div>
                <div className="noise-section">
                    <h3>🔊 当前音量</h3>
                    <NoiseBar 
                        decibel={decibel} 
                        maxDecibel={settingRef.current.maxDecibel} 
                        alertThreshold={settingRef.current.alertThreshold} 
                    />
                </div>
            </div>
            <h3 className="garden-title">🌺 我的小花园</h3>
            <Garden plants={plants} />
            <Alert alert={alert} />
            <SettingsDialog
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
                settings={settingRef.current}
                onSave={handleSettingsSave}
            />
        </div>
    );
};

export default App;