import { ParsedRow, CRMRecord, SkippedRecord, ImportStatistics } from '../types/index';
import { AIExtractor } from './aiExtractor';
import { BATCH_SIZE } from '../utils/constants';

export class BatchProcessor {
  static async processBatches(
    headers: string[],
    rows: ParsedRow[]
  ): Promise<{ importedRecords: CRMRecord[]; skippedRecords: SkippedRecord[] }> {
    const importedRecords: CRMRecord[] = [];
    const skippedRecords: SkippedRecord[] = [];

    // Split rows into batches
    const batches: ParsedRow[][] = [];
    for (let i = 0; i < rows.length; i += BATCH_SIZE) {
      batches.push(rows.slice(i, i + BATCH_SIZE));
    }

    // Process batches sequentially
    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i];
      try {
        const { extracted, skipped } = await AIExtractor.extractBatch(headers, batch);
        importedRecords.push(...extracted);
        skippedRecords.push(...skipped);

        console.log(
          `Batch ${i + 1}/${batches.length} processed: ${extracted.length} imported, ${skipped.length} skipped`
        );
      } catch (error) {
        console.error(`Error processing batch ${i + 1}:`, error);
        // Add all rows in this batch to skipped
        batch.forEach((row) => {
          skippedRecords.push({
            originalRow: row,
            reason: `Error processing batch: ${error instanceof Error ? error.message : 'Unknown error'}`,
          });
        });
      }
    }

    return { importedRecords, skippedRecords };
  }

  static calculateStatistics(
    importedRecords: CRMRecord[],
    skippedRecords: SkippedRecord[]
  ): ImportStatistics {
    const totalProcessed = importedRecords.length + skippedRecords.length;
    const totalImported = importedRecords.length;
    const totalSkipped = skippedRecords.length;

    return {
      totalProcessed,
      totalImported,
      totalSkipped,
      successRate: totalProcessed > 0 ? totalImported / totalProcessed : 0,
    };
  }
}
