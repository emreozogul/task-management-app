import { PomodoroTimer } from '@/components/widgets/PomodoroTimer';
import { ThemeProvider } from '@/components/ThemeProvider';
import { TooltipProvider } from '@/components/ui/tooltip';

export default function App() {
    return (
        <ThemeProvider>
            <TooltipProvider>
                <div className="min-h-screen bg-background text-foreground transition-colors">
                    <div className="container mx-auto py-8 px-4">
                        <PomodoroTimer />
                    </div>
                </div>
            </TooltipProvider>
        </ThemeProvider>
    );
} 