import httpClient from '../httpClient';
import type { Intern } from '../../types/api';

export const internService = {
  getAll: () => httpClient.get<Intern[]>('/interns'),
  getById: (id: string) => httpClient.get<Intern>(`/interns/${id}`),
  getByUserId: (userId: string) => httpClient.get<Intern>(`/interns/user/${userId}`),
  getByFacilitatorId: (facilitatorId: string) =>
    httpClient.get<Intern[]>(`/interns/facilitator/${facilitatorId}`),
  getBySubprojectId: (subprojectId: string) =>
    httpClient.get<Intern[]>(`/interns/subproject/${subprojectId}`),
  create: (data: Omit<Intern, 'id'>) => httpClient.post<Intern>('/interns', data),
  updateById: (id: string, data: Partial<Intern>) =>
    httpClient.put<Intern>(`/interns/${id}`, data),
  deleteById: (id: string) => httpClient.delete<Intern>(`/interns/${id}`)
};
