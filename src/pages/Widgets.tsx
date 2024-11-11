import { PomodoroTimer } from '@/components/utilities/PomodoroTimer';
import { QuickNotes } from '@/components/utilities/QuickNotes';
import { AmbientSoundPlayer } from '@/components/utilities/AmbientSoundPlayer';
import { TimeTracker } from '@/components/utilities/TimeTracker';
const Widgets = () => {
    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-white">Widgets</h1>
            </div>

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