# Pozan Market

Portfolio, booking flow, pricing catalog, and project-management dashboard for Pozan Market.

- Production: https://pozanmarket.vercel.app
- Admin: https://pozanmarket.vercel.app/admin
- Data: Convex
- Hosting: Vercel

## Local development

```bash
npm install
npm run dev
```

The website is available at `http://localhost:3000/portfolio/`.

Create `.env.local` through `npx convex dev`. The generated `VITE_CONVEX_URL` connects the frontend to the development deployment.

## Production

```bash
npx convex deploy --cmd "npm run build" --cmd-url-env-var-name VITE_CONVEX_URL
vercel --prod
```

The Convex `ADMIN_KEY` protects project, pricing, and booking-option management. It is stored only in the Convex environment and entered into the admin page per browser session.
