# Deployment

Hosted on Vercel: https://maya-one-mu.vercel.app

## Required environment variables

The app renders, but **every product list, cart and order will fail until these
are set**. Both are server-only and must NOT be prefixed with `NEXT_PUBLIC_` —
that prefix inlines a value into the browser bundle, which would publish the API
key to every visitor.

| Variable | Value | Notes |
| --- | --- | --- |
| `MAYA_API_KEY` | *(your backend API key)* | Sent as the `x-apiKey` header. Required. |
| `MAYA_API_BASE_URL` | `https://ecommerce-backend-9tly.onrender.com` | Optional; this is the built-in default. |

### Setting them in Vercel

Project → Settings → Environment Variables → add each for **Production,
Preview and Development**, then **redeploy** — Vercel only injects env vars at
build/run time, so an existing deployment will not pick them up on its own.

### Locally

Create `.env.local` (gitignored) with the same two keys, then `npm run dev`.

## Verifying it worked

```bash
# Should return product JSON, not the "MAYA_API_KEY is not configured" error
curl https://maya-one-mu.vercel.app/api/maya/api/products
```

Then confirm in the browser, with devtools open:

1. `/products` lists real products.
2. Every XHR goes to `/api/maya/*` — **no request to onrender.com**, and no
   `x-apiKey` header visible anywhere in the Network tab.
3. Register → add to cart → checkout → the order appears under `/orders`.

## Two known unknowns

**Product visibility.** The API docs mark `GET /api/products` as requiring a
bearer token. The proxy attaches one only when a session cookie exists, so the
shop is public if the backend allows it and shows a "sign in to browse" state if
it does not. Whichever way it lands, the page behaves sensibly — but check which
you get, because it determines whether anonymous visitors can browse.

**Registration `roleId`.** The docs never publish the customer vs farmer role
ids, so registration omits the field and the backend applies its default. A
"Sell my produce" signup therefore may not actually come back as a partner, and
that account would be bounced from `/farmer/*`. Fix by reading the real ids off
a signup response and setting them in
[`src/services/constants.js`](src/services/constants.js).

## Architecture note

The browser never talks to the backend directly:

```
Browser ──▶ /api/maya/*  ──▶  Render backend
              │ injects x-apiKey (server env)
              │ injects Authorization: Bearer (httpOnly cookie)
              └ retries 502/503 cold starts up to 3×
```

The Render free tier sleeps after inactivity, so the first request after a quiet
period can take the better part of a minute. The retry in
[`src/services/serverApi.js`](src/services/serverApi.js) covers it; server-side
rendering degrades to an empty page with a client retry rather than a 500.

`/api/auth/*` deliberately bypasses the proxy — it is the only place the backend
`accessToken` is handled, and it goes straight into an httpOnly cookie rather
than being returned to the browser.
