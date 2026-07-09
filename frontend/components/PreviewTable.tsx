'use client';

import { ParsedRow } from '@/types';

interface PreviewTableProps {
  headers: string[];
  rows: ParsedRow[];
  rowCount: number;
}

export default function PreviewTable({ headers, rows, rowCount }: PreviewTableProps) {
  const displayRows = rows.slice(0, 10);

  return (
    <div className="w-full">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Step 2: Preview CSV Data
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Review the CSV data before importing. Showing first 10 rows of {rowCount} total rows.
        </p>
      </div>

      <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <p className="text-sm text-gray-700 dark:text-gray-300">
          <strong>Total Rows:</strong> {rowCount} | <strong>Columns:</strong> {headers.length}
        </p>
      </div>

      <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-lg">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800 sticky top-0">
            <tr>
              {headers.map((header, index) => (
                <th
                  key={index}
                  className="px-6 py-3 text-left text-xs font-semibold text-gray-900 dark:text-white whitespace-nowrap"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            {displayRows.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                {headers.map((header, cellIndex) => (
                  <td
                    key={cellIndex}
                    className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300 whitespace-nowrap overflow-hidden text-overflow-ellipsis"
                  >
                    {row[header]?.toString() || '-'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {rowCount > 10 && (
        <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded text-sm text-yellow-800 dark:text-yellow-200">
          Showing 10 out of {rowCount} rows. All rows will be processed during import.
        </div>
      )}
    </div>
  );
}
