import { useEffect, useState } from 'react';

export const useAudioLevel = () => {
  const [decibel, setDecibel] = useState(0);

  useEffect(() => {
    let audioContext: AudioContext;
    let analyser: AnalyserNode;
    let microphone: MediaStreamAudioSourceNode;

    const getMicrophone = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        audioContext = new AudioContext();
        analyser = audioContext.createAnalyser();
        microphone = audioContext.createMediaStreamSource(stream);
        microphone.connect(analyser);
        analyser.fftSize = 256;

        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        
        const updateDecibel = () => {
          analyser.getByteFrequencyData(dataArray);
          const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
          // 将 0-255 的值映射到 0-50 的分贝范围
          const mappedDecibel = (average / 255) * 50;
          setDecibel(Math.round(mappedDecibel));
          requestAnimationFrame(updateDecibel);
        };

        updateDecibel();
      } catch (error) {
        console.error('Error accessing microphone:', error);
      }
    };

    getMicrophone();

    return () => {
      if (audioContext) {
        audioContext.close();
      }
    };
  }, []);

  return decibel;
};