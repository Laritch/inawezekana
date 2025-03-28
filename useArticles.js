'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchArticles } from '../api';

export function useArticles() {
  return useQuery({
    queryKey: ['articles'],
    queryFn: fetchArticles,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });
}

export function usePrefetchArticles(queryClient) {
  return () => {
    queryClient.prefetchQuery({
      queryKey: ['articles'],
      queryFn: fetchArticles,
      staleTime: 1000 * 60 * 5, // 5 minutes
    });
  };
}
