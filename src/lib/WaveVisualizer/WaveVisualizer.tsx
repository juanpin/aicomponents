import type { ForwardedRef } from 'react';
import {
  useEffect,
  useRef,
  useState,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from 'react';

import classes from './WaveVisualizer.module.css';

export type WaveVisualizerProps = {
  /** Color of the bars */
  barColor?: string;
  /** Gap between bars in pixels */
  barGap?: number;
  /** Height of the visualization container */
  height?: number;
  /** Width of the visualization container */
  width?: number;
  /** The analyzer node to visualize */
  analyzer?: AnalyserNode;
};

export type WaveVisualizerRef = {
  startVisualization: (analyzer: AnalyserNode) => void;
};

export const WaveVisualizer = forwardRef<
  WaveVisualizerRef,
  WaveVisualizerProps
>(
  (
    {
      barColor = '#4a90e2',
      barGap = 2,
      height = 100,
      width = 400,
      analyzer: initialAnalyzer,
    },
    ref: ForwardedRef<WaveVisualizerRef>
  ) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationFrameRef = useRef<number | null>(null);
    const [dataArray, setDataArray] = useState<Uint8Array | null>(null);
    const [analyzer, setAnalyzer] = useState<AnalyserNode | null>(
      initialAnalyzer || null
    );

    // Initialize data array when analyzer is provided
    useEffect(() => {
      if (analyzer) {
        const bufferLength = analyzer.frequencyBinCount;
        setDataArray(new Uint8Array(bufferLength));
      }
    }, [analyzer]);

    // Update data array at 60fps when analyzer is provided
    useEffect(() => {
      if (!analyzer || !dataArray) return;

      const updateData = () => {
        analyzer.getByteFrequencyData(dataArray);
        // Force a re-render by creating a new array reference
        setDataArray(new Uint8Array(dataArray));
      };

      const intervalId = setInterval(updateData, 1000 / 60);
      return () => clearInterval(intervalId);
    }, [analyzer, dataArray]);

    const draw = useCallback(() => {
      const canvas = canvasRef.current;
      if (!canvas || !dataArray) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Clear the canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // Calculate bar dimensions
      const barCount = dataArray.length;
      // Calculate total space needed for gaps
      const totalGapSpace = (barCount - 1) * barGap;
      // Calculate available width for bars
      const availableWidth = canvas.width - totalGapSpace;
      // Calculate bar width to fill the available space
      const barWidth = availableWidth / barCount;

      // Draw each bar
      for (let i = 0; i < barCount; i++) {
        const barHeight = (dataArray[i] / 255) * canvas.height;
        const x = i * (barWidth + barGap);
        const y = canvas.height - barHeight;

        ctx.fillStyle = barColor;
        ctx.fillRect(x, y, barWidth, barHeight);
      }

      // Request next frame
      animationFrameRef.current = requestAnimationFrame(draw);
    }, [barColor, barGap, dataArray]);

    useEffect(() => {
      if (dataArray) {
        // Start animation
        animationFrameRef.current = requestAnimationFrame(draw);
      }

      return () => {
        // Cleanup animation frame
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
          animationFrameRef.current = null;
        }
      };
    }, [dataArray, draw]);

    const startVisualization = useCallback((newAnalyzer: AnalyserNode) => {
      setAnalyzer(newAnalyzer);
    }, []);

    useImperativeHandle(ref, () => ({
      startVisualization,
    }));

    return (
      <canvas
        className={classes.visualizer}
        ref={canvasRef}
        width={width}
        height={height}
      />
    );
  }
);

WaveVisualizer.displayName = 'WaveVisualizer';
