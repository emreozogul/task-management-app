import { cn } from "@/lib/utils";

interface ClockFaceProps {
    size?: number;
    className?: string;
    showMarkers?: boolean;
    children?: React.ReactNode;
}

export const ClockFace = ({
    size = 200,
    className,
    showMarkers = true,
    children
}: ClockFaceProps) => {
    return (
        <div
            className={cn("relative rounded-full border-4 border-primary flex items-center justify-center", className)}
            style={{ width: size, height: size }}
        >
            {showMarkers && (
                <>
                    {[...Array(12)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute w-1 h-4 bg-primary-foreground"
                            style={{
                                transform: `rotate(${i * 30}deg)`,
                                transformOrigin: '50% 50%',
                                left: '50%',
                                marginLeft: '-0.5px',
                                top: '10px'
                            }}
                        />
                    ))}
                </>
            )}
            {children}
        </div>
    );
};