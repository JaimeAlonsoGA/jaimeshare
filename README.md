# Share hub

Minimal share packs for music and pro links.

**Live:** https://jamx.web.app

## Packs

| Path | Content |
|------|---------|
| `/` | Hub |
| `/music` | Artists → streaming (`?a=jaime2000` deep link) |
| `/me` | Pro links (portfolio, LinkedIn, GitHub, email) |

Stub packs (`/files`, `/photos`) are registered but hidden from the hub until they have items.

## Icons & images

Official brand PNGs live in `img/icons/`; artist covers in `img/`.

If binaries are missing locally, either:

```bash
./scripts/fetch-assets.sh
```

or run the **Materialize assets** GitHub Action (`.github/workflows/materialize-assets.yml`), which pulls from https://jamx.web.app and commits them to `main`.

## Deploy

```bash
firebase deploy --only hosting --project jaime360
```

Hosting site: `jamx` → https://jamx.web.app
