import { useEffect, useRef, useState } from 'react';

export const useAudioLevel = (isPaused = false) => {
  const [decibel, setDecibel] = useState(0);
  const streamRef = useRef<MediaStream | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number>(0);

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

        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        
        const updateDecibel = () => {
          analyser.getByteFrequencyData(dataArray);
          const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
          // 将 0-255 的值映射到 0-50 的分贝范围
          const mappedDecibel = (average / 255) * 50;
          setDecibel(Math.round(mappedDecibel));
          animationFrameRef.current = requestAnimationFrame(updateDecibel);
        };

        updateDecibel();
      } catch (error) {
        console.error('Error accessing microphone:', error);
      }
    };

    if (!isPaused) {
        debugger
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