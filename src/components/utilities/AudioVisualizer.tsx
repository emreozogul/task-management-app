import { useEffect, useRef } from 'react';
import * as Tone from 'tone';

interface AudioVisualizerProps {
    isPlaying: boolean;
    activeSounds: { player?: Tone.Player }[];
    className?: string;
}

export const AudioVisualizer = ({ isPlaying, activeSounds, className }: AudioVisualizerProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const analyserRef = useRef<Tone.Analyser | null>(null);
    const animationRef = useRef<number>();

    useEffect(() => {
        if (!analyserRef.current) {
            analyserRef.current = new Tone.Analyser('waveform', 128);
        }

        const analyser = analyserRef.current;

        activeSounds.forEach(sound => {
            if (sound.player) {
                sound.player.connect(analyser);
            }
        });

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const animate = () => {
            if (!ctx || !analyser) return;

            const values = analyser.getValue();
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = '#2a2b38';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const centerY = canvas.height / 2;
            const barWidth = Math.ceil(canvas.width / values.length);

            ctx.beginPath();
            ctx.moveTo(0, centerY);

            for (let i = 0; i < values.length; i++) {
                const x = i * barWidth;
                const value = values[i] as number;
                const amplifiedValue = value * 3;
                const y = centerY + (amplifiedValue * canvas.height * 0.4);

                if (i === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }

            for (let i = values.length - 1; i >= 0; i--) {
                const x = i * barWidth;
                const value = values[i] as number;
                const amplifiedValue = value * 3;
                const y = centerY - (amplifiedValue * canvas.height * 0.4);
                ctx.lineTo(x, y);
            }

            const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
            gradient.addColorStop(0, '#6775bc33');
            gradient.addColorStop(0.5, '#6775bccc');
            gradient.addColorStop(1, '#6775bc33');

            ctx.fillStyle = gradient;
            ctx.fill();

            ctx.shadowBlur = 15;
            ctx.shadowColor = '#6775bc';
            ctx.strokeStyle = '#6775bc';
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.shadowBlur = 0;

            animationRef.current = requestAnimationFrame(animate);
        };

        if (isPlaying) {
            animate();
        } else {
            ctx.fillStyle = '#2a2b38';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const centerY = canvas.height / 2;
            ctx.beginPath();
            ctx.moveTo(0, centerY);
            ctx.lineTo(canvas.width, centerY);
            ctx.strokeStyle = '#6775bc66';
            ctx.lineWidth = 2;
            ctx.stroke();
        }

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
            activeSounds.forEach(sound => {
                if (sound.player) {
                    sound.player.disconnect(analyser);
                }
            });
        };
    }, [isPlaying, activeSounds]);

    return (
        <canvas
            ref={canvasRef}
            width={400}
            height={300}
            className={`w-full rounded-lg ${className}`}
        />
    );
}; 