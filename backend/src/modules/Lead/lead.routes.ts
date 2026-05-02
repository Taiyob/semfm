import { Router } from 'express';
import { LeadController } from './lead.controller';
import { authMiddleware } from '@/middleware/authMiddleware';
import { validateRequest } from '@/middleware/validation';
import { LeadValidation } from './lead.validation';

export class LeadRoutes {
  private router: Router;
  private leadController: LeadController;

  constructor(leadController: LeadController) {
    this.router = Router();
    this.leadController = leadController;
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    // All lead routes require authentication
    this.router.use(authMiddleware);

    // Create a new lead (Investor/User)
    this.router.post(
      '/',
      validateRequest({ body: LeadValidation.create }),
      this.leadController.createLead
    );

    // Get leads for the current agent
    this.router.get(
      '/my',
      this.leadController.getMyLeads
    );

    // Get lead details
    this.router.get(
      '/:id',
      this.leadController.getLeadDetails
    );

    // Update lead status
    this.router.patch(
      '/:id/status',
      validateRequest({ body: LeadValidation.updateStatus }),
      this.leadController.updateLeadStatus
    );

    // Delete a lead
    this.router.delete(
      '/:id',
      this.leadController.deleteLead
    );
  }

  public getRouter(): Router {
    return this.router;
  }
}
