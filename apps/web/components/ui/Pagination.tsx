import Link from 'next/link';

export type PaginationProps = {
  currentPage: number;
  totalPages: number;
  basePath?: string;
  searchParams?: Record<string, string | undefined>;
  className?: string;
};

export function Pagination({
  currentPage,
  totalPages,
  basePath = '',
  searchParams = {},
  className = '',
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const showEllipsis = totalPages > 7;

    if (!showEllipsis) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const buildHref = (page: number) => {
    const params = new URLSearchParams();
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value !== undefined) params.set(key, value);
    });
    if (page > 1) params.set('page', String(page));
    const suffix = params.toString() ? `?${params.toString()}` : '';
    return `${basePath}${suffix}`;
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Link
        href={currentPage > 1 ? buildHref(currentPage - 1) : '#'}
        className={`rounded-md border border-[var(--rws-border)] px-3 py-1 text-sm hover:bg-[var(--rws-surface)] ${
          currentPage === 1 ? 'pointer-events-none opacity-50' : ''
        }`}
      >
        Previous
      </Link>

      <div className="flex items-center gap-1">
        {getPageNumbers().map((page, index) => (
          <div key={index}>
            {page === '...' ? (
              <span className="px-2 text-[var(--rws-muted)]">...</span>
            ) : (
              <Link
                href={buildHref(page as number)}
                className={`rounded-md px-3 py-1 text-sm ${
                  currentPage === page
                    ? 'bg-[var(--rws-fg)] text-white'
                    : 'border border-[var(--rws-border)] hover:bg-[var(--rws-surface)]'
                }`}
              >
                {page}
              </Link>
            )}
          </div>
        ))}
      </div>

      <Link
        href={currentPage < totalPages ? buildHref(currentPage + 1) : '#'}
        className={`rounded-md border border-[var(--rws-border)] px-3 py-1 text-sm hover:bg-[var(--rws-surface)] ${
          currentPage === totalPages ? 'pointer-events-none opacity-50' : ''
        }`}
      >
        Next
      </Link>
    </div>
  );
}
