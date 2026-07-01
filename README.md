# Policy Modeling

Policy Modeling is a Vite React app with HeroUI and Tailwind CSS already wired up. It is the first pass at a policy comparison screen.

## Overview

### What The App Does

- It compares two policies against a single client profile.
- One policy is asset-based and the other is pure LTC.
- User preferences change the comparison results.
- The app models premium type, premium range, inflation rider preference, coverage amount, and care start age.
- The age slider shows how much value each policy delivers if LTC starts at that age.

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

- `src/App.tsx` contains the UI, state, and table rendering.
- `src/policyModel.ts` contains the policy data model, shared types, and calculation logic.
- `src/main.tsx` mounts the React app.
- `src/styles.css` loads Tailwind CSS and shared styles.
- `vite.config.ts` configures Vite.
- `package.json` lists scripts and dependencies.

### Calculation Notes

The app keeps the math in `src/policyModel.ts` and the UI in `src/App.tsx`.

Projected coverage

- Projected monthly care cost = today monthly cost x `(1 + care inflation) ^ years until care`.
- Policy paid that month = the smallest of:
  - eligible cost after deductible
  - coinsurance-adjusted cost
  - monthly benefit cap
  - remaining lifetime pool
- Client gap = projected care cost - policy paid.
- Runout = the first month the remaining lifetime pool reaches zero.

ROI analysis

- Capital paid before care = upfront premium, or the sum of annual premiums paid before care starts.
- Care ROI = total covered benefit / capital paid.
- Net claim value = total covered benefit + no-claim asset value - capital paid.

Policy comparison

- The comparison is a plain scorecard.
- Each visible factor gives one point to the policy that fits the selected preference or has the stronger modeled value.
- Ties stay tied, so the app does not force a winner when the comparison is even.
- The explanation column is there to say what the number means in plain English.

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
