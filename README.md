# UPIA Frontend

Frontend web application for the **Urban Poor Integrated Alliance (UPIA)** platform, built with Next.js 14, Tailwind CSS, and deployed on Azure App Service.

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS, Headless UI, Framer Motion
- **CMS:** Sanity (for news/blog content)
- **Maps:** Google Maps / Places Autocomplete
- **Deployment:** Azure App Service (Linux, Node 24)

## Project Structure

```
src/
├── app/
│   ├── (auth)/          # Login and registration flows
│   ├── (portal)/        # Authenticated dashboards (portal, admin)
│   │   └── portal/      # User portal (profile, payment, payment callback)
│   └── (ui)/            # Public-facing pages (about, contact, donate, news, resources, register)
├── components/          # Shared UI components
├── context/             # React context providers
├── lib/                 # Utilities and API helpers
└── styles/              # Global styles
```

## Getting Started

Install dependencies:

```bash
npm install
```

Copy the environment file and fill in values:

```bash
cp .env.local.example .env.local
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_API_URL` | Base URL of the UPIA backend API |

> **Note:** `NEXT_PUBLIC_*` variables are baked in at build time. Update `.env.local` and redeploy when changing the API URL.

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |

## Deployment (Azure App Service)

The app deploys automatically via GitHub Actions on push to the main branch.

- **App name:** `upiafrontend`
- **Resource group:** `upia`
- **Region:** Canada Central
- **Runtime:** Node 24 LTS
- **Startup command:** `node_modules/.bin/next start`

To restart the app manually:

```bash
az webapp restart --name upiafrontend --resource-group upia
```

To update environment variables:

```bash
az webapp config appsettings set --name upiafrontend --resource-group upia \
  --settings NEXT_PUBLIC_API_URL=<your-backend-url>
```
