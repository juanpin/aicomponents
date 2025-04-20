import type { FC } from 'react';
import { useRef, useState, useCallback, useEffect } from 'react';
import { Mic } from 'lucide-react';

import { WaveVisualizer } from '../WaveVisualizer/WaveVisualizer';
import classes from './SpeechTranscriber.module.css';

type SpeechRecognition = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult:
    | ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => void)
    | null;
  onerror:
    | ((this: SpeechRecognition, ev: SpeechRecognitionError) => void)
    | null;
};

type SpeechRecognitionEvent = {
  results: SpeechRecognitionResultList;
};

type SpeechRecognitionError = {
  error: string;
};

export type Props = {
  /** Language for speech recognition (e.g., 'en-US', 'es-ES') */
  language?: string;
  /** Whether to continuously listen for speech */
  continuous?: boolean;
  /** Callback when transcription is available */
  onTranscription?: (text: string) => void;
  /** Callback when an error occurs */
  onError?: (error: Error) => void;
  /** Color for the microphone button and wave visualizer bars */
  color?: string;
};

export const SpeechTranscriber: FC<Props> = ({
  language = 'en-US',
  continuous = false,
  onTranscription,
  onError,
  color = 'black',
}) => {
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const waveVisualizerRef = useRef<{
    startVisualization: (analyzer: AnalyserNode) => void;
  }>(null);

  const checkBrowserSupport = useCallback(() => {
    if (!('webkitSpeechRecognition' in window)) {
      const error = new Error(
        'Speech recognition is not supported in this browser'
      );
      setError(error);
      onError?.(error);
      return false;
    }
    return true;
  }, [onError]);

  const setupAudioContext = useCallback(async () => {
    try {
      if (!checkBrowserSupport()) return;
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      const audioContext = new AudioContext();
      audioContextRef.current = audioContext;
      const source = audioContext.createMediaStreamSource(stream);
      const analyzer = audioContext.createAnalyser();
      analyzer.fftSize = 64;
      analyzer.smoothingTimeConstant = 0.8;
      source.connect(analyzer);

      const recognition = new (
        window as unknown as {
          webkitSpeechRecognition: new () => SpeechRecognition;
        }
      ).webkitSpeechRecognition();
      recognitionRef.current = recognition;
      recognitionRef.current.continuous = continuous;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = language;

      recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join(' ');
        onTranscription?.(transcript);
      };

      recognitionRef.current.onerror = (event: SpeechRecognitionError) => {
        const error = new Error(`Speech recognition error: ${event.error}`);
        setError(error);
        onError?.(error);
      };

      waveVisualizerRef.current?.startVisualization(analyzer);
    } catch (_) {
      const error = new Error('Failed to access microphone');
      setError(error);
      onError?.(error);
    }
  }, [checkBrowserSupport, continuous, language, onTranscription, onError]);

  const cleanupResources = useCallback(() => {
    recognitionRef.current?.stop();
    if (mediaStreamRef.current) {
      for (const track of mediaStreamRef.current.getTracks()) {
        track.stop();
      }
    }
    audioContextRef.current?.close();
  }, []);

  const startListening = useCallback(async () => {
    try {
      await setupAudioContext();
      recognitionRef.current?.start();
      setIsListening(true);
    } catch (_) {
      const error = new Error('Failed to start listening');
      setError(error);
      onError?.(error);
    }
  }, [setupAudioContext, onError]);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
    cleanupResources();
  }, [cleanupResources]);

  useEffect(() => {
    return cleanupResources;
  }, [cleanupResources]);

  if (error) {
    return (
      <div className={classes.error}>
        Speech recognition is not supported in your browser. Please try a
        different browser.
      </div>
    );
  }

  return (
    <div className={classes.speechTranscriber}>
      <WaveVisualizer
        ref={waveVisualizerRef}
        barColor={color}
        barGap={1}
        height={52}
        width={52}
      />

      <button
        className={classes.button}
        type="button"
        onClick={isListening ? stopListening : startListening}
        aria-label={isListening ? 'Stop listening' : 'Start listening'}
        style={{ backgroundColor: color }}>
        <Mic size={24} />
      </button>
    </div>
  );
};
