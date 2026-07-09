export interface ParsedRow {
  [key: string]: string | number | boolean | null;
}

export interface ParseCSVResponse {
  success: boolean;
  data?: {
    headers: string[];
    rows: ParsedRow[];
    rowCount: number;
  };
  error?: string;
}

export interface CRMRecord {
  created_at?: string;
  name?: string;
  email?: string;
  country_code?: string;
  mobile_without_country_code?: string;
  company?: string;
  city?: string;
  state?: string;
  country?: string;
  lead_owner?: string;
  crm_status?: string;
  crm_note?: string;
  data_source?: string;
  possession_time?: string;
  description?: string;
}

export interface SkippedRecord {
  originalRow: ParsedRow;
  reason: string;
}

export interface ImportStatistics {
  totalProcessed: number;
  totalImported: number;
  totalSkipped: number;
  successRate: number;
}

export interface ImportCSVResponse {
  success: boolean;
  data?: {
    importedRecords: CRMRecord[];
    skippedRecords: SkippedRecord[];
    statistics: ImportStatistics;
  };
  error?: string;
}

export interface CSVImporterState {
  step: 'upload' | 'preview' | 'confirm' | 'results';
  file: File | null;
  headers: string[];
  rows: ParsedRow[];
  importedRecords: CRMRecord[];
  skippedRecords: SkippedRecord[];
  statistics: ImportStatistics | null;
  isLoading: boolean;
  error: string | null;
}
