'use client';

import { useCSVImport } from '@/hooks/useCSVImport';
import UploadSection from '@/components/UploadSection';
import PreviewTable from '@/components/PreviewTable';
import ConfirmButton from '@/components/ConfirmButton';
import ResultsTable from '@/components/ResultsTable';
import { Toaster } from 'react-hot-toast';

export default function Home() {
  const { state, handleFileUpload, handleConfirmImport, handleReset, goToConfirm, goBackToPreview } =
    useCSVImport();

  return (
    <main className="min-h-screen bg-white dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <Toaster position="top-right" />

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            GrowEasy CSV Importer
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Intelligently extract CRM lead data from any CSV format using AI
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-12">
          <div className="flex justify-between items-center max-w-2xl mx-auto">
            {['upload', 'preview', 'confirm', 'results'].map((step, index) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    ['upload', 'preview', 'confirm', 'results'].indexOf(state.step) >= index
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                  }`}
                >
                  {index + 1}
                </div>
                {index < 3 && (
                  <div
                    className={`h-1 w-12 mx-2 ${
                      ['upload', 'preview', 'confirm', 'results'].indexOf(state.step) > index
                        ? 'bg-blue-600'
                        : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Error Message */}
        {state.error && (
          <div className="max-w-2xl mx-auto mb-8 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-800 dark:text-red-200 font-semibold">Error</p>
            <p className="text-red-700 dark:text-red-300 text-sm">{state.error}</p>
          </div>
        )}

        {/* Step 1: Upload */}
        {state.step === 'upload' && (
          <UploadSection onFileUpload={handleFileUpload} isLoading={state.isLoading} />
        )}

        {/* Step 2: Preview */}
        {state.step === 'preview' && (
          <div className="max-w-6xl mx-auto">
            <PreviewTable headers={state.headers} rows={state.rows} rowCount={state.rows.length} />
            <div className="mt-8 flex gap-4 max-w-2xl mx-auto">
              <button
                onClick={handleReset}
                className="flex-1 px-6 py-3 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg font-semibold transition-colors"
              >
                Upload Different File
              </button>
              <button
                onClick={goToConfirm}
                className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
                Continue to Confirmation
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Confirm */}
        {state.step === 'confirm' && (
          <ConfirmButton
            rowCount={state.rows.length}
            onConfirm={handleConfirmImport}
            isLoading={state.isLoading}
            onBack={goBackToPreview}
          />
        )}

        {/* Step 4: Results */}
        {state.step === 'results' && (
          <ResultsTable
            importedRecords={state.importedRecords}
            skippedRecords={state.skippedRecords}
            statistics={state.statistics}
            onReset={handleReset}
          />
        )}
      </div>
    </main>
  );
}
