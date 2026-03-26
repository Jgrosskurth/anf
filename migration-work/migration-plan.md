# Migration Plan: Abercrombie & Fitch Homepage (Spring 2026)

**Mode:** Single Page
**Source:** https://web.archive.org/web/20260323180311/https://www.abercrombie.com/shop/us
**Generated:** 2026-03-26
**Note:** Replacing previous Winter 2025 migration with updated Spring 2026 content

## Steps
- [x] 0. Initialize Migration Plan
- [x] 1. Project Setup
- [x] 2. Site Analysis
- [x] 3. Page Analysis
- [x] 4. Block Mapping
- [x] 5. Import Infrastructure
- [x] 6. Content Import

## Page Sections (from Wayback Machine March 23, 2026)
1. Promo Banner - "All Clearance Up To 60% Off" (dark navy bg)
2. Hero Carousel - "Hotel Abercrombie" with dual-image slides
3. Cards Editorial - "NEW IN SWIM / High Tide" + "Premium Heavyweight 2.0 Tee"
4. Hero - "The Heritage Heavyweight Collection" (full-width)
5. Hero Brand - YPB "Your Personal Best"
6. Columns Services - myAbercrombie, App, Find Store

## Key Image URLs
- Hero carousel: ANF-2026-FebWk1-D-HP-SpringPreview-Part2-Dual-{1-4}.jpg
- Cards: ANF-2026-031526-D-HP-NA-USCA-{W,M}.jpg
- Heritage hero: ANF-2026-031226-D-HP-FLEECE-USCA.jpg
- YPB: ANF-2026-022626-D-HP-USCA-YPB.jpg
- Service icons: ANF-2024-Footer-{myabercrombie-logo,APP_ICON,LOCATION_ICON}.svg

## Artifacts
- `.migration/project.json` - Project configuration
- `migration-work/migration-plan.md` - This migration plan
- `tools/importer/page-templates.json` - Page template with block mappings
- `content/index.plain.html` - Spring 2026 homepage content
- `blocks/hero-banner/hero-banner.css` - Promo banner styling
- `blocks/carousel-nfl/carousel-nfl.css` - Carousel block styling
- `blocks/cards-editorial/cards-editorial.css` - Editorial cards styling
- `blocks/cards-editorial/cards-editorial.js` - Cards JS decorator
- `blocks/hero/hero.css` - Heritage hero styling
- `blocks/hero-brand/hero-brand.css` - YPB brand hero styling
- `blocks/columns-services/columns-services.css` - Services footer styling
- `styles/styles.css` - Global design system (Trade Gothic, brand colors, buttons)
- `styles/fonts.css` - Trade Gothic font-face declarations
- `fonts/trade-gothic-*.woff2` - Self-hosted Trade Gothic fonts
