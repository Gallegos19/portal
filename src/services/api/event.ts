import httpClient from '../httpClient';
import type { Event } from '../../types/api';

export const eventService = {
  getAll: () => httpClient.get<Event[]>('/events'),
  getById: (id: string) => httpClient.get<Event>(`/events/${id}`),
  getByCreatorId: (creatorId: string) =>
    httpClient.get<Event[]>(`/events/creator/${creatorId}`),
  create: (data: Omit<Event, 'id'>) => httpClient.post<Event>('/events', data),
  updateById: (id: string, data: Partial<Event>) =>
    httpClient.put<Event>(`/events/${id}`, data),
  deleteById: (id: string) => httpClient.delete<Event>(`/events/${id}`)
};
