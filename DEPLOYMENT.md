# Deployment configuration

This project deploys as a Vite frontend and an Express API. Configure each service from its own folder.

## Backend service

- Root directory: `Backend`
- Build command: `npm install && npm run build`
- Start command: `npm start`
- The build command installs Puppeteer's Chrome browser, which the API needs to generate PDF files.
- Set `PORT` only if your provider does not set it automatically. The server listens on `process.env.PORT`, falling back to `3000` for local development, and binds to `0.0.0.0`.
- Set `NODE_ENV=production`, `MONGO_URI`, `JWT_SECRET`, and `GOOGLE_GENAI_API_KEY` in the provider's environment settings.
- Set `CLIENT_URL` to the deployed frontend's origin, such as `https://app.example.com` (no trailing slash). For multiple frontends, use comma-separated `CLIENT_URLS` instead.

## Frontend service

- Root directory: `Frontend`
- Install command: `npm install`
- Build command: `npm run build`
- Publish directory: `dist`
- Set `VITE_API_URL` to the deployed backend origin, such as `https://api.example.com` (no trailing slash). If the frontend and API share one origin, it can be omitted.
- Configure the static host to rewrite unknown paths to `/index.html` (SPA fallback), so direct visits and refreshes on routes such as `/interview/:interviewId` work.

Vite embeds `VITE_API_URL` into the frontend at build time, so set it before triggering the production build. Do not put secrets in frontend environment variables; values prefixed with `VITE_` are public.

The API uses Puppeteer to generate PDFs. Confirm the backend host supports Puppeteer's downloaded Chromium and run a PDF generation check after deployment.
