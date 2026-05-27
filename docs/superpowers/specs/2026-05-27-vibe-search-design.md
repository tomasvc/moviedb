# Vibe Search — Design Spec

**Date:** 2026-05-27  
**Status:** Approved  
**Scope:** Enhance existing search overlay to support natural-language vibe/mood queries alongside regular title/person search.

---

## Overview

The search overlay currently handles specific queries ("Inception", "Tom Hanks") via a GPT call that returns freeform text, which is then parsed by a brittle string utility and resolved against TMDB. This spec replaces that pipeline with a structured JSON approach and adds a new "vibe mode" render path for conversational queries like _"something cozy after a breakup, under 2 hours, not horror"_.

---

## What Is Not Changing

- The search is triggered from the header icon, renders as a full-screen overlay, and closes on Escape or the X button.
- Regular title/person queries continue to work exactly as today, with the same result card layout.
- The TMDB lookup step (resolving titles to full movie/person data) is unchanged.

---

## Backend — API Route (`/api/search/gpt`)

### Approach

Replace freeform GPT text output with **structured JSON output** using OpenAI's `response_format: { type: "json_schema" }` feature. This eliminates the `parseOutput` utility entirely.

### Response Schema

```typescript
type SearchGPTResponse = {
  mode: "regular" | "vibe";

  // Regular mode — titles and people to resolve via TMDB
  titles?: string[];   // e.g. ["Inception", "Interstellar"]
  people?: string[];   // e.g. ["Tom Hanks", "Christopher Nolan"]

  // Vibe mode — AI-extracted filters + ranked recommendations
  filters?: {
    mood?: string[];          // e.g. ["cozy", "bittersweet"]
    max_runtime?: number;     // minutes, e.g. 120
    exclude_genres?: string[]; // e.g. ["horror"]
    include_genres?: string[]; // e.g. ["romance", "drama"]
  };
  recommendations?: {
    title: string;
    blurb: string; // one sentence, e.g. "Warm and gently melancholy — about letting go, at exactly 123 min."
  }[];
};
```

### Intent Detection

The GPT prompt instructs the model to set `mode: "vibe"` when the query is conversational, describes a mood, feeling, or constraint rather than a specific title or person. Otherwise `mode: "regular"`.

### Error Handling

Unchanged from current implementation (rate limit, credits, invalid key responses).

---

## Frontend — Search Component

### State

Replace the current `output` (raw string) + `parsedOutput` (intermediate parsed object) with a single typed state value:

```typescript
const [searchResponse, setSearchResponse] = useState<SearchGPTResponse | null>(null);
```

The two-`useEffect` parse chain (`output` → `parsedOutput` → `results`) collapses into one effect that sets both `searchResponse` and triggers the TMDB lookup.

Add `vibeResults` to pair TMDB-resolved movie data with blurbs:

```typescript
const [vibeResults, setVibeResults] = useState<Array<{
  movie: SearchResult;
  blurb: string;
}>>([]);
```

### Render Paths

**Regular mode (`mode === "regular"`):**  
Renders identically to today — movies grid and people grid.

**Vibe mode (`mode === "vibe"`):**

1. **Vibe badge** — a small `✦ Vibe Search` pill badge appears above the input (green accent, uppercase, 10px). Signals to the user that AI interpretation is active.

2. **Filter interpretation bar** — appears between the input and results. Shows chips for each extracted filter:
   - Mood: `mood · cozy · bittersweet`
   - Runtime: `runtime · < 120 min`
   - Excluded genres: `excluding · horror` (red text)
   - Hidden if `filters` is empty or absent.

3. **Ranked results list** — replaces the grid. Each card contains:
   - Rank number (1–N, muted)
   - Poster thumbnail (42×60px, rounded corners)
   - Title (semibold, 14px)
   - Year badge (green accent pill)
   - One-sentence blurb (12px, muted)
   - Arrow indicator on hover (transitions to green, shifts right 3px)
   - If TMDB returns no match for a recommended title, that entry is silently skipped (not shown as an error card).

### Animations

- Filter bar fades in (`animate-fadeIn`) when it appears.
- Result cards stagger in with a 50ms delay between each.
- These match the existing animation conventions in the component.

---

## Files Changed

| File | Change |
|------|--------|
| `src/app/api/search/gpt/route.ts` | Refactor to use structured JSON output; update GPT prompt |
| `src/components/Search/index.tsx` | New state shape; new vibe mode render path |
| `src/utils/parseOutput.ts` | **Delete** — no longer needed |
| `src/types/api.ts` | Add `SearchGPTResponse` type |

---

## Out of Scope

- Marathon planner — separate feature, separate spec.
- Saved searches or search history.
- Filter editing after the fact (user cannot adjust chips; they re-type the query).
- People results in vibe mode (recommendations are movies only for now).
