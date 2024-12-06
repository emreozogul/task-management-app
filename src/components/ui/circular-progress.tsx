import { cn } from "@/lib/utils";

interface CircularProgressProps {
    value: number;
    size?: number;
    strokeWidth?: number;
    className?: string;
    children?: React.ReactNode;
    indicatorIcon?: React.ReactNode;
    topIcon?: React.ReactNode;
    color?: string;
    trackColor?: string;
}

export const CircularProgress = ({
    value,
    size = 200,
    strokeWidth = 8,
    className,
    children,
    indicatorIcon,
    topIcon,
    color = 'var(--primary)',
    trackColor = 'var(--primary)'
}: CircularProgressProps) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (value / 100) * circumference;

    // Calculate indicator position
    const angle = ((value / 100) * 360 - 90) * (Math.PI / 180);
    const indicatorX = size / 2 + (radius * Math.cos(angle));
    const indicatorY = size / 2 + (radius * Math.sin(angle));

    return (
        <div className={cn("relative inline-flex items-center justify-center", className)}>
            {topIcon && (
                <div className="absolute z-10 -top-3">
                    {topIcon}
                </div>
            )}
            <svg width={size} height={size} className="transform -rotate-90">
                {/* Background track */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    strokeWidth={strokeWidth}
                    stroke={trackColor}
                    fill="none"
                    className="opacity-20"
                />

                {/* Progress circle */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    strokeWidth={strokeWidth}
                    stroke={color}
                    fill="none"
                    strokeLinecap="round"
                    style={{
                        strokeDasharray: circumference,
                        strokeDashoffset: offset,
                        transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                        filter: `drop-shadow(0 0 6px ${color})`
                    }}
                />
            </svg>

            {indicatorIcon && (
                <div
                    className="absolute flex items-center justify-center bg-background rounded-full border-2 shadow-lg"
                    style={{
                        width: '28px',
                        height: '28px',
                        transform: `translate(-50%, -50%) rotate(${(value / 100) * 360}deg)`,
                        left: `${indicatorX}px`,
                        top: `${indicatorY}px`,
                        borderColor: color,
                        transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                >
                    <div style={{ color }}>
                        {indicatorIcon}
                    </div>
                </div>
            )}

            <div className="absolute inset-0 flex items-center justify-center">
                {children}
            </div>
        </div>
    );
};
