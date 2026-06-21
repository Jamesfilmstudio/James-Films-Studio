/**
 * JAMES FILMS — PORTFOLIO DATA
 * ============================
 * Add, remove, or edit projects below. Each project needs:
 *
 *   title        — Project name (shows on the card + modal)
 *   category     — Short tag, e.g. "Music Video", "Brand Film", "Commercial"
 *   thumbnail    — Path or URL to a poster image (use a 2:3 portrait image
 *                  for the best "movie poster" effect, min 800x1200px)
 *   description  — 1-3 sentences. Shows in the detail modal.
 *   videoUrl     — External link to the full video (YouTube, Vimeo, etc.)
 *   previewVideo — (optional) Path/URL to a short muted MP4 clip that plays
 *                  on hover. Leave as "" to just show the thumbnail.
 *   year         — (optional) Year of the project.
 *   client       — (optional) Client or artist name.
 *
 * To add a new project, copy one block (between the { and },) and edit it.
 * The newest item in the array shows first — add new work to the top.
 */

const PROJECTS = [
  {
    title: "MIDNIGHT FREQUENCY",
    category: "Music Video",
    client: "Echo Park",
    year: "2025",
    thumbnail: "assets/placeholder-1.jpg",
    previewVideo: "",
    description:
      "A neon-soaked performance piece built around rhythm cuts and reactive color grading. Edited to land every beat on the frame.",
    videoUrl: "https://www.youtube.com/",
  },
  {
    title: "BUILT DIFFERENT",
    category: "Brand Film",
    client: "Forge Athletics",
    year: "2025",
    thumbnail: "assets/placeholder-2.jpg",
    previewVideo: "",
    description:
      "A high-energy brand anthem combining slow-motion training footage with punchy match cuts to sell intensity and discipline.",
    videoUrl: "https://www.youtube.com/",
  },
  {
    title: "THE LAUNCH",
    category: "Commercial",
    client: "Vantage Tech",
    year: "2024",
    thumbnail: "assets/placeholder-3.jpg",
    previewVideo: "",
    description:
      "A 30-second product spot edited for a national broadcast push — clean, fast, and built to hold attention in the first three seconds.",
    videoUrl: "https://www.youtube.com/",
  },
  {
    title: "NO DAYS OFF",
    category: "Documentary",
    client: "Independent",
    year: "2024",
    thumbnail: "assets/placeholder-4.jpg",
    previewVideo: "",
    description:
      "A short-form documentary following an athlete's offseason grind, cut for emotional pacing as much as visual impact.",
    videoUrl: "https://www.youtube.com/",
  },
  {
    title: "AFTERGLOW",
    category: "Music Video",
    client: "Reverie",
    year: "2024",
    thumbnail: "assets/placeholder-5.jpg",
    previewVideo: "",
    description:
      "A moody, slow-burn visual narrative paired with practical lighting effects added in post to match the track's atmosphere.",
    videoUrl: "https://www.youtube.com/",
  },
  {
    title: "RED LINE",
    category: "Commercial",
    client: "Apex Motors",
    year: "2023",
    thumbnail: "assets/placeholder-6.jpg",
    previewVideo: "",
    description:
      "An automotive spot built on aggressive speed ramps and sound-designed cuts that put the engine at the center of every frame.",
    videoUrl: "https://www.youtube.com/",
  },
];

/**
 * SOCIAL LINKS
 * ============
 * Update the URLs below to point to your real profiles.
 * Set a link to "" to hide that icon from the site.
 */
const SOCIAL_LINKS = {
  instagram: "https://instagram.com/jamesfilms",
  youtube: "https://youtube.com/@jamesfilms",
  tiktok: "https://tiktok.com/@jamesfilms",
  twitter: "",
  linkedin: "",
};
