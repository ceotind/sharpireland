'use client';

import { useState, useRef } from 'react';
import { logActivity } from '../../utils/activity-logger-client';

interface UserFile {
  id: string;
  name: string;
  original_name: string;
  file_path: string;
  file_url: string;
  file_type: string;
  file_size: number;
  folder: string;
  description: string | null;
  tags: string[] | null;
  download_count: number;
  last_accessed: string | null;
  created_at: string;
  updated_at: string;
}

interface FileUploaderProps {
  userId: string;
  onFileUploaded?: (file: UserFile) => void;
  maxFiles?: number;
  maxFileSize?: number; // in bytes
  acceptedTypes?: string[];
  folder?: string;
}

interface UploadingFile {
  file: File;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
  error?: string;
  uploadedFile?: UserFile;
}

export default function FileUploader({
  userId,
  onFileUploaded,
  maxFiles = 10,
  maxFileSize = 10 * 1024 * 1024, // 10MB
  acceptedTypes = [
    'image/jpeg', 'image/png', 'image/gif', 'image/webp',
    'application/pdf', 'text/plain', 'text/csv',
    'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/zip', 'application/x-zip-compressed'
  ],
  folder = 'uploads'
}: FileUploaderProps) {
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    if (file.size > maxFileSize) {
      return `File size exceeds ${formatFileSize(maxFileSize)} limit`;
    }

    if (!acceptedTypes.includes(file.type)) {
      return 'File type not supported';
    }

    return null;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const uploadFile = async (file: File, description: string = '') => {
    const uploadingFile: UploadingFile = {
      file,
      progress: 0,
      status: 'uploading'
    };

    setUploadingFiles(prev => [...prev, uploadingFile]);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);
      formData.append('description', description);
      formData.append('userId', userId);

      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setUploadingFiles(prev => prev.map(uf => 
          uf.file === file && uf.status === 'uploading'
            ? { ...uf, progress: Math.min(uf.progress + 10, 90) }
            : uf
        ));
      }, 200);

      const response = await fetch('/api/files', {
        method: 'POST',
        body: formData
      });

      clearInterval(progressInterval);

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to upload file');
      }

      // Update to completed
      setUploadingFiles(prev => prev.map(uf => 
        uf.file === file
          ? { ...uf, progress: 100, status: 'completed', uploadedFile: result.data }
          : uf
      ));

      // Log activity
      await logActivity({
        action: 'file_uploaded',
        description: `Uploaded file: ${file.name}`,
        metadata: {
          file_name: file.name,
          file_type: file.type,
          file_size: file.size,
          folder
        }
      });

      // Notify parent component
      if (onFileUploaded) {
        onFileUploaded(result.data);
      }

    } catch (err) {
      console.error('Error uploading file:', err);
      
      setUploadingFiles(prev => prev.map(uf => 
        uf.file === file
          ? { 
              ...uf, 
              progress: 0, 
              status: 'error', 
              error: err instanceof Error ? err.message : 'Upload failed' 
            }
          : uf
      ));
    }
  };

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    setError(null);
    const fileArray = Array.from(files);

    // Check max files limit
    if (uploadingFiles.length + fileArray.length > maxFiles) {
      setError(`Cannot upload more than ${maxFiles} files at once`);
      return;
    }

    // Validate each file
    const validFiles: File[] = [];
    const errors: string[] = [];

    fileArray.forEach(file => {
      const validationError = validateFile(file);
      if (validationError) {
        errors.push(`${file.name}: ${validationError}`);
      } else {
        validFiles.push(file);
      }
    });

    if (errors.length > 0) {
      setError(errors.join(', '));
    }

    // Upload valid files
    validFiles.forEach(file => {
      uploadFile(file);
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const removeUploadingFile = (file: File) => {
    setUploadingFiles(prev => prev.filter(uf => uf.file !== file));
  };

  const retryUpload = (file: File) => {
    setUploadingFiles(prev => prev.filter(uf => uf.file !== file));
    uploadFile(file);
  };

  const clearCompleted = () => {
    setUploadingFiles(prev => prev.filter(uf => uf.status !== 'completed'));
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) {
      return (
        <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      );
    } else if (fileType === 'application/pdf') {
      return (
        <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      );
    } else {
      return (
        <svg className="h-6 w-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      );
    }
  };

  return (
    <div className="space-y-4" id="file-uploader-container">
      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragOver
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        id="file-drop-zone"
      >
        <svg className="h-12 w-12 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
        
        <p className="text-lg font-medium text-gray-900 mb-2">
          Drop files here or click to browse
        </p>
        
        <p className="text-sm text-gray-600 mb-4">
          Maximum {maxFiles} files, up to {formatFileSize(maxFileSize)} each
        </p>
        
        <button
          onClick={() => fileInputRef.current?.click()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          id="browse-files-button"
        >
          Browse Files
        </button>
        
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptedTypes.join(',')}
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
          id="file-input"
        />
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg" id="upload-error">
          <p className="text-red-600 text-sm">{error}</p>
          <button
            onClick={() => setError(null)}
            className="mt-2 text-sm text-red-600 hover:text-red-800"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Uploading Files */}
      {uploadingFiles.length > 0 && (
        <div className="space-y-3" id="uploading-files-list">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-gray-900">
              Uploading Files ({uploadingFiles.length})
            </h4>
            {uploadingFiles.some(uf => uf.status === 'completed') && (
              <button
                onClick={clearCompleted}
                className="text-sm text-blue-600 hover:text-blue-800"
                id="clear-completed-button"
              >
                Clear Completed
              </button>
            )}
          </div>

          {uploadingFiles.map((uploadingFile, index) => (
            <div
              key={`${uploadingFile.file.name}-${index}`}
              className="border border-gray-200 rounded-lg p-4"
              id={`uploading-file-${index}`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  {getFileIcon(uploadingFile.file.type)}
                  <div>
                    <p className="font-medium text-gray-900 text-sm">
                      {uploadingFile.file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(uploadingFile.file.size)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {uploadingFile.status === 'completed' && (
                    <svg className="h-5 w-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                  
                  {uploadingFile.status === 'error' && (
                    <button
                      onClick={() => retryUpload(uploadingFile.file)}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      Retry
                    </button>
                  )}

                  <button
                    onClick={() => removeUploadingFile(uploadingFile.file)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Progress Bar */}
              {uploadingFile.status === 'uploading' && (
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadingFile.progress}%` }}
                  ></div>
                </div>
              )}

              {/* Status */}
              <div className="text-xs">
                {uploadingFile.status === 'uploading' && (
                  <span className="text-blue-600">
                    Uploading... {uploadingFile.progress}%
                  </span>
                )}
                {uploadingFile.status === 'completed' && (
                  <span className="text-green-600">Upload completed</span>
                )}
                {uploadingFile.status === 'error' && (
                  <span className="text-red-600">
                    Error: {uploadingFile.error}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Supported File Types */}
      <div className="text-xs text-gray-500" id="supported-types">
        <p className="font-medium mb-1">Supported file types:</p>
        <p>
          Images (JPEG, PNG, GIF, WebP), Documents (PDF, DOC, DOCX), 
          Spreadsheets (XLS, XLSX), Text files (TXT, CSV), Archives (ZIP)
        </p>
      </div>
    </div>
  );
}