import httpClient from '../httpClient';
import type { TrainingProgress } from '../../types/api';

export const trainingProgressService = {
  getAll: () => httpClient.get<TrainingProgress[]>('/training-progress'),
  getById: (id: string) => httpClient.get<TrainingProgress>(`/training-progress/${id}`),
  getByTrainingId: (trainingId: string) =>
    httpClient.get<TrainingProgress[]>(`/training-progress/training/${trainingId}`),
  getByUserId: (userId: string) =>
    httpClient.get<TrainingProgress[]>(`/training-progress/user/${userId}`),
  getByTrainingAndUser: (trainingId: string, userId: string) =>
    httpClient.get<TrainingProgress>(
      `/training-progress/training/${trainingId}/user/${userId}`
    ),
  create: (data: Omit<TrainingProgress, 'id'>) =>
    httpClient.post<TrainingProgress>('/training-progress', data),
  updateById: (id: string, data: Partial<TrainingProgress>) =>
    httpClient.put<TrainingProgress>(`/training-progress/${id}`, data),
  deleteById: (id: string) => httpClient.delete<TrainingProgress>(`/training-progress/${id}`)
};
