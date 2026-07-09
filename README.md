# GrowEasy AI-Powered CSV Importer

A full-stack application that intelligently imports CSV files containing lead data, regardless of column names or structure. The AI-powered system maps fields to CRM format using Claude API.

## Features

- 🚀 **Drag & Drop Upload** - Easy CSV file upload with drag-and-drop support
- 🔍 **Smart Preview** - View CSV data before processing with responsive table
- 🤖 **AI-Powered Extraction** - Claude API intelligently maps CSV columns to CRM fields
- 📊 **Batch Processing** - Efficiently handles large CSV files in optimized batches
- 📈 **Detailed Results** - View imported records, skipped items, and statistics
- 📥 **Export Results** - Download processed data as CSV
- 🌙 **Dark Mode** - Full dark mode support with TailwindCSS
- 📱 **Responsive Design** - Mobile-friendly interface

## Project Structure

```
.
├── frontend/                 # Next.js 16+ application
│   ├── app/                 # Next.js app router
│   ├── components/          # React components
│   ├── hooks/              # Custom React hooks
│   ├── types/              # TypeScript types
│   ├── utils/              # Utility functions
│   └── package.json
├── backend/                 # Node.js/Express API
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   ├── services/       # Business logic (CSV parsing, AI extraction)
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Express middleware
│   │   ├── types/          # TypeScript interfaces
│   │   ├── utils/          # Utilities
│   │   └── index.ts        # Express server entry point
│   └── package.json
└── README.md
```

## Tech Stack

### Frontend
- **Next.js 16+** - React framework with App Router
- **TypeScript** - Type-safe development
- **TailwindCSS** - Utility-first CSS
- **React Dropzone** - Drag-and-drop file upload
- **React Hot Toast** - Notifications
- **PapaParse** - CSV parsing

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **TypeScript** - Type-safe development
- **Anthropic Claude API** - AI-powered field extraction
- **Multer** - File upload handling
- **PapaParse** - CSV parsing

## Setup Instructions

### Prerequisites
- Node.js 18+ and npm
- Anthropic API key (get from https://console.anthropic.com/)

### Backend Setup

1. **Install dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Configure environment variables**
   ```bash
   # Copy .env.example to .env
   cp .env.example .env
   
   # Edit .env and add your API keys
   ANTHROPIC_API_KEY=your_api_key_here
   CORS_ORIGIN=http://localhost:3000
   PORT=3001
   ```

3. **Start the backend server**
   ```bash
   npm run dev
   ```
   Server will run on `http://localhost:3001`

### Frontend Setup

1. **Install dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Configure environment variables**
   ```bash
   # .env.local is already configured
   NEXT_PUBLIC_API_URL=http://localhost:3001
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```
   Application will run on `http://localhost:3000`

## Running the Application

In two separate terminal windows:

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

Then open http://localhost:3000 in your browser.

## API Endpoints

### POST /api/csv/parse
Parse and validate CSV file structure.

**Request:**
- `file`: CSV file (multipart/form-data)

**Response:**
```json
{
  "success": true,
  "data": {
    "headers": ["name", "email", ...],
    "rows": [{...}, ...],
    "rowCount": 100
  }
}
```

### POST /api/csv/import
Extract CRM records from parsed CSV data.

**Request:**
```json
{
  "headers": ["name", "email", ...],
  "rows": [{...}, ...]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "importedRecords": [...],
    "skippedRecords": [...],
    "statistics": {
      "totalProcessed": 100,
      "totalImported": 95,
      "totalSkipped": 5,
      "successRate": 0.95
    }
  }
}
```

## CRM Fields Extracted

- `created_at` - Lead creation date
- `name` - Lead name
- `email` - Primary email
- `country_code` - Country code (e.g., +91)
- `mobile_without_country_code` - Mobile number
- `company` - Company name
- `city` - City
- `state` - State
- `country` - Country
- `lead_owner` - Lead owner
- `crm_status` - Status (GOOD_LEAD_FOLLOW_UP | DID_NOT_CONNECT | BAD_LEAD | SALE_DONE)
- `crm_note` - Additional notes
- `data_source` - Source (leads_on_demand | meridian_tower | eden_park | varah_swamy | sarjapur_plots)
- `possession_time` - Property possession time
- `description` - Additional description

## Supported CSV Formats

The importer handles CSV files from:
- Facebook Lead Exports
- Google Ads Exports
- Excel sheets
- Real Estate CRM exports
- Sales reports
- Marketing agency CSVs
- Manually created spreadsheets

Column names don't matter—AI intelligently maps them to CRM fields.

## Building for Production

### Backend
```bash
cd backend
npm run build
npm start
```

### Frontend
```bash
cd frontend
npm run build
npm start
```

## Deployment

### Deploy Frontend to Vercel
```bash
cd frontend
vercel deploy
```

### Deploy Backend to Railway/Render
1. Push code to GitHub
2. Connect repository to Railway/Render
3. Set environment variables (ANTHROPIC_API_KEY, etc.)
4. Deploy

See deployment guides:
- [Vercel Docs](https://vercel.com/docs)
- [Railway Docs](https://railway.app/docs)
- [Render Docs](https://render.com/docs)

## Testing

### Backend Tests (Optional - to be added)
```bash
cd backend
npm test
```

### Manual Testing
1. Navigate to http://localhost:3000
2. Upload a CSV file
3. Review the preview
4. Confirm import
5. Check results and statistics

## Troubleshooting

### "API connection failed"
- Ensure backend is running on http://localhost:3001
- Check CORS_ORIGIN in .env matches frontend URL

### "No matching version found for package"
- Clear npm cache: `npm cache clean --force`
- Delete node_modules and package-lock.json
- Run `npm install` again

### "ANTHROPIC_API_KEY not found"
- Add API key to backend/.env file
- Restart backend server

## Performance Considerations

- **Batch Processing** - Large CSVs are processed in batches of 50 rows
- **Streaming** - Can be implemented for real-time progress updates
- **Caching** - Consider Redis for caching extracted data
- **Database** - Currently stateless; can add PostgreSQL for persistence

## Future Enhancements

- [ ] Database persistence (PostgreSQL)
- [ ] WebSocket streaming for real-time progress
- [ ] Advanced field mapping configuration
- [ ] Duplicate detection
- [ ] Data validation rules
- [ ] Audit logging
- [ ] Multi-user support

## Contributing

Contributions are welcome! Please follow the existing code structure and style.

## License

MIT License - see LICENSE file for details

## Support

For issues or questions, please create an issue in the GitHub repository or contact the maintainers.

---

**Built with ❤️ for GrowEasy**
