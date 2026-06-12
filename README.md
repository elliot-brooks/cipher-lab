# 🔐 Cipher Lab

An open crypto-analysis workbench built with **React + TypeScript + Vite**.

Explore classical ciphers, analyse encrypted text, and visualise historic encryption machines — all in the browser, with zero server-side dependencies.

---

## Features

| Tool | Status |
|---|---|
| Enigma Simulator | ✅ Available |
| Frequency Analysis | 🔜 Coming soon |
| Substitution Helper | 🔜 Coming soon |
| Rotor Visualiser | 🔜 Coming soon |
| Vigenère Solver | 🔜 Coming soon |
| Index of Coincidence | 🔜 Coming soon |

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

The compiled output will be in the `dist/` directory.

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
├── public/             # Static assets
├── src/
│   ├── components/     # Shared UI components (NavBar, …)
│   ├── pages/          # Top-level page components
│   │   ├── Home.tsx
│   │   └── EnigmaSimulator.tsx
│   ├── lib/
│   │   ├── enigma/     # Core Enigma machine logic
│   │   │   ├── rotors.ts   – Rotor/reflector wiring definitions
│   │   │   ├── enigma.ts   – EnigmaMachine class
│   │   │   └── index.ts
│   │   └── analysis/   # Crypto-analysis utilities
│   │       ├── frequency.ts – Letter frequency, IoC helpers
│   │       └── index.ts
│   ├── App.tsx         # Root component & lightweight router
│   ├── App.css
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

Navigation is handled with lightweight client-side state (no router library required) to keep the bundle minimal.

---

## Enigma implementation notes

The simulator implements a historically grounded 3-rotor Enigma (Wehrmacht/Luftwaffe variant):

- Rotors I–V with correct wirings and notch positions
- Reflectors B and C
- Authentic **double-stepping anomaly**
- Configurable **ring settings** (Ringstellung)
- **Plugboard** (Steckerbrett) accepting up to 13 letter-pair swaps

Because Enigma is a symmetric cipher, using the same settings to re-encrypt the output returns the original plaintext.

---

## Contributing

Contributions are welcome! The `src/lib/analysis/` module is a good place to add new cipher-analysis tools.
