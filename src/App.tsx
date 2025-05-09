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
    const [isPaused, setIsPaused] = useState(false);
    const decibel = useAudioLevel(isPaused);
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
    const [isLoaded, setIsLoaded] = useState(false);  // 添加加载标志

    // 在组件挂载时加载植物数据
    useEffect(() => {
        const data = storageService.getData();
        setPlants(data.plants);
        setSettings(data.settings);
        setIsLoaded(true);  // 标记数据已加载
    }, []);

    // 当植物更新时保存数据
    useEffect(() => {
        if (isLoaded) {  // 只在加载完成后保存数据
            storageService.saveData({ plants, settings });
        }
    }, [plants, settings, isLoaded]);

    useEffect(() => {
        if (decibel >= settingRef.current.maxDecibel) {
            setSeconds(0);
        }
        if (decibel >= settingRef.current.alertThreshold) {
            setAlert({
                show: true,
                message: '噪音太大了！请保持安静。'
            });
            setTimeout(() => setAlert({ show: false, message: '' }), 3000);
        } else {
            if (!timerRef.current && !isPaused) {
                console.log('start time')
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
    }, [decibel, settings.maxSeconds, settings.alertThreshold]); // 添加依赖项

    const addPlant = () => {
        setPlants(prevPlants => {
            // 统计当前植物数量
            const seedlings = prevPlants.filter(p => p.type === 'seedling');
            const trees = prevPlants.filter(p => p.type === 'tree');

            // 如果有足够的树，转换为一朵花
            if (trees.length >= settingRef.current.treesToFlower - 1 && seedlings.length >= settingRef.current.seedlingsToTree - 1) {
                // 移除所有树，添加一朵新花
                const remainingPlants = prevPlants.filter(p => p.type !== 'tree' && p.type !== 'seedling');
                return [...remainingPlants, { id: generateId(), type: 'flower' }];
            }

            // 如果有足够的树苗，转换为一棵树
            if (seedlings.length >= settingRef.current.seedlingsToTree - 1) {
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
            setSeconds(0);
        }
    };

    const handlePlayPause = () => {
        if (!isPaused) {
            // 
            if (timerRef.current) {
                console.log('stop time')
                clearInterval(timerRef.current);
                timerRef.current = null;
                // setSeconds(0);
            }
        }
        console.log(isPaused ? "play": "stop")
        setIsPaused(prev => {
            if (!prev) { // 暂停
                
            }
            return !prev;
        });
    };

    return (
        <div className="app">
            <div className="header">
                <button 
                    onClick={handlePlayPause} 
                    className="control-button"
                >
                    {isPaused ? '▶️' : '⏸️'}
                </button>
                <button onClick={() => setIsSettingsOpen(true)}>⚙️</button>
                <button onClick={handleReset}>🔄</button>
            </div>
            <div className="monitor-section">
                <div className="monitor-title">
                    🌱 保持安静，让花园成长
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