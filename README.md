# Spy Game

A browser game built with React, Vite, Express, and Supabase. 
The Express server serves the production frontend and `/api` endpoints.

## Project structure

```text
backend/
  index.js                 Existing deployment entry point
  src/
    app.js                 Express middleware and route composition
    server.js              Server startup
    config/                Environment, database client, filesystem paths
    controllers/           HTTP handlers for auth, users, words, game, static files
    middleware/            Token verification and rate limiting
    repositories/          Extracted database helper functions
    routes/                Route registration and middleware ordering
    services/              Spy selection logic
  test/                    HTTP contract and game selection checks
frontend/
  public/                  Public assets, robots.txt, sitemap.xml
  src/
    main.jsx               React entry point and browser router
    app/                   App composition, routes, shared contexts
    features/
      auth/                Login, registration, logout, user hooks
      dashboard/           Dashboard page and styles
      game/                Game setup, play screens, components, lobby hooks
      words/               Word selection, custom words, related hooks
    shared/hooks/          Reusable request hook
    styles/                Global CSS
    assets/                Bundled assets
```

## Setup and commands

Node.js 22.17.0
From the repository root:

```sh
npm --prefix backend ci
npm --prefix frontend ci
npm --prefix frontend run build
npm --prefix backend start
```

The production server serves `frontend/dist`. 
Authentication retains its existing secure cookies, so HTTPS is used for signed-in browser flows. 
`npm --prefix frontend run dev` runs the Vite development server; its relative `/api` requests still require your development environment to route requests to Express. This refactor does not add a Vite proxy.

## Verification

```sh
npm --prefix frontend run build
npm --prefix backend test
```


`backend/.env` deployment values:

```dotenv
DATABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-key
SUPER_KEY=your-jwt-secret
PROD_URL=https://your-frontend-origin.example
```

Backend tests use a local HTTP server and dummy credentials. 
They cover protected endpoint responses, JWT identity, CORS and security headers, logout cookies, public files, SPA fallback, and spy selection. The SPA check skips when no frontend build exists. These tests do not exercise a live Supabase database.

## Things to remember about new features

- Keep frontend pages, components, hooks, and styles with the feature that owns them. Use `shared` only for code used across features.
- Put shared context definitions in `app/contexts.js`; feature modules should not import `App.jsx`.
- Use `use...` names for React hooks and PascalCase for React component files.
- Register backend endpoints in `src/routes/index.js`, with their HTTP handlers in the appropriate controller. Preserve middleware ordering and put static fallbacks last.
- Put reusable database operations in repositories, reusable game rules in services, and cross-cutting request checks in middleware. Existing inline queries stay in their handlers to keep this change mechanical.
- Import `src/app.js` for tests or embedding; import `src/server.js` only when starting the HTTP listener.