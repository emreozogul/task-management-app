import { useEffect } from 'react';

interface UseDialogKeyboardProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit?: () => void;
}

export const useDialogKeyboard = ({ isOpen, onClose, onSubmit }: UseDialogKeyboardProps) => {
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            } else if (event.key === 'Enter' && !event.shiftKey && onSubmit) {
                event.preventDefault();
                onSubmit();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose, onSubmit]);
};