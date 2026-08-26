# Design

<!-- impeccable:design-schema 1 -->

## Visual world

**The large-format academic conference poster** — the artifact Keshav actually produced for ACM UIST and CHI. Its grammar is numbered figure plates, captions set in a notation face, method panels, and tabular data. Evidence is the structure, not an ornament laid over one.

Fused with the **World Archery ring palette**, which supplies the data colors: the sport's own official color system does the work a generic chart palette would otherwise do.

Refused, deliberately: the near-black mono developer portfolio (the rut this category always ships) and the warm cream editorial serif personal site (its predictable opposite).

## Color

Strategy: **Committed** — the ink field carries the figure plates; the poster ground carries the reading.

| Token | Value | Role |
|---|---|---|
| `--paper` | `#EDEFF2` | Poster ground, cool neutral. The page's dominant surface. |
| `--plate` | `#FFFFFF` | Figure panel ground, sitting on paper |
| `--ink-field` | `#10151C` | Dark field inside figure plates, where luminous data lives |
| `--ink` | `#0E1319` | Primary text |
| `--ink-2` | `#5A6472` | Captions, secondary — tinted from the ground's hue, never neutral gray |
| `--rule` | `#C9CFD7` | Hairlines, plate borders |
| `--gold` | `#FFD400` | World Archery 10-ring. Primary accent, reserved for the measured quantity. **Ink fields only** |
| `--gold-ink` | `#7A6000` | The same accent's rendition on paper. Bright gold on `--paper` measures 1.24:1 and is unreadable; this measures 5.21:1 |
| `--red` | `#E4453A` | World Archery 7/8 ring. Emphasis, second data series |
| `--blue` | `#3FA9DA` | World Archery 5/6 ring. Third data series |
| `--bone` | `#EEF0F3` | The figure itself, on ink-field |

Use scene that decided light over dark: a recruiter opening this at midday in an office among twenty other tabs. Dark would have been category habit; the poster is a printed object read under room light.

Semantic rule: gold marks *measured* values only. It never becomes a generic highlight.

## Type

Two roles, both with a reason beyond association.

- **Display / headings — Helvetica Neue** (`"Helvetica Neue", Helvetica, Arial, sans-serif`). Swiss information design and scientific figure plates use this face natively; it is the poster tradition's own voice, not a fallback. Set heavy, tight (`-0.03em`), large.
- **Notation — system monospace** (`ui-monospace, "SF Mono", Menlo, monospace`). Figure numbers, captions, measurements, axis labels, metadata. This is the legitimate use: data and measurement, not a costume for "technical".

Scale: `clamp()` throughout. Display caps at 5.5rem. Body measure held to 68ch. `font-variant-numeric: tabular-nums` everywhere digits align.

## Composition

A single scrolling column read as one tall poster. A fixed figure rail on the left tracks position by figure number; prose cites figures by number, so the numbering is referential rather than decorative.

Plates alternate density: a full-bleed ink-field plate, then a quiet caption passage, then a data plate. One spacing rhythm, more space above a heading than below.

## Motion

**One authored moment:** scroll drives the draw cycle. Scroll progress across the pinned hero advances the archer through 60 frames of a real shot — the page's scroll *is* the draw. Everything else is restrained: plates and captions resolve on entry with an exponential ease-out from an already-visible default, and the target plate lands its arrows in sequence.

Never: an identical entrance on every section, or motion that hides content before it animates.

`prefers-reduced-motion` is a correctness requirement here, not an enhancement — it yields a fully legible static page with the archer held at full draw.

## Prohibitions

- No gradient text; emphasis is weight and size.
- No same-size icon-heading-text card grid as page structure.
- Gold is never used on anything that isn't a measured value.

Figure numbering is native to this world and stays.
