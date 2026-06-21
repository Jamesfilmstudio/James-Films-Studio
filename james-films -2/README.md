# James Films — Website

A single-page cinematic portfolio site built around the James Films logo:
pure black background, crimson/red glow accents, metallic silver typography.

## File structure

```
index.html              All page markup
css/style.css           All styles
js/main.js               All interactivity (loader, nav, scroll reveals,
                         portfolio render/filter/modal, before/after slider,
                         testimonials, FAQ accordion, stat counters, form)
data/projects.js         <-- EDIT THIS to manage your portfolio + socials
assets/                  Logo + placeholder poster images
```

## Adding your own work

Open `data/projects.js`. Each project is one block:

```js
{
  title: "MIDNIGHT FREQUENCY",
  category: "Music Video",
  client: "Echo Park",
  year: "2025",
  thumbnail: "assets/placeholder-1.jpg",   // swap for your own poster image
  previewVideo: "",                        // optional: short muted mp4 for hover preview
  description: "A neon-soaked performance piece...",
  videoUrl: "https://www.youtube.com/...", // link to the full video
}
```

- Add a new project by copying a block and editing it. New items at the
  **top** of the array show first.
- `category` controls the filter pills above the grid — they're generated
  automatically from whatever categories you use, so just typing a new
  category name (e.g. `"Trailer"`) adds a new filter pill automatically.
- For best results, use a **2:3 portrait image** (e.g. 1000×1500px) for
  `thumbnail` — that's the "movie poster" aspect ratio the cards use.
- `previewVideo` is optional. If set, that clip silently autoplays on hover.
  Leave it as `""` to just show the static thumbnail.

## Updating social links

Also in `data/projects.js`, near the bottom:

```js
const SOCIAL_LINKS = {
  instagram: "https://instagram.com/yourhandle",
  youtube: "https://youtube.com/@yourhandle",
  tiktok: "https://tiktok.com/@yourhandle",
  twitter: "",
  linkedin: "",
};
```

Set any link to `""` to hide that icon from the footer entirely.

## Replacing placeholder content

- **Posters**: replace the files in `assets/placeholder-*.jpg` (or point
  `thumbnail` at new files/URLs).
- **Before/after slider**: the section under "Raw Footage. Refined Story."
  currently uses styled gradients as stand-ins. Open `css/style.css` and
  search for `.reveal-slider__before` and `.reveal-slider__after` to swap
  in real video frames as background images once you have them.
- **Testimonials**: edit the `TESTIMONIALS` array near the top of the
  testimonials section in `js/main.js`.
- **FAQ**: edit the `FAQS` array in `js/main.js`.
- **Contact form**: the form currently shows a confirmation message in the
  browser only. To actually receive submissions, connect it to an email
  service (e.g. Formspree, EmailJS) or your own backend — see the
  `contactForm.addEventListener("submit", ...)` block in `js/main.js`.

## Fonts

Headings use **Anton**, body text uses **Inter**, both loaded from Google
Fonts. An internet connection is required for them to display correctly —
they'll fall back to a system sans-serif otherwise.
