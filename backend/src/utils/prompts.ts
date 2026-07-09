import { ParsedRow, CRMRecord } from '../types/index.js';

export function createExtractionPrompt(headers: string[], rows: ParsedRow[]): string {
  const rowsJson = JSON.stringify(rows, null, 2);

  return `You are an expert CRM data extractor. Your task is to intelligently extract lead information from CSV data and map it to GrowEasy CRM fields.

CSV Headers: ${JSON.stringify(headers)}

CSV Data (as JSON):
${rowsJson}

EXTRACTION RULES:
1. Map CSV columns to these CRM fields: created_at, name, email, country_code, mobile_without_country_code, company, city, state, country, lead_owner, crm_status, crm_note, data_source, possession_time, description

2. CRM Status Validation:
   - Must be ONE of: GOOD_LEAD_FOLLOW_UP, DID_NOT_CONNECT, BAD_LEAD, SALE_DONE
   - If you cannot determine the status from the data, use a reasonable default or leave empty
   - If status appears to be "closed" or similar, map to SALE_DONE
   - If status is "not interested" or "no contact", map to BAD_LEAD
   - If status is "contacted" or "pending", map to GOOD_LEAD_FOLLOW_UP
   - If status is "no connection" or "unreachable", map to DID_NOT_CONNECT

3. Data Source Validation:
   - Must be ONE of: leads_on_demand, meridian_tower, eden_park, varah_swamy, sarjapur_plots
   - Try to infer from data (e.g., "Facebook" exports might be leads_on_demand)
   - If unclear, leave empty string

4. Date Handling:
   - created_at should be a valid ISO 8601 timestamp (e.g., 2026-05-13T14:20:48Z)
   - If date exists but format is unclear, convert to ISO format
   - If no date found, leave empty

5. Phone Numbers:
   - Extract country_code (e.g., "+91", "+1", "+44")
   - Extract mobile_without_country_code (just digits, e.g., "9876543210")
   - If multiple phone numbers exist, use the first as mobile_without_country_code and append others to crm_note

6. Email Handling:
   - Use the primary/first email for the 'email' field
   - If multiple emails exist, append additional ones to crm_note with prefix "Additional emails: "

7. CRM Notes (crm_note):
   - Aggregate any additional information here:
   - Extra contact details (additional emails, phone numbers)
   - Remarks or notes from the CSV
   - Follow-up information
   - Any text that doesn't fit other fields but is relevant

8. Skip Records:
   - Skip any record that has NEITHER a valid email NOR a valid mobile number
   - Include skipped records with reason in your response

9. Field Mapping Strategy:
   - Look for common column name variations:
     * "First Name" / "FirstName" / "first_name" -> name (combine with last name if present)
     * "Email" / "email_address" / "e-mail" -> email
     * "Phone" / "mobile" / "contact" / "phone_number" -> mobile_without_country_code
     * "Company" / "company_name" / "organization" -> company
     * "Status" / "lead_status" / "stage" -> crm_status
     * "Created" / "date_created" / "created_at" -> created_at
     * "Notes" / "remarks" / "description" / "comments" -> crm_note

10. Output Format:
    Return a JSON object with this exact structure:
    {
      "extracted": [
        {
          "created_at": "ISO timestamp or empty string",
          "name": "Lead name",
          "email": "primary@email.com",
          "country_code": "+91",
          "mobile_without_country_code": "9876543210",
          "company": "Company Name",
          "city": "City",
          "state": "State",
          "country": "Country",
          "lead_owner": "Owner name",
          "crm_status": "GOOD_LEAD_FOLLOW_UP",
          "crm_note": "Additional notes",
          "data_source": "leads_on_demand",
          "possession_time": "value or empty",
          "description": "value or empty"
        }
      ],
      "skipped": [
        {
          "rowIndex": 0,
          "reason": "Missing email and mobile number"
        }
      ]
    }

IMPORTANT:
- Only return valid JSON
- Do not include any additional text or explanations
- Empty string ("") for fields you cannot determine
- Be intelligent about inferring fields from available data
- Prioritize accuracy over completion

Now extract the leads:`;
}

export function validateExtractedRecord(record: any): CRMRecord | null {
  if (!record || typeof record !== 'object') {
    return null;
  }

  // Skip if no email and no mobile
  const hasEmail = record.email && typeof record.email === 'string' && record.email.trim();
  const hasMobile = record.mobile_without_country_code &&
                    typeof record.mobile_without_country_code === 'string' &&
                    record.mobile_without_country_code.trim();

  if (!hasEmail && !hasMobile) {
    return null;
  }

  return {
    created_at: record.created_at || undefined,
    name: record.name || undefined,
    email: record.email || undefined,
    country_code: record.country_code || undefined,
    mobile_without_country_code: record.mobile_without_country_code || undefined,
    company: record.company || undefined,
    city: record.city || undefined,
    state: record.state || undefined,
    country: record.country || undefined,
    lead_owner: record.lead_owner || undefined,
    crm_status: record.crm_status || undefined,
    crm_note: record.crm_note || undefined,
    data_source: record.data_source || undefined,
    possession_time: record.possession_time || undefined,
    description: record.description || undefined,
  };
}
