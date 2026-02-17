import httpClient from '../httpClient';
import type { SuccessStory } from '../../types/api';

export const successStoryService = {
  getAll: () => httpClient.get<SuccessStory[]>('/success-stories'),
  getById: (id: string) => httpClient.get<SuccessStory>(`/success-stories/${id}`),
  getByCreatorId: (creatorId: string) =>
    httpClient.get<SuccessStory[]>(`/success-stories/creator/${creatorId}`),
  create: (data: Omit<SuccessStory, 'id'>) =>
    httpClient.post<SuccessStory>('/success-stories', data),
  updateById: (id: string, data: Partial<SuccessStory>) =>
    httpClient.put<SuccessStory>(`/success-stories/${id}`, data),
  deleteById: (id: string) => httpClient.delete<SuccessStory>(`/success-stories/${id}`)
};
