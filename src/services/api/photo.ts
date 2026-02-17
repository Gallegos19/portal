import httpClient from '../httpClient';
import type { Photo } from '../../types/api';

export const photoService = {
  getAll: () => httpClient.get<Photo[]>('/photos'),
  getById: (id: string) => httpClient.get<Photo>(`/photos/${id}`),
  getByCreatorId: (creatorId: string) =>
    httpClient.get<Photo[]>(`/photos/creator/${creatorId}`),
  create: (data: Omit<Photo, 'id'>) => httpClient.post<Photo>('/photos', data),
  updateById: (id: string, data: Partial<Photo>) =>
    httpClient.put<Photo>(`/photos/${id}`, data),
  deleteById: (id: string) => httpClient.delete<Photo>(`/photos/${id}`)
};
