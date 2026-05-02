import { Request, Response } from "express";
import { BaseController } from "@/core/BaseController";
import { InvestmentService } from "./investment.service";
import { catchAsync } from "@/utils/catchAsync";

export class InvestmentController extends BaseController {
    private investmentService: InvestmentService;

    constructor(investmentService: InvestmentService) {
        super();
        this.investmentService = investmentService;
    }

    /**
     * @route GET /api/investments
     * @desc Get current user's portfolio
     */
    public getPortfolio = catchAsync(async (req: Request, res: Response) => {
        const result = await this.investmentService.getUserPortfolio(req.user.id);
        return this.sendResponse(req, res, 'Portfolio fetched successfully', undefined, result);
    });

    /**
     * @route POST /api/investments
     * @desc Add new investment
     */
    public create = catchAsync(async (req: Request, res: Response) => {
        const result = await this.investmentService.addInvestment(req.user.id, req.body);
        return this.sendResponse(req, res, 'Investment added successfully', undefined, result);
    });

    /**
     * @route DELETE /api/investments/:id
     * @desc Delete an investment
     */
    public delete = catchAsync(async (req: Request, res: Response) => {
        const { id } = req.params;
        await this.investmentService.deleteInvestment(req.user.id, id);
        return this.sendResponse(req, res, 'Investment deleted successfully');
    });
}
