'use client';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

import { useSearchParams } from 'next/navigation';

export default function ProductPagination({ totalPages }) {
  const searchParams = useSearchParams();
  const currentPage = parseInt(searchParams.get('page') || '1', 10);

  const getPageHref = (targetPage) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', targetPage);
    return `/product?${params.toString()}`;
  };

  const visiblePages = Array.from(
    { length: totalPages },
    (_, i) => i + 1
  ).filter((p) => Math.abs(p - currentPage) <= 2);

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={getPageHref(currentPage - 1)}
            className={currentPage <= 1 ? 'pointer-events-none opacity-50' : ''}
          />
        </PaginationItem>

        {currentPage > 3 && (
          <>
            <PaginationItem>
              <PaginationLink href={getPageHref(1)}>1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          </>
        )}

        {visiblePages.map((p) => (
          <PaginationItem key={p}>
            <PaginationLink href={getPageHref(p)} isActive={p === currentPage}>
              {p}
            </PaginationLink>
          </PaginationItem>
        ))}

        {currentPage < totalPages - 2 && (
          <>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href={getPageHref(totalPages)}>
                {totalPages}
              </PaginationLink>
            </PaginationItem>
          </>
        )}

        <PaginationItem>
          <PaginationNext
            href={getPageHref(currentPage + 1)}
            className={
              currentPage >= totalPages ? 'pointer-events-none opacity-50' : ''
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
