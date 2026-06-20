import express from 'express';
import { SystemSettingController } from './systemSetting.controller';
import { authMiddleware } from '@/middleware/authMiddleware';
import { requireRole } from '@/middleware/roleMiddleware';

const router = express.Router();

router.get(
    '/calculator',
    SystemSettingController.getCalculatorSettings
);

router.patch(
    '/calculator',
    authMiddleware,
    requireRole(['admin']),
    SystemSettingController.updateCalculatorSettings
);

export const SystemSettingRoutes = router;
