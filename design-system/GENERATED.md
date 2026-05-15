# Generated files

The following files are **generated**, not hand-written. Regenerate them
after every edit to the source of truth (BRANDBOOK.md / tokens.json).

| File                | Source                                 |
| ------------------- | -------------------------------------- |
| `brand-book-a4.pdf` | `brand-book-a4.html` (headless Chrome) |
| `tokens.css`        | `tokens.json` (Style Dictionary)       |
| `tokens.ts`         | `tokens.json` (Style Dictionary)       |

## Regenerate the brand book PDF (macOS)

```bash
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome \
  --headless --disable-gpu --no-pdf-header-footer \
  --print-to-pdf="$PWD/design-system/brand-book-a4.pdf" \
  "file://$PWD/design-system/brand-book-a4.html"
```

If Chrome is not installed, use Brave (your default browser):

```bash
/Applications/Brave\ Browser.app/Contents/MacOS/Brave\ Browser \
  --headless --disable-gpu --no-pdf-header-footer \
  --print-to-pdf="$PWD/design-system/brand-book-a4.pdf" \
  "file://$PWD/design-system/brand-book-a4.html"
```

## Regenerate tokens.css and tokens.ts

Requires Style Dictionary (`npm i -D style-dictionary`):

```bash
npx style-dictionary build --config design-system/style-dictionary.config.js
```
