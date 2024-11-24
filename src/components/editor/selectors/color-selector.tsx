import { Check, ChevronDown } from "lucide-react";
import { EditorBubbleItem, useEditor } from "novel";

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
export interface BubbleColorMenuItem {
    name: string;
    color: string;
}

const TEXT_COLORS: BubbleColorMenuItem[] = [
    {
        name: "Default",
        color: "text-foreground",
    },
    {
        name: "Purple",
        color: "text-purple-600",
    },
    {
        name: "Red",
        color: "text-red-600",
    },
    {
        name: "Yellow",
        color: "text-yellow-600",
    },
    {
        name: "Blue",
        color: "text-blue-600",
    },
    {
        name: "Green",
        color: "text-green-600",
    },
    {
        name: "Orange",
        color: "text-orange-600",
    },
    {
        name: "Pink",
        color: "text-pink-600",
    },
    {
        name: "Gray",
        color: "text-gray-600",
    },
];

const HIGHLIGHT_COLORS: BubbleColorMenuItem[] = [
    {
        name: "Default",
        color: "var(--novel-highlight-default)",
    },
    {
        name: "Purple",
        color: "var(--novel-highlight-purple)",
    },
    {
        name: "Red",
        color: "var(--novel-highlight-red)",
    },
    {
        name: "Yellow",
        color: "var(--novel-highlight-yellow)",
    },
    {
        name: "Blue",
        color: "var(--novel-highlight-blue)",
    },
    {
        name: "Green",
        color: "var(--novel-highlight-green)",
    },
    {
        name: "Orange",
        color: "var(--novel-highlight-orange)",
    },
    {
        name: "Pink",
        color: "var(--novel-highlight-pink)",
    },
    {
        name: "Gray",
        color: "var(--novel-highlight-gray)",
    },
];

interface ColorSelectorProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const ColorSelector = ({ open, onOpenChange }: ColorSelectorProps) => {
    const { editor } = useEditor();

    if (!editor) return null;
    const activeColorItem = TEXT_COLORS.find(({ color }) => editor.isActive("textStyle", { color }));
    const activeHighlightItem = HIGHLIGHT_COLORS.find(({ color }) => editor.isActive("highlight", { color }));

    return (
        <Popover
            modal={false}
            open={open}
            onOpenChange={onOpenChange}
        >
            <PopoverTrigger asChild>
                <Button size="sm" className="gap-2 rounded-lg" variant="ghost">
                    <span className={`rounded-sm px-1 ${activeColorItem?.color || ''}`}>
                        A
                    </span>
                    <ChevronDown className="h-4 w-4" />
                </Button>
            </PopoverTrigger>

            <PopoverContent
                align="start"
                side="bottom"
                className="w-48 z-[99999] p-0 border-border bg-background-secondary text-primary-foreground"
                sideOffset={0}
                alignOffset={0}
                forceMount
                onOpenAutoFocus={(e) => e.preventDefault()}
                avoidCollisions={false}
            >
                <div className="flex flex-col">
                    <div className="my-1 px-2 text-sm font-semibold text-muted">Color</div>
                    {TEXT_COLORS.map(({ name, color }) => (
                        <EditorBubbleItem
                            key={name}
                            onSelect={() => {
                                editor.commands.unsetColor();
                                name !== "Default" &&
                                    editor
                                        .chain()
                                        .focus()
                                        .setColor(color || "")
                                        .run();
                                onOpenChange(false);
                            }}
                            className="flex cursor-pointer items-center justify-between px-2 py-1 text-sm hover:bg-background-hover"
                        >
                            <div className="flex items-center gap-2">
                                <div className={`rounded-sm border px-2 py-px font-medium ${color}`}>
                                    A
                                </div>
                                <span>{name}</span>
                            </div>
                        </EditorBubbleItem>
                    ))}
                </div>
                <div>
                    <div className="my-1 px-2 text-sm font-semibold text-muted">Background</div>
                    {HIGHLIGHT_COLORS.map(({ name, color }) => (
                        <EditorBubbleItem
                            key={name}
                            onSelect={() => {
                                editor.commands.unsetHighlight();
                                name !== "Default" && editor.chain().focus().setHighlight({ color }).run();
                                onOpenChange(false);
                            }}
                            className="flex cursor-pointer items-center justify-between px-2 py-1 text-sm hover:bg-background-hover"
                        >
                            <div className="flex items-center gap-2">
                                <div className={`rounded-sm border px-2 py-px font-medium ${color}`}>
                                    A
                                </div>
                                <span>{name}</span>
                            </div>
                            {editor.isActive("highlight", { color }) && <Check className="h-4 w-4" />}
                        </EditorBubbleItem>
                    ))}
                </div>
            </PopoverContent>
        </Popover>
    );
};