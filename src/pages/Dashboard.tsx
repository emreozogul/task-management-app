import { TodaysTaskList } from '@/components/widgets/TodaysTaskList';
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
                {/* Main Content - Left Side (3 columns on xl) */}
                <div className="xl:col-span-3 space-y-6">
                    {/* Statistics Section */}
                    <TasksStatistics />

                    {/* Middle Section - Split into two */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Today's Tasks */}
                        <div className="md:col-span-1">
                            <TodaysTaskList />
                        </div>

                        {/* Active Boards */}
                        <div className="md:col-span-1">
                            <ActiveBoards />
                        </div>
                    </div>

                    {/* Bottom Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Recent Documents */}
                        <RecentDocuments />
                    </div>
                </div>

                {/* Right Sidebar (1 column on xl) */}
                <div className="xl:col-span-1 space-y-6">
                    {/* Quick Actions */}
                    <QuickActions />

                    {/* Pomodoro Timer */}
                    <PomodoroTimer />

                    {/* Time Tracker */}
                    <TimeTracker />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;