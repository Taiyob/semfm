import express from 'express';
import { RegionController } from './region.controller';
import { authMiddleware } from '@/middleware/authMiddleware';
import { requireRole } from '@/middleware/roleMiddleware';

const router = express.Router();

router.get('/', RegionController.getAllRegions);
router.post('/', authMiddleware, RegionController.createRegion);
router.patch('/:id', authMiddleware, RegionController.updateRegion);
router.delete('/:id', authMiddleware, RegionController.deleteRegion);

router.post('/neighborhoods', authMiddleware, RegionController.createNeighborhood);
router.delete('/neighborhoods/:id', authMiddleware, RegionController.deleteNeighborhood);

export const RegionRoutes = router;
