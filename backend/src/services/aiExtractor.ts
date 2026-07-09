import Anthropic from '@anthropic-ai/sdk';
import { ParsedRow, CRMRecord, SkippedRecord } from '../types/index';
import { createExtractionPrompt, validateExtractedRecord } from '../utils/prompts';
import { API_TIMEOUT, RETRY_ATTEMPTS, RETRY_DELAY } from '../utils/constants';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export class AIExtractor {
  static async extractBatch(
    headers: string[],
    rows: ParsedRow[],
    retryCount = 0
  ): Promise<{ extracted: CRMRecord[]; skipped: SkippedRecord[] }> {
    try {
      const prompt = createExtractionPrompt(headers, rows);

      const message = await anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 4096,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      });

      const responseText =
        message.content[0].type === 'text' ? message.content[0].text : '';

      // Extract JSON from response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in AI response');
      }

      const parsedResponse = JSON.parse(jsonMatch[0]);

      // Process extracted records
      const extracted: CRMRecord[] = [];
      const skipped: SkippedRecord[] = [];

      if (Array.isArray(parsedResponse.extracted)) {
        parsedResponse.extracted.forEach((record: any, index: number) => {
          const validated = validateExtractedRecord(record);
          if (validated) {
            extracted.push(validated);
          } else {
            skipped.push({
              originalRow: rows[index],
              reason: 'Missing email and mobile number',
            });
          }
        });
      }

      // Add skipped records from AI response
      if (Array.isArray(parsedResponse.skipped)) {
        parsedResponse.skipped.forEach((skip: any) => {
          if (skip.rowIndex !== undefined && rows[skip.rowIndex]) {
            skipped.push({
              originalRow: rows[skip.rowIndex],
              reason: skip.reason || 'Skipped by AI',
            });
          }
        });
      }

      return { extracted, skipped };
    } catch (error) {
      if (retryCount < RETRY_ATTEMPTS) {
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
        return this.extractBatch(headers, rows, retryCount + 1);
      }
      throw error;
    }
  }
}
