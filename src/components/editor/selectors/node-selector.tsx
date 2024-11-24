import {
    Check,
    CheckSquare,
    ChevronDown,
    Code,
    Heading1,
    Heading2,
    Heading3,
    ListOrdered,
    type LucideIcon,
    TextIcon,
    TextQuote,
} from "lucide-react";
import { EditorBubbleItem, useEditor } from "novel";

import { Button } from "@/components/ui/button";
import { PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Popover } from "@radix-ui/react-popover";

export type SelectorItem = {
    name: string;
    icon: LucideIcon;
    command: (editor: NonNullable<ReturnType<typeof useEditor>["editor"]>) => void;
    isActive: (editor: NonNullable<ReturnType<typeof useEditor>["editor"]>) => boolean;
};

const items: SelectorItem[] = [
    {
        name: "Text",
        icon: TextIcon,
        command: (editor) => editor.chain().focus().clearNodes().run(),
        isActive: (editor) =>
            editor.isActive("paragraph") && !editor.isActive("bulletList") && !editor.isActive("orderedList"),
    },
    {
        name: "Heading 1",
        icon: Heading1,
        command: (editor) => editor.chain().focus().clearNodes().toggleHeading({ level: 1 }).run(),
        isActive: (editor) => editor.isActive("heading", { level: 1 }),
    },
    {
        name: "Heading 2",
        icon: Heading2,
        command: (editor) => editor.chain().focus().clearNodes().toggleHeading({ level: 2 }).run(),
        isActive: (editor) => editor.isActive("heading", { level: 2 }),
    },
    {
        name: "Heading 3",
        icon: Heading3,
        command: (editor) => editor.chain().focus().clearNodes().toggleHeading({ level: 3 }).run(),
        isActive: (editor) => editor.isActive("heading", { level: 3 }),
    },
    {
        name: "To-do List",
        icon: CheckSquare,
        command: (editor) => editor.chain().focus().clearNodes().toggleTaskList().run(),
        isActive: (editor) => editor.isActive("taskItem"),
    },
    {
        name: "Bullet List",
        icon: ListOrdered,
        command: (editor) => editor.chain().focus().clearNodes().toggleBulletList().run(),
        isActive: (editor) => editor.isActive("bulletList"),
    },
    {
        name: "Numbered List",
        icon: ListOrdered,
        command: (editor) => editor.chain().focus().clearNodes().toggleOrderedList().run(),
        isActive: (editor) => editor.isActive("orderedList"),
    },
    {
        name: "Quote",
        icon: TextQuote,
        command: (editor) => editor.chain().focus().clearNodes().toggleBlockquote().run(),
        isActive: (editor) => editor.isActive("blockquote"),
    },
    {
        name: "Code",
        icon: Code,
        command: (editor) => editor.chain().focus().clearNodes().toggleCodeBlock().run(),
        isActive: (editor) => editor.isActive("codeBlock"),
    },
];
interface NodeSelectorProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const NodeSelector = ({ open, onOpenChange }: NodeSelectorProps) => {
    const { editor } = useEditor();
    if (!editor) return null;

    const activeItem = items.find(({ isActive }) => isActive(editor));
    return (
        <EditorBubbleItem>
            <Popover modal={false} open={open} onOpenChange={onOpenChange}>
                <PopoverTrigger asChild>
                    <Button size="sm" variant="ghost" className="gap-2 rounded-lg">
                        <span className="whitespace-nowrap">{activeItem?.name || 'Multiple'}</span>
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
                    {items.map((item) => (
                        <EditorBubbleItem
                            key={item.name}
                            onSelect={(editor) => {
                                item.command(editor);
                                onOpenChange(false);
                            }}
                            className="flex cursor-pointer items-center justify-between rounded-sm px-2 py-1 text-sm hover:bg-background-hover"
                        >
                            <div className="flex items-center space-x-2">
                                <div className="rounded-sm border border-border p-1">
                                    <item.icon className="h-3 w-3" />
                                </div>
                                <span>{item.name}</span>
                            </div>
                            {activeItem?.name === item.name && <Check className="h-4 w-4" />}
                        </EditorBubbleItem>
                    ))}
                </PopoverContent>
            </Popover>
        </EditorBubbleItem>
    );
};