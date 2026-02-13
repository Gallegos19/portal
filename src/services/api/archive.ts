import httpClient from '../httpClient';
import type { SignedUrlResponse } from '../../types/api';

export const archiveService = {
  getSignedUrl: (archiveId: string, expiresInSeconds?: number) =>
    httpClient.get<SignedUrlResponse>(`/archives/${archiveId}/signed-url`, {
      params: expiresInSeconds ? { expiresIn: expiresInSeconds } : undefined
    })
};
