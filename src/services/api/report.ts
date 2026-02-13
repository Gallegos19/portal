import httpClient from '../httpClient';
import type { Report } from '../../types/api';

export const reportService = {
  getAll: () => httpClient.get<Report[]>('/reports'),
  getByCreatorId: (creatorId: string) =>
    httpClient.get<Report[]>(`/reports/creator/${creatorId}`),
  getById: (id: string) => httpClient.get<Report>(`/reports/${id}`)
};
