import Papa from 'papaparse';
import { ParsedRow } from '../types/index';

export class CSVParser {
  static async parse(fileContent: string): Promise<{ headers: string[]; rows: ParsedRow[] }> {
    return new Promise((resolve, reject) => {
      Papa.parse(fileContent, {
        header: true,
        dynamicTyping: false,
        skipEmptyLines: true,
        complete: (results: any) => {
          if (results.errors && results.errors.length > 0) {
            reject(new Error(`CSV parsing error: ${results.errors[0].message}`));
          } else {
            const headers = Object.keys(results.data[0] || {});
            const rows: ParsedRow[] = results.data.filter((row: any) =>
              Object.values(row).some((val: any) => val && val.toString().trim())
            );

            if (headers.length === 0) {
              reject(new Error('CSV file has no headers'));
            } else if (rows.length === 0) {
              reject(new Error('CSV file has no data rows'));
            } else {
              resolve({ headers, rows });
            }
          }
        },
        error: (error: any) => {
          reject(new Error(`CSV parsing failed: ${error.message}`));
        },
      });
    });
  }

  static validateHeaders(headers: string[]): boolean {
    return headers.length > 0 && headers.every((h) => typeof h === 'string' && h.trim());
  }

  static validateRows(rows: ParsedRow[]): boolean {
    return Array.isArray(rows) && rows.length > 0;
  }
}
