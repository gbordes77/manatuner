# Generated files

The following files are **generated**, not hand-written. Regenerate them
after every edit to the source of truth (`BRANDBOOK.md` / `tokens.json`).

| File                | Source                                 |
| ------------------- | -------------------------------------- |
| `brand-book-a4.pdf` | `brand-book-a4.html` (headless Chrome) |
| `tokens.css`        | `tokens.json` (manual sync)            |
| `tokens.ts`         | `tokens.json` (manual sync)            |

## Regenerate the brand book PDF (macOS)

Brave is the default; Chrome works identically.

```bash
/Applications/Brave\ Browser.app/Contents/MacOS/Brave\ Browser \
  --headless --disable-gpu --no-pdf-header-footer \
  --print-to-pdf="$PWD/design-system/brand-book-a4.pdf" \
  "file://$PWD/design-system/brand-book-a4.html"
```

Or, if Chrome is preferred:

```bash
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome \
  --headless --disable-gpu --no-pdf-header-footer \
  --print-to-pdf="$PWD/design-system/brand-book-a4.pdf" \
  "file://$PWD/design-system/brand-book-a4.html"
```

There is also a `Makefile.ds` at the repo root with `make -f Makefile.ds ds-pdf`.

## Regenerate `tokens.css` and `tokens.ts` from `tokens.json`

The mirror edition keeps these in lockstep manually. To switch to a generated
pipeline, install Style Dictionary and add a config:

```bash
npm i -D style-dictionary
npx style-dictionary build --config design-system/style-dictionary.config.js
```

(The config file is intentionally not shipped — sync is currently manual.)
