import httpClient from '../httpClient';
import type { Report } from '../../types/api';

export const reportService = {
  getAll: () => httpClient.get<Report[]>('/reports'),
  getByCreatorId: (creatorId: string) =>
    httpClient.get<Report[]>(`/reports/creator/${creatorId}`),
  getByType: (type: string) => httpClient.get<Report[]>(`/reports/type/${type}`),
  getById: (id: string) => httpClient.get<Report>(`/reports/${id}`),
  create: (data: Omit<Report, 'id'>) => httpClient.post<Report>('/reports', data),
  updateById: (id: string, data: Partial<Report>) =>
    httpClient.put<Report>(`/reports/${id}`, data),
  deleteById: (id: string) => httpClient.delete<Report>(`/reports/${id}`)
};
