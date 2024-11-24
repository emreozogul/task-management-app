import { TodaysTaskList } from '@/components/dashboard/TodaysTaskList';
import { ActiveBoards } from '@/components/dashboard/ActiveBoards';
import { RecentDocuments } from '@/components/dashboard/RecentDocuments';
import { TasksStatistics } from '@/components/dashboard/TasksStatistics';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { PomodoroTimer } from '@/components/widgets/PomodoroTimer';
import { TimeTracker } from '@/components/widgets/TimeTracker';

const Dashboard = () => {
    return (
        <div className="p-6 min-h-screen bg-[#1a1b23]">
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
                <div className="xl:col-span-1 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-1 gap-6">
                        <QuickActions />
                        <PomodoroTimer />
                        <TimeTracker />

                    </div>
                </div>
                <div className="xl:col-span-3 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <TodaysTaskList />
                        </div>

                    </div>
                    <TasksStatistics />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-1">
                            <ActiveBoards />
                        </div>
                        <div className="md:col-span-1">
                            <RecentDocuments />
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Dashboard;