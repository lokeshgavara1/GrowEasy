'use client';

import { CRMRecord, SkippedRecord, ImportStatistics } from '@/types';

interface ResultsTableProps {
  importedRecords: CRMRecord[];
  skippedRecords: SkippedRecord[];
  statistics: ImportStatistics | null;
  onReset: () => void;
}

export default function ResultsTable({
  importedRecords,
  skippedRecords,
  statistics,
  onReset,
}: ResultsTableProps) {
  const crmFields = [
    'name',
    'email',
    'mobile_without_country_code',
    'company',
    'city',
    'state',
    'country',
    'crm_status',
  ];

  const exportToCSV = () => {
    if (importedRecords.length === 0) return;

    const headers = [
      'created_at',
      'name',
      'email',
      'country_code',
      'mobile_without_country_code',
      'company',
      'city',
      'state',
      'country',
      'lead_owner',
      'crm_status',
      'crm_note',
      'data_source',
      'possession_time',
      'description',
    ];

    const csv = [
      headers.join(','),
      ...importedRecords.map((record) =>
        headers
          .map((field) => {
            const value = (record as any)[field] || '';
            return `"${value.toString().replace(/"/g, '""')}"`;
          })
          .join(',')
      ),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `crm-import-${new Date().getTime()}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Step 4: Import Results
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Review your imported records and statistics below.
        </p>
      </div>

      {/* Statistics Cards */}
      {statistics && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <p className="text-sm text-green-700 dark:text-green-400 font-semibold">Imported</p>
            <p className="text-2xl font-bold text-green-900 dark:text-green-300">
              {statistics.totalImported}
            </p>
          </div>

          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-700 dark:text-red-400 font-semibold">Skipped</p>
            <p className="text-2xl font-bold text-red-900 dark:text-red-300">
              {statistics.totalSkipped}
            </p>
          </div>

          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p className="text-sm text-blue-700 dark:text-blue-400 font-semibold">Total</p>
            <p className="text-2xl font-bold text-blue-900 dark:text-blue-300">
              {statistics.totalProcessed}
            </p>
          </div>

          <div className="p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
            <p className="text-sm text-purple-700 dark:text-purple-400 font-semibold">
              Success Rate
            </p>
            <p className="text-2xl font-bold text-purple-900 dark:text-purple-300">
              {(statistics.successRate * 100).toFixed(1)}%
            </p>
          </div>
        </div>
      )}

      {/* Imported Records Table */}
      {importedRecords.length > 0 && (
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Successfully Imported ({importedRecords.length})
            </h3>
            <button
              onClick={exportToCSV}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-semibold transition-colors"
            >
              Export to CSV
            </button>
          </div>

          <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-lg">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800 sticky top-0">
                <tr>
                  {crmFields.map((field) => (
                    <th
                      key={field}
                      className="px-6 py-3 text-left text-xs font-semibold text-gray-900 dark:text-white whitespace-nowrap"
                    >
                      {field.replace(/_/g, ' ')}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                {importedRecords.map((record, index) => (
                  <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    {crmFields.map((field) => (
                      <td
                        key={field}
                        className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300 max-w-xs truncate"
                      >
                        {(record as any)[field]?.toString() || '-'}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Skipped Records */}
      {skippedRecords.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Skipped Records ({skippedRecords.length})
          </h3>

          <div className="space-y-2">
            {skippedRecords.map((skip, index) => (
              <div
                key={index}
                className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg"
              >
                <p className="text-sm text-yellow-900 dark:text-yellow-200">
                  <strong>Reason:</strong> {skip.reason}
                </p>
                <p className="text-xs text-yellow-800 dark:text-yellow-300 mt-1 truncate">
                  <strong>Row:</strong> {JSON.stringify(skip.originalRow).substring(0, 100)}...
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          onClick={onReset}
          className="flex-1 px-6 py-3 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg font-semibold transition-colors"
        >
          Import Another File
        </button>
      </div>
    </div>
  );
}
