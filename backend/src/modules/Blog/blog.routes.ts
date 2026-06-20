import { Router } from 'express';
import { BlogController } from './blog.controller';
import { authMiddleware } from '@/middleware/authMiddleware';
import { requireRole } from '@/middleware/roleMiddleware';

const router = Router();
const blogController = new BlogController();

// Public routes
router.get('/', blogController.getPublishedBlogs);
router.get('/post/:slug', blogController.getBlogBySlug);

// Protected routes (Admin only)
router.use(authMiddleware);
router.use(requireRole(['admin']));

router.get('/admin', blogController.getAllBlogsAdmin);
router.post('/', blogController.createBlog);
router.patch('/:id', blogController.updateBlog);
router.delete('/:id', blogController.deleteBlog);

export default router;
