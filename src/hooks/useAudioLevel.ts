import { useEffect, useRef, useState } from 'react';

export const useAudioLevel = (isPaused = false) => {
    const [decibel, setDecibel] = useState(0);
    const streamRef = useRef<MediaStream | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const animationFrameRef = useRef<number>(0);
    const [prevDb, setPrevDb] = useState(0);

    useEffect(() => {
        console.log('useAudio')
        const getMicrophone = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                streamRef.current = stream;

                const audioContext = new AudioContext();
                const analyser = audioContext.createAnalyser();
                analyserRef.current = analyser;
                const microphone = audioContext.createMediaStreamSource(stream);
                microphone.connect(analyser);
                analyser.fftSize = 256;

                const dataArray = new Float32Array(analyser.frequencyBinCount);

                const updateDecibel = () => {
                    analyser.getFloatTimeDomainData(dataArray);
                    // 1. 计算RMS（均方根）
                    let sumSquares = 0;
                    for (let i = 0; i < dataArray.length; i++) {
                        sumSquares += dataArray[i] ** 2;  // 平方累加
                    }
                    const rms = Math.sqrt(sumSquares / dataArray.length);  // 均方根

                    // 2. 转换成分贝值（dBFS）
                    const minRMS = 0.0001;  // 对应-80dB: 20*log10(0.0001) = -80
                    const rawDB = 20 * Math.log10(Math.max(rms, minRMS));

                    // 3. 动态范围映射（根据实测校准）
                    const inputRange = {
                        min: -50,  // 实测静音环境值
                        max: -5    // 实测最大音量值
                    };
                    const outputRange = {
                        min: 30,    // 目标最小值
                        max: 90   // 目标最大值
                    };

                    // 线性映射公式
                    let mappedDB = ((rawDB - inputRange.min) / (inputRange.max - inputRange.min))
                        * (outputRange.max - outputRange.min) + outputRange.min;

                    // 4. 边界钳制
                    mappedDB = Math.max(outputRange.min, Math.min(outputRange.max, mappedDB));

                    // 5. 指数平滑滤波
                    const smoothingFactor = 0;  // 0.3表示保留30%历史值，70%新值
                    const smoothedDb = prevDb * smoothingFactor + mappedDB * (1 - smoothingFactor);

                    // 更新状态
                    setPrevDb(smoothedDb);
                    setDecibel(Math.round(smoothedDb));

                    animationFrameRef.current = requestAnimationFrame(updateDecibel);
                };
                updateDecibel();
            } catch (error) {
                console.error('Error accessing microphone:', error);
            }
        };

        if (!isPaused) {
            getMicrophone();
        }

        return () => {
            console.log('stop media')
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
                streamRef.current = null;
            }
            if (analyserRef.current) {
                analyserRef.current.disconnect();
                analyserRef.current = null;
            }
            setDecibel(0);
        };
    }, [isPaused]);

    return decibel;
};