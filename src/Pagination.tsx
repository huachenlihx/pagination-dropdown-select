'use client';

import * as React from 'react';

export interface PaginationProps {
  pageSizeArray: number[];
  totalResultsNumber: number;
  pageSize: number;
  setPageSize: (size: number) => void;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  goToFirstPageToolTip?: string | null;
  goToPreviousPageToolTip?: string | null;
  goToNextPageToolTip?: string | null;
  goToLastPageToolTip?: string | null;
  isLoading?: boolean;
  /** Optional accessible name for the navigation region. */
  ariaLabel?: string;
  className?: string;
}

/** Accessible, controlled pagination for React and Next.js Client Components. */
export default function Pagination({
  pageSizeArray,
  totalResultsNumber,
  pageSize,
  setPageSize,
  currentPage,
  setCurrentPage,
  goToFirstPageToolTip,
  goToPreviousPageToolTip,
  goToNextPageToolTip,
  goToLastPageToolTip,
  isLoading = false,
  ariaLabel = 'Pagination',
  className,
}: Readonly<PaginationProps>): React.JSX.Element {
  const safeSize = Number.isFinite(pageSize) && pageSize > 0 ? Math.floor(pageSize) : 1;
  const safeTotal = Number.isFinite(totalResultsNumber) ? Math.max(0, Math.floor(totalResultsNumber)) : 0;
  const totalPages = Math.max(1, Math.ceil(safeTotal / safeSize));
  const page = Math.min(totalPages, Math.max(1, Number.isFinite(currentPage) ? Math.floor(currentPage) : 1));
  const atFirst = page <= 1;
  const atLast = page >= totalPages;
  const navigationDisabled = isLoading || safeTotal === 0;
  const previousLabel = goToPreviousPageToolTip ?? `Go to page ${Math.max(1, page - 1)}`;
  const nextLabel = goToNextPageToolTip ?? `Go to page ${Math.min(totalPages, page + 1)}`;
  const validSizes = [...new Set(pageSizeArray.filter((size) => Number.isInteger(size) && size > 0))];
  if (!validSizes.includes(pageSize) && Number.isInteger(pageSize) && pageSize > 0) {
    validSizes.unshift(pageSize);
  }

  return (
    <nav aria-label={ariaLabel} className={className} style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.75rem' }}>
      <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
        <span>Per page</span>
        <select
          aria-label="Results per page"
          value={pageSize}
          disabled={isLoading || validSizes.length === 0}
          onChange={(event) => {
            setPageSize(Number(event.currentTarget.value));
            setCurrentPage(1);
          }}
        >
          {validSizes.map((size) => <option key={size} value={size}>{size}</option>)}
        </select>
      </label>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
        <button type="button" aria-label={goToFirstPageToolTip ?? 'Go to first page'} title={goToFirstPageToolTip ?? 'Go to first page'} disabled={navigationDisabled || atFirst} onClick={() => setCurrentPage(1)}>« First</button>
        <button type="button" aria-label={previousLabel} title={previousLabel} disabled={navigationDisabled || atFirst} onClick={() => setCurrentPage(Math.max(1, page - 1))}>‹ Previous</button>
        <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
          <span>Page</span>
          <select
            aria-label="Current page"
            value={page}
            disabled={isLoading || safeTotal === 0 || totalPages <= 1}
            onChange={(event) => setCurrentPage(Number(event.currentTarget.value))}
          >
            {Array.from({ length: totalPages }, (_, index) => (
              <option key={index + 1} value={index + 1}>{index + 1}</option>
            ))}
          </select>
        </label>
        <span aria-live="polite" aria-atomic="true">of {totalPages}</span>
        <button type="button" aria-label={nextLabel} title={nextLabel} disabled={navigationDisabled || atLast} onClick={() => setCurrentPage(Math.min(totalPages, page + 1))}>Next ›</button>
        <button type="button" aria-label={goToLastPageToolTip ?? 'Go to last page'} title={goToLastPageToolTip ?? 'Go to last page'} disabled={navigationDisabled || atLast} onClick={() => setCurrentPage(totalPages)}>Last »</button>
      </div>
    </nav>
  );
}
