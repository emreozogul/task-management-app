import { PomodoroTimer } from '@/components/utilities/PomodoroTimer';
import { QuickNotes } from '@/components/utilities/QuickNotes';
import { AmbientSoundPlayer } from '@/components/utilities/AmbientSoundPlayer';
import { TimeTracker } from '@/components/utilities/TimeTracker';
const Widgets = () => {
    return (
        <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <PomodoroTimer />
                <QuickNotes />
                <div className="col-span-2">
                    <AmbientSoundPlayer />
                </div>
                <TimeTracker />
            </div>
        </div>
    );
};

export default Widgets; 