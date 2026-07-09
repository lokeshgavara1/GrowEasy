import { Router, Request, Response } from 'express';
import multer from 'multer';
import { CSVController } from '../controllers/csvController';
import { MAX_FILE_SIZE } from '../utils/constants';

const router = Router();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
      cb(null, true);
    } else {
      cb(new Error('Only CSV files are allowed'));
    }
  },
});

// Parse CSV endpoint
router.post('/parse', upload.single('file'), CSVController.parseCSV);

// Import and extract CRM records endpoint
router.post('/import', CSVController.importCSV);

export default router;
