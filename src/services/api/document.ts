import httpClient from '../httpClient';
import type { Document } from '../../types/api';

export const documentService = {
  getAll: () => httpClient.get<Document[]>('/documents'),
  getById: (id: string) => httpClient.get<Document>(`/documents/${id}`),
  getByInternId: (internId: string) =>
    httpClient.get<Document[]>(`/documents/intern/${internId}`),
  create: (data: Omit<Document, 'id'>) => httpClient.post<Document>('/documents', data),
  updateById: (id: string, data: Partial<Document>) =>
    httpClient.put<Document>(`/documents/${id}`, data),
  deleteById: (id: string) => httpClient.delete<Document>(`/documents/${id}`)
};
