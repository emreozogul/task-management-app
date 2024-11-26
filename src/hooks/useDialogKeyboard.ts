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
            // Get the active element
            const activeElement = document.activeElement;

            // Check if we're in an input field or similar
            const isInputActive = activeElement instanceof HTMLElement && (
                activeElement.tagName === 'INPUT' ||
                activeElement.tagName === 'TEXTAREA' ||
                activeElement.tagName === 'SELECT' ||
                activeElement.getAttribute('role') === 'combobox' ||
                activeElement.getAttribute('contenteditable') === 'true'
            );

            // Check if we're in a date picker
            const isDatePicker = activeElement instanceof HTMLElement && (
                activeElement.closest('[role="dialog"][aria-label*="date"]') ||
                activeElement.closest('.rdp') ||
                activeElement.getAttribute('aria-label')?.includes('calendar')
            );

            // Handle Escape key
            if (event.key === 'Escape' && !isDatePicker) {
                onClose();
                return;
            }

            // Don't handle Enter if we're in an input field (except for single-line inputs)
            if (event.key === 'Enter' && onSubmit) {
                if (isInputActive) {
                    // Allow Enter for single-line inputs only
                    if (activeElement instanceof HTMLInputElement &&
                        activeElement.type !== 'textarea') {
                        event.preventDefault();
                        onSubmit();
                    }
                } else if (!isDatePicker) {
                    event.preventDefault();
                    onSubmit();
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose, onSubmit]);
};