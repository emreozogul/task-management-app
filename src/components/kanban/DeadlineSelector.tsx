import * as React from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, X } from "lucide-react";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface DeadlineSelectorProps {
    deadline: Date | null;
    onDeadlineChange: (date: Date | null) => void;
}

const DeadlineSelector: React.FC<DeadlineSelectorProps> = ({ deadline, onDeadlineChange }) => {
    const handleSelect = React.useCallback((date: Date | undefined) => {
        onDeadlineChange(date || null);
    }, [onDeadlineChange]);

    return (
        <div className="flex items-center gap-2">
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        className={cn(
                            "w-full justify-start text-left font-normal bg-[#383844] border-[#4e4e59] text-white",
                            !deadline && "text-muted-foreground"
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {deadline ? format(deadline, "PPP") : <span>Pick a date</span>}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-[#232430] border-[#383844]" align="start">
                    <Calendar
                        mode="single"
                        selected={deadline || undefined}
                        onSelect={handleSelect}
                        initialFocus
                        className="bg-[#232430] text-white"
                    />
                </PopoverContent>
            </Popover>

            {deadline && (
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDeadlineChange(null)}
                    className="h-8 w-8 p-0 hover:bg-[#383844]"
                >
                    <X className="h-4 w-4" />
                </Button>
            )}
        </div>
    );
};

export default DeadlineSelector; 