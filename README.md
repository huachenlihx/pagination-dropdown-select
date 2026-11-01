# Pagination Dropdown Select

[![npm version](https://img.shields.io/npm/v/pagination-dropdown-select.svg)](https://www.npmjs.com/package/pagination-dropdown-select)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](#license)

Accessible, controlled pagination and page-size dropdowns for React and Next.js, written in TypeScript.

## Features

- First, previous, next and last-page buttons
- Page-number and results-per-page selectors
- React 18.3.1+ / React 19 peer compatibility target
- Next.js App Router Client Component compatible
- Native HTML controls: screen-reader labels, keyboard navigation, disabled states and focus semantics
- No Tailwind, Radix, UUID, icon library or global CSS requirement
- CommonJS/ESM bundles with TypeScript declarations

## Installation

```bash
npm install pagination-dropdown-select
```

React is a peer dependency; Next.js is optional.

## Usage — React / Next.js App Router

In a Next.js App Router project, create `app/components/PaginatedList.tsx`:

```tsx
'use client';

import { useState } from 'react';
import Pagination from 'pagination-dropdown-select';

const rows = Array.from({ length: 72 }, (_, i) => `Record ${i + 1}`);

export default function PaginatedList() {
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const start = (currentPage - 1) * pageSize;

  return (
    <section>
      <ul>{rows.slice(start, start + pageSize).map((row) => <li key={row}>{row}</li>)}</ul>
      <Pagination
        pageSizeArray={[5, 10, 20, 50]}
        totalResultsNumber={rows.length}
        pageSize={pageSize}
        setPageSize={setPageSize}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        ariaLabel="Record pagination"
      />
    </section>
  );
}
```

For server-side/API pagination, use the server's reported total count as `totalResultsNumber`, and request data again when `currentPage` or `pageSize` changes. Keep the table/list and its loading state accessible.

## Props

| Prop | Type | Description |
|---|---|---|
| `pageSizeArray` | `number[]` | Available page sizes (positive integers) |
| `totalResultsNumber` | `number` | Total record count, not current page length |
| `pageSize` | `number` | Controlled rows per page |
| `setPageSize` | `(size: number) => void` | Change page size; component resets page to 1 |
| `currentPage` | `number` | Controlled, 1-based page number |
| `setCurrentPage` | `Dispatch<SetStateAction<number>>` | Page state setter |
| `isLoading` | `boolean` | Disables controls while loading (default false) |
| `goToFirstPageToolTip` etc. | `string \| null` | Override navigation labels and titles |
| `ariaLabel` | `string` | Pagination navigation region label |
| `className` | `string` | Optional wrapper CSS class |

The existing tooltip prop names are retained for compatibility: `goToFirstPageToolTip`, `goToPreviousPageToolTip`, `goToNextPageToolTip`, `goToLastPageToolTip`.

## Development

Requires a maintained Node.js LTS version and npm.

```bash
git clone https://github.com/huachenlihx/pagination-dropdown-select.git
cd pagination-dropdown-select
npm install
npm run typecheck
npm test
npm run test:coverage
npm run build
npm pack --dry-run
```

`npm install` generates `package-lock.json`; commit the generated lockfile for reproducible development installations.

## Accessibility (WCAG 2.2)

Unlike a data-only CSV utility, this package renders interactive controls, so accessibility matters. It uses native `<button>` and `<select>` elements, meaningful accessible names, a labeled navigation region, keyboard-operable controls, disabled states and a polite page-total announcement. Unit tests include `jest-axe` checks.

**This is not a certification of WCAG 2.2 AA compliance.** In your application, verify contrast and visible focus indicators from your chosen theme, announce data loading and the visible results range when helpful, and test with actual assistive technology. Native control appearance and focus styling vary by browser and OS.

## Migration from 1.0.8

The public prop names remain, but **the rendered appearance changes**: Radix/Tailwind components and their bundled CSS have been replaced with native controls. Custom styles or selectors targeting the previous Radix markup may need adjustment. React is now a peer dependency rather than a bundled dependency. Since the UI changes, consider a **major** semver release if existing consumers depend on the old appearance.

## Contributing

Issues and pull requests: https://github.com/huachenlihx/pagination-dropdown-select/issues

## License

MIT © 2026 Hua Chen. See [LICENSE](LICENSE).
