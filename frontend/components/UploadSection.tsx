'use client';

import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import toast from 'react-hot-toast';

interface UploadSectionProps {
  onFileUpload: (file: File) => void;
  isLoading: boolean;
}

export default function UploadSection({ onFileUpload, isLoading }: UploadSectionProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) {
        toast.error('Please upload a CSV file');
        return;
      }

      const file = acceptedFiles[0];
      if (!file.name.endsWith('.csv')) {
        toast.error('Only CSV files are supported');
        return;
      }

      onFileUpload(file);
    },
    [onFileUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'text/csv': ['.csv'] },
    disabled: isLoading,
  });

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Step 1: Upload CSV File
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Upload a CSV file from any source (Facebook, Google Ads, Excel, etc.)
        </p>
      </div>

      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-all ${
          isDragActive
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
        } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <input {...getInputProps()} />

        <div className="space-y-4">
          <svg
            className="w-16 h-16 mx-auto text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>

          {isDragActive ? (
            <>
              <p className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                Drop your CSV file here
              </p>
            </>
          ) : (
            <>
              <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                Drag and drop your CSV file here
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                or click to browse for a file
              </p>
            </>
          )}

          {isLoading && (
            <div className="inline-flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">Processing...</span>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <p className="text-sm text-gray-700 dark:text-gray-300">
          <strong>Supported formats:</strong> CSV files from Facebook Lead Exports, Google Ads,
          Excel sheets, Real Estate CRM exports, and more.
        </p>
      </div>
    </div>
  );
}
