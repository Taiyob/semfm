import { PrismaClient } from '@prisma/client';
import mailchimp from '@mailchimp/mailchimp_marketing';

mailchimp.setConfig({
    apiKey: process.env.MAILCHIMP_API_KEY,
    server: process.env.MAILCHIMP_SERVER_PREFIX,
});

export class NewsletterService {
    constructor(private prisma: PrismaClient) {}

    async subscribe(email: string, markets: string[], topics: string[]) {
        try {
            const listId = process.env.MAILCHIMP_AUDIENCE_ID;
            if (listId) {
                await mailchimp.lists.setListMember(
                    listId,
                    email.toLowerCase(),
                    {
                        email_address: email,
                        status_if_new: 'subscribed',
                    }
                );
            }
        } catch (error: any) {
            console.error('Mailchimp integration error:', error?.response?.body || error.message);
        }
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

    async getAllSubscribers() {
        return await this.prisma.newsletterSubscriber.findMany({
            orderBy: { createdAt: 'desc' }
        });
    }

    async getCampaigns() {
        try {
            const response = await mailchimp.campaigns.list({
                status: 'sent',
                sort_field: 'send_time',
                sort_dir: 'DESC',
                count: 10,
            });
            return response.campaigns;
        } catch (error: any) {
            console.error('Mailchimp fetch campaigns error:', error?.response?.body || error.message);
            throw new Error('Failed to fetch campaigns from Mailchimp');
        }
    }
}
