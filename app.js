import { packs, getPack } from "./packs/index.js";

const PLATFORMS = [
  { key: "tidal", label: "TIDAL" },
  { key: "spotify", label: "Spotify" },
  { key: "apple", label: "Apple Music" },
  { key: "youtube", label: "YouTube Music" },
  { key: "amazon", label: "Amazon Music" },
  { key: "deezer", label: "Deezer" },
];

const ICONS = {
  tidal: `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M4.8 8.4 7.6 11.2 4.8 14 2 11.2zm4.8-4.8L12.4 6.4 9.6 9.2 6.8 6.4zm0 9.6L12.4 16 9.6 18.8 6.8 16zm4.8-4.8L17.2 11.2 14.4 14 11.6 11.2zm4.8-4.8L22 8.8 19.2 11.6 16.4 8.8z"/></svg>`,
  spotify: `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10" fill="#1DB954"/><path d="M7.4 10.3c3.5-1.05 7.2-.75 10.4.85M7.8 13.2c2.7-.75 5.6-.55 8.1.65M8.3 15.9c2-.5 4.1-.35 5.9.5" fill="none" stroke="#0a0a0a" stroke-width="1.6" stroke-linecap="round"/></svg>`,
  apple: `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10" fill="#FC3C44"/><path fill="#fff" d="M14.2 8.2c-.55.65-.9 1.5-.8 2.4.95.05 1.9-.45 2.5-1.15.55-.65.9-1.5.8-2.4-.95 0-1.9.5-2.5 1.15zm1.35 3.35c-.95.05-1.75.55-2.25.55s-1.35-.55-2.3-.5c-1.2.05-2.3.7-2.9 1.8-1.25 2.15-.3 5.35.85 7.1.55.85 1.25 1.8 2.15 1.75.85-.05 1.2-.55 2.25-.55s1.35.55 2.25.5c.95-.05 1.55-.85 2.1-1.7.65-.95.9-1.85.9-1.9-.05 0-1.8-.7-1.85-2.85-.05-1.8 1.45-2.65 1.5-2.7-.85-1.25-2.15-1.4-2.7-1.45z"/></svg>`,
  youtube: `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10" fill="#FF0033"/><path fill="#fff" d="M10 8.8v6.4l5.2-3.2z"/></svg>`,
  amazon: `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10" fill="#25D1DA"/><path fill="#0a0a0a" d="M7.2 13.6c1.9 1.35 4.55 2.05 7.05 2.05 1.55 0 3.2-.3 4.55-.9-.05.15-.05.3-.1.45-.55 1.35-1.85 2.2-3.35 2.2H8.85c-1.55 0-2.85-.9-3.35-2.25-.15-.4-.2-.8-.2-1.2 0-.1 0-.2.05-.3.55.35 1.2.65 1.85.95zm9.55-6.05c0-1.15-.85-1.8-2.3-1.8H9.7c-.35 0-.55.2-.55.5v7.05c0 .3.2.5.55.5h.85c.3 0 .5-.2.5-.5v-2h2.85c1.85 0 3.05-1.05 3.05-2.6 0-1-.5-1.7-1.3-2.05.7-.4 1.1-1.05 1.1-1.9zM12.05 11h-2v-1.85h2c.85 0 1.3.35 1.3.95S12.9 11 12.05 11zm.2-3.55h-2.2V5.85h2.05c.75 0 1.2.3 1.2.85s-.45.85-1.05.85z"/></svg>`,
  deezer: `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10" fill="#A238FF"/><g fill="#fff"><rect x="5.5" y="13.2" width="1.8" height="3.3" rx=".3"/><rect x="8.1" y="10.8" width="1.8" height="5.7" rx=".3"/><rect x="10.7" y="8.2" width="1.8" height="8.3" rx=".3"/><rect x="13.3" y="10.1" width="1.8" height="6.4" rx=".3"/><rect x="15.9" y="11.5" width="1.8" height="5" rx=".3"/></g></svg>`,
  chev: `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" d="M9 6l6 6-6 6"/></svg>`,
  globe: `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M3 12h18M12 3c2.5 2.8 3.8 5.8 3.8 9s-1.3 6.2-3.8 9c-2.5-2.8-3.8-5.8-3.8-9s1.3-6.2 3.8-9z" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>`,
  linkedin: `<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="3" fill="#0A66C2"/><path fill="#fff" d="M8.2 10.2H6.1v7.1h2.1zm-1-3.4a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4zM17.9 13.3c0-2.1-1.1-3.4-3.2-3.4-1.5 0-2.1.8-2.5 1.4v-1.2H10v7.1h2.1v-4c0-1 .2-2 1.5-2s1.3.9 1.3 2v4h2.1z"/></svg>`,
  github: `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2C6.5 2 2 6.6 2 12.2c0 4.5 2.9 8.3 6.9 9.6.5.1.7-.2.7-.5v-1.8c-2.8.6-3.4-1.4-3.4-1.4-.4-1.1-1.1-1.4-1.1-1.4-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.6 2.4 1.1 3 .9.1-.7.4-1.1.7-1.4-2.2-.3-4.6-1.2-4.6-5.1 0-1.1.4-2 1-2.7-.1-.3-.4-1.3.1-2.7 0 0 .8-.3 2.8 1 .8-.2 1.6-.3 2.4-.3s1.6.1 2.4.3c2-.1 2.8-1 2.8-1 .5 1.4.2 2.4.1 2.7.6.7 1 1.6 1 2.7 0 4-2.3 4.8-4.6 5.1.4.3.7.9.7 1.9v2.8c0 .3.2.6.7.5 4-1.3 6.9-5.1 6.9-9.6C22 6.6 17.5 2 12 2z"/></svg>`,
  mail: `<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2.5" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M4 7l8 6 8-6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`,
  box: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 8l8-4 8 4v8l-8 4-8-4V8z" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M4 8l8 4 8-4M12 12v8" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>`,
  keyboard: `<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2.5" y="6" width="19" height="12" rx="2" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M6 14h12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`,
  circuit: `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="6" cy="12" r="2" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="18" cy="6" r="2" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="18" cy="18" r="2" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M8 12h4m4-4v-2m0 12v-2m-4-4h4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`,
  code: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 8L4 12l4 4M16 8l4 4-4 4M13 6l-2 12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  flask: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 3h6M10 3v6l-5 9a2 2 0 001.7 3h10.6a2 2 0 001.7-3l-5-9V3" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  folder: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>`,
  image: `<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="9" cy="10" r="1.6" fill="currentColor"/><path d="M4.5 17l4.5-4.5 3 3 3.5-4.5 4.5 6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  pack: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M12 12l8-4.5M12 12v9M12 12L4 7.5" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>`,
};

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

function hrefForFilter(pack, ids) {
  const allIds = pack.items.map((i) => i.id);
  const url = new URL(location.href);
  url.search = "";
  const isAll =
    ids === "all" ||
    (Array.isArray(ids) && ids.length === allIds.length && allIds.every((id, i) => id === ids[i]));
  if (isAll) return `/${pack.id}`;
  const list = Array.isArray(ids) ? ids : [ids];
  url.pathname = `/${pack.id}`;
  url.searchParams.set(pack.filterParam || "a", list.length === 1 ? list[0] : list.join(","));
  return url.pathname + url.search;
}

function selectionEqual(a, b) {
  return a.length === b.length && a.every((v, i) => v === b[i]);
}

function topBar(brand) {
  return `
    <div class="top">
      <div class="brand">${esc(brand || "Jaime Alonso")}</div>
      <button type="button" class="copy-btn" data-copy>Copiar link</button>
    </div>`;
}

function platformRows(artist) {
  return PLATFORMS.map((platform) => {
    const href = artist.links[platform.key];
    if (!href) return "";
    return `
      <li>
        <a href="${esc(href)}" target="_blank" rel="noopener noreferrer">
          <span class="icon">${ICONS[platform.key]}</span>
          <span class="name">${esc(platform.label)}</span>
          <span class="chev">${ICONS.chev}</span>
        </a>
      </li>`;
  }).join("");
}

function artistCard(artist) {
  return `
    <article class="card" id="${esc(artist.id)}">
      <div class="cover"><img src="${esc(artist.image)}" alt="${esc(artist.name)}" width="800" height="800" /></div>
      <div class="meta">
        <h1>${esc(artist.name)}</h1>
        <p>Jaime Alonso</p>
        <div class="tag">${esc(artist.subtitle)}</div>
      </div>
      <ul class="platforms">${platformRows(artist)}</ul>
    </article>`;
}

function chipsNav(pack, selected) {
  if (!pack.chips?.length) return "";
  const allIds = pack.items.map((i) => i.id);
  return `
    <nav class="chips" aria-label="Filtro">
      ${pack.chips
        .map((chip) => {
          const ids = chip.ids === "all" ? [...allIds] : chip.ids;
          const current = selectionEqual(ids, selected);
          return `<a href="${hrefForFilter(pack, chip.ids)}" ${current ? 'aria-current="page"' : ""}>${esc(chip.label)}</a>`;
        })
        .join("")}
    </nav>`;
}

function linkRows(items) {
  if (!items.length) return "";
  return `
    <ul class="platforms">
      ${items
        .map((item) => {
          const icon = ICONS[item.icon] || ICONS.pack;
          const external = item.href.startsWith("http") || item.href.startsWith("mailto:");
          const attrs = external ? ' target="_blank" rel="noopener noreferrer"' : "";
          const sub = item.subtitle
            ? `<span class="sub">${esc(item.subtitle)}</span>`
            : "";
          return `
            <li>
              <a href="${esc(item.href)}"${attrs}>
                <span class="icon">${icon}</span>
                <span class="name-wrap">
                  <span class="name">${esc(item.label)}</span>
                  ${sub}
                </span>
                <span class="chev">${ICONS.chev}</span>
              </a>
            </li>`;
        })
        .join("")}
    </ul>`;
}

function emptyState(message) {
  return `<p class="empty">${esc(message || "Nada que mostrar.")}</p>`;
}

function renderHub() {
  document.title = "JaimeShare";
  const view = document.querySelector("#view");
  view.innerHTML = `
    <div class="top">
      <div class="brand">JaimeShare</div>
    </div>
    <div class="hub-intro">
      <h1>Compartir</h1>
      <p>Elige un pack. Los links que envíes deben ser la URL del pack (sin volver aquí).</p>
    </div>
    <ul class="platforms hub-list">
      ${packs
        .map((pack) => {
          const icon =
            pack.kind === "artists"
              ? ICONS.pack
              : pack.kind === "files"
                ? ICONS.folder
                : pack.kind === "photos"
                  ? ICONS.image
                  : ICONS.globe;
          return `
            <li>
              <a href="/${esc(pack.id)}">
                <span class="icon">${icon}</span>
                <span class="name-wrap">
                  <span class="name">${esc(pack.title)}</span>
                  <span class="sub">${esc(pack.description)}</span>
                </span>
                <span class="chev">${ICONS.chev}</span>
              </a>
            </li>`;
        })
        .join("")}
    </ul>`;
}

function renderArtists(pack) {
  const selected = parseArtistFilter(pack);
  const artists = pack.items.filter((a) => selected.includes(a.id));
  const title =
    artists.length === 1
      ? `${artists[0].name} — JaimeShare`
      : artists.length === pack.items.length
        ? `${pack.title} — JaimeShare`
        : `${artists.map((a) => a.name).join(" · ")} — JaimeShare`;
  document.title = title;
  document
    .querySelector('meta[name="description"]')
    ?.setAttribute(
      "content",
      artists.map((a) => a.name).join(", ") + " en las principales plataformas de streaming."
    );

  const view = document.querySelector("#view");
  if (!artists.length) {
    view.innerHTML = topBar(pack.brand) + emptyState("No hay artistas en este link.");
    return;
  }

  view.innerHTML = `
    ${topBar(pack.brand)}
    ${chipsNav(pack, selected)}
    <div class="stack">${artists.map(artistCard).join("")}</div>`;
}

function renderLinks(pack) {
  document.title = `${pack.title} — JaimeShare`;
  document
    .querySelector('meta[name="description"]')
    ?.setAttribute("content", pack.description || pack.title);

  const view = document.querySelector("#view");
  const headline = pack.headline
    ? `<div class="tag">${esc(pack.headline)}</div>`
    : "";
  view.innerHTML = `
    ${topBar(pack.brand)}
    <header class="pack-head">
      <h1>${esc(pack.title)}</h1>
      ${headline}
      ${pack.description ? `<p>${esc(pack.description)}</p>` : ""}
    </header>
    ${
      pack.items.length
        ? linkRows(pack.items)
        : emptyState(pack.empty || "Próximamente.")
    }`;
}

function renderStub(pack) {
  document.title = `${pack.title} — JaimeShare`;
  const view = document.querySelector("#view");
  view.innerHTML = `
    ${topBar(pack.brand)}
    <header class="pack-head">
      <h1>${esc(pack.title)}</h1>
      ${pack.description ? `<p>${esc(pack.description)}</p>` : ""}
    </header>
    ${emptyState(pack.empty || "Próximamente.")}`;
}

function render() {
  const id = packPath();
  if (!id) {
    renderHub();
    return;
  }
  const pack = getPack(id);
  if (!pack) {
    document.title = "No encontrado — JaimeShare";
    document.querySelector("#view").innerHTML = `
      ${topBar("Jaime Alonso")}
      ${emptyState("Este pack no existe.")}`;
    return;
  }
  if (pack.kind === "artists") renderArtists(pack);
  else if (pack.kind === "links") renderLinks(pack);
  else renderStub(pack);
}

document.addEventListener("click", async (event) => {
  const copy = event.target.closest("[data-copy]");
  if (!copy) return;
  try {
    await navigator.clipboard.writeText(location.href.split("#")[0]);
    copy.dataset.copied = "true";
    copy.textContent = "Copiado";
    setTimeout(() => {
      copy.dataset.copied = "false";
      copy.textContent = "Copiar link";
    }, 1600);
  } catch {
    copy.textContent = "No se pudo copiar";
  }
});

window.addEventListener("popstate", render);
render();
