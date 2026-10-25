#!/usr/bin/env bash
# Fetch img binaries from live jamx.web.app into this repo.
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p img/icons
BASE=https://jamx.web.app
for f in amazon-music.png apple-music.png deezer.png github.png gmail.png linkedin.png \
         pack-files.png pack-music.png pack-photos.png pack-pro.png portfolio.png \
         spotify.png tidal.png youtube-music.png; do
  curl -fsSL "$BASE/img/icons/$f" -o "img/icons/$f"
done
for f in cover-2000-jaimes.jpg cover-aura.jpg cover-criaturas.jpg cover-depths.jpg \
         cover-mefui.jpg cover-neo.jpg cover-tavern.jpg jaime-2000.jpg spirithz.jpg; do
  curl -fsSL "$BASE/img/$f" -o "img/$f"
done
rm -f img/icons/_tiny-test.png
echo "Assets fetched into img/"
