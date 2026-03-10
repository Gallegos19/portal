import httpClient from '../httpClient';
import type { Region } from '../../types/api';

export interface CreateRegionPayload {
  name_region: string;
  id_coordinator: string;
}

export interface UpdateRegionPayload {
  name_region?: string;
  id_coordinator?: string;
}

export const regionService = {
  getAll: () => httpClient.get<Region[]>('/regions'),
  getById: (id: string) => httpClient.get<Region>(`/regions/${id}`),
  create: (data: CreateRegionPayload) => httpClient.post<Region>('/regions', data),
  updateById: (id: string, data: UpdateRegionPayload) =>
    httpClient.put<Region>(`/regions/${id}`, data),
  deleteById: (id: string) => httpClient.delete<Region>(`/regions/${id}`)
};
