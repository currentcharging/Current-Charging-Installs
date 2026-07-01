{
  "name": "current-charging-site",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "lucide-react": "^0.383.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.1",
    "autoprefixer": "^10.4.19",
    "postcss": "^8.4.38",
    "tailwindcss": "^3.4.3",
    "vite": "^5.2.0"
  }
}

export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};

<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Current Charging | Michigan's EV Charging Specialists</title>
    <meta
      name="description"
      content="Professional home EV charger installation across Michigan. Get a firm quote from 5 photos — no site visit needed."
    />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>

# Current Charging — Landing Page

This is a ready-to-deploy React + Tailwind project for the Current Charging landing page.

## How to put this live (no coding needed)

1. Upload this entire folder to a new GitHub repository (drag and drop all files/folders).
2. Go to vercel.com, sign in, click **"Add New Project"**, and import that GitHub repo.
3. Leave all settings as default and click **Deploy**. Vercel automatically detects
   this is a Vite project and builds it correctly.
4. Once deployed, click **"Add Domain"** in the Vercel project settings and enter your
   GoDaddy domain. Vercel will show you 1-2 DNS records to add.
5. In GoDaddy, go to your domain's **DNS settings** and add those exact records.

That's it — your domain will point to the live site within a few minutes to an hour.

## If you want to preview it on your own computer first

Requires Node.js installed (nodejs.org).

```
npm install
npm run dev
```

Then open the local address it prints in your browser.

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
};

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
});
