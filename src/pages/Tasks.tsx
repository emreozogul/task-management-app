import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MainContent, Calendar, Gantt } from '@/components/tasks/contents';
import { ListTodo, CalendarClock, GanttChart } from 'lucide-react';
export default function TasksPage() {

    return (
        <div className="relative min-h-screen">
            <Tabs defaultValue="tasks" className='w-full '>
                <TabsList className="bg-background-secondary border-b border-border  w-full px-4 z-10 fixed top-0">
                    <TabsTrigger value="tasks">
                        <ListTodo className="w-6 h-6" />
                        Tasks
                    </TabsTrigger>
                    <TabsTrigger value="calendar">
                        <CalendarClock className="w-6 h-6" />
                        Calendar
                    </TabsTrigger>
                    <TabsTrigger value="gantt">
                        <GanttChart className="w-6 h-6" />
                        Timeline
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="tasks">
                    <MainContent />
                </TabsContent>
                <TabsContent value="calendar">
                    <Calendar />
                </TabsContent>
                <TabsContent value="gantt">
                    <Gantt />
                </TabsContent>

            </Tabs>
        </div>
    );
}

