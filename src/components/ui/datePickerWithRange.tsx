"use client"

import * as React from "react"
import { addDays, format } from "date-fns"
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
}

const DatePickerWithRange: React.FC<DatePickerWithRangeProps> = ({ onChange, initialDate, ...props }) => {
    const [date, setDate] = React.useState<DateRange | undefined>({
        from: initialDate || new Date(),
        to: addDays(initialDate || new Date(), 7),
    })

    return (
        <div className={cn("grid gap-2", props.className)}>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        id="date"
                        variant={"outline"}
                        className={cn(
                            "w-[300px] justify-start text-left font-normal bg-[#383844] border-[#4e4e59] text-white",
                            !date && "text-muted-foreground"
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
                    className="w-auto p-0 bg-[#232430] border-[#383844]"
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
                        className="text-white"
                    />
                </PopoverContent>
            </Popover>
        </div>
    )
}

export default DatePickerWithRange
