/** @typedef {{ key: string, label: string, href: string }} PlatformLink */
/** @typedef {{ id: string, name: string, subtitle: string, image: string, links: Record<string, string> }} Artist */

/** @type {Artist[]} */
export const artists = [
  {
    id: "jaime2000",
    name: "Jaime 2000",
    subtitle: "Indie pop",
    image: "/img/cover-2000-jaimes.jpg",
    links: {
      tidal: "https://tidal.com/artist/87677903",
      spotify: "https://open.spotify.com/artist/0fILFburaL1mArozqNg4uZ",
      apple: "https://music.apple.com/us/artist/jaime-2000/6819618646",
      youtube: "https://music.youtube.com/channel/UClvbza29z5oUoCcMiXwvS7Q",
      amazon: "https://music.amazon.com/artists/B0HM4DXMKC",
      deezer: "https://www.deezer.com/artist/420530972",
    },
  },
  {
    id: "spirithz",
    name: "Spirithz",
    subtitle: "Trance",
    image: "/img/spirithz.jpg",
    links: {
      tidal: "https://tidal.com/artist/36347288",
      spotify: "https://open.spotify.com/artist/0VIwVTAsQcPt1nkAGj1CNO",
      apple: "https://music.apple.com/us/artist/spirithz/1661265663",
      youtube:
        "https://music.youtube.com/playlist?list=OLAK5uy_m8qhlgv59f3U0yw3ltId75P9uwFvdUcps",
      amazon: "https://music.amazon.com/artists/B0BQYJ135N/spirithz",
      deezer: "https://www.deezer.com/artist/194659137",
    },
  },
  {
    id: "quarteteuc",
    name: "The Symphonic Quarteteuc",
    subtitle: "Medieval tavern",
    image: "/img/cover-tavern.jpg",
    links: {
      tidal: "https://tidal.com/artist/50502492",
      spotify: "https://open.spotify.com/artist/1eNSjkwrYEQik7qcmzYWc8",
      apple: "https://music.apple.com/us/artist/the-symphonic-quarteteuc/1768849532",
      deezer: "https://www.deezer.com/artist/282398201",
    },
  },
];

export default {
  id: "music",
  title: "Música",
  description: "Escúchame en tu plataforma favorita.",
  kind: "artists",
  brand: "Jaime Alonso",
  items: artists,
  filterParam: "a",
  filterAliases: ["artists", "artist"],
  chips: [
    { label: "Todos", ids: "all" },
    { label: "Jaime 2000", ids: ["jaime2000"] },
    { label: "Spirithz", ids: ["spirithz"] },
    { label: "Quarteteuc", ids: ["quarteteuc"] },
    { label: "Jaime + Spirithz", ids: ["jaime2000", "spirithz"] },
  ],
};
