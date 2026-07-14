import { PrismaClient } from '@prisma/client';

export class NewsletterService {
    constructor(private prisma: PrismaClient) {}

    async subscribe(email: string, markets: string[], topics: string[]) {
        const existing = await this.prisma.newsletterSubscriber.findUnique({
            where: { email }
        });

        if (existing) {
            // Update preferences if already subscribed
            return await this.prisma.newsletterSubscriber.update({
                where: { email },
                data: {
                    markets,
                    topics,
                    isActive: true
                }
            });
        }

        return await this.prisma.newsletterSubscriber.create({
            data: {
                email,
                markets,
                topics,
                isActive: true
            }
        });
    }
}
