/** Share formats: cover square, cover story, tracklist — no URL on art. */

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.decoding = "async";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load ${src}`));
    img.src = src;
  });
}

function roundRect(ctx, x, y, w, h, r) {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
}

function coverFit(ctx, img, x, y, w, h) {
  const iw = img.naturalWidth || img.width;
  const ih = img.naturalHeight || img.height;
  const scale = Math.max(w / iw, h / ih);
  const dw = iw * scale;
  const dh = ih * scale;
  ctx.drawImage(img, x + (w - dw) / 2, y + (h - dh) / 2, dw, dh);
}

function coverContain(ctx, img, x, y, size, radius = 0) {
  ctx.save();
  if (radius > 0) {
    roundRect(ctx, x, y, size, size, radius);
    ctx.clip();
  }
  coverFit(ctx, img, x, y, size, size);
  ctx.restore();
}

function sampleTint(img) {
  const c = document.createElement("canvas");
  c.width = c.height = 8;
  const x = c.getContext("2d", { willReadFrequently: true });
  x.drawImage(img, 0, 0, 8, 8);
  const data = x.getImageData(0, 0, 8, 8).data;
  let r = 0, g = 0, b = 0, n = 0;
  for (let i = 0; i < data.length; i += 4) {
    r += data[i];
    g += data[i + 1];
    b += data[i + 2];
    n += 1;
  }
  return { r: Math.round(r / n), g: Math.round(g / n), b: Math.round(b / n) };
}

function toBlob(canvas) {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("toBlob failed"))),
      "image/png"
    );
  });
}

/** Cover only — Instagram square / feed. */
async function buildCoverSquare(artist) {
  const cover = await loadImage(artist.image);
  const S = 1080;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = S;
  const ctx = canvas.getContext("2d");
  coverFit(ctx, cover, 0, 0, S, S);
  return { blob: await toBlob(canvas), filename: `${artist.id}-cover.png` };
}

/** Cover only — full-bleed story with soft blur backdrop. No text. */
async function buildCoverStory(artist) {
  const cover = await loadImage(artist.image);
  const W = 1080;
  const H = 1920;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");

  // Blurred fill
  ctx.save();
  ctx.filter = "blur(48px) brightness(0.45)";
  coverFit(ctx, cover, -80, -80, W + 160, H + 160);
  ctx.restore();

  // Full-bleed cover centered (edge-to-edge width)
  const size = W;
  const y = (H - size) / 2;
  coverFit(ctx, cover, 0, y, size, size);

  return { blob: await toBlob(canvas), filename: `${artist.id}-story.png` };
}

/**
 * Tracklist card, or elegant cover + name if no tracks.
 * Minimal, striking — no URL.
 */
async function buildTracklist(artist) {
  const cover = await loadImage(artist.image);
  const tint = sampleTint(cover);
  const tracks = Array.isArray(artist.tracks) ? artist.tracks.filter(Boolean) : [];
  const W = 1080;
  const H = tracks.length ? 1920 : 1350;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");

  // Backdrop
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, `rgb(${Math.round(tint.r * 0.22)}, ${Math.round(tint.g * 0.22)}, ${Math.round(tint.b * 0.26)})`);
  bg.addColorStop(0.5, "#0a0a0a");
  bg.addColorStop(1, "#050505");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  if (!tracks.length) {
    // Elegant cover + name only
    const glow = ctx.createRadialGradient(W / 2, H * 0.42, 20, W / 2, H * 0.42, 480);
    glow.addColorStop(0, `rgba(${tint.r}, ${tint.g}, ${tint.b}, 0.4)`);
    glow.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, W, H);

    const size = 720;
    const x = (W - size) / 2;
    const y = (H - size) / 2 - 60;
    ctx.save();
    ctx.shadowColor = "rgba(0,0,0,0.55)";
    ctx.shadowBlur = 50;
    ctx.shadowOffsetY = 24;
    coverContain(ctx, cover, x, y, size, 40);
    ctx.restore();

    ctx.fillStyle = "#f5f5f5";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.font = "700 64px Inter, system-ui, -apple-system, sans-serif";
    ctx.fillText(artist.name, W / 2, y + size + 56);

    return { blob: await toBlob(canvas), filename: `${artist.id}-card.png` };
  }

  // Compact cover + name header
  const coverSize = 280;
  const pad = 88;
  const coverX = pad;
  const coverY = pad + 40;

  const glow = ctx.createRadialGradient(
    coverX + coverSize / 2,
    coverY + coverSize / 2,
    10,
    coverX + coverSize / 2,
    coverY + coverSize / 2,
    340
  );
  glow.addColorStop(0, `rgba(${tint.r}, ${tint.g}, ${tint.b}, 0.35)`);
  glow.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, W, 520);

  ctx.save();
  ctx.shadowColor = "rgba(0,0,0,0.5)";
  ctx.shadowBlur = 36;
  ctx.shadowOffsetY = 16;
  coverContain(ctx, cover, coverX, coverY, coverSize, 28);
  ctx.restore();

  const textX = coverX + coverSize + 48;
  const textMax = W - textX - pad;
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.fillStyle = "#f5f5f5";
  ctx.font = "700 52px Inter, system-ui, -apple-system, sans-serif";
  wrapText(ctx, artist.name, textX, coverY + 48, textMax, 60, 2);

  if (artist.album) {
    ctx.fillStyle = "rgba(245,245,245,0.5)";
    ctx.font = "600 30px Inter, system-ui, -apple-system, sans-serif";
    ctx.fillText(artist.album, textX, coverY + 180);
  }

  // Accent line
  ctx.fillStyle = `rgb(${tint.r}, ${tint.g}, ${tint.b})`;
  roundRect(ctx, pad, coverY + coverSize + 72, 64, 6, 3);
  ctx.fill();

  // Tracks
  let ty = coverY + coverSize + 120;
  const maxTracks = Math.min(tracks.length, 12);
  const lineH = Math.min(88, Math.floor((H - ty - pad) / maxTracks));

  for (let i = 0; i < maxTracks; i++) {
    const num = String(i + 1).padStart(2, "0");
    ctx.fillStyle = "rgba(245,245,245,0.35)";
    ctx.font = "600 28px Inter, system-ui, -apple-system, sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(num, pad, ty);

    ctx.fillStyle = "#f5f5f5";
    ctx.font = "600 34px Inter, system-ui, -apple-system, sans-serif";
    const title = truncate(ctx, tracks[i], W - pad * 2 - 80);
    ctx.fillText(title, pad + 80, ty);

    ty += lineH;
  }

  return { blob: await toBlob(canvas), filename: `${artist.id}-tracks.png` };
}

function truncate(ctx, text, maxW) {
  if (ctx.measureText(text).width <= maxW) return text;
  let t = text;
  while (t.length > 1 && ctx.measureText(t + "…").width > maxW) t = t.slice(0, -1);
  return t + "…";
}

function wrapText(ctx, text, x, y, maxW, lineH, maxLines) {
  const words = text.split(/\s+/);
  let line = "";
  let lines = 0;
  for (let i = 0; i < words.length; i++) {
    const test = line ? `${line} ${words[i]}` : words[i];
    if (ctx.measureText(test).width > maxW && line) {
      ctx.fillText(line, x, y + lines * lineH);
      lines += 1;
      line = words[i];
      if (lines >= maxLines - 1) {
        const rest = [line, ...words.slice(i + 1)].join(" ");
        ctx.fillText(truncate(ctx, rest, maxW), x, y + lines * lineH);
        return;
      }
    } else {
      line = test;
    }
  }
  if (line) ctx.fillText(line, x, y + lines * lineH);
}

const FORMATS = [
  {
    id: "square",
    label: "Cover",
    hint: "1:1 photo",
    build: buildCoverSquare,
  },
  {
    id: "story",
    label: "Story",
    hint: "9:16 photo",
    build: buildCoverStory,
  },
  {
    id: "tracks",
    label: "Tracklist",
    hint: "songs card",
    build: buildTracklist,
  },
];

function downloadBlob(blob, filename) {
  const href = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = href;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(href), 4000);
}

function toast(message) {
  let el = document.querySelector(".toast");
  if (!el) {
    el = document.createElement("div");
    el.className = "toast";
    el.setAttribute("role", "status");
    document.body.appendChild(el);
  }
  el.textContent = message;
  el.classList.add("show");
  clearTimeout(toast._t);
  toast._t = setTimeout(() => el.classList.remove("show"), 2200);
}

function closePicker() {
  document.querySelector(".share-sheet")?.remove();
  document.querySelector(".share-backdrop")?.remove();
}

async function exportFormat(artist, format) {
  const { blob, filename } = await format.build(artist);
  const file = new File([blob], filename, { type: "image/png" });
  const title = artist.name;

  if (navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ files: [file], title });
      toast("Shared");
      return;
    } catch (err) {
      if (err?.name === "AbortError") return;
    }
  } else if (navigator.share) {
    try {
      await navigator.share({ title, text: artist.name });
      downloadBlob(blob, filename);
      toast("Image saved");
      return;
    } catch (err) {
      if (err?.name === "AbortError") return;
    }
  }

  downloadBlob(blob, filename);
  toast("Image saved");
}

/**
 * Open format picker, then share / download the chosen PNG.
 * @param {{ id: string, name: string, image: string, tracks?: string[], album?: string }} artist
 */
export async function shareArtist(artist) {
  closePicker();

  const backdrop = document.createElement("div");
  backdrop.className = "share-backdrop";
  backdrop.addEventListener("click", closePicker);

  const sheet = document.createElement("div");
  sheet.className = "share-sheet";
  sheet.setAttribute("role", "dialog");
  sheet.setAttribute("aria-label", "Share format");
  sheet.innerHTML = `
    <header class="share-sheet-head">
      <p class="share-sheet-title">Share</p>
      <button type="button" class="share-sheet-close" aria-label="Close">×</button>
    </header>
    <ul class="share-formats">
      ${FORMATS.map(
        (f) => `
        <li>
          <button type="button" class="share-format" data-format="${f.id}">
            <span class="share-format-preview" data-preview="${f.id}" aria-hidden="true"></span>
            <span class="share-format-meta">
              <span class="share-format-label">${f.label}</span>
              <span class="share-format-hint">${f.hint}</span>
            </span>
          </button>
        </li>`
      ).join("")}
    </ul>`;

  document.body.append(backdrop, sheet);
  sheet.querySelector(".share-sheet-close").addEventListener("click", closePicker);

  // Tiny live previews from cover
  try {
    const cover = await loadImage(artist.image);
    sheet.querySelectorAll("[data-preview]").forEach((el) => {
      const id = el.getAttribute("data-preview");
      const c = document.createElement("canvas");
      if (id === "square") {
        c.width = c.height = 96;
        coverFit(c.getContext("2d"), cover, 0, 0, 96, 96);
        el.classList.add("is-square");
      } else if (id === "story") {
        c.width = 54;
        c.height = 96;
        const ctx = c.getContext("2d");
        ctx.filter = "blur(4px) brightness(0.5)";
        coverFit(ctx, cover, -10, -10, 74, 116);
        ctx.filter = "none";
        const size = 54;
        coverFit(ctx, cover, 0, (96 - size) / 2, size, size);
        el.classList.add("is-story");
      } else {
        c.width = 72;
        c.height = 96;
        const ctx = c.getContext("2d");
        const tint = sampleTint(cover);
        ctx.fillStyle = `rgb(${Math.round(tint.r * 0.2)}, ${Math.round(tint.g * 0.2)}, ${Math.round(tint.b * 0.24)})`;
        ctx.fillRect(0, 0, 72, 96);
        coverContain(ctx, cover, 10, 10, 28, 4);
        ctx.fillStyle = "rgba(245,245,245,0.85)";
        for (let i = 0; i < 5; i++) {
          ctx.fillRect(10, 48 + i * 7, 40 - (i % 3) * 6, 2.5);
        }
        el.classList.add("is-tracks");
      }
      el.appendChild(c);
    });
  } catch {
    /* previews optional */
  }

  sheet.querySelectorAll("[data-format]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.getAttribute("data-format");
      const format = FORMATS.find((f) => f.id === id);
      if (!format) return;
      btn.setAttribute("aria-busy", "true");
      sheet.querySelectorAll("[data-format]").forEach((b) => {
        if (b !== btn) b.disabled = true;
      });
      try {
        await exportFormat(artist, format);
        closePicker();
      } catch (err) {
        console.error(err);
        toast("Share failed");
        btn.removeAttribute("aria-busy");
        sheet.querySelectorAll("[data-format]").forEach((b) => {
          b.disabled = false;
        });
      }
    });
  });
}

/** @deprecated kept for alt-click handlers — no-op toast */
export async function copyArtistLink() {
  toast("Pick a format from Share");
}
