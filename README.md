# Yomix

A manga reader built with Next.js. Reads from MangaDex with three reading modes — single page, book spread, and webtoon scroll.

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square)
![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)

## Stack

- [Next.js 16](https://nextjs.org) — App Router, Server Actions
- [TypeScript](https://www.typescriptlang.org)
- [Tailwind CSS](https://tailwindcss.com)
- [page-flip](https://github.com/Nodlik/StPageFlip) — book spread animation
- [Radix UI](https://www.radix-ui.com) — accessible UI primitives
- [MangaDex API](https://api.mangadex.org) — manga and chapter data

## Getting Started

```bash
git clone https://github.com/zonkviral/yomix
cd yomix
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
app/                    # Next.js App Router pages
actions/                # Server actions
components/
  MangaReader/          # Reader component tree
    BookCanvas/         # Book mode — page-flip canvas
      initConfig.ts     # PageFlip initialization, cache logic
      buildStructure.ts # Slot layout, wide page processing
      imageTransforms.ts# splitImg, rotateImg, blob URL management
      renderer.ts       # Canvas resolution, DPR, resize handling
    SingleReader.tsx    # Single page mode
    WebtoonReader.tsx   # Webtoon scroll mode
    ReaderContext.tsx   # Reader state (pages, chapter, navigation)
    ReaderControls/     # HUD — top bar, bottom bar, sidebar, settings
hooks/                  # useReaderNavigation, useZoom, useChapterNavigation
lib/
  MangaDex/             # MangaDex API client
  MangaLib/             # MangaLib API is still up in the air
  Remanga/              # Remanga API client
```

## Book Mode Architecture

Book mode uses `page-flip` to render pages as a canvas-based book spread. Wide pages (width/height ratio > 1.2) are detected before loading and either split into left/right halves (desktop) or rotated 90° (mobile).

The initialization runs in four phases:

1. **Preload** — all page URLs loaded in parallel to get dimensions
2. **CORS reload** — wide pages reloaded with `crossOrigin=anonymous` for canvas access
3. **Build structure** — exact slot count calculated, `pageToSlot` and `slotToPage` maps built, blob URLs created
4. **Init PageFlip** — loaded once with the exact URL array, no reserved slots needed

The result is cached in `cacheRef`. Switching reading modes reuses the cache — no reprocessing. Switching chapters clears the cache and revokes blob URLs.

## License

MIT
