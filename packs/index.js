import music from "./music.js";
import me from "./me.js";
import projects from "./projects.js";
import files from "./files.js";
import photos from "./photos.js";

/** Registry: add a pack file and list it here. */
export const packs = [music, me, projects, files, photos];

export function getPack(id) {
  return packs.find((p) => p.id === id) || null;
}
