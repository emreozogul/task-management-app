"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

interface DatePickerWithRangeProps {
    onChange: (range: { from: Date; to: Date }) => void;
    className?: string;
    initialDate?: Date;
    endDate?: Date;
}

export function DatePickerWithRange({
    className,
    onChange,
    initialDate,
    endDate,
}: DatePickerWithRangeProps) {
    const [date, setDate] = React.useState<DateRange | undefined>(
        initialDate && endDate
            ? {
                from: initialDate,
                to: endDate,
            }
            : undefined
    );

    React.useEffect(() => {
        if (initialDate && endDate) {
            setDate({
                from: initialDate,
                to: endDate,
            });
        }
    }, [initialDate, endDate]);

    return (
        <div className={cn("grid gap-2", className)}>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        id="date"
                        variant={"outline"}
                        className={cn(
                            "w-[300px] justify-start text-left font-normal bg-background-hover border-border text-primary-foreground",
                            !date && "text-muted"
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date?.from ? (
                            date.to ? (
                                <>
                                    {format(date.from, "LLL dd, y")} -{" "}
                                    {format(date.to, "LLL dd, y")}
                                </>
                            ) : (
                                format(date.from, "LLL dd, y")
                            )
                        ) : (
                            <span>Pick a date</span>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent
                    className="w-auto p-0 bg-background-secondary border-border"
                    align="start"
                >
                    <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={date?.from}
                        selected={date}
                        onSelect={(newDate) => {
                            setDate(newDate)
                            if (newDate?.from && newDate?.to) {
                                onChange({ from: newDate.from, to: newDate.to })
                            }
                        }}
                        numberOfMonths={2}
                        className="text-primary-foreground"
                    />
                </PopoverContent>
            </Popover>
        </div>
    )
}

export default DatePickerWithRange
