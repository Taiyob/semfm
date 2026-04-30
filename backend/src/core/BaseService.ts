// src/core/BaseService.ts
import { PrismaClient } from '@/generated/prisma/client';
import { NotFoundError } from './errors/AppError';

export interface ServiceOptions {
  enableSoftDelete?: boolean;
  enableAuditFields?: boolean;
}

export abstract class BaseService<T> {
  protected prisma: PrismaClient;
  protected modelName: string;
  protected options: ServiceOptions;

  constructor(prisma: PrismaClient, modelName: string, options: ServiceOptions = {}) {
    this.prisma = prisma;
    this.modelName = modelName;
    this.options = {
      enableSoftDelete: false,
      enableAuditFields: false,
      ...options,
    };
  }

  // Get the prisma model delegate (e.g., this.prisma.user)
  protected abstract getModel(): any;

  /**
   * Create a new record
   */
  async create(data: any, include?: any): Promise<T> {
    const model = this.getModel();
    return model.create({
      data,
      include,
    }) as Promise<T>;
  }

  /**
   * Find a single record by its unique fields
   */
  async findOne(where: any, include?: any): Promise<T | null> {
    const model = this.getModel();
    
    // Apply soft delete filter if enabled
    const finalWhere = this.options.enableSoftDelete 
      ? { ...where, isDeleted: false } 
      : where;

    return model.findFirst({
      where: finalWhere,
      include,
    }) as Promise<T | null>;
  }

  /**
   * Find a record by ID
   */
  async findById(id: string, include?: any): Promise<T | null> {
    const model = this.getModel();
    
    // Apply soft delete filter if enabled
    const finalWhere = this.options.enableSoftDelete 
      ? { id, isDeleted: false } 
      : { id };

    return model.findFirst({
      where: finalWhere,
      include,
    }) as Promise<T | null>;
  }

  /**
   * Find multiple records
   */
  async findMany(
    where: any = {}, 
    pagination?: { page: number; limit: number },
    orderBy?: any,
    include?: any,
    select?: any
  ): Promise<{ data: T[]; total: number; page: number; limit: number; totalPages: number; hasNext: boolean; hasPrevious: boolean }> {
    const model = this.getModel();
    
    // Apply soft delete filter if enabled
    const finalWhere = this.options.enableSoftDelete 
      ? { ...where, isDeleted: false } 
      : where;

    // Pagination logic
    const page = pagination?.page ? Math.max(1, pagination.page) : 1;
    const limit = pagination?.limit ? Math.max(1, pagination.limit) : 10;
    const skip = (page - 1) * limit;

    const queryArgs: any = {
      where: finalWhere,
      orderBy,
    };

    if (include && !select) queryArgs.include = include;
    if (select && !include) queryArgs.select = select;
    
    // Add pagination
    if (pagination) {
        queryArgs.skip = skip;
        queryArgs.take = limit;
    }

    const [data, total] = await Promise.all([
      model.findMany(queryArgs),
      model.count({ where: finalWhere }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: data as T[],
      total,
      page,
      limit,
      totalPages,
      hasNext: page < totalPages,
      hasPrevious: page > 1,
    };
  }

  /**
   * Update a record by ID
   */
  async updateById(id: string, data: any, include?: any): Promise<T> {
    const model = this.getModel();
    
    // Check if exists
    const exists = await this.findById(id);
    if (!exists) {
      throw new NotFoundError(`${this.modelName} with id ${id} not found`);
    }

    return model.update({
      where: { id },
      data,
      include,
    }) as Promise<T>;
  }

  /**
   * Delete a record by ID (hard or soft depending on options)
   */
  async deleteById(id: string): Promise<T> {
    const model = this.getModel();
    
    // Check if exists
    const exists = await this.findById(id);
    if (!exists) {
      throw new NotFoundError(`${this.modelName} with id ${id} not found`);
    }

    if (this.options.enableSoftDelete) {
      return model.update({
        where: { id },
        data: { 
          isDeleted: true,
          deletedAt: new Date()
        },
      }) as Promise<T>;
    } else {
      return model.delete({
        where: { id },
      }) as Promise<T>;
    }
  }

  /**
   * Count records
   */
  async count(where: any = {}): Promise<number> {
    const model = this.getModel();
    
    // Apply soft delete filter if enabled
    const finalWhere = this.options.enableSoftDelete 
      ? { ...where, isDeleted: false } 
      : where;

    return model.count({
      where: finalWhere,
    });
  }
}
