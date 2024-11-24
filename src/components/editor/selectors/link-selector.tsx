import { Button } from "@/components/ui/button";
import { PopoverContent } from "@/components/ui/popover";
import { Popover, PopoverTrigger } from "@radix-ui/react-popover";
import { Check, Trash, Link2 } from "lucide-react";
import { useEditor, EditorBubbleItem } from "novel";
import { useRef } from "react";

export function isValidUrl(url: string) {
    try {
        new URL(url);
        return true;
    } catch (_e) {
        return false;
    }
}
export function getUrlFromString(str: string) {
    if (isValidUrl(str)) return str;
    try {
        if (str.includes(".") && !str.includes(" ")) {
            return new URL(`https://${str}`).toString();
        }
    } catch (_e) {
        return null;
    }
}
interface LinkSelectorProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const LinkSelector = ({ open, onOpenChange }: LinkSelectorProps) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const { editor } = useEditor();
    const formRef = useRef<HTMLFormElement>(null);

    if (!editor) return null;

    return (
        <EditorBubbleItem>
            <Popover modal={false} open={open} onOpenChange={onOpenChange}>
                <PopoverTrigger asChild>
                    <Button size="sm" variant="ghost" className="gap-2 rounded-lg">
                        <Link2 className="h-4 w-4" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent
                    align="start"
                    side="bottom"
                    className="w-72 z-[99999] p-0 border-border bg-background-secondary text-primary-foreground"
                    sideOffset={0}
                    alignOffset={0}
                    forceMount
                    sticky="always"
                    onEscapeKeyDown={(e) => {
                        e.preventDefault();
                        onOpenChange(false);
                    }}
                    onInteractOutside={(e) => {
                        e.preventDefault();
                    }}
                    avoidCollisions={false}
                >
                    <form
                        ref={formRef}
                        onSubmit={(e) => {
                            e.preventDefault();
                            const url = getUrlFromString(inputRef.current?.value || '');
                            if (url) {
                                editor.chain().focus().setLink({ href: url }).run();
                                onOpenChange(false);
                            }
                        }}
                        className="flex items-center gap-2 p-2"
                    >
                        <input
                            ref={inputRef}
                            type="text"
                            placeholder="Paste a link"
                            className="flex-1 bg-background-hover rounded-md px-2 py-1 text-sm outline-none border-0 placeholder:text-muted"
                            defaultValue={editor.getAttributes("link").href || ""}
                            autoFocus
                        />
                        {editor.getAttributes("link").href ? (
                            <Button
                                size="sm"
                                variant="ghost"
                                type="button"
                                className="h-7 px-2 text-destructive hover:text-destructive/90 hover:bg-background-hover"
                                onClick={() => {
                                    editor.chain().focus().unsetLink().run();
                                    if (inputRef.current) inputRef.current.value = "";
                                    onOpenChange(false);
                                }}
                            >
                                <Trash className="h-4 w-4" />
                            </Button>
                        ) : (
                            <Button
                                size="sm"
                                variant="ghost"
                                className="h-7 px-2 hover:bg-background-hover"
                            >
                                <Check className="h-4 w-4" />
                            </Button>
                        )}
                    </form>
                </PopoverContent>
            </Popover>
        </EditorBubbleItem>
    );
};