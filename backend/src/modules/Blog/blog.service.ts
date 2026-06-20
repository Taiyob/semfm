import { PrismaClient, BlogPost } from '@/generated/prisma/client';
import { BaseService } from '../../core/BaseService';
import { prisma } from '../../lib/prisma';
import slugify from 'slugify';

export class BlogService extends BaseService<BlogPost> {
    constructor() {
        super(prisma, 'BlogPost', {
            enableSoftDelete: false,
            enableAuditFields: false,
        });
    }

    protected getModel() {
        return this.prisma.blogPost;
    }

    private generateSlug(title: string): string {
        return slugify(title, { lower: true, strict: true }) + '-' + Date.now().toString().slice(-4);
    }

    /**
     * Create a new blog post
     */
    async createBlog(data: Partial<BlogPost>) {
        const slug = data.slug || this.generateSlug(data.title as string);
        
        return this.create({
            title: data.title as string,
            slug,
            excerpt: data.excerpt,
            content: data.content as string,
            author: data.author as string,
            readTime: data.readTime,
            category: data.category as string,
            country: data.country,
            imageUrl: data.imageUrl,
            isFeatured: data.isFeatured || false,
            isPublished: data.isPublished || false,
        });
    }

    /**
     * Get all blogs with pagination and search
     */
    async getAllBlogs(query: any, adminScope = false) {
        const { page = 1, limit = 10, search, category, country, isFeatured } = query;
        const skip = (Number(page) - 1) * Number(limit);

        const where: any = {};

        // If not admin, only show published blogs
        if (!adminScope) {
            where.isPublished = true;
        }

        if (category) where.category = category;
        if (country) where.country = country;
        if (isFeatured !== undefined) where.isFeatured = isFeatured === 'true';

        if (search) {
            where.OR = [
                { title: { contains: search as string, mode: 'insensitive' } },
                { author: { contains: search as string, mode: 'insensitive' } },
                { category: { contains: search as string, mode: 'insensitive' } },
            ];
        }

        const [data, total] = await Promise.all([
            this.prisma.blogPost.findMany({
                where,
                skip,
                take: Number(limit),
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.blogPost.count({ where }),
        ]);

        const totalPages = Math.ceil(total / Number(limit));
        const currentPage = Number(page);

        return {
            data,
            total,
            page: currentPage,
            limit: Number(limit),
            totalPages,
            hasNext: currentPage < totalPages,
            hasPrevious: currentPage > 1,
        };
    }

    /**
     * Get a single blog by slug
     */
    async getBlogBySlug(slug: string, adminScope = false) {
        const where: any = { slug };
        if (!adminScope) {
            where.isPublished = true;
        }

        const blog = await this.prisma.blogPost.findFirst({
            where
        });

        if (!blog) {
            throw new Error('Blog not found');
        }

        return blog;
    }

    /**
     * Update blog
     */
    async updateBlog(id: string, data: Partial<BlogPost>) {
        if (data.title && !data.slug) {
            data.slug = this.generateSlug(data.title);
        }
        return this.updateById(id, data);
    }

    /**
     * Delete blog
     */
    async deleteBlog(id: string) {
        return this.deleteById(id);
    }
}
