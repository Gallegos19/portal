import httpClient from '../httpClient';
import type { Training } from '../../types/api';

export const trainingService = {
  getAll: () => httpClient.get<Training[]>('/trainings'),
  getById: (id: string) => httpClient.get<Training>(`/trainings/${id}`),
  getByCreatorId: (creatorId: string) =>
    httpClient.get<Training[]>(`/trainings/creator/${creatorId}`),
  create: (data: Omit<Training, 'id'>) => httpClient.post<Training>('/trainings', data),
  updateById: (id: string, data: Partial<Training>) =>
    httpClient.put<Training>(`/trainings/${id}`, data),
  deleteById: (id: string) => httpClient.delete<Training>(`/trainings/${id}`)
};
