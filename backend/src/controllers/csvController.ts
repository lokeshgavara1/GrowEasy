import { Request, Response } from 'express';
import { CSVParser } from '../services/csvParser';
import { BatchProcessor } from '../services/batchProcessor';
import { ParseCSVResponse, ImportCSVResponse } from '../types/index';

export class CSVController {
  static async parseCSV(req: Request, res: Response<ParseCSVResponse>): Promise<void> {
    try {
      if (!req.file) {
        res.status(400).json({
          success: false,
          error: 'No file uploaded',
        });
        return;
      }

      const fileContent = req.file.buffer.toString('utf-8');

      if (!fileContent.trim()) {
        res.status(400).json({
          success: false,
          error: 'File is empty',
        });
        return;
      }

      const { headers, rows } = await CSVParser.parse(fileContent);

      if (!CSVParser.validateHeaders(headers)) {
        res.status(400).json({
          success: false,
          error: 'Invalid CSV headers',
        });
        return;
      }

      if (!CSVParser.validateRows(rows)) {
        res.status(400).json({
          success: false,
          error: 'CSV file has no data rows',
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: {
          headers,
          rows,
          rowCount: rows.length,
        },
      });
    } catch (error) {
      console.error('Error parsing CSV:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      });
    }
  }

  static async importCSV(req: Request, res: Response<ImportCSVResponse>): Promise<void> {
    try {
      const { headers, rows } = req.body;

      // Validate request
      if (!Array.isArray(headers) || headers.length === 0) {
        res.status(400).json({
          success: false,
          error: 'Invalid headers',
        });
        return;
      }

      if (!Array.isArray(rows) || rows.length === 0) {
        res.status(400).json({
          success: false,
          error: 'No rows to process',
        });
        return;
      }

      // Process batches and extract CRM records
      const { importedRecords, skippedRecords } = await BatchProcessor.processBatches(headers, rows);

      // Calculate statistics
      const statistics = BatchProcessor.calculateStatistics(importedRecords, skippedRecords);

      res.status(200).json({
        success: true,
        data: {
          importedRecords,
          skippedRecords,
          statistics,
        },
      });
    } catch (error) {
      console.error('Error importing CSV:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      });
    }
  }
}
