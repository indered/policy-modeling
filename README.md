# Policy Modeling

Policy Modeling is a Vite React app with HeroUI and Tailwind CSS already wired up. It is a clean starting point for building the first real policy modeling screen.

## Overview

### What Is Included

- React with TypeScript
- Vite for local development and production builds
- HeroUI components
- Tailwind CSS styling
- A public Vercel deployment

### Live App

- Production URL: https://policy-modeling.vercel.app
- GitHub repo: https://github.com/indered/policy-modeling

## Getting Started

### Prerequisites

- Node.js
- npm

### Install Dependencies

```bash
npm install
```

### Run Locally

```bash
npm run dev
```

The app runs on `http://127.0.0.1:5173` by default.

## Available Scripts

### Development

- `npm run dev` starts the local Vite dev server.

### Production Build

- `npm run build` runs TypeScript checks and creates a production build.

### Preview Build

- `npm run preview` serves the production build locally.

## Project Structure

### Key Files

- `src/App.tsx` contains the starter screen.
- `src/main.tsx` mounts the React app.
- `src/styles.css` loads Tailwind CSS and shared styles.
- `vite.config.ts` configures Vite.
- `package.json` lists scripts and dependencies.

## Deployment

### Hosting

- The app is hosted on Vercel.
- The Vercel project is linked through `.vercel/project.json`.
- Production deploys are connected to the GitHub repo.

### Deployment Note

- If a new Vercel URL redirects to SSO, check project protection settings.
- Run `vercel project protection policy-modeling --format json --scope mahesh-inders-projects`.
- Disable project SSO protection if the app should be public.

## Next Steps

### Product Work

- Replace the starter screen with the first policy modeling workflow.
- Decide what data a policy model needs before adding a backend.
- Keep the first version small enough to test with real users.

### Engineering Work

- Add routing when there is more than one screen.
- Add tests once the app has real user flows.
- Add a backend only when the frontend needs persisted data or server-side logic.
