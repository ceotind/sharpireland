'use client';

import { useState, useEffect } from 'react';
import { logActivity } from '../../utils/activity-logger-client';
import FileUploader from './FileUploader';

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

interface FileManagerProps {
  userId: string;
}

export default function FileManager({ userId }: FileManagerProps) {
  const [files, setFiles] = useState<UserFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedFolder, setSelectedFolder] = useState('all');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [showUploader, setShowUploader] = useState(false);
  const [editingFile, setEditingFile] = useState<UserFile | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const itemsPerPage = 20;

  useEffect(() => {
    loadFiles();
  }, [searchQuery, selectedType, selectedFolder, sortBy, sortOrder, currentPage]);

  const loadFiles = async () => {
    try {
      setLoading(true);
      
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
        sortBy,
        sortOrder
      });

      if (searchQuery) params.append('search', searchQuery);
      if (selectedType !== 'all') params.append('type', selectedType);

      const response = await fetch(`/api/files?${params}`);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to load files');
      }

      setFiles(result.data || []);
      setTotalPages(result.pagination?.total_pages || 1);

    } catch (err) {
      console.error('Error loading files:', err);
      setError(err instanceof Error ? err.message : 'Failed to load files');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (uploadedFile: UserFile) => {
    setFiles(prev => [uploadedFile, ...prev]);
    setShowUploader(false);
    
    await logActivity({
      action: 'file_uploaded_via_manager',
      description: `Uploaded file via file manager: ${uploadedFile.name}`,
      metadata: { file_id: uploadedFile.id, file_name: uploadedFile.name }
    });
  };

  const handleFileDelete = async (fileId: string) => {
    const file = files.find(f => f.id === fileId);
    if (!file) return;

    if (!confirm(`Are you sure you want to delete "${file.name}"?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/files/${fileId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || 'Failed to delete file');
      }

      setFiles(prev => prev.filter(f => f.id !== fileId));
      setSelectedFiles(prev => prev.filter(id => id !== fileId));

      await logActivity({
        action: 'file_deleted_via_manager',
        description: `Deleted file via file manager: ${file.name}`,
        metadata: { file_id: fileId, file_name: file.name }
      });

    } catch (err) {
      console.error('Error deleting file:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete file');
    }
  };

  const handleFileDownload = async (fileId: string) => {
    const file = files.find(f => f.id === fileId);
    if (!file) return;

    try {
      const response = await fetch(`/api/files/${fileId}?download=true`);
      
      if (!response.ok) {
        throw new Error('Failed to download file');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.original_name;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      await logActivity({
        action: 'file_downloaded_via_manager',
        description: `Downloaded file via file manager: ${file.name}`,
        metadata: { file_id: fileId, file_name: file.name }
      });

    } catch (err) {
      console.error('Error downloading file:', err);
      setError(err instanceof Error ? err.message : 'Failed to download file');
    }
  };

  const handleFileEdit = async (file: UserFile, updates: Partial<UserFile>) => {
    try {
      const response = await fetch(`/api/files/${file.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updates)
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || 'Failed to update file');
      }

      const result = await response.json();
      setFiles(prev => prev.map(f => f.id === file.id ? result.data : f));
      setEditingFile(null);

      await logActivity({
        action: 'file_updated_via_manager',
        description: `Updated file via file manager: ${file.name}`,
        metadata: { file_id: file.id, file_name: file.name }
      });

    } catch (err) {
      console.error('Error updating file:', err);
      setError(err instanceof Error ? err.message : 'Failed to update file');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedFiles.length === 0) return;

    if (!confirm(`Are you sure you want to delete ${selectedFiles.length} selected files?`)) {
      return;
    }

    try {
      const deletePromises = selectedFiles.map(fileId => 
        fetch(`/api/files/${fileId}`, { method: 'DELETE' })
      );

      await Promise.all(deletePromises);
      
      setFiles(prev => prev.filter(f => !selectedFiles.includes(f.id)));
      setSelectedFiles([]);

      await logActivity({
        action: 'files_bulk_deleted',
        description: `Bulk deleted ${selectedFiles.length} files`,
        metadata: { deleted_count: selectedFiles.length }
      });

    } catch (err) {
      console.error('Error bulk deleting files:', err);
      setError('Failed to delete some files');
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) {
      return (
        <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      );
    } else if (fileType === 'application/pdf') {
      return (
        <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      );
    } else if (fileType.includes('spreadsheet') || fileType.includes('excel')) {
      return (
        <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      );
    } else {
      return (
        <svg className="h-8 w-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      );
    }
  };

  const uniqueTypes = Array.from(new Set(files.map(f => f.file_type)));
  const uniqueFolders = Array.from(new Set(files.map(f => f.folder)));

  if (loading && files.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6" id="file-manager-loading">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6" id="file-manager-container">
      {/* Header */}
      <div className="flex items-center justify-between mb-6" id="file-manager-header">
        <h3 className="text-lg font-semibold text-gray-900">File Manager</h3>
        <button
          onClick={() => setShowUploader(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          id="upload-files-button"
        >
          Upload Files
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg" id="file-manager-error">
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => setError(null)}
            className="mt-2 text-sm text-red-600 hover:text-red-800"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Controls */}
      <div className="mb-6 space-y-4" id="file-manager-controls">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-64">
            <input
              type="text"
              placeholder="Search files..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              id="file-search-input"
            />
          </div>
          
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            id="file-type-filter"
          >
            <option value="all">All Types</option>
            {uniqueTypes.map((type) => (
              <option key={type} value={type}>
                {type.split('/')[1]?.toUpperCase() || type}
              </option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            id="file-sort-select"
          >
            <option value="created_at">Date Created</option>
            <option value="name">Name</option>
            <option value="file_size">Size</option>
            <option value="download_count">Downloads</option>
          </select>

          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            id="sort-order-toggle"
          >
            {sortOrder === 'asc' ? '↑' : '↓'}
          </button>

          <div className="flex border border-gray-300 rounded-lg">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-2 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
              id="grid-view-button"
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-2 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
              id="list-view-button"
            >
              List
            </button>
          </div>
        </div>

        {selectedFiles.length > 0 && (
          <div className="flex items-center gap-4 p-3 bg-blue-50 rounded-lg">
            <span className="text-sm text-blue-700">
              {selectedFiles.length} file{selectedFiles.length !== 1 ? 's' : ''} selected
            </span>
            <button
              onClick={handleBulkDelete}
              className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
              id="bulk-delete-button"
            >
              Delete Selected
            </button>
            <button
              onClick={() => setSelectedFiles([])}
              className="px-3 py-1 border border-gray-300 text-gray-700 text-sm rounded hover:bg-gray-50"
              id="clear-selection-button"
            >
              Clear Selection
            </button>
          </div>
        )}
      </div>

      {/* Files Display */}
      {files.length === 0 ? (
        <div className="text-center py-12 text-gray-500" id="no-files-message">
          <svg className="h-16 w-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p>No files found</p>
          <p className="text-sm mt-1">Upload some files to get started</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4" id="files-grid">
          {files.map((file) => (
            <div
              key={file.id}
              className={`border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer ${
                selectedFiles.includes(file.id) ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
              }`}
              onClick={() => {
                setSelectedFiles(prev => 
                  prev.includes(file.id) 
                    ? prev.filter(id => id !== file.id)
                    : [...prev, file.id]
                );
              }}
              id={`file-card-${file.id}`}
            >
              <div className="flex items-center justify-center mb-3">
                {getFileIcon(file.file_type)}
              </div>
              
              <h4 className="font-medium text-gray-900 text-sm truncate mb-1" title={file.name}>
                {file.name}
              </h4>
              
              <p className="text-xs text-gray-500 mb-2">
                {formatFileSize(file.file_size)}
              </p>
              
              <p className="text-xs text-gray-500 mb-3">
                {new Date(file.created_at).toLocaleDateString()}
              </p>

              <div className="flex items-center gap-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleFileDownload(file.id);
                  }}
                  className="flex-1 px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                  title="Download"
                >
                  Download
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingFile(file);
                  }}
                  className="px-2 py-1 text-xs border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
                  title="Edit"
                >
                  Edit
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleFileDelete(file.id);
                  }}
                  className="px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
                  title="Delete"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto" id="files-table">
          <table className="min-w-full border border-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                  <input
                    type="checkbox"
                    checked={selectedFiles.length === files.length && files.length > 0}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedFiles(files.map(f => f.id));
                      } else {
                        setSelectedFiles([]);
                      }
                    }}
                  />
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Name</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Type</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Size</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Created</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {files.map((file) => (
                <tr key={file.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedFiles.includes(file.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedFiles(prev => [...prev, file.id]);
                        } else {
                          setSelectedFiles(prev => prev.filter(id => id !== file.id));
                        }
                      }}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex-shrink-0">
                        {getFileIcon(file.file_type)}
                      </div>
                      <span className="text-sm text-gray-900 truncate">{file.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {file.file_type.split('/')[1]?.toUpperCase() || file.file_type}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {formatFileSize(file.file_size)}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {new Date(file.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleFileDownload(file.id)}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        Download
                      </button>
                      <button
                        onClick={() => setEditingFile(file)}
                        className="text-gray-600 hover:text-gray-800 text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleFileDelete(file.id)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between" id="file-pagination">
          <div className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border border-gray-300 text-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border border-gray-300 text-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* File Uploader Modal */}
      {showUploader && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" id="file-uploader-modal">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Upload Files</h3>
              <button
                onClick={() => setShowUploader(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <FileUploader userId={userId} onFileUploaded={handleFileUpload} />
          </div>
        </div>
      )}

      {/* Edit File Modal */}
      {editingFile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" id="edit-file-modal">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Edit File</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                handleFileEdit(editingFile, {
                  name: formData.get('name') as string,
                  description: formData.get('description') as string,
                  folder: formData.get('folder') as string
                });
              }}
            >
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    name="name"
                    defaultValue={editingFile.name}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    name="description"
                    defaultValue={editingFile.description || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Folder</label>
                  <input
                    type="text"
                    name="folder"
                    defaultValue={editingFile.folder}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={() => setEditingFile(null)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}