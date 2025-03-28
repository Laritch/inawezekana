'use client';

import {
  useQuery,
  useMutation,
  useQueryClient
} from '@tanstack/react-query';
import axios from 'axios';

// Get all appointments for the current user
export function useAppointments() {
  return useQuery({
    queryKey: ['appointments'],
    queryFn: async () => {
      const response = await axios.get('/api/appointments');
      return response.data;
    },
  });
}

// Get a specific appointment by ID
export function useAppointment(id) {
  return useQuery({
    queryKey: ['appointments', id],
    queryFn: async () => {
      if (!id) return null;
      const response = await axios.get(`/api/appointments?id=${id}`);
      return response.data;
    },
    enabled: !!id,
  });
}

// Create a new appointment
export function useCreateAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (appointmentData) => {
      const response = await axios.post('/api/appointments', appointmentData);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate the appointments query to refetch the data
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
  });
}

// Update an existing appointment
export function useUpdateAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (appointmentData) => {
      const response = await axios.patch('/api/appointments', appointmentData);
      return response.data;
    },
    onSuccess: (data) => {
      // Update the specific appointment in the cache
      queryClient.invalidateQueries({ queryKey: ['appointments', data.id] });
      // Invalidate the appointments list
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
  });
}

// Utility function to format dates for the calendar
export function formatAppointmentsForCalendar(appointments) {
  if (!appointments || !Array.isArray(appointments)) return [];

  return appointments.map(appointment => {
    const date = new Date(appointment.date);
    const startTimeParts = appointment.startTime.split(':');
    const endTimeParts = appointment.endTime.split(':');

    const start = new Date(date);
    start.setHours(
      parseInt(startTimeParts[0], 10),
      parseInt(startTimeParts[1] || '0', 10)
    );

    const end = new Date(date);
    end.setHours(
      parseInt(endTimeParts[0], 10),
      parseInt(endTimeParts[1] || '0', 10)
    );

    // Different colors based on status
    const statusColors = {
      pending: '#FFC107', // yellow
      confirmed: '#4CAF50', // green
      cancelled: '#F44336', // red
      completed: '#2196F3', // blue
    };

    return {
      id: appointment.id,
      title: appointment.subject,
      start,
      end,
      extendedProps: {
        status: appointment.status,
        notes: appointment.notes,
        clientName: appointment.clientName,
        expertName: appointment.expertName,
        clientId: appointment.clientId,
        expertId: appointment.expertId,
      },
      backgroundColor: statusColors[appointment.status] || '#9E9E9E',
      borderColor: statusColors[appointment.status] || '#9E9E9E',
    };
  });
}

// Get available time slots for an expert
export function useExpertAvailability(expertId, date) {
  return useQuery({
    queryKey: ['expertAvailability', expertId, date],
    queryFn: async () => {
      if (!expertId || !date) return null;

      const response = await axios.get(`/api/availability?expertId=${expertId}&date=${date}`);
      return response.data;
    },
    enabled: !!expertId && !!date,
  });
}
