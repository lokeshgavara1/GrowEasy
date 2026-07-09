import { useState } from 'react';
import { CSVImporterState, ParsedRow, CRMRecord, SkippedRecord, ImportStatistics } from '@/types';
import { parseCSV, importCSV } from '@/utils/api';
import toast from 'react-hot-toast';

export function useCSVImport() {
  const [state, setState] = useState<CSVImporterState>({
    step: 'upload',
    file: null,
    headers: [],
    rows: [],
    importedRecords: [],
    skippedRecords: [],
    statistics: null,
    isLoading: false,
    error: null,
  });

  const handleFileUpload = async (file: File) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    if (file.size > 10 * 1024 * 1024) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: 'File size exceeds 10MB limit',
      }));
      toast.error('File size exceeds 10MB limit');
      return;
    }

    const result = await parseCSV(file);

    if (!result.success) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: result.error || 'Failed to parse CSV',
      }));
      toast.error(result.error || 'Failed to parse CSV');
      return;
    }

    setState((prev) => ({
      ...prev,
      step: 'preview',
      file,
      headers: result.data?.headers || [],
      rows: result.data?.rows || [],
      isLoading: false,
    }));
    toast.success('CSV parsed successfully');
  };

  const handleConfirmImport = async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    const result = await importCSV(state.headers, state.rows);

    if (!result.success) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: result.error || 'Failed to import CSV',
      }));
      toast.error(result.error || 'Failed to import CSV');
      return;
    }

    setState((prev) => ({
      ...prev,
      step: 'results',
      importedRecords: result.data?.importedRecords || [],
      skippedRecords: result.data?.skippedRecords || [],
      statistics: result.data?.statistics || null,
      isLoading: false,
    }));
    toast.success('Import completed successfully');
  };

  const handleReset = () => {
    setState({
      step: 'upload',
      file: null,
      headers: [],
      rows: [],
      importedRecords: [],
      skippedRecords: [],
      statistics: null,
      isLoading: false,
      error: null,
    });
  };

  const goToPreview = () => {
    setState((prev) => ({ ...prev, step: 'preview', error: null }));
  };

  const goToConfirm = () => {
    setState((prev) => ({ ...prev, step: 'confirm', error: null }));
  };

  const goBackToPreview = () => {
    setState((prev) => ({ ...prev, step: 'preview', error: null }));
  };

  return {
    state,
    handleFileUpload,
    handleConfirmImport,
    handleReset,
    goToPreview,
    goToConfirm,
    goBackToPreview,
  };
}
