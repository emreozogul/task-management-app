# Document Editor with Pomodoro Timer

A modern document management and productivity application built with Tauri, React, and TypeScript.

## Features

### Document Management
- Rich text editor powered by TipTap/Novel
- Real-time auto-saving
- Document status management (draft, published, archived)
- Tag and category organization
- Word count tracking
- Global drag and drop functionality for content blocks

### Editor Capabilities
- Text formatting (bold, italic, underline)
- Headings and lists
- Code blocks with syntax highlighting
- Image upload and management
- YouTube and Twitter embeds
- Mathematical equations support
- Custom slash commands
- Color selection for text
- Link management
- Task lists and checkboxes

### Pomodoro Timer
- Configurable work and break durations
- Session tracking and statistics
- Visual and audio notifications
- Session type indication (work/break)

## Technical Stack

- **Frontend Framework**: React with TypeScript
- **Desktop Framework**: Tauri (Rust)
- **Editor Framework**: TipTap/Novel
- **Styling**: Tailwind CSS + shadcn/ui
- **State Management**: Zustand
- **Database**: SQLite (via Rusqlite)

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run tauri dev
   ```

## Building for Production

To create a production build:
```bash
npm run tauri build
```


## Development Requirements

- Node.js 18+
- Rust toolchain
- Tauri system dependencies

## Project Structure

- `/src` - React frontend code
- `/src-tauri` - Rust backend code
- `/src/components` - Reusable React components
- `/src/stores` - Zustand state management
- `/src/styles` - Global styles and Tailwind configuration

background colors

#1a1b23 - Main background (very dark blue-gray)
#232430 - Card/component background (dark blue-gray)
#383844 - Secondary/hover background (medium blue-gray)
#4e4e59 - Darker hover states (medium-dark blue-gray)

Accent/Primary Colors:

#6775bc - Primary accent color (indigo/blue)
#7983c4 - Lighter primary accent (lighter indigo/blue)

Text Colors:
#95959c - Muted text (gray)
