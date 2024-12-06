import { PomodoroTimer } from '@/components/widgets/PomodoroTimer';
import { QuickNotes } from '@/components/widgets/QuickNotes';
import { AmbientSoundPlayer } from '@/components/widgets/AmbientSoundPlayer';
import { TimeTracker } from '@/components/widgets/TimeTracker';
const Widgets = () => {
    return (
        <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-2">
                    <PomodoroTimer />
                </div>

                <div className="col-span-2">
                    <AmbientSoundPlayer />
                </div>
                <TimeTracker />
                <QuickNotes />
            </div>
        </div>
    );
};

export default Widgets; 