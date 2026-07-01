# Project Instructions

## Things that have broken before

- Deployed Vercel URL redirects to SSO instead of the app → team SSO protection was inherited by the fresh project → check `vercel project protection <name> --format json` and disable project SSO before calling the app live.
