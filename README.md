# Policy Modeling

Policy Modeling is a Vite React app with HeroUI and Tailwind CSS already wired up. It is the first pass at a policy comparison screen.

## Overview

### What The App Does

- It compares two policies against a single client profile.
- One policy is asset-based and the other is pure LTC.
- User preferences change the comparison results.
- The app models premium type, premium range, inflation rider preference, coverage amount, and care start age.
- The age slider shows how much value each policy delivers if LTC starts at that age.

**walkthrough video:**  
https://www.youtube.com/watch?v=KUykdbhrYNI

### Live App

- Production URL: https://policy-modeling.vercel.app
- GitHub repo: https://github.com/indered/policy-modeling

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
