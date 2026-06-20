import express from 'express';
import { RegionController } from './region.controller';
import { authMiddleware } from '@/middleware/authMiddleware';
import { requireRole } from '@/middleware/roleMiddleware';

const router = express.Router();

router.get('/', RegionController.getAllRegions);
router.post('/', authMiddleware, requireRole(['admin']), RegionController.createRegion);
router.patch('/:id', authMiddleware, requireRole(['admin']), RegionController.updateRegion);
router.delete('/:id', authMiddleware, requireRole(['admin']), RegionController.deleteRegion);

export const RegionRoutes = router;
