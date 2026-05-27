# CMS Demo Page

Simple demo page that fetches content from `GET /api/v1/cms/landing` and renders each content type (TEXT, HTML, IMAGE, BANNER, VIDEO).

## How it works

1. The page fetches `/api/v1/cms/landing` on mount (proxied to the API server via Vite).
2. Response is typed with `CmsLandingResponse` from `@bopacorp/shared` (`ContentBlockResponse`, `CmsLandingResponse`).
3. Each section (hero, features, banner, video, cta, footer) looks up blocks by their content key and renders them.

## States

| State | Behavior |
|---|---|
| **Loading** | Skeleton placeholders for hero + feature cards |
| **Error** | Empty component with error message + retry button |
| **Empty** | Empty component indicating no blocks published |
| **Success** | Full landing page rendering all sections |

## Content keys consumed

| Section | contentKey | type | Rendering |
|---|---|---|---|
| Hero | `hero.title` | TEXT | `<h1>` |
| Hero | `hero.subtitle` | TEXT | `<p>` |
| Hero | `hero.cta` | TEXT | `<button>` |
| Hero | `hero.background` | IMAGE | CSS `background-image` |
| Features | `features.title` | TEXT | `<h2>` |
| Features | `features.subtitle` | TEXT | `<p>` |
| Features | `features.item.{1,2,3}` | HTML | `dangerouslySetInnerHTML` in cards |
| Banner | `banner.promo` | BANNER | `dangerouslySetInnerHTML` |
| Video | `video.intro` | VIDEO | `dangerouslySetInnerHTML` (expects iframe) |
| CTA | `cta.title` | TEXT | `<h2>` |
| CTA | `cta.button` | TEXT | `<button>` |
| Footer | `footer.text` | TEXT | `<span>` |
| Footer | `footer.links` | HTML | `dangerouslySetInnerHTML` |

## Running locally

```bash
# Terminal 1: API
cd bopacorp-api
npx tsx src/scripts/seed-content-types.ts  # once
npx tsx src/scripts/seed-cms-landing.ts     # once
npm run dev

# Terminal 2: Web
cd bopacorp-web
npm run dev
```

Open `http://localhost:5173` and click **CMS Demo** in the sidebar.
