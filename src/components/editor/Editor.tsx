"use client";
import {
    EditorCommand,
    EditorCommandEmpty,
    EditorCommandItem,
    EditorCommandList,
    EditorContent,
    type EditorInstance,
    EditorRoot,
    EditorBubble,
    JSONContent,
} from "novel";
import { ImageResizer, handleCommandNavigation } from "novel/extensions";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { ColorSelector } from "./selectors/color-selector";
import { LinkSelector } from "./selectors/link-selector";
import { MathSelector } from "./selectors/math-selector";
import { NodeSelector } from "./selectors/node-selector";
import { TextButtons } from "./selectors/text-buttons";
import { defaultExtensions } from "./extensions";
import { suggestionItems } from "./slash-command";

import 'highlight.js/styles/github-dark.css';
import '@/styles/prosemirror.css';

interface EditorProps {
    onUpdate: (content: JSONContent) => void;
    initialContent?: JSONContent;
    documentId: string;
}

const Editor = ({ onUpdate, initialContent, documentId }: EditorProps) => {
    const [saveStatus, setSaveStatus] = useState("Saved");
    const [charsCount, setCharsCount] = useState();

    const [openNode, setOpenNode] = useState(false);
    const [openColor, setOpenColor] = useState(false);
    const [openLink, setOpenLink] = useState(false);

    const debouncedUpdates = useDebouncedCallback(async (editor: EditorInstance) => {
        const json = editor.getJSON();

        const newContent = {
            type: 'doc',
            content: json.content || []
        };

        onUpdate(newContent);
        setSaveStatus("Saved");
        setCharsCount(editor.storage.characterCount.words());

    }, 1000);


    return (
        <div className="relative w-full">
            <div className="flex absolute right-0 top-0 z-10 mb-5 gap-2 -mt-2 -mr-2">
                <div className="rounded-lg bg-background-hover shadow-md border border-border px-2 py-1 text-xs sm:text-sm text-muted">
                    {saveStatus}
                </div>
                <div className={charsCount ? "rounded-lg bg-background-hover shadow-md border border-border px-2 py-1 text-xs sm:text-sm text-muted" : "hidden"}>
                    {charsCount} Words
                </div>
            </div>
            <EditorRoot>
                <EditorContent
                    key={documentId}
                    initialContent={initialContent}
                    extensions={defaultExtensions}
                    className="relative h-[85vh] overflow-y-auto w-full border-border bg-background-secondary rounded-md sm:border sm:shadow-lg p-2 sm:p-4"
                    editorProps={{
                        handleDOMEvents: {
                            keydown: (_view, event) => handleCommandNavigation(event),
                            mousedown: (_view, event) => {
                                if (event.target instanceof HTMLElement) {
                                    const isDragHandle = event.target.closest('.drag-handle');
                                    if (isDragHandle) {
                                        event.stopPropagation();
                                        if ((event as DragEvent).dataTransfer!) {
                                            (event as DragEvent).dataTransfer!.effectAllowed = 'move';
                                        }
                                        return true;
                                    }
                                }
                                return false;
                            },
                            dragstart: (_view, event) => {
                                if (event.target instanceof HTMLElement) {
                                    const isDragHandle = event.target.closest('.drag-handle');
                                    if (isDragHandle) {
                                        event.stopPropagation();
                                        return true;
                                    }
                                }
                                return false;
                            }
                        },
                        attributes: {
                            class: "prose prose-lg prose-invert prose-headings:font-title font-default focus:outline-none max-w-full leading-relaxed px-4",
                            style: " line-height: 1.3;"
                        },
                    }}
                    onUpdate={({ editor }) => {
                        debouncedUpdates(editor);
                        setSaveStatus("Unsaved");
                    }}
                    slotAfter={<ImageResizer />}
                >
                    <EditorBubble
                        tippyOptions={{
                            duration: 100,
                            placement: 'top',
                            offset: [0, 10],
                            zIndex: 50,
                            maxWidth: 'none'
                        }}
                        className="flex items-center p-1 shadow-lg whitespace-nowrap"
                    >
                        <div className="flex items-center min-w-fit p-1 border border-border bg-background-secondary rounded-lg">
                            <NodeSelector open={openNode} onOpenChange={setOpenNode} />
                            <LinkSelector open={openLink} onOpenChange={setOpenLink} />
                            <MathSelector />
                            <TextButtons />
                            <ColorSelector open={openColor} onOpenChange={setOpenColor} />
                        </div>
                    </EditorBubble>

                    <EditorCommand className="z-50 h-auto max-h-[330px] overflow-y-auto rounded-md border border-border bg-background-secondary px-1 py-2 shadow-md transition-all">
                        <EditorCommandEmpty className="px-2 text-muted">No results</EditorCommandEmpty>
                        <EditorCommandList>
                            {suggestionItems.map((item) => (
                                <EditorCommandItem
                                    value={item.title}
                                    onCommand={(val) => item.command?.(val)}
                                    className="flex w-full items-center space-x-2 rounded-md px-2 py-1 text-left text-sm hover:bg-background-hover aria-selected:bg-background-hover"
                                    key={item.title}
                                >
                                    <div className="flex h-10 w-10 items-center justify-center rounded-md border border-border bg-background-hover">
                                        {item.icon}
                                    </div>
                                    <div>
                                        <p className="font-medium">{item.title}</p>
                                        <p className="text-xs text-muted">{item.description}</p>
                                    </div>
                                </EditorCommandItem>
                            ))}
                        </EditorCommandList>
                    </EditorCommand>
                </EditorContent>
            </EditorRoot>
        </div>
    );
};

export default Editor;