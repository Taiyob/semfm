import { Request, Response } from 'express';
import { LeadService } from './lead.service';
import { catchAsync } from '@/utils/catchAsync';

export class LeadController {
  private leadService: LeadService;

  constructor(leadService: LeadService) {
    this.leadService = leadService;
  }

  createLead = catchAsync(async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const { propertyId, message, budget, financing, calculationId } = req.body;

    const lead = await this.leadService.createLead({
      propertyId,
      userId,
      message,
      budget,
      financing,
      calculationId,
    });

    res.status(201).json({
      status: 'success',
      data: { lead },
    });
  });

  getMyLeads = catchAsync(async (req: Request, res: Response) => {
    const agentId = (req as any).user.id;
    const leads = await this.leadService.getLeadsByAgent(agentId);

    res.status(200).json({
      status: 'success',
      results: leads.length,
      data: { leads },
    });
  });

  updateLeadStatus = catchAsync(async (req: Request, res: Response) => {
    const agentId = (req as any).user.id;
    const { id } = req.params as { id: string };
    const { status } = req.body;

    const lead = await this.leadService.updateLeadStatus(id, agentId, status);

    res.status(200).json({
      status: 'success',
      data: { lead },
    });
  });

  getLeadDetails = catchAsync(async (req: Request, res: Response) => {
    const agentId = (req as any).user.id;
    const { id } = req.params as { id: string };

    const lead = await this.leadService.getLeadById(id, agentId);

    res.status(200).json({
      status: 'success',
      data: { lead },
    });
  });

  deleteLead = catchAsync(async (req: Request, res: Response) => {
    const agentId = (req as any).user.id;
    const { id } = req.params as { id: string };

    await this.leadService.deleteLead(id, agentId);

    res.status(200).json({
      status: 'success',
      message: 'Lead deleted successfully',
    });
  });
}
