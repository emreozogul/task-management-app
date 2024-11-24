import * as React from "react";
import { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import DatePickerWithRange from "@/components/ui/datePickerWithRange";

interface DeadlineSelectorProps {
    dateRange: DateRange | null;
    onDateRangeChange: (range: DateRange | null) => void;
}

const DeadlineSelector: React.FC<DeadlineSelectorProps> = ({ dateRange, onDateRangeChange }) => {
    return (
        <div className="flex items-center gap-2">
            <DatePickerWithRange
                onChange={(range) => {
                    if (range.from && range.to) {
                        const endDate = new Date(range.to);
                        endDate.setHours(23, 59, 59, 999);
                        onDateRangeChange({
                            from: range.from,
                            to: endDate
                        });
                    }
                }}
                initialDate={dateRange?.from}
                endDate={dateRange?.to}
            />

            {dateRange && (
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDateRangeChange(null)}
                    className="h-8 w-8 p-0 hover:bg-background-hover"
                >
                    <X className="h-4 w-4" />
                </Button>
            )}
        </div>
    );
};

export default DeadlineSelector; 