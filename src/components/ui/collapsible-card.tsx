import { Card } from '@/components/ui/card'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { useState, useRef } from 'react'
import { cn } from '@/lib/utils'

interface CollapsibleCardProps {
    title?: string
    icon?: React.ReactNode
    children: React.ReactNode
    defaultExpanded?: boolean
    headerContent?: React.ReactNode
    className?: string
}

export function CollapsibleCard({
    title,
    icon,
    children,
    defaultExpanded = true,
    headerContent,
    className
}: CollapsibleCardProps) {
    const [isExpanded, setIsExpanded] = useState(defaultExpanded)
    const contentRef = useRef<HTMLDivElement>(null)


    return (
        <Card className={cn("bg-background-secondary", className, isExpanded ? 'overflow-hidden' : 'h-fit')}>
            <div
                className="p-4 sm:p-6 cursor-pointer flex items-center justify-between"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex items-center">
                    {icon}
                    <h2 className="text-lg font-semibold text-primary-foreground">{title}</h2>
                </div>
                <div className="flex items-center gap-2">
                    {headerContent}
                    {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-primary" />
                    ) : (
                        <ChevronDown className="w-5 h-5 text-primary" />
                    )}
                </div>
            </div>

            {isExpanded && (

                <div ref={contentRef} className="p-4 sm:px-6">
                    {children}
                </div>

            )}
        </Card>
    )
} 