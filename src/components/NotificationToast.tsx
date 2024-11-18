import { useEffect } from 'react';
import { toast } from 'sonner';
import { useKanbanStore } from '@/stores/kanbanStore';
import { TaskNotification } from '@/types/notification';

export const NotificationToast = () => {
    const kanbanServices = useKanbanStore(state => state.kanbanServices);

    useEffect(() => {
        const handleNotification = (notification: TaskNotification) => {
            switch (notification.type) {
                case 'created':
                    toast.success(notification.message);
                    break;
                case 'updated':
                    toast.info(notification.message);
                    break;
                case 'deleted':
                    toast.error(notification.message);
                    break;
                case 'moved':
                    toast.info(notification.message);
                    break;
                case 'completed':
                    toast.success(notification.message);
                    break;
                default:
                    toast(notification.message);
            }
        };

        // Subscribe to notifications
        const userId = 'current-user'; // Replace with actual user ID
        kanbanServices.notification.subscribe(userId, handleNotification);

        return () => {
            kanbanServices.notification.unsubscribe(userId);
        };
    }, [kanbanServices]);

    return null;
};