import httpClient from '../httpClient';
import type { Subproject } from '../../types/api';

export const subprojectService = {
  getAll: () => httpClient.get<Subproject[]>('/subprojects'),
  getByRegionId: (regionId: string) =>
    httpClient.get<Subproject[]>(`/subprojects/region/${regionId}`),
  getById: (id: string) => httpClient.get<Subproject>(`/subprojects/${id}`),
  create: (data: Omit<Subproject, 'id'>) => httpClient.post<Subproject>('/subprojects', data),
  updateById: (id: string, data: Partial<Subproject>) =>
    httpClient.put<Subproject>(`/subprojects/${id}`, data),
  deleteById: (id: string) => httpClient.delete<Subproject>(`/subprojects/${id}`)

};
