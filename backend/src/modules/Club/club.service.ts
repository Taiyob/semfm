import { prisma } from '../../lib/prisma';
import { AppLogger } from '../../core/logging/logger';

export class ClubService {
  async createApplication(data: { name: string; email: string; country: string; reason: string }) {
    AppLogger.info('Creating new Club Application', { email: data.email });
    
    const application = await prisma.clubApplication.create({
      data: {
        name: data.name,
        email: data.email,
        country: data.country,
        reason: data.reason,
      },
    });

    return application;
  }
}
