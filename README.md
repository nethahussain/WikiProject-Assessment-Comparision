# WikiProject Assessment Comparison

Interactive dashboard comparing article quality distributions between **WikiProject Women's Health** and **WikiProject Military History** on English Wikipedia.

## Overview

This project uses WikiProject banner metadata (via the MediaWiki `categoryinfo` API) to compare how articles are distributed across quality classes:

| Class | Description |
|-------|-------------|
| Stub | Minimal content, a few lines |
| Start | Basic article with some structure |
| C-Class | Substantial but incomplete |
| B-Class | Well-referenced, reasonably complete |
| GA | Good Article — passed community review |
| FA | Featured Article — highest quality tier |

## Key Findings

- **Military History** has a higher GA+FA proportion (3.14% vs 1.78%)
- **Military History** has a lower Stub proportion (11.53% vs 16.36%)
- Military History oversees ~235,000 assessed articles — roughly 79× the size of Women's Health (~2,981)

## Data Source

Counts retrieved via the MediaWiki API:

```
https://en.wikipedia.org/w/api.php?action=query&prop=categoryinfo&titles=Category:{Class}-Class_{project}_articles&format=json
```

The same category structure feeds PetScan queries and the Version 1.0 Editorial Team statistics tables.

## Tech

- React component (`.jsx`) designed to render as a standalone dashboard
- Uses Tailwind-free inline styles, IBM Plex Mono + DM Sans typography
- Data queried February 2025

## License

MIT
