# Spy Game frontend

React application built with Vite. See the [repository README](../README.md) for backend setup, environment variables, verification, and architecture conventions.

## Commands

Run these commands from this directory:

```sh
npm ci
npm run dev
npm run build
npm run preview
```

The build is written to `dist/` and served by Express in production. 
API requests use relative `/api` URLs. Vite has no API proxy configured, so development routing must provide access to the backend. 
Existing secure authentication cookies require HTTPS for signed-in browser flows.

## Source layout

- `main.jsx`: React mounting and browser router.
- `app/`: route composition, provider state, and shared context definitions.
- `features/auth/`: authentication pages, logout, and current-user hooks.
- `features/dashboard/`: dashboard page and styles.
- `features/game/`: setup screens, gameplay, and lobby hooks.
- `features/words/`: word lists, custom-word components, and hooks.
- `shared/hooks/`: the reusable POST request hook.
- `styles/`: global styles.

Feature styles remain regular CSS, with the original imports and cascade order. Context consumers import `app/contexts.js`, avoiding a dependency back to the application component. Hooks use the `use...` naming convention.
