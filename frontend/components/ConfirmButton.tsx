'use client';

interface ConfirmButtonProps {
  rowCount: number;
  onConfirm: () => void;
  isLoading: boolean;
  onBack: () => void;
}

export default function ConfirmButton({
  rowCount,
  onConfirm,
  isLoading,
  onBack,
}: ConfirmButtonProps) {
  return (
    <div className="w-full max-w-2xl mx-auto mt-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Step 3: Confirm Import
        </h2>
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg mb-6">
          <p className="text-sm text-blue-900 dark:text-blue-200">
            <strong>Ready to import:</strong> {rowCount} rows will be processed by AI for CRM field extraction.
          </p>
        </div>
      </div>

      <div className="flex gap-4">
        <button
          onClick={onBack}
          disabled={isLoading}
          className="flex-1 px-6 py-3 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-semibold transition-colors"
        >
          Back to Preview
        </button>

        <button
          onClick={onConfirm}
          disabled={isLoading}
          className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Processing...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Confirm & Import
            </>
          )}
        </button>
      </div>

      {isLoading && (
        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            AI is analyzing your CSV data and mapping to CRM fields. This may take a moment...
          </p>
        </div>
      )}
    </div>
  );
}
