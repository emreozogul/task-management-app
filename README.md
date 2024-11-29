# Document Editor with Task Management

A modern document and task management application built with Tauri, React, and TypeScript. Combines rich text editing with powerful task management features.

## Core Features

### Document Management
- Rich text editor powered by TipTap with real-time autosaving
- Support for markdown, math equations, and code blocks
- Document organization with folders and tags
- Export to PDF and DOCX formats
- Global drag and drop for content blocks

### Task Management
- Multiple task views: Kanban boards, Calendar, Timeline (Gantt)
- Task prioritization and deadline tracking
- Task linking with documents
- Custom tags and labels
- Progress tracking and statistics

### Productivity Tools
- Pomodoro timer with customizable work/break intervals
- Time tracking for tasks
- Ambient sound mixer for focus
- Quick notes widget
- Dashboard with task overview and statistics

## Technical Implementation

### Frontend Architecture
- React with TypeScript for UI components
- Zustand for state management
- TipTap/Novel for rich text editing
- DND Kit for drag-and-drop functionality
- Tailwind CSS + shadcn/ui for styling
- React Router for navigation

### Backend Features
- Tauri (Rust) for desktop integration
- SQLite database for data persistence
- File system operations for document management
- Cross-platform compatibility

### Key Components
- Document Editor with real-time collaboration features
- Kanban Board with customizable columns
- Calendar view with task scheduling
- Gantt chart for project timeline visualization
- Dashboard with task statistics and quick actions

## Development Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run in development mode:
   ```bash
   npm run tauri dev
   ```

3. Build for production:
   ```bash
   npm run tauri build
   ```

## Project Structure

src/
├── components/ # Reusable React components
│ ├── editor/ # Text editor components
│ ├── kanban/ # Kanban board components
│ ├── tasks/ # Task management components
│ └── widgets/ # Dashboard widgets
├── stores/ # Zustand state management
├── pages/ # Main application pages
├── layouts/ # Layout components
└── styles/ # Global styles and themes
src-tauri/ # Rust backend code


## System Requirements
- Node.js 18+
- Rust toolchain
- Tauri system dependencies

## Theme Support
- Dark and light mode
- System theme detection
- Customizable color schemes

## License
[Add your license information here]