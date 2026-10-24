# JaimeShare

Hub compartible de Jaime Alonso. Un URL por pack; packs aislados (sin nav al home).

Live: https://jam.web.app

## Packs

| Path | Qué |
|------|-----|
| `/music` | Artistas + plataformas de streaming |
| `/me` | Portfolio, LinkedIn, GitHub, email |
| `/projects` | Proyectos públicos |
| `/files` | Stub (próximamente) |
| `/photos` | Stub (próximamente) |

`/` es un picker mínimo para Jaime. Los links que compartas deben ser paths de pack.

## Params (music)

- Default: todos → `https://jam.web.app/music`
- Uno: `?a=jaime2000`
- Combo: `?a=jaime2000,spirithz`
- Aliases: `artists` / `artist`; separadores `,` o `|`

## Añadir un pack

Crea `packs/<id>.js` exportando `{ id, title, description, kind, items }`, impórtalo en `packs/index.js` y listo.

## Deploy

Firebase Hosting (primary): `firebase deploy --only hosting`
