This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## About the app

This project implements an interactive Bloch sphere visualisation for qubits, offering insights into quantum states.

### Features
- **Quantum Gates**: Apply predefined quantum gates (X, Y, Z, H) or add custom gates.
- **Comprehensive Qubit State Representation**:  
  - View the qubit state as a vector inside the Bloch sphere.  
  - Displays the current state in the form:  
    **a|0⟩ + b|1⟩**.  
  - Examine the state’s coordinates in euclidean space and angular representation.
- **History Tracking**: Undo actions with the history feature and share your progress.

