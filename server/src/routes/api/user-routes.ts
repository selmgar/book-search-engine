import express from 'express';
const router = express.Router();
import {
  saveBook,
  deleteBook,
} from '../../controllers/user-controller.js';

// import middleware
import { authenticateToken } from '../../services/auth.js';

// put authMiddleware anywhere we need to send a token for verification of user
router.route('/').put(saveBook);

router.route('/books/:bookId').delete(authenticateToken, deleteBook);

export default router;
