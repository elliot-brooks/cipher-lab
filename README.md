# 🔐 Cipher Lab

An open crypto-analysis workbench built with **React + TypeScript + Vite**.

---

## Getting started

### Prerequisites

- [Node.js](https://nodejs.org/) 18 or later
- npm 9 or later (bundled with Node.js)
- [go-task](https://taskfile.dev/installation/) — task runner (`brew install go-task` / `scoop install task` / see docs)

### Install dependencies

```bash
npm install
```

### Task runner (go-task)

Common workflows are defined in `Taskfile.yml` and can be run with `task`:

| Command      | Description                          |
| ------------ | ------------------------------------ |
| `task dev`   | Start the Vite development server    |
| `task build` | Type-check and build for production  |
| `task test`  | Run the test suite with Vitest       |

### Run in development mode

```bash
task dev
# or: npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for production

```bash
task build
# or: npm run build
```

### Run tests

```bash
task test
# or: npx vitest run
```

### Preview the production build

```bash
npm run preview
```

### Lint

```bash
npm run lint
```

---

## Project structure

```
cipher-lab/
├── public/             # Static assets (app icon)
├── src/
│   ├── components/     # Shared UI components
│   ├── pages/          # Top-level page components
│   ├── lib/
│   │   ├── enigma/     # Enigma machine logic (coming soon)
│   │   └── analysis/   # Crypto-analysis utilities (coming soon)
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css       # Global CSS variables & reset
├── index.html
├── Taskfile.yml        # go-task developer workflows
├── vite.config.ts
├── tsconfig.json
└── package.json
```

---

## Tech stack

- **[Vite](https://vitejs.dev/)** — fast development server & bundler
- **[React 18](https://react.dev/)** — UI framework
- **[TypeScript](https://www.typescriptlang.org/)** — type-safe JavaScript
