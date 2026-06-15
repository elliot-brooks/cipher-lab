# Development

This document outlines the development workflow for Cipher Lab. It is intended for developers who want to contribute to the project or run it locally.

This project uses [Vite](https://vitejs.dev/) for development and build tooling, [Vitest](https://vitest.dev/) for testing, and [go-task](https://taskfile.dev/) for task automation.

## Prerequisites

- [Node.js](https://nodejs.org/) 20 or later
- npm 10 or later (bundled with Node.js)
- [go-task](https://taskfile.dev/installation/) — task runner (`brew install go-task` / `scoop install task` / see docs)

## Task runner

| Command      | Description                         |
| ------------ | ----------------------------------- |
| `task dev`   | Start the Vite development server   |
| `task build` | Type-check and build for production |
| `task test`  | Run the test suite with Vitest      |
| `task deps`  | Install project dependencies        |


Open [http://localhost:5173](http://localhost:5173) after running `task dev`.

Other scripts available directly via npm: `npm run preview`, `npm run lint`.

## Project structure

```
cipher-lab/
├── public/             # Static assets (app icon)
├── src/
│   ├── components/     # Shared UI components
│   ├── pages/          # Top-level page components
│   ├── services/           # Core app logic
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css       # Global CSS variables & reset
├── index.html
├── Taskfile.yml        # go-task developer workflows
├── vite.config.ts
├── tsconfig.json
└── package.json
```

## Release workflow

Releases are created from the GitHub Actions workflow at `.github/workflows/release.yml`.

Releases are tagged with a version number (for example `v1.0.0`) and deployed to GitHub Pages.
Releases are created from `main`
