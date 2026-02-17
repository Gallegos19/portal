import httpClient from '../httpClient';
import type { EventPhoto } from '../../types/api';

export const eventPhotoService = {
  create: (data: Omit<EventPhoto, 'id'>) =>
    httpClient.post<EventPhoto>('/event-photos', data),
  getByEventId: (eventId: string) =>
    httpClient.get<EventPhoto[]>(`/event-photos/event/${eventId}`),
  getByPhotoId: (photoId: string) =>
    httpClient.get<EventPhoto[]>(`/event-photos/photo/${photoId}`),
  updateById: (id: string, data: Partial<EventPhoto>) =>
    httpClient.put<EventPhoto>(`/event-photos/${id}`, data),
  deleteById: (id: string) => httpClient.delete<EventPhoto>(`/event-photos/${id}`)
};
