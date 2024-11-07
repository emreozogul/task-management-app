import * as React from "react";
import DatePickerWithRange from "@/components/ui/datePickerWithRange";

interface DeadlineSelectorProps {
    deadline: Date | null;
    onDeadlineChange: (date: Date | null) => void;
}

const DeadlineSelector: React.FC<DeadlineSelectorProps> = ({ onDeadlineChange }) => {
    const handleDateChange = (range: { from: Date; to: Date }) => {
        onDeadlineChange(range.to);
    };

    const today = new Date();

    return (
        <div className="flex items-center space-x-2">
            <DatePickerWithRange
                className="flex-1"
                onChange={handleDateChange}
                initialDate={today}
            />
        </div>
    );
};

export default DeadlineSelector; 