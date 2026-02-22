// uploadService.ts - Service for file uploads
import { archiveService } from './archive';
import type { Archive } from '../../types/api';

export const uploadService = {
  uploadFile: async (
    file: File,
    uploadedBy: string,
    fileType?: string,
    folder?: string,
    onUploadProgress?: (progress: number) => void
  ): Promise<Archive> => {
    const response = await archiveService.uploadFile(
      file,
      uploadedBy,
      fileType,
      folder,
      onUploadProgress
    );
    return response.data;
  }
};
