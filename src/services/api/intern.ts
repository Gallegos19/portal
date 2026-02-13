import httpClient from '../httpClient';
import type { Intern } from '../../types/api';

export const internService = {
  getAll: () => httpClient.get<Intern[]>('/interns')
};
