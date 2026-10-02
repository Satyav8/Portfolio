# satyaprabhas.dev

Portfolio for BVS Satya Prabhas, Voice AI Engineer. React + TypeScript + Vite, Three.js, GSAP, Lenis.

Live site: https://satyaprabhas.dev

## Run locally

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production build into dist/
```

## Where to edit content

| What | File |
|---|---|
| Name, links, hero stats, projects, experience, events, skills | `src/data.ts` |
| Project case studies (problem / how it works / result) | `src/studies.ts` |
| Colours | CSS variables at the top of `src/styles.css` |
| Photos and videos | `public/assets/` |
| Page title, description, share image | `index.html`, `public/og.jpg` |

Original, uncompressed videos are in `_orig/` (not deployed, not committed).

## Deploy to Render (static site) and satyaprabhas.dev

1. Push this folder to a GitHub repo (private is fine).
2. On render.com choose **New -> Blueprint** (or **New -> Static Site**) and pick the repo.
   `render.yaml` already sets the build (`npm ci && npm run build`), publish dir (`dist`), Node 20 and headers.
3. Wait for the first deploy, then open the `*.onrender.com` URL to check it.
4. Custom domain: Render service -> **Settings -> Custom Domains** -> add `satyaprabhas.dev` and `www.satyaprabhas.dev`.
5. In GoDaddy (**My Products -> satyaprabhas.dev -> DNS**) delete the default parked A/CNAME records, then add the records Render shows. Typically:

   | Type | Name | Value |
   |---|---|---|
   | A | `@` | `216.24.57.1` |
   | CNAME | `www` | `<your-service>.onrender.com` |

6. Back in Render click **Verify**. HTTPS is issued automatically (`.dev` domains require HTTPS).

After it is live, check the link preview with the LinkedIn Post Inspector.
