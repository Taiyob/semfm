import { Request, Response } from 'express';
import { BaseController } from '../../core/BaseController';
import { BlogService } from './blog.service';
import { HTTPStatusCode } from '../../types/HTTPStatusCode';
import { catchAsync } from '@/utils/catchAsync';

const blogService = new BlogService();

export class BlogController extends BaseController {
  
  /**
   * @route POST /api/v1/blog
   * @desc Create a new blog post (Admin)
   */
  public createBlog = catchAsync(async (req: Request, res: Response) => {
    const { title, content, author, category } = req.body;

    if (!title || !content || !author || !category) {
      return res.status(HTTPStatusCode.BAD_REQUEST).json({
        success: false,
        message: 'Title, content, author, and category are required',
      });
    }

    const blog = await blogService.createBlog(req.body);

    return this.sendCreatedResponse(req, res, blog, 'Blog post created successfully');
  });

  /**
   * @route GET /api/v1/blog
   * @desc Get all published blogs (Public)
   */
  public getPublishedBlogs = catchAsync(async (req: Request, res: Response) => {
    const result = await blogService.getAllBlogs(req.query, false);
    const { data, ...pagination } = result;
    return this.sendPaginatedResponse(req, res, pagination, 'Blogs fetched successfully', data);
  });

  /**
   * @route GET /api/v1/blog/admin
   * @desc Get all blogs including drafts (Admin)
   */
  public getAllBlogsAdmin = catchAsync(async (req: Request, res: Response) => {
    const result = await blogService.getAllBlogs(req.query, true);
    const { data, ...pagination } = result;
    return this.sendPaginatedResponse(req, res, pagination, 'Blogs fetched successfully', data);
  });

  /**
   * @route GET /api/v1/blog/:slug
   * @desc Get a single blog by slug (Public)
   */
  public getBlogBySlug = catchAsync(async (req: Request, res: Response) => {
    const { slug } = req.params;
    const blog = await blogService.getBlogBySlug(slug, false);
    return this.sendResponse(req, res, 'Blog fetched successfully', HTTPStatusCode.OK, blog);
  });

  /**
   * @route PATCH /api/v1/blog/:id
   * @desc Update blog post (Admin)
   */
  public updateBlog = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const blog = await blogService.updateBlog(id, req.body);
    return this.sendResponse(req, res, 'Blog updated successfully', HTTPStatusCode.OK, blog);
  });

  /**
   * @route DELETE /api/v1/blog/:id
   * @desc Delete a blog post (Admin)
   */
  public deleteBlog = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    await blogService.deleteBlog(id);
    return this.sendNoContentResponse(res);
  });
}
