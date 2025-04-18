import type {FC} from 'react';
import {useState, useRef, useEffect, useCallback} from 'react';

import type {WaveVisualizerRef} from './WaveVisualizer';
import {WaveVisualizer} from './WaveVisualizer';

export const WaveVisualizerDemo: FC = () => {
    const [isRecording, setIsRecording] = useState(false);
    const audioContextRef = useRef<AudioContext | null>(null);
    const mediaStreamRef = useRef<MediaStream | null>(null);
    const analyzerRef = useRef<AnalyserNode | null>(null);
    const visualizerRef = useRef<WaveVisualizerRef>(null);

    const startRecording = async () => {
        try {
            // Request microphone access
            const stream = await navigator.mediaDevices.getUserMedia({audio: true});
            mediaStreamRef.current = stream;

            // Create audio context and analyzer
            const audioContext = new AudioContext();
            audioContextRef.current = audioContext;
            const analyzer = audioContext.createAnalyser();
            analyzerRef.current = analyzer;

            // Configure analyzer
            analyzer.fftSize = 64;
            analyzer.smoothingTimeConstant = 0.9;

            // Connect microphone to analyzer
            const source = audioContext.createMediaStreamSource(stream);
            source.connect(analyzer);

            // Start visualization
            visualizerRef.current?.startVisualization(analyzer);
            setIsRecording(true);
        } catch (error) {
            console.error('Error accessing microphone:', error);
        }
    };

    const stopRecording = useCallback(() => {
        if (mediaStreamRef.current) {
            for (const track of mediaStreamRef.current.getTracks()) {
                track.stop();
            }
        }
        if (audioContextRef.current) {
            audioContextRef.current.close();
        }
        setIsRecording(false);
    }, []);

    useEffect(() => {
        return () => {
            stopRecording();
        };
    }, [stopRecording]);

    return (
        <div className="wave-visualizer-demo">
            <h2>Wave Visualizer Demo</h2>
            <div className="controls">
                <button
                    type="button"
                    onClick={isRecording ? stopRecording : startRecording}
                    className={isRecording ? 'stop' : 'start'}>
                    {isRecording ? 'Stop Recording' : 'Start Recording'}
                </button>
            </div>
            <WaveVisualizer ref={visualizerRef} barColor="blue" barGap={2} height={600} width={600} />
            <style>{`
                .wave-visualizer-demo {
                    padding: 20px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 20px;
                }
                .controls {
                    margin-bottom: 20px;
                }
                button {
                    padding: 10px 20px;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 16px;
                    transition: background-color 0.2s;
                }
                button.start {
                    background-color: #4a90e2;
                    color: white;
                }
                button.stop {
                    background-color: #e24a4a;
                    color: white;
                }
                button:hover {
                    opacity: 0.9;
                }
            `}</style>
        </div>
    );
};
