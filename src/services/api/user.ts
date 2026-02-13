import httpClient from '../httpClient';
import type { UserApi } from '../../types/api';

export const userService = {
  getAll: () => httpClient.get<UserApi[]>('/users')
};
