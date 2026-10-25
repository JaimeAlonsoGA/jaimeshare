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

## Icons

Official brand PNGs live in `img/icons/`. Keep binaries in git so other agents can maintain the hub.

## Deploy

```bash
firebase deploy --only hosting --project jaime360
```

Hosting site: `jamx` → https://jamx.web.app
