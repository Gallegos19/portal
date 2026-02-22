import httpClient from '../httpClient';
import type { Archive, SignedUrlResponse } from '../../types/api';

export const archiveService = {
  getSignedUrl: (archiveId: string, expiresInSeconds?: number) =>
    httpClient.get<SignedUrlResponse>(`/archives/${archiveId}/signed-url`, {
      params: expiresInSeconds ? { expiresIn: expiresInSeconds } : undefined
    }),
  
  uploadFile: (
    file: File,
    uploadedBy: string,
    fileType?: string,
    folder?: string,
    onUploadProgress?: (progress: number) => void
  ) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('uploaded_by', uploadedBy);
    if (fileType) formData.append('file_type', fileType);
    if (folder) formData.append('folder', folder);

    return httpClient.post<Archive>('/archives', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress: (progressEvent) => {
        if (onUploadProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onUploadProgress(progress);
        }
      }
    });
  },
  
  create: (data: Omit<Archive, 'id' | 'upload_date'>) => httpClient.post<Archive>('/archives', data),
  deleteById: (id: string) => httpClient.delete(`/archives/${id}`)
};
