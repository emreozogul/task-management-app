import { Extension } from '@tiptap/core';
import Suggestion from '@tiptap/suggestion';
import { Editor } from '@tiptap/core';
import {
    Heading1,
    Heading2,
    Heading3,
    List,
    ListOrdered,
    Text,
    Image as ImageIcon,
    Code,
    Quote,
    CheckSquare,
    Table as TableIcon,
    Minus,
} from 'lucide-react';

import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { TaskList } from '@tiptap/extension-task-list';
import { TaskItem } from '@tiptap/extension-task-item';

const getSuggestionItems = ({ query }: { query: string }) => {
    return [
        {
            title: 'Text',
            description: 'Just start typing with plain text',
            searchTerms: ['p', 'paragraph'],
            icon: <Text className="w-4 h-4" />,
            command: ({ editor, range }: { editor: Editor; range: any }) => {
                editor
                    .chain()
                    .focus()
                    .deleteRange(range)
                    .toggleNode('paragraph', 'paragraph')
                    .run();
            },
        },
        {
            title: 'Heading 1',
            description: 'Big section heading',
            searchTerms: ['title', 'big', 'large', 'h1'],
            icon: <Heading1 className="w-4 h-4" />,
            command: ({ editor, range }: { editor: Editor; range: any }) => {
                editor
                    .chain()
                    .focus()
                    .deleteRange(range)
                    .toggleHeading({ level: 1 })
                    .run();
            },
        },
        {
            title: 'Heading 2',
            description: 'Medium section heading',
            searchTerms: ['subtitle', 'medium', 'h2'],
            icon: <Heading2 className="w-4 h-4" />,
            command: ({ editor, range }: { editor: Editor; range: any }) => {
                editor
                    .chain()
                    .focus()
                    .deleteRange(range)
                    .toggleHeading({ level: 2 })
                    .run();
            },
        },
        {
            title: 'Heading 3',
            description: 'Small section heading',
            searchTerms: ['subtitle', 'small', 'h3'],
            icon: <Heading3 className="w-4 h-4" />,
            command: ({ editor, range }: { editor: Editor; range: any }) => {
                editor
                    .chain()
                    .focus()
                    .deleteRange(range)
                    .toggleHeading({ level: 3 })
                    .run();
            },
        },
        {
            title: 'Bullet List',
            description: 'Create a simple bullet list',
            searchTerms: ['unordered', 'point'],
            icon: <List className="w-4 h-4" />,
            command: ({ editor, range }: { editor: Editor; range: any }) => {
                editor
                    .chain()
                    .focus()
                    .deleteRange(range)
                    .toggleBulletList()
                    .run();
            },
        },
        {
            title: 'Numbered List',
            description: 'Create a numbered list',
            searchTerms: ['ordered'],
            icon: <ListOrdered className="w-4 h-4" />,
            command: ({ editor, range }: { editor: Editor; range: any }) => {
                editor
                    .chain()
                    .focus()
                    .deleteRange(range)
                    .toggleOrderedList()
                    .run();
            },
        },
        {
            title: 'To-do List',
            description: 'Track tasks with a to-do list',
            searchTerms: ['todo', 'task', 'list', 'check', 'checkbox'],
            icon: <CheckSquare className="w-4 h-4" />,
            command: ({ editor, range }: { editor: Editor; range: any }) => {
                editor
                    .chain()
                    .focus()
                    .deleteRange(range)
                    .toggleTaskList()
                    .run();
            },
        },
        {
            title: 'Quote',
            description: 'Capture a quote',
            searchTerms: ['blockquote'],
            icon: <Quote className="w-4 h-4" />,
            command: ({ editor, range }: { editor: Editor; range: any }) => {
                editor
                    .chain()
                    .focus()
                    .deleteRange(range)
                    .toggleBlockquote()
                    .run();
            },
        },
        {
            title: 'Code',
            description: 'Capture a code snippet',
            searchTerms: ['codeblock'],
            icon: <Code className="w-4 h-4" />,
            command: ({ editor, range }: { editor: Editor; range: any }) => {
                editor
                    .chain()
                    .focus()
                    .deleteRange(range)
                    .toggleCodeBlock()
                    .run();
            },
        },
        {
            title: 'Image',
            description: 'Upload an image',
            searchTerms: ['photo', 'picture', 'media'],
            icon: <ImageIcon className="w-4 h-4" />,
            command: ({ editor, range }: { editor: Editor; range: any }) => {
                const url = window.prompt('Enter the URL of the image:');
                if (url) {
                    editor
                        .chain()
                        .focus()
                        .deleteRange(range)
                        .setImage({ src: url })
                        .run();
                }
            },
        },
        {
            title: 'Table',
            description: 'Add a table',
            searchTerms: ['grid'],
            icon: <TableIcon className="w-4 h-4" />,
            command: ({ editor, range }: { editor: Editor; range: any }) => {
                editor
                    .chain()
                    .focus()
                    .deleteRange(range)
                    .insertTable({ rows: 3, cols: 3 })
                    .run();
            },
        },
        {
            title: 'Divider',
            description: 'Add a dividing line',
            searchTerms: ['horizontal rule', 'hr', 'line'],
            icon: <Minus className="w-4 h-4" />,
            command: ({ editor, range }: { editor: Editor; range: any }) => {
                editor
                    .chain()
                    .focus()
                    .deleteRange(range)
                    .setHorizontalRule()
                    .run();
            },
        },
    ].filter(item => {
        if (typeof query === 'string' && query.length > 0) {
            const search = query.toLowerCase();
            return (
                item.title.toLowerCase().includes(search) ||
                item.description.toLowerCase().includes(search) ||
                (item.searchTerms &&
                    item.searchTerms.some(term => term.includes(search)))
            );
        }
        return true;
    });
};

export default Extension.create({
    name: 'slash-command',

    addExtensions() {
        return [
            Table.configure({
                resizable: true,
            }),
            TableRow,
            TableCell,
            TableHeader,
            TaskList,
            TaskItem.configure({
                nested: true,
            }),
        ];
    },

    addOptions() {
        return {
            suggestion: {
                char: '/',
                command: ({ editor, range, props }: { editor: Editor; range: Range; props: any }) => {
                    props.command({ editor, range });
                },
                items: getSuggestionItems,
            },
        };
    },

    addProseMirrorPlugins() {
        return [
            Suggestion({
                editor: this.editor,
                ...this.options.suggestion,
                render: () => {
                    let popup: any = null;

                    return {


                        onUpdate: (props: any) => {
                            if (props.clientRect !== popup?.getBoundingClientRect()) {
                                popup?.setStyles({
                                    getReferenceClientRect: props.clientRect,
                                });
                            }
                        },

                        onKeyDown: (props: any) => {
                            if (props.event.key === 'Enter') {
                                props.command({ editor: this.editor, range: props.range });
                                return true;
                            }
                            return false;
                        },
                    };
                },
            }),
        ];
    },
}); 