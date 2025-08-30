import { create } from 'zustand';

export interface UploadFile {
  id: string;
  name: string;
  size: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  progress: number;
  error?: string;
}

export interface UploadError {
  fileId: string;
  message: string;
}

interface UploadState {
  files: UploadFile[];
  status: 'idle' | 'uploading' | 'processing' | 'complete' | 'error';
  progress: number;
  errors: UploadError[];
  addFiles: (files: File[]) => void;
  updateFileStatus: (fileId: string, status: UploadFile['status'], progress?: number, error?: string) => void;
  setStatus: (status: UploadState['status']) => void;
  setProgress: (progress: number) => void;
  addError: (error: UploadError) => void;
  clearErrors: () => void;
  reset: () => void;
}

export const useUploadStore = create<UploadState>((set) => ({
  files: [],
  status: 'idle',
  progress: 0,
  errors: [],
  addFiles: (files) => set((state) => ({
    files: [
      ...state.files,
      ...files.map((file, index) => ({
        id: `${Date.now()}-${index}`,
        name: file.name,
        size: file.size,
        status: 'pending' as const,
        progress: 0
      }))
    ]
  })),
  updateFileStatus: (fileId, status, progress = 0, error) => set((state) => ({
    files: state.files.map(file => 
      file.id === fileId 
        ? { ...file, status, progress, error }
        : file
    )
  })),
  setStatus: (status) => set({ status }),
  setProgress: (progress) => set({ progress }),
  addError: (error) => set((state) => ({ errors: [...state.errors, error] })),
  clearErrors: () => set({ errors: [] }),
  reset: () => set({ files: [], status: 'idle', progress: 0, errors: [] }),
}));
