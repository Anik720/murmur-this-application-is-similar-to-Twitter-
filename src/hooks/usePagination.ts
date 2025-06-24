import { useState } from 'react';

export function usePagination(initialPage: number = 1, pageSize: number = 10) {
  const [page, setPage] = useState(initialPage);

  const nextPage = () => setPage((prev) => prev + 1);
  const prevPage = () => setPage((prev) => Math.max(1, prev - 1));
  const resetPage = () => setPage(initialPage);

  return {
    page,
    pageSize,
    nextPage,
    prevPage,
    resetPage,
    setPage,
  };
}