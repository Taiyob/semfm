import { Router } from 'express';
import { ClubController } from './club.controller';
import { authMiddleware } from '@/middleware/authMiddleware';
import { requireRole } from '@/middleware/roleMiddleware';

const router = Router();
const clubController = new ClubController();

// Public routes
router.post('/apply', clubController.submitApplication);

// Protected routes (Admin only)
router.use(authMiddleware);
router.use(requireRole(['admin']));

router.get('/', clubController.getAllApplications);
router.patch('/:id/status', clubController.updateStatus);
router.delete('/:id', clubController.deleteApplication);

export default router;
