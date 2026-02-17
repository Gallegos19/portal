import httpClient from '../httpClient';
import type { SocialFacilitator } from '../../types/api';

export const socialFacilitatorService = {
  getAll: () => httpClient.get<SocialFacilitator[]>('/social-facilitators'),
  getById: (id: string) => httpClient.get<SocialFacilitator>(`/social-facilitators/${id}`),
  getByUserId: (userId: string) =>
    httpClient.get<SocialFacilitator>(`/social-facilitators/user/${userId}`),
  getBySubprojectId: (subprojectId: string) =>
    httpClient.get<SocialFacilitator[]>(`/social-facilitators/subproject/${subprojectId}`),
  create: (data: Omit<SocialFacilitator, 'id'>) =>
    httpClient.post<SocialFacilitator>('/social-facilitators', data),
  updateById: (id: string, data: Partial<SocialFacilitator>) =>
    httpClient.put<SocialFacilitator>(`/social-facilitators/${id}`, data),
  deleteById: (id: string) =>
    httpClient.delete<SocialFacilitator>(`/social-facilitators/${id}`)
};
