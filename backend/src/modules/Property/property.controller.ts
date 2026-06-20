// src/modules/Property/property.controller.ts
import { Request, Response } from 'express';
import { BaseController } from '@/core/BaseController';
import { PropertyService } from './property.service';
import { catchAsync } from '@/utils/catchAsync';
import { AppError } from '@/core/errors/AppError';
import { HTTPStatusCode } from '@/types/HTTPStatusCode';

export class PropertyController extends BaseController {
    constructor(private propertyService: PropertyService) {
        super();
    }

    /**
     * @route POST /api/properties
     * @desc Create a new property listing (Agents only)
     */
    public create = catchAsync(async (req: Request, res: Response) => {
        const user = req.user;
        
        const roleName = user.role?.name?.toLowerCase();
        const isAuthorized = roleName === 'agent' || roleName === 'admin';
        
        if (!isAuthorized) {
            throw new AppError({
                statusCode: HTTPStatusCode.FORBIDDEN,
                message: 'Access denied. Only agents can list properties.',
            });
        }

        // If admin provides an agentId, use it. Otherwise use their own id.
        const targetAgentId = (roleName === 'admin' && req.body.agentId) ? req.body.agentId : user.id;

        const result = await this.propertyService.createProperty(targetAgentId, req.body);
        return this.sendCreatedResponse(req, res, result, 'Property listed successfully');
    });

    /**
     * @route GET /api/properties/:id
     * @desc Get a single property by ID (Public)
     */
    public getById = catchAsync(async (req: Request, res: Response) => {
        const { id } = req.params;
        const userId = req.user?.id;
        const result = await this.propertyService.getPropertyById(id as string, userId);
        
        if (!result) {
            throw new AppError({
                statusCode: HTTPStatusCode.NOT_FOUND,
                message: 'Property not found',
            });
        }

        return this.sendResponse(req, res, 'Property fetched successfully', undefined, result);
    });

    /**
     * @route GET /api/properties
     * @desc Get all properties (Public)
     */
    public getAll = catchAsync(async (req: Request, res: Response) => {
        const userId = req.user?.id;
        const result = await this.propertyService.getAllProperties(req.query, userId);
        const { data, ...pagination } = result;
        return this.sendPaginatedResponse(req, res, pagination, 'Properties fetched successfully', data);
    });

    /**
     * @route GET /api/properties/my
     * @desc Get properties listed by the current agent
     */
    public getMyProperties = catchAsync(async (req: Request, res: Response) => {
        const result = await this.propertyService.getMyProperties(req.user.id, req.query);
        const { data, ...pagination } = result;
        return this.sendPaginatedResponse(req, res, pagination, 'Your properties fetched successfully', data);
    });

    /**
     * @route PATCH /api/properties/:id/view
     * @desc Increment property view count (Public)
     */
    public incrementViews = catchAsync(async (req: Request, res: Response) => {
        const { id } = req.params;
        
        // Fetch property to check agent
        const property = await this.propertyService.getPropertyById(id as string);
        if (!property) {
            throw new AppError({
                statusCode: HTTPStatusCode.NOT_FOUND,
                message: 'Property not found',
            });
        }

        // If user is logged in and is the agent of this property, don't increment
        if (req.user && property.agentId === req.user.id) {
            return this.sendResponse(req, res, 'Agent view not counted', undefined, property);
        }

        const result = await this.propertyService.incrementViews(id as string);
        return this.sendResponse(req, res, 'View counted', undefined, result);
    });

    /**
     * @route PATCH /api/properties/:id/lead
     * @desc Increment property lead count (Public)
     */
    public incrementLeads = catchAsync(async (req: Request, res: Response) => {
        const { id } = req.params;
        const result = await this.propertyService.incrementLeads(id as string);
        return this.sendResponse(req, res, 'Lead counted', undefined, result);
    });

    /**
     * @route PATCH /api/properties/:id
     * @desc Update a property listing (Private - Agent only)
     */
    public update = catchAsync(async (req: Request, res: Response) => {
        const { id } = req.params;
        const isAdmin = req.user.role?.name?.toLowerCase() === 'admin';
        const result = await this.propertyService.updateProperty(id as string, req.user.id, req.body, isAdmin);
        
        if (!result) {
            throw new AppError({
                statusCode: HTTPStatusCode.NOT_FOUND,
                message: 'Property not found or you do not have permission',
            });
        }

        return this.sendResponse(req, res, 'Property updated successfully', undefined, result);
    });

    /**
     * @route POST /api/properties/:id/save
     * @desc Toggle save property (Private)
     */
    public toggleSave = catchAsync(async (req: Request, res: Response) => {
        const { id } = req.params;
        await this.propertyService.toggleSaveProperty(req.user.id, id as string);
        return this.sendResponse(req, res, 'Save status updated successfully');
    });

    /**
     * @route GET /api/properties/saved
     * @desc Get current user's saved properties (Private)
     */
    public getSaved = catchAsync(async (req: Request, res: Response) => {
        const result = await this.propertyService.getSavedProperties(req.user.id);
        return this.sendResponse(req, res, 'Saved properties fetched successfully', undefined, result);
    });

    /**
     * @route DELETE /api/properties/:id
     * @desc Delete a property listing (Private - Agent only)
     */
    public delete = catchAsync(async (req: Request, res: Response) => {
        const { id } = req.params;
        const isAdmin = req.user.role?.name?.toLowerCase() === 'admin';
        const result = await this.propertyService.deleteProperty(id as string, req.user.id, isAdmin);
        
        if (!result) {
            throw new AppError({
                statusCode: HTTPStatusCode.NOT_FOUND,
                message: 'Property not found or you do not have permission',
            });
        }

        return this.sendNoContentResponse(res);
    });
}
