import { ParseCSVResponse, ImportCSVResponse } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function parseCSV(file: File): Promise<ParseCSVResponse> {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch(`${API_URL}/api/csv/parse`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error parsing CSV:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to parse CSV',
    };
  }
}

export async function importCSV(headers: string[], rows: any[]): Promise<ImportCSVResponse> {
  try {
    const response = await fetch(`${API_URL}/api/csv/import`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ headers, rows }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error importing CSV:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to import CSV',
    };
  }
}
