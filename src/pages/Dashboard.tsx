import { TodaysTaskList } from '@/components/dashboard/TodaysTaskList';
import { ActiveBoards } from '@/components/dashboard/ActiveBoards';
import { RecentDocuments } from '@/components/dashboard/RecentDocuments';
import { TasksStatistics } from '@/components/dashboard/TasksStatistics';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { PomodoroTimer } from '@/components/widgets/PomodoroTimer';
import { TimeTracker } from '@/components/widgets/TimeTracker';

const Dashboard = () => {
    return (
        <div className="p-6 min-h-screen">
            <div className="space-y-6">
                <div className="grid grid-cols-1 gap-6">
                    <TodaysTaskList />
                </div>
                {/* Top row - Pomodoro Timer */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <PomodoroTimer />
                    </div>
                    <TimeTracker />
                </div>

                {/* Second row - Quick Actions and Time Tracker */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                    <div className="lg:col-span-2 h-full">
                        <QuickActions />
                    </div>

                    <div className="lg:col-span-3">
                        <ActiveBoards />
                    </div>
                </div>




                {/* Bottom row - Active Boards and Recent Documents */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                    <div className="lg:col-span-3">
                        <TasksStatistics />
                    </div>
                    <div className="lg:col-span-2 h-full w-full">
                        <RecentDocuments />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;