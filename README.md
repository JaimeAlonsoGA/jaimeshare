# Share hub

Minimal share packs for music and pro links.

**Live:** https://jamx.web.app

## Packs

| Path | Content |
|------|---------|
| `/` | Hub |
| `/music` | Artists → streaming (`?a=jaime2000` deep link) + **Share** (9:16 story card) |
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

## Share (music)

Each artist’s streaming menu ends with **Share**:
1. Builds a 1080×1920 Instagram-story PNG (cover + name + `jamx.web.app/music?a=<id>`).
2. Uses the Web Share API when available (image + URL).
3. Falls back to PNG download + copies the deep link.
4. Right-click / Alt-click copies the link only.
