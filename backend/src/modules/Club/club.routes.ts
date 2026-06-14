import { Router } from 'express';
import { ClubController } from './club.controller';

const router = Router();
const clubController = new ClubController();

router.post('/apply', clubController.submitApplication);

export default router;
