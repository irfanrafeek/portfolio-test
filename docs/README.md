# Design System Documentation

This folder documents the design tokens, CSS components, and theming model
that power [irfanrafeek.com](https://www.irfanrafeek.com).

## What this is

A zero-build static portfolio with a **two-tier design token system**.
Components consume semantic tokens, never primitives. Four themes
(Light, Dark, Editorial, Code) live on top of the same component layer.

```
┌─────────────────────────────────────────────────────┐
│  Tier 1: Primitives  →  Tier 2: Semantic  →  Used   │
│  raw colors, sizes,     intent aliases       in CSS │
│  weights                background/primary,         │
│                         text/primary, etc.          │
└─────────────────────────────────────────────────────┘
              ▲                  ▲
              │                  │
              └──── tokens.css ──┘
                           │
                           └─→  components.css uses var(--semantic-…)
```

## File map

| File             | Purpose                                                |
| ---------------- | ------------------------------------------------------ |
| `tokens.css`     | All design tokens (primitives + semantic + theme overrides) |
| `components.css` | All component CSS — references semantic tokens only    |
| `scripts/*.js`   | Renderers for projects/writings cards + article body + theme + nav  |
| `*.html`         | Six page templates: index, about, work, case, writings, writing |

## Documentation in this folder

- [**tokens.md**](./tokens.md) — Token reference: every primitive ramp,
  every semantic intent, naming convention, when to use which.
- [**components.md**](./components.md) — Class reference: the major
  component classes (`.hero`, `.project-card`, `.case-*`, `.theme-switcher`, etc.)
  with markup examples.
- [**themes.md**](./themes.md) — How the four-theme system works: the
  `data-theme` attribute, per-theme token overrides, persistence,
  how to add a new theme.

## Quick start: changing a value

To change the brand accent color across the whole site (light + dark +
editorial + code themes):

```css
/* tokens.css */
:root {
  --primitive-color-accent-500: #ff6b47;  /* ← change this hex */
}
```

Every component that uses `color/interactive/primary` (semantic) gets
the new value automatically because semantic aliases into the primitive.

To change it for **one theme only**:

```css
/* tokens.css */
[data-theme='sepia'] {
  --semantic-color-interactive-primary: var(--primitive-color-accent-700);
  /* now Editorial theme uses a different accent without touching others */
}
```

## Mirroring in Figma

The same two-tier structure is mirrored as Figma Variables in the file
linked from your project's CMS-setup memory. Primitive Collection +
Semantic Collection with four modes (Light/Dark/Sepia/Slate). Text
styles bind their `fontFamily` to `font/display`, `font/body`, and
`font/eyebrow` intent variables so designs retint with the mode just
like the live site.

See [themes.md](./themes.md#in-figma) for the editor workflow.
