'use client';

import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useUploadStore } from '@/presentation/store/uploadStore';

interface FileUploaderProps {
  onUpload: (files: File[]) => void;
}

export const FileUploader: React.FC<FileUploaderProps> = ({ onUpload }) => {
  const { addFiles, setStatus } = useUploadStore();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    addFiles(acceptedFiles);
    setStatus('uploading');
    onUpload(acceptedFiles);
  }, [addFiles, setStatus, onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/json': ['.json']
    },
    maxSize: 100 * 1024 * 1024, // 100MB
    multiple: true
  });

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          isDragActive
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        <input {...getInputProps()} />
        <div className="space-y-2">
          <div className="text-2xl">📁</div>
          {isDragActive ? (
            <p className="text-blue-600">파일을 여기에 놓으세요...</p>
          ) : (
            <>
              <p className="text-gray-600">
                파일을 드래그하거나 클릭하여 업로드하세요
              </p>
              <p className="text-sm text-gray-500">
                JSON 파일만 지원 (최대 100MB)
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
