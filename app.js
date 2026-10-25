import { packs, getPack } from "./packs/index.js";

const PLATFORMS = [
  { key: "tidal", label: "TIDAL", icon: "tidal" },
  { key: "spotify", label: "Spotify", icon: "spotify" },
  { key: "apple", label: "Apple Music", icon: "apple-music" },
  { key: "youtube", label: "YouTube Music", icon: "youtube-music" },
  { key: "amazon", label: "Amazon Music", icon: "amazon-music" },
  { key: "deezer", label: "Deezer", icon: "deezer" },
];

function iconSrc(name) {
  return `/img/icons/${name}.png`;
}

function iconImg(name, alt = "") {
  return `<img class="icon-img" src="${esc(iconSrc(name))}" alt="${esc(alt)}" width="32" height="32" loading="lazy" decoding="async" />`;
}

function esc(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function packPath() {
  const raw = location.pathname.replace(/\/+$/, "") || "/";
  if (raw === "/" || raw === "/index.html") return null;
  return raw.replace(/^\//, "").split("/")[0].toLowerCase();
}

/** Deep-link filter via ?a= — no UI chips. */
function parseArtistFilter(pack) {
  const allIds = pack.items.map((i) => i.id);
  const params = new URLSearchParams(location.search);
  const keys = [pack.filterParam || "a", ...(pack.filterAliases || [])];
  let raw = "all";
  for (const key of keys) {
    const v = params.get(key);
    if (v != null && v !== "") {
      raw = v;
      break;
    }
  }
  if (!raw || raw.toLowerCase() === "all") return [...allIds];
  const wanted = raw
    .split(/[|,]/)
    .map((s) => s.trim().toLowerCase().replace(/^jaime-2000$/, "jaime2000"))
    .filter(Boolean);
  const picked = allIds.filter((id) => wanted.includes(id));
  return picked.length ? picked : [...allIds];
}

function platformRows(artist) {
  return PLATFORMS.map((platform) => {
    const href = artist.links[platform.key];
    if (!href) return "";
    return `
      <li>
        <a href="${esc(href)}" target="_blank" rel="noopener noreferrer">
          ${iconImg(platform.icon, platform.label)}
          <span class="name">${esc(platform.label)}</span>
        </a>
      </li>`;
  }).join("");
}

function artistCard(artist) {
  return `
    <article class="card" id="${esc(artist.id)}">
      <div class="cover">
        <img src="${esc(artist.image)}" alt="${esc(artist.name)}" width="800" height="800" />
      </div>
      <h1 class="artist-name">${esc(artist.name)}</h1>
      <ul class="list">${platformRows(artist)}</ul>
    </article>`;
}

function linkRows(items) {
  if (!items.length) return "";
  return `
    <ul class="list">
      ${items
        .map((item) => {
          const external = item.href.startsWith("http") || item.href.startsWith("mailto:");
          const attrs = external ? ' target="_blank" rel="noopener noreferrer"' : "";
          return `
            <li>
              <a href="${esc(item.href)}"${attrs}>
                ${iconImg(item.icon, item.label)}
                <span class="name">${esc(item.label)}</span>
              </a>
            </li>`;
        })
        .join("")}
    </ul>`;
}

function emptyState(message) {
  return `<p class="empty">${esc(message || "…")}</p>`;
}

function visibleHubPacks() {
  return packs.filter((p) => {
    if (p.kind === "artists") return p.items?.length;
    if (p.kind === "links") return p.items?.length;
    return false; // hide empty stubs from hub
  });
}

function renderHub() {
  document.title = "Share";
  const view = document.querySelector("#view");
  view.innerHTML = `
    <ul class="list hub">
      ${visibleHubPacks()
        .map(
          (pack) => `
            <li>
              <a href="/${esc(pack.id)}">
                ${iconImg(pack.icon || "pack-pro", pack.title)}
                <span class="name">${esc(pack.title)}</span>
              </a>
            </li>`
        )
        .join("")}
    </ul>`;
}

function renderArtists(pack) {
  const selected = parseArtistFilter(pack);
  const artists = pack.items.filter((a) => selected.includes(a.id));
  document.title =
    artists.length === 1
      ? artists[0].name
      : artists.length === pack.items.length
        ? pack.title
        : artists.map((a) => a.name).join(" · ");

  const view = document.querySelector("#view");
  if (!artists.length) {
    view.innerHTML = emptyState("Nothing here.");
    return;
  }
  view.innerHTML = `<div class="stack">${artists.map(artistCard).join("")}</div>`;
}

function renderLinks(pack) {
  document.title = pack.title;
  const view = document.querySelector("#view");
  view.innerHTML = pack.items.length
    ? linkRows(pack.items)
    : emptyState(pack.empty || "Coming soon.");
}

function renderStub(pack) {
  document.title = pack.title;
  document.querySelector("#view").innerHTML = emptyState(pack.empty || "Coming soon.");
}

function render() {
  const id = packPath();
  if (!id) {
    renderHub();
    return;
  }
  const pack = getPack(id);
  if (!pack) {
    document.title = "404";
    document.querySelector("#view").innerHTML = emptyState("Not found.");
    return;
  }
  if (pack.kind === "artists") renderArtists(pack);
  else if (pack.kind === "links") renderLinks(pack);
  else renderStub(pack);
}

window.addEventListener("popstate", render);
render();
