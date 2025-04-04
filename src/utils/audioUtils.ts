// src/utils/audioUtils.ts

export const calculateDecibelLevel = (audioData: Float32Array): number => {
    const rms = Math.sqrt(audioData.reduce((sum, value) => sum + value * value, 0) / audioData.length);
    return 20 * Math.log10(rms);
};

export const isAboveThreshold = (decibelLevel: number, threshold: number = 50): boolean => {
    return decibelLevel > threshold;
};