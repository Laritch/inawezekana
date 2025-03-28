'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchCategories } from '../api';

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
    staleTime: 1000 * 60 * 60, // 1 hour
    refetchOnWindowFocus: false,
  });
}

export function usePrefetchCategories(queryClient) {
  return () => {
    queryClient.prefetchQuery({
      queryKey: ['categories'],
      queryFn: fetchCategories,
      staleTime: 1000 * 60 * 60, // 1 hour
    });
  };
}
