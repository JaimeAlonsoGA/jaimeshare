/** Story card (9:16) + Web Share / download / copy-link helpers. */

const W = 1080;
const H = 1920;

function shareUrl(artistId) {
  const u = new URL("/music", location.origin);
  u.searchParams.set("a", artistId);
  return u.toString();
}

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

function drawCover(ctx, img, x, y, size, radius) {
  ctx.save();
  roundRect(ctx, x, y, size, size, radius);
  ctx.clip();
  const iw = img.naturalWidth || img.width;
  const ih = img.naturalHeight || img.height;
  const scale = Math.max(size / iw, size / ih);
  const dw = iw * scale;
  const dh = ih * scale;
  ctx.drawImage(img, x + (size - dw) / 2, y + (size - dh) / 2, dw, dh);
  ctx.restore();
}

/** Average a few cover pixels for a tinted backdrop. */
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

/**
 * Build a 1080×1920 Instagram-story card.
 * @param {{ id: string, name: string, image: string }} artist
 * @returns {Promise<{ blob: Blob, url: string, filename: string }>}
 */
export async function buildStoryCard(artist) {
  const url = shareUrl(artist.id);
  const cover = await loadImage(artist.image);
  const tint = sampleTint(cover);

  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");

  // Backdrop: deep black → tinted vignette
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, `rgb(${Math.round(tint.r * 0.18)}, ${Math.round(tint.g * 0.18)}, ${Math.round(tint.b * 0.22)})`);
  bg.addColorStop(0.45, "#0a0a0a");
  bg.addColorStop(1, "#050505");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // Soft glow behind cover
  const glow = ctx.createRadialGradient(W / 2, 720, 40, W / 2, 720, 520);
  glow.addColorStop(0, `rgba(${tint.r}, ${tint.g}, ${tint.b}, 0.45)`);
  glow.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 200, W, 1000);

  // Cover
  const coverSize = 720;
  const coverX = (W - coverSize) / 2;
  const coverY = 380;
  ctx.save();
  ctx.shadowColor = "rgba(0,0,0,0.55)";
  ctx.shadowBlur = 60;
  ctx.shadowOffsetY = 28;
  drawCover(ctx, cover, coverX, coverY, coverSize, 48);
  ctx.restore();

  // Artist name
  ctx.fillStyle = "#f5f5f5";
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  ctx.font = "700 72px Inter, system-ui, -apple-system, sans-serif";
  ctx.fillText(artist.name, W / 2, coverY + coverSize + 72);

  // Deep link
  ctx.fillStyle = "rgba(245,245,245,0.55)";
  ctx.font = "600 36px Inter, system-ui, -apple-system, sans-serif";
  const pretty = url.replace(/^https?:\/\//, "");
  ctx.fillText(pretty, W / 2, coverY + coverSize + 168);

  // Thin accent bar
  ctx.fillStyle = `rgb(${tint.r}, ${tint.g}, ${tint.b})`;
  roundRect(ctx, W / 2 - 48, coverY + coverSize + 248, 96, 8, 4);
  ctx.fill();

  // Footer mark
  ctx.fillStyle = "rgba(245,245,245,0.28)";
  ctx.font = "600 28px Inter, system-ui, -apple-system, sans-serif";
  ctx.fillText("jamx.web.app", W / 2, H - 120);

  const blob = await new Promise((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("toBlob failed"))),
      "image/png"
    );
  });

  return {
    blob,
    url,
    filename: `${artist.id}-story.png`,
  };
}

export async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand("copy");
      ta.remove();
      return ok;
    } catch {
      return false;
    }
  }
}

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

/**
 * Primary share: Web Share with PNG + URL; fallback download + copy link.
 * @param {{ id: string, name: string, image: string }} artist
 */
export async function shareArtist(artist) {
  const btn = document.querySelector(`[data-share="${CSS.escape(artist.id)}"]`);
  if (btn) btn.setAttribute("aria-busy", "true");
  try {
    const { blob, url, filename } = await buildStoryCard(artist);
    const file = new File([blob], filename, { type: "image/png" });
    const title = artist.name;
    const text = `${artist.name} — ${url}`;

    if (navigator.canShare?.({ files: [file] })) {
      try {
        await navigator.share({ files: [file], title, text, url });
        toast("Shared");
        return;
      } catch (err) {
        if (err?.name === "AbortError") return;
        // fall through
      }
    } else if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
        // Still offer the image as download for Stories upload
        downloadBlob(blob, filename);
        toast("Link shared · image saved");
        return;
      } catch (err) {
        if (err?.name === "AbortError") return;
      }
    }

    downloadBlob(blob, filename);
    const copied = await copyText(url);
    toast(copied ? "Image saved · link copied" : "Image saved");
  } catch (err) {
    console.error(err);
    const url = shareUrl(artist.id);
    const copied = await copyText(url);
    toast(copied ? "Link copied" : "Share failed");
  } finally {
    if (btn) btn.removeAttribute("aria-busy");
  }
}

/** Secondary: copy deep link only. */
export async function copyArtistLink(artist) {
  const url = shareUrl(artist.id);
  const ok = await copyText(url);
  toast(ok ? "Link copied" : "Could not copy");
}
