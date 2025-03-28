'use client';

import {
  useQuery,
  useMutation,
  useQueryClient
} from '@tanstack/react-query';
import axios from 'axios';

// Get verification requests - for admin or expert
export function useVerificationRequests(status) {
  return useQuery({
    queryKey: ['verification', status],
    queryFn: async () => {
      let url = '/api/verification';
      if (status) {
        url += `?status=${status}`;
      }
      const response = await axios.get(url);
      return response.data;
    },
  });
}

// Get a specific verification request
export function useVerificationRequest(id) {
  return useQuery({
    queryKey: ['verification', id],
    queryFn: async () => {
      if (!id) return null;
      const response = await axios.get(`/api/verification?id=${id}`);
      return response.data;
    },
    enabled: !!id,
  });
}

// Create a verification request - for experts
export function useCreateVerificationRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (requestData) => {
      const response = await axios.post('/api/verification', requestData);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate the verification requests query to refetch the data
      queryClient.invalidateQueries({ queryKey: ['verification'] });
    },
  });
}

// Update a verification request - for admins
export function useUpdateVerificationRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (requestData) => {
      const response = await axios.patch('/api/verification', requestData);
      return response.data;
    },
    onSuccess: (data) => {
      // Update the specific request in the cache
      queryClient.invalidateQueries({ queryKey: ['verification', data.id] });
      // Invalidate the requests list
      queryClient.invalidateQueries({ queryKey: ['verification'] });
    },
  });
}

// Check if the current expert has a pending verification
export function useExpertVerificationStatus() {
  return useQuery({
    queryKey: ['expertVerificationStatus'],
    queryFn: async () => {
      const response = await axios.get('/api/verification');
      if (response.data && Array.isArray(response.data) && response.data.length > 0) {
        return response.data[0];
      }
      return null;
    },
  });
}
