# 🔐 Cipher Lab

An open crypto-analysis workbench built with **React + TypeScript + Vite**.

---

## Getting started

### Prerequisites

- [Node.js](https://nodejs.org/) 18 or later
- npm 9 or later (bundled with Node.js)

### Install dependencies

```bash
npm install
```

### Run in development mode

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for production

```bash
npm run build
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
├── vite.config.ts
├── tsconfig.json
└── package.json
```

---

## Tech stack

- **[Vite](https://vitejs.dev/)** — fast development server & bundler
- **[React 18](https://react.dev/)** — UI framework
- **[TypeScript](https://www.typescriptlang.org/)** — type-safe JavaScript
